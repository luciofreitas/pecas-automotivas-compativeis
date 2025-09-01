-- zz_import_seeds.sql
-- This script runs after schema.sql and imports CSV seed files into the database.
\echo 'Starting idempotent CSV import...'
\set ON_ERROR_STOP on

-- This import is idempotent: we COPY into staging tables and then
-- INSERT ... ON CONFLICT DO UPDATE into the real tables. Sequences are
-- fixed after inserting explicit ids.

BEGIN;

-- 1) Manufacturers
CREATE TABLE IF NOT EXISTS stg_manufacturers (
	id TEXT,
	name TEXT,
	code TEXT,
	created_at TEXT
);
TRUNCATE stg_manufacturers;
COPY stg_manufacturers FROM '/docker-entrypoint-initdb.d/seeds/manufacturers.csv' WITH (FORMAT csv, HEADER true);
INSERT INTO manufacturers(id, name, code, created_at)
SELECT (id::int), name, code, (created_at::timestamptz)
FROM stg_manufacturers
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, code = EXCLUDED.code, created_at = EXCLUDED.created_at;
SELECT setval(pg_get_serial_sequence('manufacturers','id'), COALESCE((SELECT MAX(id) FROM manufacturers),0)+1, false);

-- 2) Products
CREATE TABLE IF NOT EXISTS stg_products (
	id TEXT,
	manufacturer_id TEXT,
	sku TEXT,
	mpn TEXT,
	name TEXT,
	description TEXT,
	attributes TEXT,
	active TEXT,
	created_at TEXT
);
TRUNCATE stg_products;
COPY stg_products FROM '/docker-entrypoint-initdb.d/seeds/products.csv' WITH (FORMAT csv, HEADER true);
INSERT INTO products(id, manufacturer_id, sku, mpn, name, description, attributes, active, created_at)
SELECT (id::int), NULLIF(manufacturer_id,'')::int, sku, NULLIF(mpn,'')::text, name, NULLIF(description,'')::text, COALESCE(NULLIF(attributes,''),'{}')::jsonb, COALESCE(NULLIF(active,''),'true')::boolean, (created_at::timestamptz)
FROM stg_products
ON CONFLICT (id) DO UPDATE SET manufacturer_id = EXCLUDED.manufacturer_id, sku = EXCLUDED.sku, mpn = EXCLUDED.mpn, name = EXCLUDED.name, description = EXCLUDED.description, attributes = EXCLUDED.attributes, active = EXCLUDED.active, created_at = EXCLUDED.created_at;
SELECT setval(pg_get_serial_sequence('products','id'), COALESCE((SELECT MAX(id) FROM products),0)+1, false);

-- 3) Vehicles
CREATE TABLE IF NOT EXISTS stg_vehicles (
	id TEXT,
	make TEXT,
	model TEXT,
	variant TEXT,
	year_from TEXT,
	year_to TEXT,
	engine TEXT,
	created_at TEXT
);
TRUNCATE stg_vehicles;
COPY stg_vehicles FROM '/docker-entrypoint-initdb.d/seeds/vehicles.csv' WITH (FORMAT csv, HEADER true);
INSERT INTO vehicles(id, make, model, variant, year_from, year_to, engine, created_at)
SELECT (id::int), make, model, NULLIF(variant,''), NULLIF(year_from,'')::int, NULLIF(year_to,'')::int, NULLIF(engine,''), (created_at::timestamptz)
FROM stg_vehicles
ON CONFLICT (id) DO UPDATE SET make = EXCLUDED.make, model = EXCLUDED.model, variant = EXCLUDED.variant, year_from = EXCLUDED.year_from, year_to = EXCLUDED.year_to, engine = EXCLUDED.engine, created_at = EXCLUDED.created_at;
SELECT setval(pg_get_serial_sequence('vehicles','id'), COALESCE((SELECT MAX(id) FROM vehicles),0)+1, false);

-- 4) Fitments
CREATE TABLE IF NOT EXISTS stg_fitments (
	id TEXT,
	product_id TEXT,
	vehicle_id TEXT,
	note TEXT,
	created_at TEXT
);
TRUNCATE stg_fitments;
COPY stg_fitments FROM '/docker-entrypoint-initdb.d/seeds/fitments.csv' WITH (FORMAT csv, HEADER true);
INSERT INTO fitments(id, product_id, vehicle_id, note, created_at)
SELECT (id::int), (product_id::int), (vehicle_id::int), NULLIF(note,''), (created_at::timestamptz)
FROM stg_fitments
ON CONFLICT (id) DO UPDATE SET product_id = EXCLUDED.product_id, vehicle_id = EXCLUDED.vehicle_id, note = EXCLUDED.note, created_at = EXCLUDED.created_at;
SELECT setval(pg_get_serial_sequence('fitments','id'), COALESCE((SELECT MAX(id) FROM fitments),0)+1, false);

-- 5) Equivalences
CREATE TABLE IF NOT EXISTS stg_equivalences (
	id TEXT,
	product_id TEXT,
	equivalent_product_id TEXT,
	source TEXT,
	confidence TEXT,
	created_at TEXT
);
TRUNCATE stg_equivalences;
COPY stg_equivalences FROM '/docker-entrypoint-initdb.d/seeds/equivalences.csv' WITH (FORMAT csv, HEADER true);
INSERT INTO equivalences(id, product_id, equivalent_product_id, source, confidence, created_at)
SELECT (id::int), (product_id::int), (equivalent_product_id::int), NULLIF(source,''), COALESCE(NULLIF(confidence,''),'0.75')::numeric, (created_at::timestamptz)
FROM stg_equivalences
ON CONFLICT (id) DO UPDATE SET product_id = EXCLUDED.product_id, equivalent_product_id = EXCLUDED.equivalent_product_id, source = EXCLUDED.source, confidence = EXCLUDED.confidence, created_at = EXCLUDED.created_at;
SELECT setval(pg_get_serial_sequence('equivalences','id'), COALESCE((SELECT MAX(id) FROM equivalences),0)+1, false);

-- 6) Users
CREATE TABLE IF NOT EXISTS stg_users (
	id TEXT,
	email TEXT,
	name TEXT,
	password_hash TEXT,
	is_pro TEXT,
	pro_since TEXT,
	created_at TEXT
);
TRUNCATE stg_users;
COPY stg_users FROM '/docker-entrypoint-initdb.d/seeds/users.csv' WITH (FORMAT csv, HEADER true);
INSERT INTO users(id, email, name, password_hash, is_pro, pro_since, created_at)
SELECT (id::int), email, NULLIF(name,''), NULLIF(password_hash,''), COALESCE(NULLIF(is_pro,''),'0')::boolean, NULLIF(pro_since,'')::timestamptz, (created_at::timestamptz)
FROM stg_users
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, is_pro = EXCLUDED.is_pro, pro_since = EXCLUDED.pro_since, created_at = EXCLUDED.created_at;
SELECT setval(pg_get_serial_sequence('users','id'), COALESCE((SELECT MAX(id) FROM users),0)+1, false);

COMMIT;
\echo 'Idempotent CSV import complete.'
