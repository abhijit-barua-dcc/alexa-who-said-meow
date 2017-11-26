'use strict'

const Alexa = require('alexa-sdk')
const assert = require('assert')

const voice = require('./src/voice')

const states = {
  QUERY: 'QUERY',
  CLEAR: 'CLEAR'
}

const handleError = function (context, err) {
  if (err) {
    console.log('Error while processing Meow request: ' + err.toString())
    console.log(err)
  }
  else {
    console.log("Warning: No error found in handler.")
    console.trace()
  }
  context.response
    .speak('<say-as interpret-as="interjection">Shucks!</say-as>')
    .speak('I am having trouble figuring out who said meow.  Try again right meow!')
  context.emit(':responseReady')
}

const emitWhyDidYouSayMeow = function(person) {
  assert(person)
  const why = `<prosody pitch="high"><prosody volume="x-loud">${person} why did you say meow!</prosody></prosody>`
  const words = [voice.snap(), why]
  this.response.speak(words).listen(why)
  this.emit(':responseReady')
}

const NewSession = function () {
  console.log('Starting new session...')

  const person = this.attributes.person
  const reason = this.attributes.reason
  const words = []
  if (person) {
    // I know who said meow.
    words.push(voice.yo())
    words.push(voice.high(voice.xloud(voice.slow(`${person} said meow!`))))
    if (reason) {
      words.push(voice.slow(`because ${reason}`))
    }
  } else {
    words.push('<say-as interpret-as="interjection">Shucks!</say-as>')
    words.push('<prosody pitch="high"><prosody volume="x-loud">I don\'t know who said meow!</prosody></prosody>')
  }
  const question = 'Did someone say meow?'
  words.push(question)

  this.handler.state = states.QUERY
  this.response.speak(words).listen(question)
  this.emit(':responseReady')
}

const SessionEndedRequest = function() {
  console.log('Session ended...')
  this.emit(':tell', '<say-as interpret-as="interjection">Okey dokey!</say-as>, goodbye.')
}

/**
 * Retrieve a slot value.
 * @param context - the environment context.
 * @param slot - the slot name.
 * @returns {*} - the slot value or null.
 */
const getSlot = function(context, slot) {
  assert(context)
  if (context &&
    context.event &&
    context.event.request &&
    context.event.request.intent &&
    context.event.request.intent.slots) {
    let value = context.event.request.intent.slots[slot]
    if (value) {
      return value.value
    } else {
      return null
    }
  } else {
    return null
  }
}

const SomeoneSaidMeow = function () {
  try {
    console.log(JSON.stringify(this.event.request, null, 2))
    console.log('Recording who said meow...')

    const person = getSlot(this, 'person')
    if (!person) {
      // Error, unable to determine the person value.
      return handleError(this, new Error('No person value was found.'))
    }
    this.attributes.person = person

    emitWhyDidYouSayMeow.call(this, person)
  }
  catch (err) {
    return handleError(this, err)
  }
}

const Unhandled = function () {
  const words = [
    '<say-as interpret-as="interjection">Hiss!</say-as>',
    'That\'s not something I understand.  Try again right meow.'
  ]
  this.emit(':tell', words.join())
}


const defaultHandlers = {
  'NewSession': NewSession,
  'SessionEndedRequest': SessionEndedRequest,
  'SomeoneSaidMeow': SomeoneSaidMeow,
  'Unhandled': Unhandled
}

const QueryNewSession = function() {
  // Re-direct to the default new session handler.
  this.handler.state = ''
  this.emit('NewSession')
}

const QueryYes = function() {
  const message = 'You said yes!'
  console.log(message)

  this.response.speak('Ok, who said meow?').listen('Who said meow?')
  this.emit(':responseReady')
}

const QueryNo = function() {
  const message = 'Ok, I guess nobody said meow. Would you like me to forget who said meow?'
  this.response.speak(message).listen(message)
  this.handler.state = states.CLEAR
  this.emit(':responseReady')
}

const QueryBecauseIntent = function() {
  let reason = getSlot(this, 'reason')
  if (reason) {
    // Save the reason for later.
    this.attributes.reason = reason
    let aha = voice.low(voice.slow(voice.interjection('aha!')))
    const messages = [
      aha, voice.slow(`You said because ${reason}`)
    ]
    this.emit(':tell', messages.join())
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
  'Unhandled': Unhandled
})

const ClearNewSession = function() {
  this.state = ''
  this.emit('NewSession')
}

const ClearYes = function() {
  this.attributes.person = null
  this.attributes.reason = null
  this.emit(':tell', 'Ok, I\'ll forget who said meow')
}

const ClearNo = function() {
  this.emit(':tell', 'Ok, see you later.')
}

const clearHandlers = Alexa.CreateStateHandler(states.CLEAR, {
  'NewSession': ClearNewSession,
  'AMAZON.YesIntent': ClearYes,
  'AMAZON.NoIntent': ClearNo,
  'Unhandled': Unhandled
})

exports.handler = function(event, context, callback) {
  const alexa = Alexa.handler(event, context, callback)
  alexa.appId = 'amzn1.ask.skill.5fe09c40-bb1c-4398-af2e-939081be95e3'
  alexa.dynamoDBTableName = 'who_said_meow'
  alexa.registerHandlers(defaultHandlers, queryHandlers, clearHandlers)
  alexa.execute()
}

//
// Utilities.
//

