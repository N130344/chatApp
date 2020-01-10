const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    socketId: { type: String },
    name: { type: String },
    room: { type: String },
    online: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model("rooms", schema);