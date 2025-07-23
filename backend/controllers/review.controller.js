const db = require('../db');

exports.createReview = (req, res) => {
  const { userId, movieId, title, poster, comment, rating, tags, date } = req.body;
  const tagString = JSON.stringify(tags);

  const query = `
    INSERT INTO reviews (userId, movieId, title, poster, comment, rating, tags, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(query, [userId, movieId, title, poster, comment, rating, tagString, date], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
};

exports.getReviewsByUser = (req, res) => {
  const { userId } = req.params;
  db.all('SELECT * FROM reviews WHERE userId = ?', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.updateReview = (req, res) => {
  const { id } = req.params;
  const { comment, rating, tags } = req.body;
  const tagString = JSON.stringify(tags);

  db.run(
    `UPDATE reviews SET comment = ?, rating = ?, tags = ? WHERE id = ?`,
    [comment, rating, tagString, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
};

exports.deleteReview = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM reviews WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
};
