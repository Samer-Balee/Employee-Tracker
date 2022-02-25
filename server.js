
const inquirer = require("inquirer");

const db = require('./lib/conection');

const questions = require('./lib/questions');

const table = require('console.table');

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
        case "View All Employees":
            viewEmployees();
            break;
        case "View All Employees by Department":
            viewEmpByDepartment();
            break;
        case "View All Employees by Manager":
            viewEmpByManager();
            break;
        case "Add Employee":
            addEmployee();
            break;
        case "Remove Employee":
            removeEmployee();
            break;
        case "Update Employee Role":
            updateEmpRole();
            break;
        case "Update Employee Manager":
            updateEmpByManager();
            break;
        case "View All Roles":
            viewRoles();
            break;
        case "Add Role":
            addRole();
            break;
        case "Remove Role":
            removeRole();
            break;
        case "View All Departments":
           viewDepartments();
            break;
        case "Add Department":
            addDepartment();
            break;
        case "Remove Department":
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
    roles.title AS title, roles.salary, department.department_name AS department 
    FROM employee  JOIN roles ON employee.role_id = roles.id 
    JOIN department ON roles.department_id = department.id`, function (err, res) {
        if (err) throw err;
       
        console.table(res);
        start();
    });
}

function viewEmpByDepartment() {
    db.query("SELECT * FROM department", async (err, department) => {
        
        const {
            departmentName
        } = await inquirer.prompt([{
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



