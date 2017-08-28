const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const bcrypt = require("bcrypt")
const flash = require('connect-flash')
const db = require('../database/db.js')
const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cookieParser('secret'))
app.use(cookieSession({
  secret : "iwantacatpls",
  key    : ['key1', 'key2'],
  maxAge : 60 * 60 * 1000
}))

app.use(flash({ unsafe: true }))

app.get('/', (req, res) => {
  return res.render('index')
})

app.get('/flash', function(req, res){
  req.flash('error', 'please provide an email and a password to login')
  res.redirect('/signup')
})

app.get('/flash2', function(req, res){
  req.flash('error', 'passwords do not match')
  res.redirect('/signup')
})

app.get('/flash3', function(req, res){
  req.flash('error', 'incorrect email or password')
  res.redirect('/login')
})

app.get('/homepage', function(req, res) {
  const user = req.session.user.email
  res.send('welcome ' + user);
})

app.get('/login', (req, res) => {
  if(req.session.user) {
    return res.redirect('/homepage')
  } else {
    res.render('login', {message: req.flash('error')})
  }
})

app.get('/signup', (req, res) => {
  if(req.session.user) {
    res.redirect('/homepage')
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
        res.redirect('/homepage')
      }
    });
  })
})

app.post('/signup', (req, res) => {
  const { email, password, confirm_pass } = req.body

  if(email.length <= 0 && password.length <= 0 && confirm_pass.length <= 0 || email.length < 3 && password.length < 3 && confirm_pass.length < 3) {
    res.redirect('/flash')
  } else if(password !== confirm_pass) {
    res.redirect('/flash2')
  }
  if(email.length >= 3 && password === confirm_pass) {

    const saltRounds = 10

    bcrypt.hash(password, saltRounds).then(function(hashedPassword) {
      return hashedPassword
    })
    .then(function(hash) {
      return db.addUsers(email, hash)
    })
    .then(result => {
      req.session.user = result
      res.redirect('/homepage')
    })
    .catch(err => console.log(err))
  }
})

const port = process.env.PORT || 3000
app.listen(port)
console.log('listening on port: 3000');
