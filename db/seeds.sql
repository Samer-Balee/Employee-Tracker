INSERT INTO department (department_name)
VALUES
    ('Engineering'),
    ('Finance'),
    ('legal'),
    ('Sales'),
    ('Service');

INSERT INTO roles (title, salary, department_id)
VALUES 
    ('Sales Lead' , 70000 , 4),
    ('Lead Engineer' , 120000 , 1),
    ('Software Engineer' , 140000 , 1),
    ('Account Manager' , 150000 , 2),
    ('Legal Team Lead' , 120000 , 3),
    ('Accountant' , 100000 , 2),
    ('Customer Service' , 70000 , 5),
    ('lawyer' , 140000 , 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('William', 'King', 1, 1),
    ('Tom', 'Porterboy', 2, 1),
    ('John', 'Kim', 7, 2),
    ('Dan', 'Templeton', 3, 2),
    ('Samir', 'Nagheenanajar', 3, 3),
    ('Josh', 'Clammer', 4, 2),
    ('Lily', 'Santa-Monica', 4, 1),
    ('Ray', 'Mustbeirish', 5, 1),
    ('Milton', 'Waddams', 5, 3),
    ('Samer', 'Balee', 1, 1);