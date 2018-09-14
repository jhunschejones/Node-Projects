const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../db/sample.db')

// create the database
db.run('CREATE TABLE IF NOT EXISTS NRQLjokes(id INTEGER PRIMARY KEY, joke TEXT, punchline TEXT)');

db.close((err) => {
  if (err) {
      return console.error(err.message);
  }
  console.log('Closing the database connection.')
});