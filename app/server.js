const express = require('express')
const bodyParser = require('body-parser')
const cookieSession = require('cook-session')
const bcrypt = require('bcrypt')
const flash = require('connect-flash')
const db = require('../config/database/db.js')
const { saveNewUser } = require('../config/database/auth.js')
const app = express()

require('dotenv').load();

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cookieSession({
  secret : process.env.SECRET_KEY,
  maxAge : 60 * 60 * 1000
}))

app.use(flash({ unsafe: true }))

app.get('/index', (req, res) => {
  return res.render('index')
})

app.get('/flash', (req, res) => {
  req.flash('error', 'please provide an email and a password to login')
  res.redirect('/signup')
})

app.get('/flash2', (req, res) => {
  req.flash('error', 'passwords do not match')
  res.redirect('/signup')
})

app.get('/flash3', (req, res) => {
  req.flash('error', 'incorrect email or password')
  res.redirect('/login')
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
    return res.redirect('/')
  } else {
    res.render('login', { message: req.flash('error') })
  }
})

app.get('/signup', (req, res) => {
  if(req.session.user) {
    res.redirect('/')
  } else {
    res.render('signup', { message: req.flash('error') })
  }
})

app.post('/login', (req, res) => {
  const { email, password } = req.body

  db.getUser(email)
  .then(result => {
    bcrypt.compare(password, result.password, function(err, isMatch) {
      if(err) return next(err)

      if(email === result.email && isMatch) {
        req.session.user = result
        res.redirect('/')
      }
    });
  })
})

app.post('/signup', (req, res) => {
  const { email, password, confirm_pass } = req.body

  if(email.length < 3 || password.length < 3) {
    res.render('/signup', { message: 'please provide an email and a password to login' })
  } else if(password !== confirm_pass) {
    res.render('signup', { message: 'passwords do not match' })
  }
  if(email.length >= 3 && password === confirm_pass) {

    .then(user => {
      req.session.user = user
      res.redirect('/')
    })
    .catch(err => next(err))
  }
})

const port = process.env.PORT || 3000
app.listen(port)
console.log('listening on port: 3000');
