// create the database
db.run('CREATE TABLE IF NOT EXISTS NRQLjokes(id INTEGER PRIMARY KEY, joke TEXT, punchline TEXT)');

// insert a row into the database
db.run(`INSERT INTO NRQLjokes(joke, punchline) VALUES(?, ?)`, ['What did the Facet say to the Timeseries?', 'What an event!'], function(err) {
  if (err) {
      return console.log(err.message);
  }

  console.log(`A row has been inserted with rowid ${this.lastID}`);
});

db.run(`INSERT INTO NRQLjokes(joke, punchline) VALUES(?, ?)`, ['What is the most Portland LIMIT?', '15, the limit before anyone else was a limit.'], function(err) {
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