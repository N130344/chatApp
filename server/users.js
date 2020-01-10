var chatModel = require('./rooms-model')
const messagesModel = require('./messages_model');
const path = require('path');
const fs = require('fs');


const addUser = async ({ socketId, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  let user;
  const existingUser = await chatModel.findOne({ room: room, name: name });
  //const existingUser = users.find((user) => user.room === room && user.name === name);

  if (!name || !room) return { error: 'Username and room are required.' };
  exist = existingUser ? true : false;
  if (!exist) {
    user = await chatModel.create({ socketId, name, room, online: true })
  }
  else {
    user = await chatModel.findOneAndUpdate({ name, room }, { $set: { socketId: socketId, online: true } }, { new: true })
  }
  user = user.toJSON();

  return { user, exist };
}

const userLogout = async (name, room) => {
  //const index = users.findIndex((user) => user.id === id);
  await chatModel.findOneAndUpdate({ name, room }, { $set: { online: false } });
  //if (index !== -1) return users.splice(index, 1)[0];
}

const getUser = async (name, room, socketId) => {
  try {
    return await chatModel.findOne({ "name": name, "room": room }).lean();
  }
  catch (err) {
    return err
  }
}

const getUsersInRoom = async (room) => {
  try {
    let users = await chatModel.find({ room: room }).lean();
    return users;
  }
  catch (err) {
    return err
  }
  //return users.filter((user) => user.room === room);
}

const getUserHistory = async (room, name) => {
  try {
    let user = await chatModel.findOne({ room: room, name: name }).lean();
    let usersData = await messagesModel.find({ room, createdAt: { $gte: new Date(user.createdAt) } }).lean();
    return usersData;
  }
  catch (err) {
    return err
  }
}

async function messageCreate(message, name, room) {
  try {
    return await messagesModel.create({ text: message, user: name, room });
  }
  catch (err) {
    return err
  }

}
async function exportFile() {
  try {
    export_path = __dirname;
    chat = await messagesModel.find({}, { createdAt: 1, user: 1, text: 1 }).lean();
    full_name = `chat.txt`;
    chat.forEach((ele,ind,arr) => {
      let date = new Date(ele.createdAt).toLocaleString('en-IN',{hour12: true, month:'2-digit', day:'2-digit', year:'numeric', hour:'2-digit',  minute:'2-digit', second:'2-digit'})
      let txt = `${date} - ${ele.user} : ${ele.text} \n`;
      fs.appendFileSync(path.join(export_path, full_name), txt);
    });
    file = fs.readFileSync(path.join(export_path, full_name));
    let file_info = {
      'Content-Type': 'application/octet-stream',
    };
    file_info['Content-Disposition'] = `attachment; filename=${full_name}`;
    file_info['Content-Length'] = file.length;
    // unlinkSync(path.join(export_path, full_name));
    return { file_info, file, file_path: path.join(export_path, full_name) }
  }
  catch (err) {

  }


}

module.exports = { addUser, getUser, getUsersInRoom, getUserHistory, userLogout, messageCreate, exportFile };