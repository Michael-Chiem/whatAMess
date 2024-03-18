const sql = require('mysql2');

const connection = sql.createConnection({
    host: "localhost",
    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "employees"
  });
  
  connection.connect(function (err) {
    if (err) throw err;
  });
  
  module.exports = connection;