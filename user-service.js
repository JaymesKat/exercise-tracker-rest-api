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
      return { _id: userRes._id, username: userRes.username, count: userRes.count, log: userRes.log };
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
  return UserModel.findById(id)
    .then(user => {
      return user;
    }).catch(err => console.log(err));
}

module.exports.findByUsername = (value) => {
  return UserModel.find({ username: value })
    .then(users => {
      return users;
    })
  .catch(err => console.log(err));
}

module.exports.addExercise = (user, log) => {
  console.log(user.log)
  user.log.push(log);
  user.count++
  
  return user.save()
    .then(savedUser => (savedUser))
    .catch(err => console.log(err))
}

