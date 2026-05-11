BEGIN;

CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS users (
	id BIGSERIAL PRIMARY KEY,
	email CITEXT NOT NULL UNIQUE,
	password_hash TEXT NOT NULL,
	first_name TEXT NOT NULL,
	last_name TEXT,
	phone TEXT,
	role TEXT NOT NULL DEFAULT 'guest' CHECK (role IN ('guest', 'admin')),
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rooms (
	id BIGSERIAL PRIMARY KEY,
	code TEXT NOT NULL UNIQUE,
	name TEXT NOT NULL,
	category TEXT NOT NULL,
	description TEXT NOT NULL,
	price_per_night INTEGER NOT NULL CHECK (price_per_night > 0),
	size_sqm NUMERIC(6, 2) NOT NULL CHECK (size_sqm > 0),
	max_guests SMALLINT NOT NULL CHECK (max_guests > 0),
	features JSONB NOT NULL DEFAULT '[]'::JSONB,
	is_available BOOLEAN NOT NULL DEFAULT TRUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
	id BIGSERIAL PRIMARY KEY,
	booking_reference TEXT NOT NULL UNIQUE,
	user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
	room_id BIGINT NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
	check_in DATE NOT NULL,
	check_out DATE NOT NULL,
	guests SMALLINT NOT NULL CHECK (guests > 0),
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	email CITEXT NOT NULL,
	phone TEXT,
	nationality TEXT,
	special_request TEXT,
	payment_method TEXT NOT NULL CHECK (payment_method IN ('transfer', 'card', 'cash')),
	status TEXT NOT NULL DEFAULT 'pending' CHECK (
		status IN ('pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out')
	),
	subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
	tax_amount INTEGER NOT NULL CHECK (tax_amount >= 0),
	grand_total INTEGER NOT NULL CHECK (grand_total >= 0),
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT check_booking_dates CHECK (check_out > check_in)
);

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
	BEFORE UPDATE ON users
	FOR EACH ROW
	EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trigger_rooms_updated_at ON rooms;
CREATE TRIGGER trigger_rooms_updated_at
	BEFORE UPDATE ON rooms
	FOR EACH ROW
	EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trigger_bookings_updated_at ON bookings;
CREATE TRIGGER trigger_bookings_updated_at
	BEFORE UPDATE ON bookings
	FOR EACH ROW
	EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_rooms_price ON rooms(price_per_night);
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date_range ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS no_overlapping_bookings;
ALTER TABLE bookings
	ADD CONSTRAINT no_overlapping_bookings
	EXCLUDE USING gist (
		room_id WITH =,
		daterange(check_in, check_out, '[)') WITH &&
	)
	WHERE (status IN ('pending', 'confirmed', 'checked_in'));

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies for 'rooms'
-- 1. Publicly viewable
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Rooms are viewable by everyone') THEN
        CREATE POLICY "Rooms are viewable by everyone" ON rooms FOR SELECT USING (true);
    END IF;
END $$;

-- 2. Admin full access (management)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins have full access to rooms') THEN
        CREATE POLICY "Admins have full access to rooms" ON rooms 
            FOR ALL
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
                )
            );
    END IF;
END $$;


-- Policies for 'users'
-- 1. Users can view their own profile
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own profile') THEN
        CREATE POLICY "Users can view own profile" ON users 
            FOR SELECT 
            USING (id::text = auth.uid()::text);
    END IF;
END $$;

-- 2. Users can update their own profile
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON users 
            FOR UPDATE 
            USING (id::text = auth.uid()::text);
    END IF;
END $$;

-- 3. Admins can do everything
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins have full access to users') THEN
        CREATE POLICY "Admins have full access to users" ON users 
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
                )
            );
    END IF;
END $$;


-- Policies for 'bookings'
-- 1. Users can view their own bookings
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own bookings') THEN
        CREATE POLICY "Users can view own bookings" ON bookings 
            FOR SELECT 
            USING (user_id::text = auth.uid()::text);
    END IF;
END $$;

-- 2. Users can create their own bookings
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create own bookings') THEN
        CREATE POLICY "Users can create own bookings" ON bookings 
            FOR INSERT 
            WITH CHECK (user_id::text = auth.uid()::text);
    END IF;
END $$;

-- 3. Admins can do everything
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins have full access to bookings') THEN
        CREATE POLICY "Admins have full access to bookings" ON bookings 
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
                )
            );
    END IF;
END $$;

-- Logic for automated price calculation
CREATE OR REPLACE FUNCTION fn_calculate_booking_total()
RETURNS TRIGGER AS $$
DECLARE
	room_price INTEGER;
	num_nights INTEGER;
BEGIN
	-- Get price from rooms
	SELECT price_per_night INTO room_price FROM rooms WHERE id = NEW.room_id;
	
	-- Calculate nights
	num_nights := NEW.check_out - NEW.check_in;
	
	-- Populate totals
	NEW.subtotal := room_price * num_nights;
	NEW.tax_amount := (NEW.subtotal * 0.1)::INTEGER; -- 10% tax
	NEW.grand_total := NEW.subtotal + NEW.tax_amount;
	
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Logic for room availability sync
CREATE OR REPLACE FUNCTION fn_sync_room_availability()
RETURNS TRIGGER AS $$
BEGIN
	IF NEW.status = 'checked_in' THEN
		UPDATE rooms SET is_available = FALSE WHERE id = NEW.room_id;
	ELSIF NEW.status IN ('checked_out', 'cancelled') THEN
		UPDATE rooms SET is_available = TRUE WHERE id = NEW.room_id;
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Register Triggers
DROP TRIGGER IF EXISTS trg_calculate_booking_total ON bookings;
CREATE TRIGGER trg_calculate_booking_total
	BEFORE INSERT ON bookings
	FOR EACH ROW
	EXECUTE FUNCTION fn_calculate_booking_total();

DROP TRIGGER IF EXISTS trg_sync_room_availability ON bookings;
CREATE TRIGGER trg_sync_room_availability
	AFTER INSERT OR UPDATE OF status ON bookings
	FOR EACH ROW
	EXECUTE FUNCTION fn_sync_room_availability();

COMMIT;
