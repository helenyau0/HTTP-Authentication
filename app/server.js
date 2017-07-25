const express = require('express')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/signup', (req, res) => {
  res.render('signup')
})






app.listen(port)
console.log('listening on port: 3000');
