
-- View All Roles Query --

SELECT  roles.id, roles.title, departments.name AS department, roles.salary
FROM roles
LEFT JOIN departments ON roles.department_id = departments.id
ORDER BY roles.id;

