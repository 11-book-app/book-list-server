'use strict';

const pg = require('pg');
const fs = require('fs');
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);
client.connect();
client.on('error', err => {
console.error(err);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(express.static('./public'));

loadDB();

app.get('/test', (req,res) => {
  client.query(`SELECT * FROM books;`)
  .then(results => res.send(results.rows));
});

app.listen(PORT, () => console.log('Server started on port', PORT));

function loadBooks() {
  client.query('SELECT COUNT(*) FROM books')
    .then(result => {
      if (!parseInt(result.rows[0].count)) {
        fs.readFile('books.json', 'utf8', (err, fd) => {
          JSON.parse(fd).forEach(ele => {
            client.query(
              'INSERT INTO books(title, author, isbn, image_url, description) VALUES($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
              [ele.title, ele.author, ele.isbn, ele.image_url, ele.description]
            )
              .catch(console.error);
          });
        });
      }
    });
}

function loadDB() {
  client.query(`
    CREATE TABLE IF NOT EXISTS 
    books(
      book_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) UNIQUE NOT NULL,
      isbn  VARCHAR(255) NOT NULL,
      image_url VARCHAR(255),
      description TEXT NOT NULL
    );`
  )
    .then(loadBooks)
    .catch(console.error);
}

