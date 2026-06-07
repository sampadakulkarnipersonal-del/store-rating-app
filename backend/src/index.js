require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const pool    = require('./config/db');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth',   require('./routes/auth'));
app.use('/api/admin',  require('./routes/admin'));
app.use('/api/stores', require('./routes/stores'));
app.use('/api/owner',  require('./routes/owner'));

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error.' });
});

const PORT = process.env.PORT || 5000;

pool.initializeDatabase()
  .then(() => app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`   Login: admin@storerating.com / Admin@1234`);
  }))
  .catch(err => { console.error('DB init failed:', err.message); process.exit(1); });
