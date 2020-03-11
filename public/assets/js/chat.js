/* eslint-disable */
//const io = require('socket.io-client')

$(function() {
  let chatName;

  $.get(`/api/user_data`).then(data => {
    //console.log(data);
    // 'http://localhost:5000/solo'
    let socket = io({
      query: {
        username: data.username,
        id: data.id
      }
    });

    if (data.username) {
      chatName = data.username;
    } else {
      chatName = socket.id;
    }

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
