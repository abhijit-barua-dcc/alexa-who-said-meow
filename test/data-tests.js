"use strict";

const should = require('chai').should()

const data = require('../src/data')

const TEST_USER = 'test-user'
const TEST_PERSON = 'Kaili'
const UPDATED_PERSON = 'Kaitlin'

describe('data-tests', function() {
  this.timeout(5000)

  it('should insert test record', function(done) {
    data.insertPerson(TEST_USER, TEST_PERSON, done)
  })

  it('should read the test record', function(done) {
    data.findPerson(TEST_USER, (err, result) => {
      should.not.exist(err)
      should.exist(result)
      should.exist(result.user_id)
      result.user_id.should.equal(TEST_USER)
      should.exist(result.person)
      result.person.should.equal(TEST_PERSON)
      done()
    })
  })

  it('should update the test record', function(done) {
    data.updatePerson(TEST_USER, UPDATED_PERSON, (err, result) => {
      should.not.exist(err)
      should.exist(result)
      done()
    })
  })

  it('should delete the test record', function(done) {
    data.deletePerson(TEST_USER, (err, result) => {
      should.not.exist(err)
      should.exist(result)
      Object.keys(result).length.should.equal(0)
      done()
    })
  })

})