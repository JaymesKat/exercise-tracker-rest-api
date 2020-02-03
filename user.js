const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  count: { type: Number, required: true},
  log: {
    items: [
      {
        description: { type: String },
        duration: { type: Number },
        date: { type: Date }
      }
    ]
  }
});

module.exports = mongoose.model('User', userSchema);