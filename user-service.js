const UserModel = require('./user.js')

module.exports.create = (user) => {
    if (!user)
        throw new Error('Missing user details');
  
    const newUser = new UserModel({
      username: user.username,
      count: user.count,
      log: user.log
    })
    return newUser.save();
}

module.exports.getAll = () => {
  return UserModel.find()
}

module.exports.findById = id => {
  return UserModel.findById(id)
}

module.exports.searchByField = (field, value) => {
  return UserModel.find({ field: value });
}

module.exports.addExercise = (user, log) => {
  
}

