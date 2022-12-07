/* const inquirer = require('inquirer'); */
const express = require('express');
const mysql = require('mysql2');

const cTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

//Middleware

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//Connect to database

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'company'
    },
    console.log(`Connected to the company database.`)
);

db.query(`SELECT * FROM departments`, (err, results) => {
    console.log(results);
});

//Read employees
/* app.get('/api/employees', (req, res) => {
    const sql = `SELECT id, `
})
 */

