var mysql = require('mysql');

// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".


exports.connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'plantlife',
  database: 'chat'
});

exports.connection.connect((err) => {
  if (err) {
    console.log(`Error connectin: ${err}`);
  }
});

