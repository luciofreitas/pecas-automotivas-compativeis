-- Esquema inicial para Postgres (MVP)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- fabricantes
CREATE TABLE IF NOT EXISTS manufacturers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  code VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- produtos/peças
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  manufacturer_id INTEGER REFERENCES manufacturers(id) ON DELETE SET NULL,
  sku VARCHAR(128) UNIQUE,
  mpn VARCHAR(128),
  name TEXT NOT NULL,
  description TEXT,
  attributes JSONB DEFAULT '{}'::jsonb,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_mpn ON products(mpn);

-- veículos / fitment target
CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  make VARCHAR(128) NOT NULL,
  model VARCHAR(128) NOT NULL,
  variant VARCHAR(128),
  year_from INTEGER,
  year_to INTEGER,
  engine VARCHAR(128),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- relação many-to-many: qual peça serve em qual veículo
CREATE TABLE IF NOT EXISTS fitments (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, vehicle_id)
);
CREATE INDEX IF NOT EXISTS idx_fitments_product ON fitments(product_id);
CREATE INDEX IF NOT EXISTS idx_fitments_vehicle ON fitments(vehicle_id);

-- equivalências entre peças (opcional)
CREATE TABLE IF NOT EXISTS equivalences (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  equivalent_product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  source VARCHAR(128),
  confidence NUMERIC(3,2) DEFAULT 0.75,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, equivalent_product_id)
);

-- usuários (conta)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  is_pro BOOLEAN DEFAULT false,
  pro_since TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- pagamentos (simulação / registro)
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  amount NUMERIC(10,2),
  currency VARCHAR(8) DEFAULT 'BRL',
  method VARCHAR(64),
  status VARCHAR(32) DEFAULT 'pending',
  metadata JSONB DEFAULT '{}'::jsonb,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
