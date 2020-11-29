const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MessageSchema =  new Schema({
  author: {type: Schema.Types.ObjectId, ref: "User", required: true},
  body:{type: String, required:true, maxlength: 300}
},
{timestamps:true}
);

MessageSchema
  .virtual('url')
  .get(()=>{
    return "/messages/message" + this._id;
  })

module.exports = mongoose.model('Message', MessageSchema);