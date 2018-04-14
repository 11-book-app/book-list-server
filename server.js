'use strict';

const pg = require('pg');
const fs = require('fs');
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
// const conString = 'postgres://postgres:3874@LOCALHOST:5432/';
// const client = new pg.Client(conString);
// client.connect();
// client.on('error', err => {
// console.error(err);
// });

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(express.static('./public'));

app.get('/test', (req, res) => res.send('hello world!'));
app.listen(PORT, () => console.log('Server started on port', PORT));