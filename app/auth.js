const bcrypt = require('bcrypt')
const db = require('./database/db.js')

const saveNewUser = (email, password) => {
  const saltRounds = 10

  return bcrypt.hash(password, saltRounds)
  .then(hash => {
    return db.addUser(email, hash)
  })
}

const getValidUser = (email, password) => {
  return db.getUser(email)
    .then(user => {
      return bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch) {
            return user
          }
        })
    })
}

module.exports = {
  saveNewUser,
  getValidUser
}
