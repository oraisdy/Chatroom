(function() {

  var socket = io();

  var username;

  $input = $('.input');
  $messages = $('.messages');

  $input.keydown(function(event) {
    if (event.which == 13) {
      socket.emit("send", {
        username: username,
        message: $input.val()
      });
      $input.val('');
    }
  });

  socket.on('user joined', function(data) {
    username = data.username;
    // console.log(username);
  });

  socket.on('message arrived', function(data) {
    // console.log("message arrived");
    addChatMessage(data.username, data.message);
  });

  function addChatMessage(username, message) {
    var $usernameDiv = $('<span class="username"/>')
      .text(username)
      .css('color', getUsernameColor(username));
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(message);
    var $messageDiv = $('<li class="message"/>')
      .data('username', username)
      .append($usernameDiv, $messageBodyDiv);
    $messages.append($messageDiv);
    $messages.scrollTop($messages[0].scrollHeight);
  }

  function getUsernameColor(username) {
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];


})();