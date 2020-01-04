const express = require('express');
const mongoose = require("mongoose");
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const router = require('./router');
const messagesModel = require('./messages_model');

const { addUser, removeUser, getUser, getUsersInRoom, getUserHistory } = require('./users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 5000;

const url = "mongodb://localhost:27017/chat";
const connect = mongoose.connect(url, { useNewUrlParser: true }).then(res => console.log("Database connected ... "))
  .catch(function (error) {
    console.error(error);
    return process.exit();
  });

app.use(cors());
app.use(router);


//let clients = 0

io.on('connection', function (socket) {
  //io.emit('this', { will: 'be received by everyone'});
  console.log('new User conncted');

  //clients++
  //socket.emit("sendMessage",{ description: clients + ' clients connected!'})

  socket.on('join', async function ({ name, room }, callback) {
    console.log(`name : ${name} , room : ${room}`);

    const { error, user, exist } = await addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);
    //await messagesModel.create({user:user.name,text:`${user.name} has joined`});
    if (!exist) {
      socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    }
    else{
      let history =  await getUserHistory(user.room, name)
      socket.emit('message',history)
    }

    io.to(user.room).emit('roomData', { room: user.room, users: await getUsersInRoom(user.room) });

    callback();
  });

  socket.on('sendMessage', async ({message,name,room}, callback) => {
    const user = await getUser(name);

    await messagesModel.create({ text: message, user: name, room});

    io.to(room).emit('message', { user: user.name, text: message });
    io.to(room).emit('roomData', { room: user.room, text: message });

    callback();
  });


  socket.on('disconnect', async function () {
    const user = await removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    }
  });
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
