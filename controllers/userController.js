const { strategy } = require('../config/passportConfig');
const passport = require("passport");

const User = require("../models/user")
const { body, validationResult } = require("express-validator");

exports.sign_up_get = (req, res, next) => {
  res.render('sign-up-form', { title: "Sign Up" });
}

exports.sign_up_post = [
  body('first_name', 'First name must be entered').trim().isLength({ max: 100 }).escape(),
  body('last_name', 'Last name must be entered').trim().isLength({ max: 100 }).escape(),
  body('username', 'Username must be entered').trim().isLength({ max: 13 }).escape(),
  body('password', 'Password must be entered').trim().isLength({ min: 6 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    let user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: req.body.password,
      member_status: 'User'
    });

    if (!errors.isEmpty()) {
      res.render('sign_up_form', { title: "Sign Up", user: user, errors: errors.array() });
      return;
    }
    else {
      user.save(function(err) {
        if (err) { return next(err) }
        res.redirect('/messages');
      })
    }
  }
]

exports.sign_in_get = (req, res, next) => {
  res.render("sign-in-form", { title: "Sign In" });
}

exports.sign_in_post = [
  body('username').trim().escape(),
  body('password').trim().escape(),

  (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.render('sign-in-form', { error: info })
      }
      req.login(user, function(err) {
        if (err) return next(err);
        return res.redirect('/messages');
      });
    })(req, res, next);
  }
]

exports.log_out_get = (req, res, ) => {
  req.logout();
  res.redirect('/messages');
}
