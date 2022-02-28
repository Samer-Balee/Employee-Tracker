
const inquirer = require("inquirer");

const db = require('./lib/conection');

const questions = require('./lib/questions');

const table = require('console.table');
const { addDepartmentQuestions } = require("./lib/questions");

db.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + db.threadId);
    displayTitle();
});

displayTitle = () => {
    console.log("***********************************")
    console.log("*                                 *")
    console.log("*        EMPLOYEE MANAGER         *")
    console.log("*                                 *")
    console.log("***********************************")
    start();
};

async function start() {
    const userChoice = await inquirer.prompt(questions.firstQuestion);
    switch (userChoice.choices) {
        case "View All Employees":  // done
            viewEmployees();
            break;
        case "View All Employees by Department":  // done
            viewEmpByDepartment();
            break;
        case "View All Employees by Manager": // still error
            viewEmpByManager();
            break;
        case "Add an Employee": // done
            addEmployee();
            break;
        case "Remove an Employee":  // done
            removeEmployee();
            break;
        case "Update an Employee Role":  // still error
            updateEmpRole();
            break;
        case "Update Employee Manager":  // not added
            updateEmpByManager();
            break;
        case "View All Roles":  // done
            viewRoles();
            break;
        case "Add a Role":  // still error
            addRole();
            break;
        case "Remove a Role": // not added yet
            removeRole();
            break;
        case "View All Departments":  // done
            viewDepartments();
            break;
        case "Add a Department":  // done
            addDepartment();
            break;
        case "Remove a Department":  // done
            removeDepartment();
            break;
        case "View total utilized budget by department":
            viewUtilBudget();
            break;
        case "Quit":
            db.end();
            break;
        default:
            db.end();
    }

}

function viewEmployees() {


    db.query(`SELECT employee.id, employee.first_name, employee.last_name, 
    roles.title AS title, roles.salary, department.department_name AS department, 
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee JOIN roles ON employee.role_id = roles.id 
     JOIN department ON roles.department_id = department.id
     LEFT JOIN employee AS manager ON employee.manager_id = manager.id;`, function (err, res) {
        if (err) throw err;

        console.table(res);
        start();
    });
}


function viewEmpByDepartment() {
    db.query("SELECT * FROM department", async (err, department) => {

        if (err) throw err;

        const { departmentName } = await inquirer.prompt([
            {
                type: "list",
                message: "Select a Department:",
                name: "departmentName",
                choices: () => {
                    return department.map((department) => department.department_name);
                }
            }]);

        db.query(`SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary, department.department_name AS department
         FROM employee LEFT JOIN roles ON employee.role_id = roles.id 
        LEFT JOIN department ON roles.department_id = department.id`, function (err, res) {
            if (err) throw err;

            console.table(res.filter((name) => departmentName === name.department));
            start();
        });
    })
}

function viewEmpByManager() {
    db.query(`SELECT first_name, last_name, manager_id FROM employee
    JOIN employee ON employee.manager_id = employee.id`, async (err, employee) => {

        if (err) throw err;
        // get the name, category, starting bid from user
        const managers = employee.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        const { managerId } = await inquirer.prompt([
            {
                type: "list",
                message: "Choose a manager:",
                name: "managerId",
                choices: managers
            },
        ]);
        db.query(`SELECT first_name, last_name FROM employee WHERE manager_id= ?`, managerId, function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            console.table(res);
            start();
        });
    })

}

async function addEmployee() {
    let qry = "SELECT id as value, CONCAT(first_name, ' ', last_name) as name FROM employee"

    db.query(qry, async (err, employees) => {

        qry = "SELECT id as value, title as name FROM roles"

        db.query(qry, async (err, roles) => {
            // get the name, category, starting bid from user
            const newEmp = await inquirer.prompt(questions.addEmployee(roles, employees));

            qry = "INSERT INTO employee SET ?"

            db.query(qry, newEmp, function (err) {
                if (err) throw err;
                console.log("New employee was added successfully!");
              
                start();
            });
        })
    })
}



function removeEmployee() {
    db.query("SELECT * FROM employee", async (err, employee) => {

        if (err) throw err;

        const employees = employee.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        const { employeeId } = await inquirer.prompt([
            {
                type: "list",
                message: "Select an employee to delete:",
                name: "employeeId",
                choices: employees
            }]);

        db.query(`DELETE FROM employee WHERE id = ${employeeId}`,
            function (err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                console.log('Employee has been deleted successfully')
                start();
            });
    })
}

function viewDepartments() {
    db.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        start();
    });
}

function viewRoles() {
    db.query(`SELECT roles.id, roles.title, roles.salary , department.department_name AS department FROM roles 
    LEFT JOIN department ON roles.department_id = department.id`, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        start();
    });
}

async function addDepartment() {
    const departmentDetails = await inquirer.prompt(addDepartmentQuestions)

    db.query(`INSERT INTO department SET ?`, {
        department_name: departmentDetails.departmentAddName
    },
        function (err) {
            if (err) throw err;
            console.log("New department was added successfully!");
          
            start();
        }
    );
}

async function addRole() {
    const roleChoice = await inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: "What role do you want to add?",
            validate: addRole => {
            if (addRole) {
            return true;
            } else {
                console.log('Please enter a role');
                return false;
            }
         }
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is the salary of this role?",
          }
    ])
    const params = [roleChoice.role, roleChoice.salary];
    db.query(`SELECT department_name, id FROM department`, async (err, data) => {
        if (err) throw err;
        const deptartments = data.map(({ name, id }) => ({ name: name, value: id }));
        
        const deptChoice = await inquirer.prompt(
            {
                type: 'list',
                name: 'dept',
                message: "What department is this role in?",
                choices: deptartments
              }
        )
        const department = deptChoice.dept;
        params.push(department);

        db.query(`INSERT INTO roles (title, salary, department_id)
        VALUES (?, ?, ?)` , params, (err, result) => {
            if (err) throw err;
            console.log('Successfuly added a role');
            start();
        })
    })


}



function updateEmpRole() {
    db.query("SELECT * FROM employee", async (err, data) => {
        if (err) throw err;
        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
        const empChoice = await inquirer.prompt(
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employees
            })
        const employee = empChoice.name;
        const params = [];
        params.push(employee);

        const roleSql = `SELECT * FROM roles`;

        db.query(roleSql, async (err, data) => {
            if (err) throw err;

            const roles = data.map(({ id, title }) => ({ name: title, value: id }));

            const roleChoice = await inquirer.prompt(
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's new role?",
                    choices: roles
                })
            const role = roleChoice.role;
            params.push(role);

            let employee = params[0]
            params[0] = role
            params[1] = employee

            db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, params, (err, result) => {
                if (err) throw err;
                console.log("Employee's role has been updated!");
                start();
            })
        })


    })
}



function removeDepartment() {
    db.query(`SELECT * FROM department`, async (err, res) => {
        if (err) throw err;

        const dept = res.map(({ department_name, id }) => ({ name: department_name, value: id }));
        console.log(dept);

        const deptChoice = await inquirer.prompt(
            {
                type: 'list',
                name: 'deptId',
                message: "Which department would you like to delete?",
                choices: dept
            })
        console.log(deptChoice);
        db.query(`DELETE FROM department WHERE id = ?`, deptChoice.deptId, (err, result) => {
            if (err) throw err;
            console.log("Successfully deleted!");
            start();

        })

    })
}

function viewUtilBudget() {
    db.query(`SELECT department_id AS id, 
    department.department_name AS department,
    SUM(salary) AS budget
    FROM  roles  
    JOIN department ON roles.department_id = department.id GROUP BY  department_id` , (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    })
}















