var chatModel = require('./rooms-model')
const users = [];

const addUser = async ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = await chatModel.findOne({ room: room, name: name });
  //const existingUser = users.find((user) => user.room === room && user.name === name);

  if (!name || !room) return { error: 'Username and room are required.' };
  if (existingUser) return { error: 'Username is taken.' };

  let user = await chatModel.create({ id, name, room })
  //const user = { id, name, room };

  //users.push(user);
  user = user.toJSON();
  return { user };
}

const removeUser = async (id) => {
  const index = users.findIndex((user) => user.id === id);
  await chatModel.deleteOne({ id });
  if (index !== -1) return users.splice(index, 1)[0];
}

const getUser = async (id) => {
  return await chatModel.findOne({ "id": id }).lean();
}

const getUsersInRoom = async (room) => {
  let users = await chatModel.find({ room: room }).lean();
  return users;
  //return users.filter((user) => user.room === room);
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom };