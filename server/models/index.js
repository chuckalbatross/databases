var db = require('../db');
var promise = require('bluebird');

module.exports = {
  messages: {
    get: function (callback) {   
      db.connection.query(`SELECT messages.text, messages.room, users.name 
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
              outputArr.push(messageObj);
            }
            console.log('Before callback:', outputArr);
            callback(null, outputArr);
          }
        });
    },
    // a function which produces all the messages
    post: function () {} // a function which can be used to insert a message into the database

  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }
};

