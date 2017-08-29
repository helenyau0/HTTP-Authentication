const saveNewUser = (email, password) => {
  const saltRounds = 10

  bcrypt.hash(password, saltRounds).then(function(hashedPassword) {
    return hashedPassword
  })
  .then(function(hash) {
    return db.addUser(email, hash)
  })
}

module.exports = {
  saveNewUser
}
