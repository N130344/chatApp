const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);

io.on('connection', function (socket) {
    //io.emit('this', { will: 'be received by everyone'});
    console.log('new User conncted');
    
    socket.on('Join', function ({name, room}) {
      console.log(`name : ${name} , room : ${room}`);
    });
  
    socket.on('disconnect', function () {
      io.emit('user disconnected');
    });
});

server.listen(PORT,()=> console.log(`Server has started on port ${PORT}`));
