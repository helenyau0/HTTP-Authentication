const pgp = require('pg-promise')()

const cn = {
  host: 'localhost',
  port: 5432,
  database: 'http_auth'
}

const db = pgp(cn)

const getAllUsers = () => {
  return db.any('SELECT * FROM users')
}

const addUsers = (email, password) => {
  return db.none('INSERT INTO users (email, password) VALUES($1, $2)', [email, password])
}

module.exports = {
  getAllUsers,
  addUsers
}
