const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
  first_name: { type: String, required: true, maxlength: 100 },
  last_name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true },
  username: { type: String, required: true, maxlength: 13 },
  password: { type: String, required: true, minlength: 6 },
  member_status: {
    type: String,
    enum: ['User', 'Member', 'Admin'],
    default: 'User',
    required: true
  },
  admin: { type: Boolean, required: true, default: false }

}, { timestamps: true });

UserSchema
  .virtual("name")
  .get(() => {
    return this.first_name + " " + this.last_name;
  });

UserSchema
  .virtual('url')
  .get(() => {
    return "/users/user/" + this._id;
  })

UserSchema.pre('save', function(next) {
  let user = this;
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) { return next(err) }

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) { return next(err) }
      user.password = hash;
      next();
    })
  })
})

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  })
}

module.exports = mongoose.model("User", UserSchema);
