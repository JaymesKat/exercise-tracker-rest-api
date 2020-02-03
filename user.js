const mongoose = require('mongoose');
const Order = require('./order');

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  count: { type: Number, required: true},
  log: {
    items: [
      {
        description: { type: String },
        duration: { type: Number }
        date: ""
      }
    ]
  }
});

module.exports = mongoose.model('User', userSchema);