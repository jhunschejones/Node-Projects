const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../db/sample.db')

// insert a row into the database
db.run(`INSERT INTO NRQLjokes(joke, punchline) VALUES(?, ?)`, ['Why did the Facet and Timeseries get thrown out of the party?', "They don't do well with events."], function(err) {
  if (err) {
      return console.log(err.message);
  }

  console.log(`A row has been inserted with rowid ${this.lastID}`);
});

db.run(`INSERT INTO NRQLjokes(joke, punchline) VALUES(?, ?)`, ["What is the most 'Portland' LIMIT?", '15, the origional LIMIT before anyone else was a LIMIT.'], function(err) {
  if (err) {
      return console.log(err.message);
  }

  console.log(`A row has been inserted with rowid ${this.lastID}`);
});

db.run(`INSERT INTO NRQLjokes(joke, punchline) VALUES(?, ?)`, ['Why are NRQL queries the lonliest to write?', 'They can never join.'], function(err) {
  if (err) {
      return console.log(err.message);
  }

  console.log(`A row has been inserted with rowid ${this.lastID}`);
});

// close the database connection after all queries have completed
db.close((err) => {
  if (err) {
      return console.error(err.message);
  }
  console.log('Closing the database connection.')
});