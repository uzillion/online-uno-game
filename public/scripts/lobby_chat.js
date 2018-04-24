
$(function () {
  var message = document.getElementById('m'),
   userName = document.getElementById('nameInput')

   numUsers = 0;
    var socket = io('http://localhost:3000');
    $('#chatForm').submit(function(){
      console.log('message sent');
      socket.emit('chat message', {
      message: message.value,
      name: userName.value
    });
      return false;
    });
    socket.on('chat message', function(msg){
      if (msg.name == ""){
        msg.name = "guest user";
      }
      $('#messages').append('<li><strong><font color="#397AF2">' + msg.name + '</font></strong>: '+msg.message+'</li>');
      document.getElementById('m').value = "";
    });
  });
