const mysql  = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs     = require('fs');
const path   = require('path');

const pool = mysql.createPool({
  host:              process.env.DB_HOST     || 'localhost',
  port:              process.env.DB_PORT     || 3306,
  database:          process.env.DB_NAME     || 'store_ratings_db',
  user:              process.env.DB_USER     || 'root',
  password:          process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit:   10,
  queueLimit:        0,
  multipleStatements: true,   
});

async function initializeDatabase() {
  const conn = await pool.getConnection();
  console.log('✅ MySQL connected.');
  conn.release();

  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql  = fs.readFileSync(schemaPath, 'utf8');

  const statements = schemaSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const stmt of statements) {
    try {
      await pool.query(stmt);
    } catch (err) {
      if (!err.message.includes('already exists') && !err.message.includes('Duplicate')) {
        console.error('Schema error:', err.message);
      }
    }
  }

  console.log('✅ Schema ready (from schema.sql).');

  const [existing] = await pool.query("SELECT id FROM users WHERE email = 'admin@storerating.com'");
  if (existing.length === 0) {
    const salt   = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash('Admin@1234', salt);
    await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      ['System Administrator Account', 'admin@storerating.com', hashed,
       '123 Admin Street, Main City, State', 'admin']
    );
    console.log('✅ Admin seeded → admin@storerating.com / Admin@1234');
  } else {
    const [row] = await pool.query("SELECT password FROM users WHERE email = 'admin@storerating.com'");
    if (row[0]?.password?.includes('placeholder')) {
      const salt   = await bcrypt.genSalt(12);
      const hashed = await bcrypt.hash('Admin@1234', salt);
      await pool.query("UPDATE users SET password = ? WHERE email = 'admin@storerating.com'", [hashed]);
      console.log('✅ Admin password fixed.');
    }
  }
}

pool.initializeDatabase = initializeDatabase;
module.exports = pool;
