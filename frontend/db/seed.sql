INSERT INTO rooms (
	code,
	name,
	category,
	description,
	price_per_night,
	size_sqm,
	max_guests,
	features,
	is_available
)
VALUES
	(
		'superior',
		'Kamar Superior Klasik',
		'Superior',
		'Kamar nyaman dengan dekorasi periode klasik, ideal untuk pasangan.',
		1750000,
		32,
		2,
		'["Queen Bed", "Rain Shower", "City View", "Sarapan Inklusif", "WiFi"]'::jsonb,
		TRUE
	),
	(
		'deluxe',
		'Kamar Deluxe Victoria',
		'Deluxe',
		'Kamar elegan dengan sentuhan Victoria, bathtub antik, dan balkon privat.',
		2850000,
		45,
		2,
		'["King Bed", "Bathtub Antik", "Balkon Privat", "Butler Service", "Sarapan Inklusif"]'::jsonb,
		TRUE
	),
	(
		'premier',
		'Kamar Premier Mezzanine',
		'Premier',
		'Kamar dengan layout mezzanine, soaking tub, dan minibar premium.',
		3900000,
		60,
		2,
		'["King Bed", "Mezzanine Level", "Soaking Tub", "Mini Bar Premium", "Panoramic View"]'::jsonb,
		TRUE
	),
	(
		'suite',
		'Suite Baroque Grand',
		'Suite',
		'Suite luas dengan living room terpisah dan layanan butler 24/7.',
		5500000,
		90,
		4,
		'["King Bed + Sofa Bed", "Living Room Terpisah", "Marble Bathroom", "Butler 24/7", "Champagne Welcome"]'::jsonb,
		TRUE
	)
ON CONFLICT (code)
DO UPDATE SET
	name = EXCLUDED.name,
	category = EXCLUDED.category,
	description = EXCLUDED.description,
	price_per_night = EXCLUDED.price_per_night,
	size_sqm = EXCLUDED.size_sqm,
	max_guests = EXCLUDED.max_guests,
	features = EXCLUDED.features,
	is_available = EXCLUDED.is_available,
	updated_at = NOW();
