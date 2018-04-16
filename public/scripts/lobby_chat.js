
$(function () {
  var message = document.getElementById('m'),
   userName = document.getElementById('nameInput');
    var socket = io('http://localhost:3000');
    $('form').submit(function(){
      console.log('message sent');
      socket.emit('chat message', {
      message: message.value,
      name: "guest"
    });
      // $('#m').val('')};
      return false;
    });
    socket.on('chat message', function(msg){
      $('#messages').append('<strong><font color="#397AF2">' + msg.name + '</font></strong>: '+msg.message);
    });
  });