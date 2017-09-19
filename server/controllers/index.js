var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {
      if (req.method === 'GET') {
        var messagesArr = models.messages.get();
        console.log(messagesArr);
        res.end(JSON.stringify(messagesArr));
      }
    }, // a function which handles a get request for all messages
    post: function (req, res) {} // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {},
    post: function (req, res) {}
  }
};

