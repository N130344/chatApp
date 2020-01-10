const messagesModel = require('./messages_model');
const { addUser, getUser, getUsersInRoom, getUserHistory, userLogout, messageCreate } = require('./users');

function socket(io) {
  io.on('connection', function (socket) {
    //io.emit('this', { will: 'be received by everyone'});
    console.log('new User conncted', socket.id);

    //clients++
    //socket.emit("sendMessage",{ description: clients + ' clients connected!'})

    socket.on('join', async function ({ name, room }, callback) {
      console.log(`name : ${name} , room : ${room}`);

      const { error, user, exist } = await addUser({ socketId: socket.id, name, room });


      if (error) return callback(error);

      socket.join(user.room);
      //await messagesModel.create({user:user.name,text:`${user.name} has joined`});
      if (!exist) {
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
      }
      else {
        let history = await getUserHistory(user.room, name)
        socket.emit('message', history)
      }

      io.to(user.room).emit('roomData', { room: user.room, users: await getUsersInRoom(user.room) });

      callback();
    });

    socket.on('sendMessage', async ({ message, name, room }, callback) => {
      const user = await getUser(name, room);

      await messageCreate(message, name, room)

      io.to(room).emit('message', { user: user.name, text: message });
      io.to(room).emit('roomData', { room: user.room, text: message });

      callback();
    });

    socket.on('logout', async (data) => {
      let { name, room } = data;
      await userLogout(name, room);
      io.to(socket.id).emit('logout-response', {
        error: false
      });
      socket.disconnect();
    })

    socket.on('disconnect', async function ({ name, room }) {
      console.log("disconnect", { name, room })
      let user = await userLogout(name, room)
      if (user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
      }
    });
  });
}

module.exports = socket;