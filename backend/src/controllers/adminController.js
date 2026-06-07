const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const pool = require('../config/db');

const getDashboard = async (req, res) => {
  try {
    const [[usersResult], [storesResult], [ratingsResult]] = await Promise.all([
      pool.query("SELECT COUNT(*) AS count FROM users WHERE role != 'admin'"),
      pool.query('SELECT COUNT(*) AS count FROM stores'),
      pool.query('SELECT COUNT(*) AS count FROM ratings'),
    ]);
    res.json({
      totalUsers:   parseInt(usersResult[0].count)   || 0,
      totalStores:  parseInt(storesResult[0].count)  || 0,
      totalRatings: parseInt(ratingsResult[0].count) || 0,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Failed to fetch dashboard data.' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;
    const validSortFields = ['name', 'email', 'address', 'role'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let sql = 'SELECT id, name, email, address, role, created_at FROM users WHERE 1=1';
    const params = [];

    if (name)    { sql += ' AND LOWER(name)    LIKE LOWER(?)'; params.push(`%${name}%`);    }
    if (email)   { sql += ' AND LOWER(email)   LIKE LOWER(?)'; params.push(`%${email}%`);   }
    if (address) { sql += ' AND LOWER(address) LIKE LOWER(?)'; params.push(`%${address}%`); }
    if (role)    { sql += ' AND role = ?';                      params.push(role);            }

    sql += ` ORDER BY ${sortField} ${sortOrder}`;
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT id, name, email, address, role FROM users WHERE id = ?', [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found.' });

    const user = rows[0];
    if (user.role === 'store_owner') {
      const [ratingRows] = await pool.query(
        `SELECT COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating
         FROM stores s LEFT JOIN ratings r ON s.id = r.store_id
         WHERE s.owner_id = ?`, [id]
      );
      user.averageRating = parseFloat(ratingRows[0]?.average_rating) || 0;
    }
    res.json(user);
  } catch (err) {
    console.error('Get user by id error:', err);
    res.status(500).json({ message: 'Failed to fetch user details.' });
  }
};

const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, address, role } = req.body;
  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(409).json({ message: 'Email is already registered.' });

    const allowedRoles = ['admin', 'user', 'store_owner'];
    const userRole = allowedRoles.includes(role) ? role : 'user';

    const salt   = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashed, address || null, userRole]
    );
    res.status(201).json({
      message: 'User created successfully.',
      user: { id: result.insertId, name, email, address: address || null, role: userRole },
    });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ message: 'Failed to create user.' });
  }
};

const getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', order = 'ASC' } = req.query;
    const validSortFields = ['name', 'email', 'address', 'average_rating'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let sql = 'SELECT * FROM store_ratings_summary WHERE 1=1';
    const params = [];

    if (name)    { sql += ' AND LOWER(name)    LIKE LOWER(?)'; params.push(`%${name}%`);    }
    if (email)   { sql += ' AND LOWER(email)   LIKE LOWER(?)'; params.push(`%${email}%`);   }
    if (address) { sql += ' AND LOWER(address) LIKE LOWER(?)'; params.push(`%${address}%`); }

    sql += ` ORDER BY ${sortField} ${sortOrder}`;
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Get stores error:', err);
    res.status(500).json({ message: 'Failed to fetch stores.' });
  }
};

const createStore = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, address, ownerId } = req.body;
  try {
    const [existing] = await pool.query('SELECT id FROM stores WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(409).json({ message: 'A store with this email already exists.' });

    if (ownerId) {
      const [ownerCheck] = await pool.query(
        "SELECT id FROM users WHERE id = ? AND role = 'store_owner'", [ownerId]
      );
      if (ownerCheck.length === 0) return res.status(400).json({ message: 'Invalid store owner ID.' });
    }

    const [result] = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address || null, ownerId || null]
    );
    res.status(201).json({
      message: 'Store created successfully.',
      store: { id: result.insertId, name, email, address: address || null, owner_id: ownerId || null },
    });
  } catch (err) {
    console.error('Create store error:', err);
    res.status(500).json({ message: 'Failed to create store.' });
  }
};

module.exports = { getDashboard, getUsers, getUserById, createUser, getStores, createStore };
