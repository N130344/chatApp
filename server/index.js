const express = require('express');
const mongoose = require("mongoose");
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const router = require('./router');

const socket = require('./socket'); 


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

socket(io);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
