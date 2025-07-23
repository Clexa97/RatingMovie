const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  db.run(`
 CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER,
  movieId INTEGER,
  title TEXT,
  poster TEXT,
  genre TEXT,
  comment TEXT,
  rating INTEGER,
  tags TEXT,
  date TEXT
)
  `);
});

module.exports = db;
