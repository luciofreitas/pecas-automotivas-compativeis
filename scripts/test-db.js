// small script to test DB connectivity from host using pg
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function test() {
  try {
    await client.connect();
    const res = await client.query('SELECT NOW() as now, current_database() as db;');
    console.log('connected:', res.rows[0]);
  } catch (err) {
    console.error('connection error', err.message || err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

test();
