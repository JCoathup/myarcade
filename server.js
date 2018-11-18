var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

connections = [];

server.listen(process.env.PORT || 8080);
console.log('server running...');


app.use(express.static(__dirname + '/'));
app.get('/', function (req, res){
  res.render('index.html', {})
})

io.sockets.on ('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  //on user disconnections
  socket.on ('disconnect', function(data){
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);
  });
});
