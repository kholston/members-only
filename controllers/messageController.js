const Message = require('../models/message');
const { body, validationResult } = require('express-validator');
const debug = require('debug')('message');

//list messages
exports.index = function (req, res, next) {
  Message.find()
    .populate('author')
    .exec(function (err, list_messages) {
      if (err) {
        debug(`index error ${err}`);
        return next(err);
      }
      res.render('index', {
        title: 'Messages',
        message_list: list_messages,
      });
    });
};

// create message
exports.message_create_get = function (req, res, next) {
  res.render('message-create', { title: 'Create New Message' });
};

exports.message_create_post = [
  body('body')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Message body too short')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('message-create', {
        title: 'Create New Message',
        errors: errors.array(),
      });
    }

    const message = new Message({
      author: req.body.authorId,
      body: req.body.body,
    });

    message.save(function (err) {
      if (err) {
        debug(`creation error ${err}`);
        return next(err);
      }
      res.redirect('/');
    });
  },
];
// delete message
exports.message_delete_get = function (req, res, next) {
  Message.findById(req.params.id)
    .populate('author')
    .exec(function (err, foundMessage) {
      if (err) {
        debug(`deletion error ${err}`);
        return next(err);
      }
      res.render('message-delete', {
        title: 'Delete Message',
        message: foundMessage,
      });
    });
};

exports.message_delete_post = function (req, res, next) {
  Message.findByIdAndRemove(req.body.messageId, function (err) {
    if (err) return next(err);
    res.redirect('/');
  });
};
