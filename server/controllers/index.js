var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {
      var messagesArr = models.messages.get(function(err, content) {
        if (err) {
          console.log('ERROR:', err);
        } else {
          res.writeHead(200);
          res.end(JSON.stringify(content));
        }
      });
        // res.end(JSON.stringify(messagesArr));
    }, // a function which handles a get request for all messages

    post: function (req, res) {
      var message = req.body;

      models.messages.post(message, function(err, content) {
        if (err) {
          console.log('ERROR:', err);
        } else {
          res.writeHead(201);
          res.end(JSON.stringify('Posted***'));
        }
      });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {

      

    },
    post: function (req, res) {}
  }
};

