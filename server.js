// Import inquirer package
const inquirer = require("inquirer");
// import connection module
const db = require('./lib/conection');
// import questions module
const questions = require('./lib/questions');

const table = require('console.table');
// Import initial questions to start the app
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
// conditions depending on user choice
async function start() {
    const userChoice = await inquirer.prompt(questions.firstQuestion);
    switch (userChoice.choices) {
        case "View All Employees":  // done
            viewEmployees();
            break;
        case "View All Employees by Department":  // done
            viewEmpByDepartment();
            break;
        case "Add an Employee": // done
            addEmployee();
            break;
        case "Remove an Employee":  // done
            removeEmployee();
            break;
        case "Update an Employee Role":  // done
            updateEmpRole();
            break;
        case "Update an Employee Manager":  // done
            updateEmpByManager();
            break;
        case "View All Roles":  // done
            viewRoles();
            break;
        case "Add a Role":  // done
            addRole();
            break;
        case "Remove a Role": // done
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
        case "View total utilized budget by department": // done
            viewUtilBudget();
            break;
        case "Quit":
            db.end();
            break;
        default:
            db.end();
    }

}
// function to view all employees
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

// function to view all employees by department
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

// function to add employee
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


// function to remove employee
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
// function to view all departments
function viewDepartments() {
    db.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        start();
    });
}
// function to view all roles
function viewRoles() {
    db.query(`SELECT roles.id, roles.title, roles.salary , department.department_name AS department FROM roles 
    LEFT JOIN department ON roles.department_id = department.id`, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        start();
    });
}

// function to add a new department
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
// function to add a new role
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
        const deptartments = data.map(({ department_name, id }) => ({ name: department_name, value: id }));

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
// function to remove a role
function removeRole() {
    db.query(`SELECT * FROM roles`, async (err, res) => {
        if (err) throw err;

        const roles = res.map(({ title, id }) => ({ name: title, value: id }));

        const roleChoice = await inquirer.prompt(
            {
                type: 'list',
                name: 'roleId',
                message: "Which role would you like to delete?",
                choices: roles
            })

        db.query(`DELETE FROM roles WHERE id = ?`, roleChoice.roleId, (err, result) => {
            if (err) throw err;
            console.log("Successfully deleted!");
            start();

        })

    })
}


// function to update employee's role
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
            // Get all roles for choices
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
// function to update employee's manager
function updateEmpByManager() {
    db.query(`SELECT * FROM employee`, async (err, data) => {
        if (err) throw err;
        // Get all employees full name for choices
        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        const empChoice = await inquirer.prompt(
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employees
            }
        )
        const employee = empChoice.name;
        const params = [];
        params.push(employee);

        db.query(`SELECT * FROM employee`, async (err, data) => {
            if (err) throw err;

            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
            const managerCoice = await inquirer.prompt(
                {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                })
            const manager = managerCoice.manager;
            params.push(manager);

            let employee = params[0]
            params[0] = manager
            params[1] = employee

            db.query(`UPDATE employee SET manager_id = ? WHERE id = ?`, params, (err, result) => {
                if (err) throw err;
                console.log("Employee' manager has been updated!");
                start();
            })
        })
    })
}


// function to remove a department
function removeDepartment() {
    db.query(`SELECT * FROM department`, async (err, res) => {
        if (err) throw err;
        // Get all departments for choices
        const dept = res.map(({ department_name, id }) => ({ name: department_name, value: id }));

        const deptChoice = await inquirer.prompt(
            {
                type: 'list',
                name: 'deptId',
                message: "Which department would you like to delete?",
                choices: dept
            })

        db.query(`DELETE FROM department WHERE id = ?`, deptChoice.deptId, (err, result) => {
            if (err) throw err;
            console.log("Successfully deleted!");
            start();

        })

    })
}
// function to view the total utilized budget of a department
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















