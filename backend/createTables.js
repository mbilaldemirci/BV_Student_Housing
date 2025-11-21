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

async function createTables() {
  try {
    const pool = await sql.connect(config);

    await pool.request().query(`
      CREATE TABLE Students (
          StudentID INT IDENTITY(1,1) PRIMARY KEY,
          FirstName NVARCHAR(50) NOT NULL,
          LastName NVARCHAR(50) NOT NULL,
          Email NVARCHAR(50) NOT NULL,
          Phone NVARCHAR(50) NOT NULL
      );

      CREATE TABLE Houses (
          HouseID INT IDENTITY(1,1) PRIMARY KEY,
          Address NVARCHAR(100) NOT NULL
      );

      CREATE TABLE Rooms (
          RoomID INT IDENTITY(1,1) PRIMARY KEY,
          HouseID INT NOT NULL FOREIGN KEY REFERENCES Houses(HouseID),
          RoomNumber INT NOT NULL
      );

      CREATE TABLE Stays (
          StayID INT IDENTITY(1,1) PRIMARY KEY,
          StudentID INT NOT NULL FOREIGN KEY REFERENCES Students(StudentID),
          RoomID INT NOT NULL FOREIGN KEY REFERENCES Rooms(RoomID),
          StartDate DATE NOT NULL,
          EndDate DATE NOT NULL
      );

      CREATE TABLE DMs (
          DMID INT IDENTITY(1,1) PRIMARY KEY,
          SenderID INT NOT NULL FOREIGN KEY REFERENCES Students(StudentID),
          ReceiverID INT NOT NULL FOREIGN KEY REFERENCES Students(StudentID),
          Message NVARCHAR(MAX) NOT NULL,
          SentAt DATETIME DEFAULT GETDATE()
      );
    `);

    console.log('✅ Tables created successfully');
    await pool.close();
  } catch (err) {
    console.error('❌ Error creating tables:', err);
  }
}

createTables();
