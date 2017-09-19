var db = require('../db');
var promise = require('bluebird');

module.exports = {
  messages: {
    get: function () {   
      return new promise((resolve, reject) => {
        db.connection.query(`SELECT messages.text, messages.room, users.name 
          FROM messages INNER JOIN users 
          WHERE messages.user_id = users.user_id`,
          (err, results) => {
            if (err) {
              console.log(`Error SELECTing: ${err}`);
              reject(err);
            } else {
              var outputArr = [];
              for (var i = 0; i < results.length; i++) {
                var messageObj = {};
                messageObj.text = results[i].text;
                messageObj.name = results[i].name;
                messageObj.room = results[i].room;
                outputArr.push(messageObj);
              }
              resolve(outputArr);
              //console.log(`RESULTS: ${JSON.stringify(results)}`);
            }
          });
      }).then(value => {
        result = value;
      });
    }, // a function which produces all the messages
    post: function () {} // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }
};

