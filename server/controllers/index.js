var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {
      if (req.method === 'GET') {
        models.messages.get();
        res.end(200, null);
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

