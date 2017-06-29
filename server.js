var WebSocketServer = require("ws").Server;
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

var wss = new WebSocketServer({server: server});
console.log("websocket server was created");


var connections = [];

wss.on('connection', function(ws){
  connections.push(ws);

  console.log('user connnected');

  ws.on('message', function(m){

    var message = JSON.parse(m);

    if(message.type == 'register'){

      console.log(message);

      var time = new Date().toJSON();

      connections.forEach(function(connection, index){
        connection.send(time + ": Someone has logged on");
        console.log("msg sent to client");
      });
    }
  });

  ws.on('close', function(){
    connections.splice(connections.indexOf(ws), 1);

    var time = new Date().toJSON();

    connections.forEach(function(connection, index){
      connection.send(time + ": Someone has logged off.");
      console.log("msg sent to client");
    });

    console.log('user disconnected');
  });

});




console.log("WebSocketServer is Up");









//
