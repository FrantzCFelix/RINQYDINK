/* eslint-disable */
//const io = require('socket.io-client')

$(function() {
  let chatName;

  $.get(`/api/user_data`).then(data => {
    //console.log(data);
    // 'http://localhost:5000/solo'
        //adds username and id to TCP handshake header
    let socket = io({
      query: {
        username: data.username,
        id: data.id
      }
    });
    //console.log(socket);
    if (socket.query.username) {
      chatName = socket.query.username;
    } else {
      chatName = "Guest User:";
    }

//     var objDiv = document.getElementsByClassName("chatArea");
// objDiv.scrollTop = objDiv.scrollHeight;

$('.chatArea').stop ().animate ({
  scrollTop: $('.chatArea')[0].scrollHeight
});

    $(`#m`).on('keydown',(e)=>{
        console.log(e);
        if(e.key === ` `)
        {
        $(`#m`).val($(`#m`).val()+ e.key);
        }
    } );
    $(`#chat-window`).submit(function(e) {
      
    
      e.preventDefault(); // prevents page reloading
      e.stopPropagation();
      socket.emit(`chat message`, $(`#m`).val());
      $(`#m`).val(``);
      return false;
    });
    socket.on(`chat message`, function(msg) {
      $(`#messages`).append($(`<li>`).text(`${chatName}:${msg}`));
    });
  });
});
