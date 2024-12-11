const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

import fs from 'fs';
import path from 'path';

const cors = require('cors');

const app = express();

const port = 3000;

//enable cors
app.use(cors());
//simplifies the process of parsing incoming requests
app.use(bodyParser.json());

let dbPath = path.join(process.cwd(), 'webshop.db');
let file = fs.readFileSync(dbPath);

// Connect to the database specified by a single file path
const db = new sqlite3.Database('dbPath', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Just a simple hello world GET request
app.get('/hello-world-json', (req, res) => {
    res.json({ message: 'Hello, World!' });
});

app.get('/api/products/:id', (req, res) => {
    // Get the id from the request parameters
    const { id } = req.params;

    // SQL query to fetch a single product
    const sql = 'SELECT * FROM products WHERE id = ?';

    // Execute the query
    db.get(sql, [id], (err, row) => {
        // If there is an error, send an error response
        if (err) {
            // Respond with error status code and the error message in json format
            res.status(400).json({ error: err.message });
            return;
        }
        // Send the fetched product as a response in JSON format
        res.json({
            message: 'success',
            data: row
        });
    });
});

// GET request to fetch all products
app.get('/api/products', (req, res) => {
    // SQL query to fetch all products
    const sql = 'SELECT * FROM products';

    // Execute the query
    db.all(sql, [], (err, rows) => {
        // If there is an error, send an error response
        if (err) {
            // Respond with error status code and the error message in json format
            res.status(400).json({ error: err.message });
            return;
        }
        // Send the fetched products as a response in JSON format
        res.json(rows);
    });
});

// POST request to add a new product
app.post('/api/products', (req, res) => {
    // Get the data from the request body
    const { name, price, description } = req.body;

    // SQL query to insert a new product
    const sql = 'INSERT INTO products (name, price, description) VALUES (?, ?, ?)';

    // Execute the query
    db.run(sql, [name, price, description], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        // Respond with the newly added product
        res.json({
            message: 'New product added successfully!',
            data: {
                id: this.lastID,
                name,
                price,
                description
            }
        });
    });
});


// start the server on a specific port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
