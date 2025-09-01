Parts API (CSV seed-based)

This simple Node.js API loads the CSV files from `db/seeds` and exposes a few endpoints useful for prototyping the frontend.

Quick start:

1. From the project root, install dependencies for the backend:

   cd backend; npm install

2. Start the API:

   npm start

Default port: 3001

Endpoints:
- GET /api/products
- GET /api/product/:id
- GET /api/product/sku/:sku
- GET /api/vehicles
- GET /api/fitments
- GET /api/equivalences
- GET /api/compatibility/sku/:sku

If you prefer a Postgres-ready environment, start the DB with Docker Compose:

  docker-compose up -d

This mounts `db/schema.sql` into Postgres initialization; you can import CSV seeds manually or extend the compose setup to run import scripts.

Postgres mode
---------------
The backend will attempt to connect to Postgres if `DATABASE_URL` is set. When connected it serves data directly from the database. If no Postgres is available it falls back to the CSV files in `db/seeds` (useful for quick local prototyping).

To run in Postgres mode (example):

   export DATABASE_URL=postgresql://parts:parts_pass@localhost:5432/partsdb
   npm start

Or on Windows PowerShell:

   $env:DATABASE_URL = 'postgresql://parts:parts_pass@localhost:5432/partsdb'
   npm start

The API endpoints remain the same whether using Postgres or CSV fallback.
