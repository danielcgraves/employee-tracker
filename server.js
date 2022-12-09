const db = require('./db/connection.js');
const inquirer = require('inquirer');
const express = require('express');
const cTable = require('console.table');
const { response } = require('express');
const { listenerCount } = require('./db/connection.js');



const mainMenu = [
    {
        name: 'mainMenu',
        type: 'list',
        message: 'Please make a selection',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update and employee role'
        ],
    }
];




function init() {
    inquirer.prompt(mainMenu)
        .then(response => {
            if (response.mainMenu === 'View all departments') {
                showDepartments();
            } else if (response.mainMenu === 'View all roles') {
                showRoles();
            }
        })
    };

init()


// Shows departments table
const showDepartments = function() {
    db.query(`SELECT * FROM departments`, (err, results) => {
        console.table(results);
        init();
    });
};

const showRoles = function() {
    db.query(`SELECT  roles.id, roles.title, departments.name AS department, roles.salary
    FROM roles
    LEFT JOIN departments ON roles.department_id = departments.id
    ORDER BY roles.id;`, (err, results) => {
        console.table(results);
        init();
    });
};












/* const PORT = process.env.PORT || 3001; */
/* const app = express(); */

//Middleware

/* app.use(express.urlencoded({ extended: false}));
app.use(express.json()); */

