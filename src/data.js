'use strict'

const assert = require('assert')
const async = require('async')
const AWS = require("aws-sdk")

const TABLE = 'who_said_meow'
const client = new AWS.DynamoDB.DocumentClient()

const insertPerson = function (userId, person, callback) {
  assert(userId)
  assert(person)

  const data = {
    user_id: userId,
    person: person
  }
  const params = {
    TableName: TABLE,
    Item: data
  }
  client.put(params, callback)
}

const findPerson = function (userId, callback) {
  assert(userId)

  const params = {
    TableName: TABLE,
    KeyConditionExpression: 'user_id = :user_id',
    ExpressionAttributeValues: {
      ':user_id': userId
    }
  }
  client.query(params, (err, data) => {
    if (err) {
      callback(err)
    }
    else if (data.Count > 0) {
      callback(null, data.Items[0])
    }
    else {
      callback()
    }
  })
}

const updatePerson = function(userId, person, callback) {
  assert(userId)
  assert(person)

  const params = {
    TableName: TABLE,
    Key: { user_id: userId },
    UpdateExpression: 'set person = :person',
    ConditionExpression: 'user_id = :user_id',
    ExpressionAttributeValues: {
      ':user_id' : userId,
      ':person' : person
    }
  }
  client.update(params, callback)
}

const deletePerson = function(userId, callback) {
  assert(userId)

  const params = {
    Key: {
      user_id: userId
    },
    TableName: TABLE
  }
  client.delete(params, callback)
}

const auditPerson = function(userId, person, callback) {
  const fnFindPerson = function(callback) {
    findPerson(userId, person, callback)
  }

  const fnCreateRecord = function(person, callback) {
    if (person) {
      updatePerson(userId, person, callback)
    } else {
      insertPerson(userId, person, callback)
    }
  }

  async.waterfall([
    fnFindPerson,
    fnCreateRecord
  ], callback)
}

exports.findPerson = findPerson
exports.insertPerson = insertPerson
exports.updatePerson = updatePerson
exports.deletePerson = deletePerson
exports.auditPerson = auditPerson
