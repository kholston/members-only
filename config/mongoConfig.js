require('dotenv').config();
const mongoose = require('mongoose');
const debug = require('debug')('mongoose');

exports.connectDB = function () {
  const mongoDB = process.env.DB_URL;
  mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on('error', debug('MongoDB connection error:'));
  console.log('mongoDB connected');
};
