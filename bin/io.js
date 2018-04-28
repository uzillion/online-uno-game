const socket = (server) => {
  
  var io = require('socket.io')(server);

  var sockets = [];

  const room = io.of('/gameroom');

  io.on('connection', function(socket){
    sockets.push(socket);
    console.log('#%s socket connected', sockets.length);
    //send a message
    socket.on('chat message', function(data){
      console.log(data);
      io.emit('chat message', data);
    });
    // user disconnect 
    socket.on('disconnect', function(data){
      sockets.splice(sockets.indexOf(socket),1);
      console.log('#%s socket disconnected', sockets.length);
    });
  });

  room.on('connection', function(socket) {
    console.log("Joined room");
  });

}
module.exports = socket;