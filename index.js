const db = require('./connection');
const inquirer = require('inquirer');


function start() {


    inquirer.prompt({
        name: "action",
        message: "What would you like to do?",
        type: "list",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add Employee",
            "Update a role"]

    }).then(
        answer => {
            switch (answer.action) {
                case "View all departments":
                    viewAllDepartments();
                    break;
                case "View all roles":
                    viewAllRoles()
                    break;
                case "View all employees":
                    viewAllEmployees()
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add Employee":
                        addEmployee();
                        break;    
                case "Update a role":
                    updateEmployeeRole();
                    break;
                default: return;
            }
        }
    )
}

function viewAllDepartments() {
    db.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function viewAllRoles() {
    //INNER JOIN Customers ON Orders.CustomerID=Customers.CustomerID;
    db.query("SELECT role.title as role_title, role.salary as role_salary, department.name as department_name  FROM role INNER JOIN department ON role.department_id = department.id", (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function viewAllEmployees() {
    db.query("SELECT employee.id as id, employee.first_name as first_name, employee.last_name as last_name, employee.role_id as role_id, role.title, employee.manager_id as manager_id, role.salary FROM employee INNER JOIN role ON employee.role_id = role.id", (err, data) => {
        //if (err) throw err;
        console.table(data);
        start();
    });
}

function addDepartment() {
    inquirer.prompt([
        { name: 'departmentName', type: 'input', message: "What is the name of the new department?" }
    ])
        .then(answer => {
            console.log(answer);
            db.query(`INSERT INTO department (name) VALUES ('${answer.departmentName}')`,
                (err, res) => {
                    if (err) throw err;
                    viewAllDepartments();
                    start();
                })
        })
}

function addRole() {
    db.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.log(res);
        const departmentNames = res.map(({ name }) => name);
        console.log(departmentNames);
        inquirer.prompt([
            { name: 'department', type: 'list', choices: departmentNames, message: "Which department would you like to put the role in?" },
        ]).then(answer => {
            console.log(answer);
            const departmentId = res.filter(({ name }) => name === answer.department)[0].id;
            console.log(departmentId);
            //return departmentId;
            addRoleToDB(departmentId);
        })

    })
    //const departments = res.map(({ id, name }) => ({ name: name, value: id }));
    //console.log(departments);
}

function addRoleToDB(departmentId) {
    inquirer.prompt([
        { name: 'roleTitle', type: 'input', message: "What is the title of the new role?" },
        { name: 'roleSalary', type: 'input', message: "What is the salary of the new role?" },
        //{ name: 'departmentId', type: 'input', message: "What is the id of the department of the role?" },
    ])
        .then(answer => {
            console.log(answer);
            console.log("departmentId", departmentId)
            //const departmentId = getDepartmentId();
            //INSERT INTO role (title, salary, department_id) VALUES ('Sales Lead', 100000, 1),
            db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answer.roleTitle}', ${answer.roleSalary}, ${departmentId});`,
                (err, res) => {
                    if (err) throw err;
                    viewAllRoles();
                    start();
                })
})
}


function addEmployee() {
    db.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        console.log(res);
        const roleTitles = res.map(({ title }) => title);
        console.log(roleTitles);
        inquirer.prompt([
            { name: 'firstName', type: 'input', message: "Enter the employee's first name:" },
            { name: 'lastName', type: 'input', message: "Enter the employee's last name:" },
            { name: 'role', type: 'list', choices: roleTitles, message: "Select the employee's role:" },
            { name: 'managerId', type: 'input', message: "Enter the employee's manager ID (if any):" },
        ]).then(answer => {
            console.log(answer);
            const roleId = res.filter(({ title }) => title === answer.role)[0].id;
            console.log(roleId);
            addEmployeeToDB(answer.firstName, answer.lastName, roleId, answer.managerId);
        });
    });
}

function addEmployeeToDB(firstName, lastName, roleId, managerId) {
    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', ${roleId}, ${managerId || null});`,
        (err, res) => {
            if (err) throw err;
            console.log("Employee added successfully!");
            viewAllEmployees();
            start();
        });


}


function updateEmployeeRole() {
    db.query("SELECT * FROM employee", (err, employees) => {
        if (err) throw err;
        console.log(employees);
        
        const employeeNames = employees.map(({ first_name, last_name }) => `${first_name} ${last_name}`);
        console.log(employeeNames);
        
        db.query("SELECT * FROM role", (err, roles) => {
            if (err) throw err;
            console.log(roles);
            
            const roleTitles = roles.map(({ title }) => title);
            console.log(roleTitles);
            
            inquirer.prompt([
                { name: 'employee', type: 'list', choices: employeeNames, message: "Which employee's role would you like to update?" },
                { name: 'role', type: 'list', choices: roleTitles, message: "Select the new role:" }
            ])
            .then(answer => {
                console.log(answer);
                const employeeId = employees.filter(emp => `${emp.first_name} ${emp.last_name}` === answer.employee)[0].id;
                const roleId = roles.filter(role => role.title === answer.role)[0].id;
                
                db.query(`UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId}`, (err, res) => {
                    if (err) throw err;
                    console.log("Employee role updated successfully!");
                    viewAllEmployees();
                    start();
                });
            });
        });
    });
}

// 


start();

// function updateDepartment() {
    //     db.query("SELECT * FROM department", (err, res) => {
    //         if (err) throw err;
    //         console.log(res);
    //         //const departments = res.map(({ id, name }) => ({ name: name, value: id }));
    //         //console.log(departments);
    
    //         const departmentNames = res.map(({ name }) => name);
    //         console.log(departmentNames);
    
    //         inquirer.prompt([
    //             { name: 'department', type: 'list', choices: departmentNames, message: "Which department would you like to update?" },
    //             { name: 'newDepartment', type: 'input', message: "What is the new department name?" }
    //         ])
    //             .then(answer => {
    
    //                 console.log(answer);
    //                 const departmentId = res.filter(d => d.name === answer.department)[0].id;
    
    //                 db.query(`UPDATE department SET name = '${answer.newDepartment}' WHERE id = ${departmentId}`,
    //                     (err, res) => {
    //                         if (err) throw err;
    //                         viewAllDepartments();
    //                         start();
    //                     })
    //             });
    //     })
    // }
    