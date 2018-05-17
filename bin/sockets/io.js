const roomSocket = require('./roomSocket');

const mainSocket = (server) => {
  
  var io = require('socket.io')(server);
  
  var sockets = [];
  
  const lobby = io.of('/lobby');
  
  io.on('connection', function(socket){
    sockets.push(socket);
    console.log('#%s socket connected', sockets.length);
    // user disconnect 
    socket.on('disconnect', function(data){
      sockets.splice(sockets.indexOf(socket),1);
      console.log('#%s socket disconnected', sockets.length);
    });
  });

  lobby.on('connection', function(socket){
    //send a message
    socket.on('chat message', function(data){
      // console.log(data);
      lobby.emit('message recieved', data);
    });
  });

  roomSocket(io);

}
module.exports = mainSocket;