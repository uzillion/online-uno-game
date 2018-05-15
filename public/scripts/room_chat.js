
$(function () {
  const socket = io('/gameroom');
  const username = $('#username').val();
  let numUsers = 0;

  const sendMessage = () => {
    console.log('message sent');
    socket.emit('chat message', {
      message: $('#chat-message').val(),
      name: username
    });
  }

  $('#chat-message').keypress((e) => {
    if($('#chat-message').val() != "" && e.which == 13)
      sendMessage();
  });

  $('#send-button').click(() => {
    if($('#chat-message').val() != "")
    sendMessage();
  });


  socket.on('message recieved', function(msg){
    console.log("Recieved");
    if(msg.name == username) {
      $('#messages').append('<li style="float: right;"><strong><font color="#397AF2">' + msg.name + '</font></strong>: '+msg.message+'</li><br>');
    } else
      $('#messages').append('<li><strong><font color="#397AF2">' + msg.name + '</font></strong>: '+msg.message+'</li>');
    $('#chat-message').val("");
  });
    localStorage.setItem('text', "$('#messages').val()");
});