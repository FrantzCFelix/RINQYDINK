'use strict';
// const io = require('socket.io-client')

$.get(`/api/user_data`).then(userData => {


  $(() => {

    const $window = $(window);
    const $messages = $(`.messages`);
    const $inputMessage = $(`.inputMessage`);
    const $UsersName = $(`.userNameDiv`);
    const ENTER = 13;

    // Prompt for setting a username
    const username = userData.username || `error`;
    let connected = false;

    const socket = io();
    // css-tricks-random-color-algorithm
    // eslint-disable-next-line no-magic-numbers
    const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    $UsersName.append(`<span class="card-title">${username}</span>`).css(`color`, randomColor);
    // AJAX CALL FOR USER NAME

    // add
    socket.emit(`add user`, username, randomColor);

    function addParticipantsMessage (data) {
      let message = ``;
      if (data.numUsers === 1) {
        message += `There's 1 participant`;
      } else {
        message += `There are ${data.numUsers} participants`;
      }
      log(message);
    }

    function sendMessage () {
      const message = $inputMessage.val();
      // if there is a non-empty message and a socket connection
      if (message && connected) {
        $inputMessage.val(``);
        addChatMessage({
          color : randomColor,
          username,
          message
        });
        // tell server to execute 'new message'
        socket.emit(`new message`, message);
      }
    }

    // Log a message
    function log (message) {
      const $el = $(`<li>`).addClass(`log card-action green lighten-2 center-align`).text(message);
      addMessageElement($el);
    }

    // Adds the visual chat message to the message list
    function addChatMessage (data){

      const $usernameDiv = $(`<span class="username"/>`)
        .text(`${data.username}:`)
        .css({"color" : `${data.color}`, "padding-right": `10px`});

      const $messageBodyDiv = $(`<span class="messageBody">`)
        .text(data.message);

      const $messageDiv = $(`<li class="message card-action green lighten-5"/>`)
        .data(`username`, data.username)
        .append($usernameDiv, $messageBodyDiv);

      addMessageElement($messageDiv);
    }

    // Adds a message element to the messages and scrolls to the bottom
    // el - The element to add as a message
    function addMessageElement (el) {
      const $el = $(el);
      $messages.append($el);
      $messages[0].scrollTop = $messages[0].scrollHeight;
    }


    $window.keydown(event => {
    // When the client hits ENTER on their keyboard
      if (event.which === ENTER) {
        sendMessage();
      }
      else {
        console.log(`Error to send message`);
      }
    });


    // Socket events

    // Whenever the server emits 'login', log the login message
    socket.on(`login`, data => {
      connected = true;
      // Display the welcome message
      const message = `Welcome to The Rinqy-Dinqy-Arcade`;
      log(message);
      addParticipantsMessage(data);
    });


    socket.on(`new message`, data => {
      addChatMessage(data);
    });


    socket.on(`user joined`, data => {
      log(`${data.username } joined`);
      addParticipantsMessage(data);
    });

    socket.on(`user left`, data => {
      log(`${data.username } left`);
      addParticipantsMessage(data);

    });

    socket.on(`disconnect`, () => {
      log(`you have been disconnected`);
    });

    socket.on(`reconnect`, () => {
      log(`you have been reconnected`);
      if (username) {
        socket.emit(`add user`, username);
      }
    });

    socket.on(`reconnect_error`, () => {
      log(`attempt to reconnect has failed`);
    });

  });
});
