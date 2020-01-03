const mongoose = require("mongoose");

const schema = new mongoose.Schema({ 
    id:{type:String},
    name:{type:String},
    room:{type:String}
},{timestamps:true})

module.exports  = mongoose.model("rooms", schema);