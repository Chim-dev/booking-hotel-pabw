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

COMMIT;
