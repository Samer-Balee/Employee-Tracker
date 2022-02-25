module.exports = {
    firstQuestion: {
        type: "list",
        message: "What would you like to do?",
        name: "choices",
        choices: [
            "View All Employees",
            "View All Employees by Ddepartment",
            "View All Employees by Manager",
            "Add Employee",
            "Remove Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "View All Roles",
            "Add Role",
            "Remove Role",
            "View All Departments",
            "Add Department",
            "Remove Department",
            "View total utilized budget by department",
            "Quit"
           ]
        },
    

    addEmployee: (roles, employees) => [
        {
            type: "input",
            message: "What is your employee's first name?",
            name: "first_name",
        },
        {
            type: "input",
            message: "What is your employee's last name?",
            name: "last_name",
        },
        {
            type: "list",
            message: "What is your employee's role?",
            name: "role",
            choices: roles
        },
        {
            type: "list",
            message: "Who is your employee's manager?",
            name: "manager",
            choices: employees
        }
    ],

    removeEmployee: {
        type: "list",
        message: "What is your employee's role?",
        name: "employeeRemoval",
        choices: ["Manager", "Associate", "Soft"]
    },

    // updateEmpRole: [
    //     {
    //         type: "list",
    //         message: "What is your employee's name?",
    //         name: "name",
    //         choices: employee
    //     },
    //     {
    //         type: "list",
    //         message: "What is your employee's role?",
    //         name: "role",
    //         choices: roles
    //     },
    // ],

    // updateEmployeeManager: [
    //     {
    //         type: "list",
    //         message: "What is your employee's name?",
    //         name: "name",
    //         choices: employees
    //     },
    //     {
    //         type: "list",
    //         message: "Who is your employee's manager?",
    //         name: "manager",
    //         choices: employee
    //     },
    // ],

    addRole:  [
        {
            type: "input",
            message: "What is the title of your new role?",
            name: "titleRole",
        },
        {
            type: "input",
            message: "What is the salary for this role?",
            name: "salary",
        },
        {
            type: "input",
            message: "What is the department id for this role?",
            name: "departmentIDrole",
        }
    ],

    // removeRole: {
    //     type: "list",
    //     message: "Which role you would like to delete?",
    //     name: "roleRemoval",
    //     choices: roles
    // },

    addDepartment: 
    {
        type: "input", 
        message: "What is the department's name you would like to add?",
        name: "departmentAddName",  
    },

    // removeDepartment: 
    // {
    //     type: "list",
    //     message: "What is the department's name you would like to remove?",
    //     name: "departmentRemove",
    //     choices: department,
    // },

    quit: {
        type: "list",
        message: "Are your sure you would like to quit?",
        name: "quit",
        choices: ["Yes", "No"]
    },
}

























