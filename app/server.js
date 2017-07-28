const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')
const db = require('../database/db.js')
const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cookieParser('secret'));
app.use(session({
    secret: 'stupid cat', // session secret
    resave: true,
    saveUninitialized: true
}))
app.use(flash({ unsafe: true }))

app.get('/flash', function(req, res){
  req.flash('error', "please provide an email and a password to login")
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

  if(req.body.email.length <= 0 && req.body.password.length <= 0) {
    res.redirect('/flash');
  } else if(req.body.password !== req.body.confirm_pass) {
    res.redirect('/flash2')
  }
  else if(req.body.email.length >=3  && req.body.password === req.body.confirm_pass) {
    db.addUsers(email, password)
    .then(() => res.redirect('login'))
    .catch(err => console.log(err))
  }
})



const port = process.env.PORT || 3000
app.listen(port)
console.log('listening on port: 3000');
