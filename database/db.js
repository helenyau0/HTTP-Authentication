const pgp = require('pg-promise')()

const cn = {
  host: 'localhost',
  port: 5432,
  database: 'http_auth'
}

const db = pgp(cn)

const getUser = (email) => {
  return db.one('SELECT * FROM users WHERE email = $1', [email])
}

const addUsers = (email, password) => {
  return db.oneOrNone('INSERT INTO users (email, password) VALUES($1, $2) RETURNING *', [email, password])
}

module.exports = {
  getUser,
  addUsers
}
