const roomSocket = require('./roomSocket');

const mainSocket = (server) => {
  
  var io = require('socket.io')(server);
  
  var sockets = [];
  
  const lobby = io.of('/lobby');
  
  // Logging whenever a socket is connected or disconnectedd
  io.on('connection', function(socket){
    sockets.push(socket);
    console.log('#%s socket connected', sockets.length);
    socket.on('disconnect', function(data){
      sockets.splice(sockets.indexOf(socket),1);
      console.log('#%s socket disconnected', sockets.length);
    });
  });

  lobby.on('connection', function(socket){

    // Broadcasting chat message to all active users
    socket.on('chat message', function(data){
      lobby.emit('message recieved', data);
    });
  });

  roomSocket(io);

}
module.exports = mainSocket;