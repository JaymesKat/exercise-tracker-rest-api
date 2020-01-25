const uuid = require('uuid/v4')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const users = [];

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user', (req, res) => {
  const { username } = req.body
  const userId = new uuid().split('-')[0]
  const duplicate = users.find(user => user._id == userId)
  
  if(!duplicate){
      const user = {
        _id: userId,
        username,
        count: 0,
        log: []
      }
      users.push(user)
      return res.status(200).json(user)
  }
  return res.send('username already taken')

});

app.get('/api/exercise/users', (req, res) => {
  res.json(users);
})

app.post('/api/exercise/add', (req, res) => {
  const { userId, description, duration, date } = req.body
  const user = users.find(user => user._id == userId);
  if(!user){
    res.send('unknown _id')
  }
  
  try{
    const newLog = {
      description,
      duration: Number(duration),
      date: new Date(date).toDateString()
    }
    user.log.push(newLog)
    user.count++
    users = [...users.filter(u => u._id !== user._id), ...user]
    
    return {
      username: user.username,
      description,
      duration,
      _id: userId,
      date: new Date(date).toDateString
    }
  } catch(err){
    res.send(err)
  }
});

app.get('/api/exercise/log', (req, res) => {
  const { userId, from, to, limit } = req.query
  const user = users.find(user => user._id == userId)
  
  if(!user){
    res.send('unknown userId');
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
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
