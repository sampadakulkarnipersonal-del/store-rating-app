const pool = require('../config/db');

const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const [storeRows] = await pool.query('SELECT * FROM stores WHERE owner_id = ?', [ownerId]);

    if (storeRows.length === 0)
      return res.status(404).json({ message: 'No store found for this owner.' });

    const store = storeRows[0];

    const [ratersRows] = await pool.query(
      `SELECT u.id AS user_id, u.name AS user_name, u.email AS user_email,
              r.rating, r.created_at, r.updated_at
       FROM ratings r JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ? ORDER BY r.updated_at DESC`,
      [store.id]
    );

    const [avgRows] = await pool.query(
      'SELECT COALESCE(ROUND(AVG(rating), 2), 0) AS average_rating FROM ratings WHERE store_id = ?',
      [store.id]
    );

    res.json({
      store: { ...store, averageRating: parseFloat(avgRows[0]?.average_rating) || 0, totalRatings: ratersRows.length },
      raters: ratersRows,
    });
  } catch (err) {
    console.error('Owner dashboard error:', err);
    res.status(500).json({ message: 'Failed to fetch dashboard data.' });
  }
};

module.exports = { getOwnerDashboard };
