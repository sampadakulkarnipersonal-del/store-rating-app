const pool = require('../config/db');

const getAllStores = async (req, res) => {
  try {
    const { name, address, sortBy = 'name', order = 'ASC' } = req.query;
    const userId = req.user.id;

    const validSortFields = ['name', 'address', 'average_rating'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let sql = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        COALESCE(ROUND(AVG(r.rating), 2), 0)                        AS average_rating,
        COUNT(r.id)                                                  AS total_ratings,
        MAX(CASE WHEN r.user_id = ? THEN r.rating ELSE NULL END)    AS user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const params = [userId];

    if (name)    { sql += ' AND LOWER(s.name)    LIKE LOWER(?)'; params.push(`%${name}%`);    }
    if (address) { sql += ' AND LOWER(s.address) LIKE LOWER(?)'; params.push(`%${address}%`); }

    sql += ` GROUP BY s.id, s.name, s.email, s.address ORDER BY ${sortField} ${sortOrder}`;

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Get stores error:', err);
    res.status(500).json({ message: 'Failed to fetch stores.' });
  }
};

const submitRating = async (req, res) => {
  const { storeId } = req.params;
  const { rating }  = req.body;
  const userId      = req.user.id;

  if (!rating || rating < 1 || rating > 5)
    return res.status(400).json({ message: 'Rating must be between 1 and 5.' });

  try {
    const [storeCheck] = await pool.query('SELECT id FROM stores WHERE id = ?', [storeId]);
    if (storeCheck.length === 0) return res.status(404).json({ message: 'Store not found.' });

    const [existing] = await pool.query(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?', [userId, storeId]
    );
    if (existing.length > 0)
      return res.status(409).json({ message: 'You have already rated this store. Use edit to update.' });

    const [result] = await pool.query(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
      [userId, storeId, rating]
    );
    res.status(201).json({
      message: 'Rating submitted successfully.',
      rating: { id: result.insertId, user_id: userId, store_id: parseInt(storeId), rating },
    });
  } catch (err) {
    console.error('Submit rating error:', err);
    res.status(500).json({ message: 'Failed to submit rating.' });
  }
};

const updateRating = async (req, res) => {
  const { storeId } = req.params;
  const { rating }  = req.body;
  const userId      = req.user.id;

  if (!rating || rating < 1 || rating > 5)
    return res.status(400).json({ message: 'Rating must be between 1 and 5.' });

  try {
    const [existing] = await pool.query(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?', [userId, storeId]
    );
    if (existing.length === 0)
      return res.status(404).json({ message: 'No existing rating found for this store.' });

    await pool.query(
      'UPDATE ratings SET rating = ?, updated_at = NOW() WHERE user_id = ? AND store_id = ?',
      [rating, userId, storeId]
    );
    res.json({ message: 'Rating updated successfully.', rating: { user_id: userId, store_id: parseInt(storeId), rating } });
  } catch (err) {
    console.error('Update rating error:', err);
    res.status(500).json({ message: 'Failed to update rating.' });
  }
};

module.exports = { getAllStores, submitRating, updateRating };
