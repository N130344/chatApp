const mongoose = require("mongoose");

const schema = new mongoose.Schema({ 
    text:{type:String},
    user:{type:String},
    //user:{type: mongoose.Types.ObjectId,ref:"users"},
    room:{type:String}
},{timestamps:true})

module.exports  = mongoose.model("messages", schema);