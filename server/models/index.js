var db = require('../db');

module.exports = {
  messages: {
    get: function () {
      
      db.collection.query(`SELECT messages.text, messages.room, users.name 
        FROM messages INNER JOIN users 
        WHERE messages.user_id = users.user_id`,
        (err, results) => {
          if (err) {
            console.log(`Error SELECTing: ${err}`);
          } else {
            console.log(`RESULTS: ${results}`);
          }
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

