const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, (req, res) => {
  const { movieId, title, poster, comment, rating, tags, date, genre } = req.body; 
  const userId = req.user.id;

  const sql = `
    INSERT INTO reviews (userId, movieId, title, poster, comment, rating, tags, date, genre)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
  `;
  db.run(sql, [userId, movieId, title, poster, comment, rating, JSON.stringify(tags), date, genre], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

router.get('/', auth, (req, res) => {
  const userId = req.user.id;

  db.all('SELECT * FROM reviews WHERE userId = ?', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const parsedRows = rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]')
    }));
    res.json(parsedRows);
  });
});

router.put('/:id', auth, (req, res) => {
  const { comment, rating, tags } = req.body;
  const reviewId = req.params.id;
  const userId = req.user.id;

  const sql = `
    UPDATE reviews
    SET comment = ?, rating = ?, tags = ?
    WHERE id = ? AND userId = ?
  `;
  db.run(sql, [comment, rating, JSON.stringify(tags), reviewId, userId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: 'Avaliação não encontrada.' });
    res.json({ message: 'Avaliação atualizada.' });
  });
});

router.delete('/:id', auth, (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.id;

  db.run('DELETE FROM reviews WHERE id = ? AND userId = ?', [reviewId, userId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: 'Avaliação não encontrada.' });
    res.json({ message: 'Avaliação removida.' });
  });
});

module.exports = router;