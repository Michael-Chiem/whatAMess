const express = require('express');
const db = require('./config/connection'); // Assuming this file exports your database connection

const app = express();
const port = 3000; // You can use any port you prefer

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., CSS, client-side JS)
app.use(express.static('public'));

// Define your routes
app.get('/', (req, res) => {
  // Render your homepage HTML here
  res.send(`
    <h1>Welcome to my website!</h1>
    <p><a href="/tables">View All Tables</a></p>
  `);
});

// Define a route to display all tables
app.get('/tables', (req, res) => {
  // Fetch data from all three tables: employee, role, and department
  const tables = ['employee', 'role', 'department'];
  const promises = tables.map(table => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM ${table}`, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve({ table, rows });
        }
      });
    });
  });

  Promise.all(promises)
    .then(results => {
      const html = results.map(result => {
        const tableName = result.table;
        const tableRows = result.rows.map(row => {
          return Object.values(row).map(value => `<td>${value}</td>`).join('');
        }).join('</tr><tr>');

        return `
          <h2>${tableName}</h2>
          <table border="1">
            <thead>
              <tr>
                ${Object.keys(result.rows[0]).map(column => `<th>${column}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>${tableRows}</tr>
            </tbody>
          </table>
        `;
      }).join('');

      res.send(html);
    })
    .catch(err => {
      res.status(500).send('Internal Server Error');
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
