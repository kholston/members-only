const mongoose = require('mongoose');
const Schema = mongoose.Schema;


UserSchema = new Schema(
  {
    first_name: { type: String, required: true, maxlength: 100 },
    last_name: { type: String, required: true, maxlength: 100 },
    username: { type: String, required: true, maxlength: 13 },
    password: { type: String, required: true, minlength: 6 },
    member_status: { type: String, 
        enum:['User','Member','Admin'], 
        default:'User', 
        required:true 
    }
  },
  {timestamps:true}
);

UserSchema
  .virtual("name")
  .get(()=>{
    return this.first_name + " " + this.last_name;
  })

UserSchema
  .virtual('url')
  .get(()=>{
    return "/users/user/" + this._id;
  })

module.exports = mongoose.model("User",  UserSchema);