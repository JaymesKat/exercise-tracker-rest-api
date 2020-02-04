const UserModel = require('./user.js')

module.exports.create = (user) => {
    if (!user)
        throw new Error('Missing user details');
  
    const newUser = new UserModel({
      username: user.username,
      count: user.count,
      log: user.log
    })
    let result;
    newUser.save().then(
    userRes => { 
      return userRes;
      result = userRes;
    })
    .catch(err => console.log(err));
    console.log(result);
    return result;
}

module.exports.getAll = () => {
  let users;
  UserModel.find().then(result => {
    users = result;
  })
  .catch(err => console.log(err))
  return users;
}

module.exports.findById = id => {
  let user;
  UserModel.findById(id).then(result => {
    user = result;
  }).catch(err => console.log(err));
  return user;
}

module.exports.searchByField = (field, value) => {
  let users;
  UserModel.find({ field: value })
    .then(results => {
      users = results;
      console.log(results);
      return results;
    })
  .catch(err => console.log(err));
  return users;
}

module.exports.addExercise = (user, log) => {
  user.push(log);
  
  let savedUser;
  
  user.save()
    .then(result => { savedUser = user;})
    .catch(err => console.log(err))
  
  return savedUser;
}

