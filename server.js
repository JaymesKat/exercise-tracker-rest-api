const uuid4 = require('uuid/v4')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')

const userRepository = require('./user-service.js')

mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

let users = [];

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user', (req, res, next) => {
  const { username } = req.body
  if(!username){
      return res.status(400).json({"message": "Username not provided"})
  }
  
  userRepository.findByUsername(username)
    .then(duplicate => {
      if(duplicate.length <= 0){
         userRepository.create({ username: username, count: 0, log: []})
          .then(user => {
            res.status(200).json(user)
          })
      }else{
        res.send('username already taken')
      } 
    })
    .catch(err => console.log(err))

});

app.get('/api/exercise/users', (req, res) => {
  userRepository.getAll().then(allUsers => {
    res.json(allUsers);
  }).catch(err => console.log(err))
})

app.post('/api/exercise/add', (req, res, next) => {
  
  const { userId, description, duration, date } = req.body
  
  userRepository.findById(userId)
    .then(user => {
      if(!user){
        return res.status(404).send('unknown userId')
      }
  });
  
  let exerciseDate = date ? new Date(date).toDateString() : new Date().toDateString()
  
    const newLog = {
      description,
      duration: Number(duration),
      date: exerciseDate
    }
    
    userRepository.addExercise(newLog)
      .then(user => {
        console.log(user)
        res.status(200).json({
          username: user.username,
          description,
          duration: newLog.duration,
          _id: userId,
          date: newLog.date
        })
      })
      .catch(err => console.log(err))
});

app.get('/api/exercise/log', (req, res) => {
  const { userId, from, to, limit } = req.query
  const user = users.find(user => user._id == userId)
  
  if(!user){
    res.status(404).send('unknown userId');
  }
  
  if(from && Date.parse(from) !== NaN){
    user.log = user.log.filter(log => new Date(log.date) > new Date(from))
    user.count = user.log.length
    user.from = Date.parse(from).toDateString
  }
  
  if(to && Date.parse(to) !== NaN){
    user.log = user.log.filter(log => new Date(log.date) < new Date(from))
    user.count = user.log.length
    user.to = Date.parse(to).toDateString
  }
  
  if(limit){
    user.log = user.log.slice(0, limit)
    user.count = user.log.length
  }
  
  res.json(user)
  
});

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  console.log('Error occurred', errMessage)
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
