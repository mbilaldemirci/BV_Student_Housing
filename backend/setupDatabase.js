const sql = require('mssql');
require('dotenv').config();

const serverConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  options: {
    trustServerCertificate: true
  }
};

async function setup() {
  try {
    const dbName = process.env.DB_NAME;
    if (!dbName) {
      console.error("DB_NAME is NOT set in .env");
      process.exit(1);
    }

    console.log("Connecting to SQL Server...");
    let pool = await sql.connect(serverConfig);
    console.log("Connected to SQL Server.");

    console.log(`Ensuring database [${dbName}] exists...`);
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = '${dbName}')
      BEGIN
        PRINT 'Creating database ${dbName}';
        CREATE DATABASE [${dbName}];
      END
    `);
    console.log("Database check done.");

    await sql.close();
    pool = await sql.connect({
      ...serverConfig,
      database: dbName
    });
    console.log(`Using database [${dbName}]`);

    console.log("Ensuring Users table exists...");
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
      BEGIN
        CREATE TABLE Users (
          id INT IDENTITY(1,1) PRIMARY KEY,
          username NVARCHAR(50) UNIQUE NOT NULL,
          email NVARCHAR(100) UNIQUE NOT NULL,
          password NVARCHAR(255) NOT NULL,
        );
      END
    `);
    console.log("Users table check done.");

    console.log("Database setup finished.");
    process.exit(0);
  } catch (err) {
    console.error("ERROR in setup:", err);
    process.exit(1);
  }
}

setup();
