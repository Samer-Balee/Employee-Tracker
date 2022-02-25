-- SELECT
--   employee.first_name , 
--   employee.last_name ,
--   roles.title,
--   roles.salary,
--   department.department_name,
--   employee_m.first_name as manager_firstname,
--   employee_m.last_name as manager_lastname
-- FROM
--   employee
--   JOIN roles ON employee.role_id = roles.id
--   JOIN department ON roles.department_id = department.id
--   LEFT JOIN employee AS employee_m ON employee.manager_id = employee_m.id;

-- SELECT * FROM department;

-- SELECT * FROM roles;

--  SELECT * FROM employee;