const mysql = require('mysql');

// Create a connection pool instead of a single connection
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'permission-module'
});

// Get a connection from the pool
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');

  // Release the connection when done
  connection.release();
});

// Export the pool for use in other modules
module.exports = pool;
