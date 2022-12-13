const db = require('./db/connection.js');
const inquirer = require('inquirer');
require('console.table');


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
            'Update an employee role'
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
            } else if (response.mainMenu === 'View all employees') {
                showEmployees();
            } else if (response.mainMenu === 'Add a department') {
                addDepartment();
            } else if (response.mainMenu === 'Add a role') {
                addRole();
            } else if (response.mainMenu === 'Add an employee') {
                addEmployee();
            } else if (response.mainMenu === 'Update an employee role') {
                updateEmployee();
            }
        });
    };

init();

// "Show" Functions

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

const showEmployees = function() {
    db.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title AS title, departments.name AS department, roles.salary AS salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employees
    JOIN roles ON employees.role_id = roles.id
    JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees manager ON employees.manager_id = manager.id
    ORDER BY employees.id;`, (err, results) => {
        if (err) throw err;
        console.table(results);
        init();
    });
    
};

// Add A Department

const addDepartment = function() {
    inquirer.prompt([
        {
            type: "input",
            name: "addDept",
            message: "What is the name of the department that you would like to add?",
            validate: addDept => {
                if (addDept) {
                    return true;
                } else {
                    console.log('Please add a department');
                    return false;
                }
            } 
        }
    ]).then(answer => {
        db.query(`INSERT INTO departments (name) VALUES (?);`, answer.addDept, (err, res) => {
            if (err) throw err;
            showDepartments();
        });
    });
};

// Add A Role

const addRole = function () {
    inquirer.prompt([
        {
            type: "input",
            name: "role",
            message: "What is the name of the role you would like to add?",
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    console.log('Please enter a new role');
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary for this role?",
            validate: salary => {
                if (salary) {
                    return true;
                } else if (salary === isNaN) {
                    console.log('Please enter a number');
                    return false;
                } else {
                    console.log('Please enter a salary');
                    return false;
                }
            }
        }
    ]).then(answer => {
        db.query(`SELECT name, id FROM departments;`, (err, data) => {
            if (err) throw err;

            const departments = data.map(({ name, id}) => ({ name: name, value: id }));

            inquirer.prompt([
                {
                    type: "list",
                    name: "department",
                    message: "What department is this role a part of?",
                    choices: departments
                }
            ]).then(choice => {

                db.query(`INSERT INTO roles (department_id, title, salary) VALUES (?, ?, ?);`, [choice.department, answer.role, answer.salary], (err, result) => { 
                    if (err) throw err;
                    showRoles();
                });
            });
        });
    });
};

// Add An Employee

const addEmployee = function() {
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the first name of this employee?",
            validate: addFirstName => {
                if (addFirstName) {
                    return true;
                } else {
                    console.log("Please enter the employee's first name");
                    return false;
                }
            }
        }, 
        {
            type: "input",
            name: "lastName",
            message: "What is the last name of this employee?",
            validate: addLastName => {
                if (addLastName) {
                    return true;
                } else {
                    console.log("Please enter this employee's last name");
                    return false;
                }
            }
        }
    ]).then(answer => {
        db.query(`SELECT roles.id, roles.title FROM roles;`, (err, data) => {
            if (err) throw err;

            const roles = data.map(({ id, title}) => ({ name: title, value: id }));

            inquirer.prompt([
                {
                    type: "list",
                    name: "role",
                    message: "What role does this employee have in the company?",
                    choices: roles
                }
            ]).then(roleChoice => {
                db.query(`SELECT * FROM employees;`, (err, data) => {
                    if (err) throw err;

                    const managers = data.map(({ id, first_name, last_name}) => ({ name: first_name + " " + last_name, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is the manager of this employee?",
                            choices: managers
                        }
                    ]).then(managerChoice => {
                        db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`, [answer.firstName, answer.lastName, roleChoice.role, managerChoice.manager], (err, result) => {
                            if (err) throw err;
                            showEmployees();
                        });
                    });
                });
            });
        });
    });
};

// Update An Employee Role

const updateEmployee = function() {
    db.query(`SELECT * FROM employees;`, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: "list",
                name: "name",
                message: "Select and employee to update their information.",
                choices: employees
            }
        ]).then(employeeChoice => {
            db.query(`SELECT * FROM roles;`, (err, data) => {
            if (err) throw err;

            const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: "list",
                        name: "role",
                        message: "What is the role you'd like this employee to have?",
                        choices: roles
                    }
                ]).then(roleChoice => {
                    db.query(`UPDATE employees SET role_id = ? WHERE id = ?;`, [roleChoice.role, employeeChoice.name], (err, result) => {
                        if (err) throw err;
                        
                        showEmployees();
                    });
                });
            });
        });
    });
};








