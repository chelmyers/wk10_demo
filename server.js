var http = require("http");
var express = require("express");

//Set root
var app = express();
app.use(express.static(__dirname + "/"));

//Set port. Will be set to 5000 on local and determined by remote host
var port = process.env.PORT || 5000;
var server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

var io = require('socket.io')(server);
console.log("websocket server was created");


var connections = [];
var users = [];

io.sockets.on('connection', function(socket){
  connections.push(socket);

  console.log('user connnected');

  socket.on('loadAll', function(user){
    //EMIT sends ONLY to the original sender
    socket.emit('loadAll', users);
    users.push(user);
    socket.broadcast.emit('register', user);
  });

  socket.on('updateColor', function(user){

      users.forEach(function(userOld, index){
        if(userOld.id == user.id && userOld != user){
          users[index] = user;
        }
      });

      socket.broadcast.emit('updateColor', user);
  });




  socket.on('disconnect', function(){

    //Broadcast SENDS TO EVERYONE connected
    socket.broadcast.emit('logOff', users[connections.indexOf(socket)]);

    users.splice(connections.indexOf(socket), 1);
    connections.splice(connections.indexOf(socket), 1);

    console.log('user disconnected');
  });

});




console.log("WebSocketServer is Up");









//
