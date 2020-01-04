var chatModel = require('./rooms-model')
const messagesModel = require('./messages_model');


const addUser = async ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  let user;
  const existingUser = await chatModel.findOne({ room: room, name: name });
  //const existingUser = users.find((user) => user.room === room && user.name === name);

  if (!name || !room) return { error: 'Username and room are required.' };
  exist = existingUser ? true : false;
  if (!exist) {
    user= await chatModel.create({ id, name, room })
  }
  else{
    user = existingUser;
  }
  //const user = { id, name, room };

  //users.push(user);
  user = user.toJSON();
  return { user, exist };
}

const removeUser = async (id) => {
  //const index = users.findIndex((user) => user.id === id);
  await chatModel.deleteOne({ id });
  //if (index !== -1) return users.splice(index, 1)[0];
}

const getUser = async (name) => {
  return await chatModel.findOne({ "name": name }).lean();
}

const getUsersInRoom = async (room) => {
  let users = await chatModel.find({ room: room }).lean();
  return users;
  //return users.filter((user) => user.room === room);
}

const getUserHistory = async (room, name) => {
  let user = await chatModel.findOne({ room: room, name: name }).lean();
  let usersData = await messagesModel.find({room,createdAt: {$gte: new Date(user.createdAt) } }).lean();
  return usersData;
  //return users.filter((user) => user.room === room);
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom, getUserHistory };