

const inquirer = require("inquirer");

const db = require('./lib/conection');




const questions = require('./lib/questions');

const table = require('console.table');

// start();

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
        case "View All Employees by Ddepartment":
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

// async function addEmployee() {
//     let qry = "SELECT id as value, CONCAT(first_name, ' ', last_name) as name FROM employee"
//     db.query(qry, async (err, employees) => {
//         qry = "SELECT id as value, title as name FROM roles"
//         db.query(qry, async (err, roles) => {
//             // get the name, category, starting bid from user
//             const newEmp = await inquirer.prompt(questions.addEmployee(roles, employees));
//             qry = "INSERT INTO employee SET ?"
//             db.query(qry, newEmp, function (err) {
//                 if (err) throw err;
//                 console.log("New employee was added successfully!");
//                 // re-prompt the user for if they want to bid or post
//                 start();
//             });
//         })
//     })
// }



