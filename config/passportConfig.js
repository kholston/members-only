const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

exports.strategy = new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err) }
      if (!user) {
        return done(null, false, { msg: "Incorrect Username or Password" });
      }

      user.comparePassword(password, (err, res) => {
        if (err) { return done(err) }
        if (res) {
          return done(null, user);
        }
        else {
          return done(null, false, { msg: "Incorrect Username or Password" });
        }

      });
    });
  }
);

exports.serialize = function(user, done) {
  done(null, user.id);
};

exports.deserialize = function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
};
