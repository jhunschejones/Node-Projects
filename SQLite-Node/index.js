const sqlite3 = require('sqlite3').verbose();

// open the database connection
let db = new sqlite3.Database('./db/sample.db')

// create the database
// db.run('CREATE TABLE IF NOT EXISTS danaNRQLjokes(id INTEGER PRIMARY KEY, joke TEXT, answer TEXT)');

// insert a row into the database
db.run(`INSERT INTO danaNRQLjokes(joke, answer) VALUES(?, ?)`, ['What did the Facet say to the Timeseries?', 'What an event!'], function(err) {
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