const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const flash = require('connect-flash')
const db = require('../database/db.js')
const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cookieParser('secret'));
app.use(cookieSession({
  secret : "iwantacatpls",
  key    : ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000
}))

app.use(flash({ unsafe: true }))

app.get('/flash', function(req, res){
  req.flash('error', 'please provide an email and a password to login')
  res.redirect('/signup')
});

app.get('/flash2', function(req, res){
  req.flash('error', 'passwords do not match')
  res.redirect('/signup')
});

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/signup', (req, res) => {
  res.render('signup', { message: req.flash('error') })
})

app.post('/signup', (req, res) => {
  const { email, password, confirm_pass } = req.body

  if(email.length <= 0 && password.length <= 0 && confirm_pass.length <= 0 || email.length >=3 && password.length <=3 && confirm_pass.length <= 3) {
    res.redirect('/flash')
  } else if(password !== confirm_pass) {
    res.redirect('/flash2')
  }
  else if(email.length >=3 && password.length >= 3 && confirm_pass.length >= 3 && password === confirm_pass ) {

    db.addUsers(email, password)
    .then(() => {
      req.session.user = {
        email: email
      }
      res.redirect('/homepage')
    })
    .catch(err => console.log(err))
  }
})


const port = process.env.PORT || 3000
app.listen(port)
console.log('listening on port: 3000');
