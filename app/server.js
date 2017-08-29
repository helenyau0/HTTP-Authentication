const express = require('express')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const db = require('./database/db.js')
const { saveNewUser, getValidUser } = require('./auth.js')
const app = express()

require('dotenv').load();

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cookieSession({
  secret : process.env.SECRET_KEY,
  maxAge : 60 * 60 * 1000
}))

app.get('/index', (req, res) => {
  return res.render('index')
})

const loginRequired = (req, res, next) => {
  if(!req.session.user) {
    res.redirect('/login')
  } else {
    next()
  }
}

app.get('/', loginRequired, (req, res, next) => {
  const user = req.session.user.email
  res.send('Welcome ' + user)
})

app.get('/login', (req, res) => {
  if(req.session.user) {
    res.redirect('/')
  } else {
    res.render('login')
  }
})

app.get('/signup', (req, res) => {
  if(req.session.user) {
    res.redirect('/')
  } else {
    res.render('signup')
  }
})

app.post('/login', (req, res) => {
  const { email, password } = req.body

  getValidUser(email, password)
  .then(user => {
    if(user) {
      req.session.user = user
      res.redirect('/')
    } else {
      res.render('/login', { message : 'incorrect email or password' })
    }
  })
})

app.post('/signup', (req, res) => {
  const { email, password, confirm_pass } = req.body

  if(email.length < 3 || password.length < 3) {
    res.render('/signup', { message: 'please provide an email and a password to login' })
  } else if(password !== confirm_pass) {
    res.render('signup', { message: 'passwords do not match' })
  } else if(email.length >= 3 && password === confirm_pass) {
    saveNewUser(email, password)
    .then(user => {
      req.session.user = user
      res.redirect('/')
    })
    .catch(err => next(err))
  }
})

const port = process.env.PORT || 3000
app.listen(port)
console.log('listening on port: 3000')
