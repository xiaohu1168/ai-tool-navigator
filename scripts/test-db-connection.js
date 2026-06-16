/**
 * Test Neon PostgreSQL connection
 * Run: node test-db-connection.js
 * Requires: DATABASE_URL environment variable
 */

const { Client } = require('pg');

async function testConnection() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log('❌ DATABASE_URL not set');
    process.exit(1);
  }

  console.log('Testing connection to Neon PostgreSQL...');
  console.log('URL:', url.replace(/\/\/[^:]+:/, '//***:*****/'));

  const client = new Client({ connectionString: url });

  try {
    await client.connect();
    console.log('✅ Connected successfully!');

    const res = await client.query('SELECT version()');
    console.log('Database version:', res.rows[0].version);

    await client.end();
    console.log('✅ Test passed!');
    process.exit(0);
  } catch (err) {
    console.log('❌ Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
