var db = require('../db');
var promise = require('bluebird');

module.exports = {
  messages: {
    get: function (callback) {   
      db.connection.query(`SELECT *
        FROM messages INNER JOIN users 
        WHERE messages.user_id = users.id`,
        (err, results) => {
          if (err) {
            console.log(`Error SELECTing: ${err}`);
          } else {
            var outputArr = [];
            for (var i = 0; i < results.length; i++) {
              var messageObj = {};
              messageObj.text = results[i].text;
              messageObj.name = results[i].name;
              messageObj.room = results[i].room;
              messageObj.objectId = results[i].id;
              console.log('RESULT ID:', results[i].id);
              outputArr.push(messageObj);
            }
            callback(null, outputArr);
          }
        });
    },
    // a function which produces all the messages
    post: function (message, callback) {
      var user = message.name;
      module.exports.users.get( (err, results) => {
        if (err) {
          console.log(`Error getting users: ${err}`);
        } else {
          
          // console.log('MESSAGES POST:', message);
          // console.log('MESSAGES POST RESULTS:', results[0].name);


          // iterate and store
          var userId = null;
          for (var i = 0; i < results.length; i++) {
            if (results[i].name === user) {
              userId = results[i].id;
            }
          }

          // find id of user
          if (userId) {
            db.connection.query(`INSERT INTO messages (user_id, text, room) VALUES 
              ('${userId}', '${message.text}', '${message.room}')`, 
              function(err, results) {
                if (err) {
                  console.log('ERROR INSERTING MESSAGE:', err);
                } else {
                  callback(null, results);
                }
              });
          } else {
            module.exports.users.post(user, (err, results) => {
              if (err) {  
                console.log(`Error getting users: ${err}`);
              } else {
                // console.log('LAST ID RESULTS:', results[0]['LAST_INSERT_ID()']);
                userId = results[0]['LAST_INSERT_ID()'];
                db.connection.query(`INSERT INTO messages (user_id, text, room) VALUES 
                  ('${userId}', '${message.text}', '${message.room}')`, 
                  function(err, results) {
                    if (err) {
                      console.log('ERROR INSERTING MESSAGE:', err);
                    } else {
                      callback(null, results);
                    }
                  });
              }  
            });
          }

          // database query (INSERT INTO)





        }
      });
      // db.connection.query(`INSERT INTO messages (user_id, text, room) VALUES 
      //   ('0','This is James first message','lobby')`,






    } // a function which can be used to insert a message into the database

  },

  users: {
    // Ditto as above.
    get: function (callback) {
      db.connection.query(`SELECT * FROM users`, (err, results) => {
        if (err) {
          console.log(`Error getting users: ${err}`);
        } else {
          callback(null, results);
        }
      
      });


    },
    post: function (name, callback) {
      db.connection.query(`INSERT INTO users (name) VALUES ('${name}')`, 
        function(err, results) {
          if (err) {
            console.log(`USERS POST ERROR: ${err}`);
          } else {
            db.connection.query(`SELECT LAST_INSERT_ID()`, (err, results) => {
              if (err) {
                console.log(`ERROR RETURNING LAST INSERT ID: ${err}`);
              } else {
                callback(null, results);
              }
            });
          }
        });
    }
  }
};

