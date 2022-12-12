
-- View All Roles Query --

SELECT  roles.id, roles.title, departments.name AS department, roles.salary
FROM roles
LEFT JOIN departments ON roles.department_id = departments.id
ORDER BY roles.id;

-- View All Employees Query --

SELECT employees.id, employees.first_name, employees.last_name, roles.title AS title, departments.name AS department, roles.salary AS salary, employees.manager_id AS manager
FROM employees
JOIN roles ON employees.role_id = roles.id
JOIN departments ON roles.department_id = departments.id
ORDER BY employees.id;

-- Add a department --

INSERT INTO departments (name) VALUES (?);

-- Add a role --



