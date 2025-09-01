// Simple seed script to create basic tables and sample data
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

const seedQueries = [
  // Insert sample parts (tables already exist)
  `INSERT INTO parts (name, part_number, brand, category, price) VALUES
    ('Filtro de Óleo', 'FO-001', 'Mann Filter', 'Filtros', 25.90),
    ('Pastilha de Freio Dianteira', 'PF-102', 'Bosch', 'Freios', 89.50),
    ('Vela de Ignição', 'VI-205', 'NGK', 'Ignição', 15.75),
    ('Amortecedor Traseiro', 'AM-301', 'Monroe', 'Suspensão', 180.00),
    ('Correia Dentada', 'CD-402', 'Gates', 'Motor', 65.30)
  ON CONFLICT (part_number) DO NOTHING;`,
  
  // Insert sample vehicles (using existing schema: year_from, year_to)
  `INSERT INTO vehicles (make, model, variant, year_from, year_to, engine) VALUES
    ('Volkswagen', 'Gol', 'G6', 2010, 2020, '1.0'),
    ('Fiat', 'Uno', 'Way', 2012, 2022, '1.0'),
    ('Chevrolet', 'Onix', 'LT', 2015, 2023, '1.4'),
    ('Honda', 'Civic', 'LXS', 2014, 2021, '1.8'),
    ('Toyota', 'Corolla', 'XEI', 2018, 2024, '2.0')
  ON CONFLICT DO NOTHING;`
];

async function seed() {
  try {
    await client.connect();
    console.log('🔗 Connected to database');
    
    for (const query of seedQueries) {
      await client.query(query);
    }
    
    const parts = await client.query('SELECT COUNT(*) FROM parts');
    const vehicles = await client.query('SELECT COUNT(*) FROM vehicles');
    
    console.log('✅ Seed completed');
    console.log(`📦 Parts: ${parts.rows[0].count}`);
    console.log(`🚗 Vehicles: ${vehicles.rows[0].count}`);
    
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
