'use strict'

const Alexa = require('alexa-sdk')
const handlers = require('./src/handlers')

exports.handler = function(event, context, callback) {
  const alexa = Alexa.handler(event, context, callback)
  alexa.appId = 'amzn1.ask.skill.5fe09c40-bb1c-4398-af2e-939081be95e3'
  alexa.dynamoDBTableName = 'who_said_meow'
  alexa.registerHandlers(handlers)
  alexa.execute();
}
