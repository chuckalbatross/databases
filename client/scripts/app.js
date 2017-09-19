
var app = {

  //TODO: The current 'handlenameClick' function just toggles the class 'friend'
  //to all messages sent by the name
  server: 'http://127.0.0.1:3000/classes/messages',
  name: 'anonymous',
  room: 'lobby',
  lastMessageId: 0,
  friends: {},
  messages: [],

  init: function() {
    // Get name
    app.name = window.location.search.substr(10);

    // Cache jQuery selectors
    app.$message = $('#message');
    app.$chats = $('#chats');
    app.$roomSelect = $('#roomSelect');
    app.$send = $('#send');

    // Add listeners
    app.$chats.on('click', '.name', app.handlenameClick);
    app.$send.on('submit', app.handleSubmit);
    app.$roomSelect.on('change', app.handleRoomChange);

    // Fetch previous messages
    app.startSpinner();
    app.fetch(false);

    // Poll for new messages
    setInterval(function() {
      app.fetch(true);
    }, 3000);
  },

  send: function(message) {
    app.startSpinner();

    // POST the message to the server
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        // Clear messages input
        app.$message.val('');

        // Trigger a fetch to update the messages, pass true to animate
        app.fetch();
      },
      error: function (error) {
        console.error('chatterbox: Failed to send message', error);
      }
    });
  },

  fetch: function(animate) {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: { order: '-createdAt' },
      contentType: 'application/json',
      success: function(data) {
        data = JSON.parse(data);
        // Don't bother if we have nothing to work with
        if (!data.results || !data.results.length) { return; }

        // Store messages for caching later
        app.messages = data.results;

        // Get the last message
        var mostRecentMessage = data.results[data.results.length - 1];

        // Only bother updating the DOM if we have a new message
        if (mostRecentMessage.objectId !== app.lastMessageId) {
          // Update the UI with the fetched rooms
          app.renderRoomList(data.results);

          // Update the UI with the fetched messages
          app.renderMessages(data.results, animate);

          // Store the ID of the most recent message
          app.lastMessageId = mostRecentMessage.objectId;
        }
      },
      error: function(error) {
        console.error('chatterbox: Failed to fetch messages', error);
      }
    });
  },

  clearMessages: function() {
    app.$chats.html('');
  },

  renderMessages: function(messages, animate) {
    // Clear existing messages`
    app.clearMessages();
    app.stopSpinner();
    if (Array.isArray(messages)) {
      // Add all fetched messages that are in our current room
      messages
        .filter(function(message) {
          return message.room === app.room ||
                 app.room === 'lobby' && !message.room;
        })
        .forEach(app.renderMessage);
    }

    // Make it scroll to the top
    if (animate) {
      $('body').animate({scrollTop: '0px'}, 'fast');
    }
  },

  renderRoomList: function(messages) {
    app.$roomSelect.html('<option value="__newRoom">New room...</option>');

    if (messages) {
      var rooms = {};
      messages.forEach(function(message) {
        var room = message.room;
        if (room && !rooms[room]) {
          // Add the room to the select menu
          app.renderRoom(room);

          // Store that we've added this room already
          rooms[room] = true;
        }
      });
    }

    // Select the menu option
    app.$roomSelect.val(app.room);
  },

  renderRoom: function(room) {
    // Prevent XSS by escaping with DOM methods
    var $option = $('<option/>').val(room).text(room);

    // Add to select
    app.$roomSelect.append($option);
  },

  renderMessage: function(message) {
    if (!message.room) {
      message.room = 'lobby';
    }

    // Create a div to hold the chats
    var $chat = $('<div class="chat"/>');

    // Add in the message data using DOM methods to avoid XSS
    // Store the name in the element's data attribute
    var $name = $('<span class="name"/>');
    $name.text(message.name + ': ').attr('data-room', message.room).attr('data-name', message.name).appendTo($chat);

    // Add the friend class
    if (app.friends[message.name] === true) {
      $name.addClass('friend');
    }

    var $message = $('<br><span/>');
    $message.text(message.text).appendTo($chat);

    // Add the message to the UI
    app.$chats.append($chat);

  },

  handlenameClick: function(event) {

    // Get name from data attribute
    var name = $(event.target).data('name');

    if (name !== undefined) {
      // Toggle friend
      app.friends[name] = !app.friends[name];

      // Escape the name in case it contains a quote
      var selector = '[data-name="' + name.replace(/"/g, '\\\"') + '"]';

      // Add 'friend' CSS class to all of that name's messages
      var $names = $(selector).toggleClass('friend');
    }
  },

  handleRoomChange: function(event) {

    var selectIndex = app.$roomSelect.prop('selectedIndex');
    // New room is always the first option
    if (selectIndex === 0) {
      var room = prompt('Enter room name');
      if (room) {
        // Set as the current room
        app.room = room;

        // Add the room to the menu
        app.renderRoom(room);

        // Select the menu option
        app.$roomSelect.val(room);
      }
    } else {
      app.startSpinner();
      // Store as undefined for empty names
      app.room = app.$roomSelect.val();
    }
    // Rerender messages
    app.renderMessages(app.messages);
  },

  handleSubmit: function(event) {
    var message = {
      name: app.name,
      text: app.$message.val(),
      room: app.room || 'lobby'
    };

    app.send(message);

    // Stop the form from submitting
    event.preventDefault();
  },

  startSpinner: function() {
    $('.spinner img').show();
    $('form input[type=submit]').attr('disabled', 'true');
  },

  stopSpinner: function() {
    $('.spinner img').fadeOut('fast');
    $('form input[type=submit]').attr('disabled', null);
  }
};
