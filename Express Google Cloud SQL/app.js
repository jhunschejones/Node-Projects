require('dotenv').config()

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database');

// get an album by album id
app.route('/albums/:albumId')
  .get(function(req, res, next) {
    connection.query(
      "SELECT * FROM `albums_table` WHERE apple_album_id = ? LIMIT 3", req.params.albumId,
      function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    );
});

// return favorite albums for a hard-coded user
app.route('/favorites')
  .get(function(req, res, next) {
    connection.query(
      "SELECT * FROM albums_table INNER JOIN favorites_table ON favorites_table.apple_album_id = albums_table.apple_album_id INNER JOIN users_table ON favorites_table.user_id = users_table.user_id WHERE favorites_table.user_id = ?", "Ol5dmjWi9eQ7HoANLhM4OFBnso2",
      function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    );
});

app.get('/', (req, res) => res.send('The app is running!'));

app.set('port', process.env.PORT || 3000);
app.listen("3000", () => console.log("App listening on port 3000"));