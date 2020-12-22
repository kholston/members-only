const passport = require('passport');
const { strategy } = require('../config/passportConfig');
const { body, validationResult } = require('express-validator');
const debug = require('debug')('user');

const User = require('../models/user');

exports.sign_up_get = (req, res, next) => {
  res.render('sign-up-form', { title: 'Sign Up' });
};

exports.sign_up_post = [
  body('first_name', 'First name must be entered')
    .trim()
    .notEmpty()
    .isLength({ max: 20 })
    .escape(),
  body('last_name', 'Last name must be entered')
    .trim()
    .notEmpty()
    .isLength({ max: 20 })
    .escape(),
  body('email', 'Email must be entered')
    .trim()
    .notEmpty()
    .normalizeEmail()
    .isEmail()
    .escape(),
  body('username')
    .notEmpty()
    .withMessage('Username must be entered')
    .isLength({ max: 13 })
    .withMessage('Username max length is 13 characters')
    .escape(),
  body('password', 'Password must be entered').trim().notEmpty(),
  body(
    'passwordConfirmation',
    'Password Confirmation must match password',
  )
    .trim()
    .notEmpty()
    .custom((value, { req }) => value === req.body.password),

  (req, res, next) => {
    const errors = validationResult(req);

    let user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      member_status: 'User',
      admin: false,
    });

    if (!errors.isEmpty()) {
      res.render('sign-up-form', {
        title: 'Sign Up',
        user: user,
        errors: errors.array(),
      });
      return;
    } else {
      user.save(function (err) {
        if (err) {
          debug(`creation err ${err}`);
          return next(err);
        }
        res.redirect('/messages');
      });
    }
  },
];

exports.sign_in_get = (req, res, next) => {
  res.render('sign-in-form', { title: 'Sign In' });
};

exports.sign_in_post = [
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be an valid email address')
    .escape(),
  body('password').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('sign-in-form', {
        title: 'Sign In',
        errors: errors.array(),
      });
      return;
    }
    passport.authenticate(strategy, (err, user, info) => {
      if (err) {
        debug(`sign in err ${err}`);
        return next(err);
      }
      if (!user) {
        return res.render('sign-in-form', { error: info });
      }
      req.login(user, function (err) {
        if (err) {
          debug(`log in error ${err}`);
          return next(err);
        }
        return res.redirect('/messages');
      });
    })(req, res, next);
  },
];

exports.log_out_get = (req, res) => {
  req.logout();
  res.redirect('/messages');
};

exports.user_profile_get = (req, res, next) => {
  res.render('user-profile', { title: 'User Profile' });
};

exports.upgrade_membership_get = (req, res, next) => {
  res.render('membership-upgrade', { title: 'Upgrade Membership' });
};

exports.upgrade_membership_post = [
  body('member_code', 'Code field cannot be empty.')
    .trim()
    .notEmpty()
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('membership-upgrade', {
        title: 'Upgrade Membership',
        errors: errors.array(),
      });
    }
    let code = req.body.member_code;
    if (code === 'Member') {
      User.findById(req.body.user_id, (err, user) => {
        if (err) {
          debug(`membership upgrade error ${err}`);
          return next(err);
        }

        user.member_status = 'Member';
        user.save((err) => {
          if (err) {
            debug(`member save error ${err}`);
            return next(err);
          }
          res.redirect('/profile');
        });
      });
    } else {
      let err = { msg: 'Incorrect Member Code' };
      res.render('membership-upgrade', {
        title: 'Upgrade Membership',
        errors: [err],
      });
    }
  },
];

exports.admin_form_get = (req, res, next) => {
  res.render('admin-form', { title: 'Gain Admin Privileges' });
};

exports.admin_form_post = [
  body('admin_code', 'Field cannot be empty')
    .trim()
    .notEmpty()
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('admin-form', {
        title: 'Gain Admin Privileges',
        errors: errors.array(),
      });
    }
    let code = req.body.admin_code;
    if (code === 'Admin') {
      User.findById(req.body.user_id, (err, user) => {
        if (err) {
          debug(`membership upgrade error ${err}`);
          return next(err);
        }

        user.admin = true;
        user.save((err) => {
          if (err) {
            debug(`member save error ${err}`);
            return next(err);
          }
          res.redirect('/profile');
        });
      });
    } else {
      let err = { msg: 'Incorrect Admin Code' };
      res.render('admin-form', {
        title: 'Gain Admin Privileges',
        errors: [err],
      });
    }
  },
];
