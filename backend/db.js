const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true
  }
};

let pool;

/**
 * Get (or create) a shared connection pool
 */
async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
    console.log('✅ Connected to SQL Server from db.js');
  }
  return pool;
}

module.exports = { getPool, sql };
