module.exports = {
    firstQuestion: {
        type: "list",
        message: "What would you like to do?",
        name: "choices",
        choices: [
            "View All Employees",
            "View All Employees by Department",
            "Add an Employee",
            "Remove an Employee",
            "Update an Employee Role",
            "Update an Employee Manager",
            "View All Roles",
            "Add a Role",
            "Remove a Role",
            "View All Departments",
            "Add a Department",
            "Remove a Department",
            "View total utilized budget by department",
            "Quit"
        ]
    },


    addEmployee: (roles, employees) => [
        {
            type: "input",
            message: "What is your employee's first name?",
            name: "first_name",
            validate: addFirst => {
                if (addFirst) {
                    return true;
                } else {
                    console.log('Please enter first name');
                    return false;
                }
            }
        },
        {
            type: "input",
            message: "What is your employee's last name?",
            name: "last_name",
            validate: addLast => {
                if (addLast) {
                    return true;
                } else {
                    console.log('Please enter last name');
                    return false;
                }
            }
        },
        {
            type: "list",
            message: "What is your employee's role?",
            name: "role_id",
            choices: roles
        },
        {
            type: "list",
            message: "Who is your employee's manager?",
            name: "manager_id",
            choices: [
                { name: 'No manager', value: null },
                ...employees]
        }
    ],

    removeEmployee: {
        type: "list",
        message: "What is your employee's role?",
        name: "employeeRemoval",
        choices: ["Manager", "Associate", "Soft"]
    },

    addDepartmentQuestions:
    {
        type: "input",
        message: "What is the department's name you would like to add?",
        name: "departmentAddName",
        validate: addDepartment => {
            if (addDepartment) {
                return true;
            } else {
                console.log('Please enter a department name');
                return false;
            }
        }
    },

    addNewRole: [
        {
            type: "input",
            message: "What is the title of your new role?",
            name: "titleRole",
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
            type: "input",
            message: "What is the salary for this role?",
            name: "salary",
            validate: addSalary => {
                if (isNAN(addSalary)) {
                  return true;
                } else {
                  console.log('Please enter a salary');
                  return false;
                }
              }
        },
        {
            type: "input",
            message: "What is the department id for this role?",
            name: "departmentIdRole",
        }
    ],

}

























