const bcrypt = require('bcryptjs')

exports.seed = (knex, Promise) => {
  const salt = bcrypt.genSaltSync()
  const hash = bcrypt.hashSync('password', salt)
  return knex('users').del()
  .then(() => {
    return Promise.join(
      knex('users').insert({
        username: 'user',
        password: hash
      })
    )
  })
}