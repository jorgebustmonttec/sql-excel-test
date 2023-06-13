const mysql = require("mysql");

// Create a connection to the database
const connection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "admin",
  database: "js_test"
});

function connectToDatabase(callback) {
  connection.connect((error) => {
    if (error) {
      console.error('Error connecting to the database:', error);
      return;
    }
    console.log('Connected to the database');
    callback(); // Execute the callback when the connection is established
  });
}

module.exports = {
  connection,
  connectToDatabase
};
