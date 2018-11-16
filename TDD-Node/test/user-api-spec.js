// allows mocha to work with KOA generator functions
require('co-mocha')
const should = require('should')
const data = require('../user-data.js')
const fs = require('co-fs')
const api = require('../user-web.js')
// the KOA version of supertest
const request = require('co-supertest').agent(api.listen())

// clear file before each test
before(function *(){
  yield fs.writeFile('./users.json', '[]')
})

describe('user data', function() {
  it('should have +1 user count after saving', function *() {
    // get user count
    const users = yield data.users.get()
    // save a new user
    yield data.users.save({ name: 'Test user backend' })
    const newUsers = yield data.users.get()
    // compare user count
    newUsers.length.should.equal(users.length + 1)
  })
})

describe('user web', function() {
  it('should have +1 user count after saving', function *() {
    // get current users
    const res = yield request.get('/user').expect(200).end()
    const users = res.body
    // add a new user
    yield data.users.save({ name: 'Test user external' })
    const newRes = yield request.get('/user').expect(200).end()
    const newUsers = newRes.body
    // check that there is now one more user
    newUsers.length.should.equal(users.length + 1)
  })
})