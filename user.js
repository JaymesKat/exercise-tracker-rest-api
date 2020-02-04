const mongoose = require('mongoose');

const ExerciseSchema = mongoose.Schema({
    description: { type: String },
    duration: { type: Number },
    date: { type: Date }
})

const UserSchema = mongoose.Schema({
  username: { type: String, required: true },
  count: { type: Number, required: true},
  log: [ExerciseSchema]
});

module.exports = mongoose.model('User', UserSchema);