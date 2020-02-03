'use strict'

const UserModel = require('./user.js')

module.exports.create = async (user) => {
    if (!user)
        throw new Error('Missing user details');
  
    const newUser = new UserModel({
      username: user.username,
      count: user.count,
      log: user.log
    })
    return await newUser.save();
}

module.exports.getAll = async () => {
  return await UserModel.find()
}

module.exports.findById = async id => {
  return await UserModel.findById(id)
}

module.exports.searchByField = async (field, value) => {
  await UserModel.find({ field: value });
}

module.exports.addExercise = async (user, log) => {
  
}

