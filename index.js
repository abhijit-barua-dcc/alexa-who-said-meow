'use strict'

const Alexa = require('alexa-sdk')

const templates = require('./ssml-speech')
const voice = require('./src/voice')
const helpers = require('./src/helpers')

const states = {
  QUERY: 'QUERY',
  CLEAR: 'CLEAR'
}

const intents = {
  SomeoneSaidMeow: 'SomeoneSaidMeow',
  ForgetIntent: 'ForgetIntent'
}

const NewSession = function () {
  const intentName = helpers.intentName(this)
  // console.log('Default new session...')
  // console.log('Found intent: ' + intentName)

  if (!intentName) {
    // Default handler, tell who last said meow.
    const person = this.attributes.person
    const reason = this.attributes.reason
    const message = templates.welcome({
      yo: voice.yo,
      person: person,
      reason: reason
    })
    this.handler.state = states.QUERY
    this.response.speak(message).listen('Did someone say meow?')
    this.emit(':responseReady')
  } else if (intentName === intents.SomeoneSaidMeow) {
    // Someone said meow.
    this.handler.state = states.QUERY
    const message = 'Ok, who said meow?'
    this.response.speak(message).listen(message)
    this.emitWithState(intentName)
    this.emit(':responseReady')
  } else if (intentName === intents.ForgetIntent) {
    // Forget who said meow?
    this.handler.state = states.CLEAR
    const message = templates.forget()
    this.response.speak(message).listen(message)
    this.emit(':responseReady')
  } else {
    // Pass-through to other intents.
    this.emit(intentName)
  }
}

const SessionEndedRequest = function() {
  this.emit(':tell', templates.goodbye())
}

const SomeoneSaidMeow = function () {
  try {
    console.log('Recording who said meow...')

    const person = helpers.slot(this, 'person')
    if (!person) {
      // Error, unable to determine the person value.
      return helpers.error(this, new Error('No person value was found.'))
    }
    this.attributes.person = person

    const message = templates.why({
      snap: voice.snap,
      person: person
    })
    this.response.speak(message).listen(message)
    this.emit(':responseReady')
  }
  catch (err) {
    return helpers.error(this, err)
  }
}

const Unhandled = function () {
  this.emit(':tell', templates.unhandled())
}

function HelpIntent() {
  const message = templates.help()
  this.response.speak(message).listen(message)
  this.emit(':responseReady')
}

function CancelIntent() {
  this.emit(':tell', templates.goodbye())
}

const defaultHandlers = {
  'NewSession': NewSession,
  'SessionEndedRequest': SessionEndedRequest,
  'SomeoneSaidMeow': SomeoneSaidMeow,
  'Unhandled': Unhandled,
  'AMAZON.HelpIntent': HelpIntent,
  'AMAZON.CancelIntent': CancelIntent,
  'AMAZON.StopIntent': CancelIntent
}

const QueryNewSession = function() {
  // Re-direct to the default new session handler.
  helpers.clearState(this)
  this.emit('NewSession')
}

const QueryYes = function() {
  this.response.speak('Ok, who said meow?').listen('Who said meow?')
  this.emit(':responseReady')
}

const QueryNo = function() {
  this.emit(':tell', templates.nobody_said_meow())
}

const QueryBecauseIntent = function() {
  let reason = helpers.slot(this, 'reason')
  if (reason) {
    // Save the reason for later.
    this.attributes.reason = reason
    this.response.speak(templates.because({reason: reason})).listen('Did someone else say meow?')
    this.emit(':responseReady')
  } else {
    const message = 'I didn\'t quite get that reason.'
    this.response.speak(message).listen(message)
    this.emit(':responseReady')
  }
}

const QuerySessionEndedRequest = function() {
  console.log('QuerySessionEnded...')
  this.response.speak('Ok, goodbye!')
  this.emit(':responseReady')
}

const queryHandlers = Alexa.CreateStateHandler(states.QUERY, {
  'NewSession': QueryNewSession,
  'AMAZON.YesIntent': QueryYes,
  'AMAZON.NoIntent': QueryNo,
  'BecauseIntent': QueryBecauseIntent,
  'SomeoneSaidMeow': SomeoneSaidMeow,
  'SessionEndedRequest': QuerySessionEndedRequest,
  'Unhandled': Unhandled,
  'AMAZON.HelpIntent': HelpIntent,
  'AMAZON.CancelIntent': CancelIntent,
  'AMAZON.StopIntent': CancelIntent
})

/**
 * Directly invoking the forget intent.
 */
const ClearNewSession = function() {
  helpers.clearState(this)
  this.emit('NewSession')
}

/**
 * User wants to forget who said meow.
 */
const ClearYes = function() {
  this.attributes.person = null
  this.attributes.reason = null
  this.emit(':tell', 'Ok, I\'ll forget who said meow')
}

/**
 * User does not want to forget who said meow.
 */
const ClearNo = function() {
  this.emit(':tell', templates.goodbye())
}

const clearHandlers = Alexa.CreateStateHandler(states.CLEAR, {
  'NewSession': ClearNewSession,
  'AMAZON.YesIntent': ClearYes,
  'AMAZON.NoIntent': ClearNo,
  'Unhandled': Unhandled,
  'AMAZON.HelpIntent': HelpIntent,
  'AMAZON.CancelIntent': CancelIntent,
  'AMAZON.StopIntent': CancelIntent
})

/**
 * Handler function.
 */
module.exports.handler = function(event, context, callback) {
  const alexa = Alexa.handler(event, context, callback)
  alexa.appId = 'amzn1.ask.skill.5fe09c40-bb1c-4398-af2e-939081be95e3'
  alexa.dynamoDBTableName = 'who_said_meow'
  alexa.registerHandlers(defaultHandlers, queryHandlers, clearHandlers)
  alexa.execute()
}

//
// Utilities.
//

