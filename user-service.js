const UserModel = require('./user.js')

module.exports.create = (user) => {
    if (!user)
        throw new Error('Missing user details');
  
    const newUser = new UserModel({
      username: user.username,
      count: user.count,
      log: user.log
    })
    
    return newUser.save().then(
    userRes => { 
      return userRes.map(u => ({
        
      }));
    })
    .catch(err => console.log(err));
}

module.exports.getAll = () => {
  return UserModel.find().then(users => {
    return users.map(u => ({ _id: u._id, count: u.count, log: u.log }));
  })
  .catch(err => console.log(err))
}

module.exports.findById = id => {
  let user;
  UserModel.findById(id).then(result => {
    user = result;
  }).catch(err => console.log(err));
  return user;
}

module.exports.searchByField = (field, value) => {
  console.log(field, '--', value)
  return UserModel.find({ field: value })
    .then(users => {
      console.log(users)
      return users;
    })
  .catch(err => console.log(err));
}

module.exports.addExercise = (user, log) => {
  user.push(log);
  
  let savedUser;
  
  user.save()
    .then(result => { savedUser = user;})
    .catch(err => console.log(err))
  
  return savedUser;
}

