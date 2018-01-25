'use strict'

const assert = require('assert')
const Alexa = require('alexa-sdk')

const templates = require('./ssml-speech')
const voice = require('./src/voice')
const helpers = require('./src/helpers')

const states = {
  CONTINUE: 'CONTINUE',
  QUERY: 'QUERY',
  WHY: 'WHY',
  CLEAR: 'CLEAR'
}

const MEOW_IMAGES = [
  'https://farm5.staticflickr.com/4740/39095267554_ec6fabfdf6_o_d.png',
  'https://farm5.staticflickr.com/4700/25932860508_a90bbe634c_o_d.png',
  'https://farm5.staticflickr.com/4761/39095267354_64ae0e0196_o_d.png',
  'https://farm5.staticflickr.com/4713/25932860418_b83e52ffd4_o_d.png'
]

const QUESTION_IMAGE = 'https://farm5.staticflickr.com/4716/39095267254_2ebe64d716_o_d.png'

const BYE_IMAGE = 'https://farm5.staticflickr.com/4623/25932860588_8c1171433d_o_d.png'

const TITLE = 'Who Said Meow?'

const intents = {
  SomeoneSaidMeow: 'SomeoneSaidMeow',
  ForgetIntent: 'ForgetIntent'
}

const getGoodbyeTemplate = function() {
  return helpers.getDisplayTemplate({
    title: TITLE,
    primary: templates.goodbye_display(),
    image: BYE_IMAGE
  })
}

const commonNewSession = function () {
  this.handler.state = ''
  this.emit('NewSession')
}

const Unhandled = function () {
  const speech = templates.unhandled()
  this.response.speak(speech).listen(speech)
  this.emit(':responseReady')
}

const SessionEndedRequest = function() {
  if (helpers.supportsDisplay(this)) {
    this.response.renderTemplate(getGoodbyeTemplate())
  }
  this.emit(':tell', templates.goodbye())
}

const HelpIntent = function() {
  const message = templates.help()
  this.response.speak(message).listen(message)
  this.emit(':responseReady')
}

const CancelIntent = function() {
  if (helpers.supportsDisplay(this)) {
    this.response.renderTemplate(getGoodbyeTemplate())
  }
  this.emit(':tell', templates.goodbye())
}

const commonHandlers = {
  'NewSession': commonNewSession,
  'Unhandled': Unhandled,
  'SessionEndedRequest': SessionEndedRequest,
  'AMAZON.HelpIntent': HelpIntent,
  'AMAZON.CancelIntent': CancelIntent,
  'AMAZON.StopIntent': CancelIntent
}

const getDefaultTemplate = function(ctx) {
  const url = MEOW_IMAGES[random(MEOW_IMAGES.length)]
  return helpers.getDisplayTemplate({
    title: TITLE,
    primary: templates.default_display(ctx),
    image: url
  })
}

const getClearTemplate = function() {
  return helpers.getDisplayTemplate({
    title: TITLE,
    primary: templates.clear_display(),
    image: QUESTION_IMAGE
  })
}

const DefaultNewSession = function () {
  const intentName = helpers.intentName(this)

  if (!intentName) {
    // Default handler, tell who last said meow.
    const person = this.attributes.person
    const reason = this.attributes.reason
    const message = templates.welcome({
      yo: voice.yo,
      person: person,
      reason: reason
    })
    this.handler.state = states.CONTINUE
    if (helpers.supportsDisplay(this)) {
      const displayTemplate = getDefaultTemplate(this.attributes)
      this.response.renderTemplate(displayTemplate)
    }
    this.response.speak(message).listen('Did someone say meow?')
    this.emit(':responseReady')
  } else if (intentName === intents.SomeoneSaidMeow) {
    // Someone said meow.
    this.handler.state = states.QUERY
    const message = 'Ok, who said meow?'
    if (helpers.supportsDisplay(this)) {
      this.response.renderTemplate(getQueryTemplate())
    }
    this.response.speak(message).listen(message)
    this.emitWithState(intentName)
    this.emit(':responseReady')
  } else if (intentName === intents.ForgetIntent) {
    // Forget who said meow?
    this.handler.state = states.CLEAR
    const message = templates.forget()
    if (helpers.supportsDisplay(this)) {
      this.response.renderTemplate(getClearTemplate())
    }
    this.response.speak(message).listen(message)
    this.emit(':responseReady')
  } else {
    // Pass-through to other intents.
    this.emit(intentName)
  }
}

const defaultHandlers = createHandler({
  'NewSession': DefaultNewSession
})

const getQueryTemplate = function() {
  return helpers.getDisplayTemplate({
    title: TITLE,
    primary: templates.query_display(),
    image: QUESTION_IMAGE
  })
}

const continueYes = function() {
  this.handler.state = states.QUERY
  if (helpers.supportsDisplay(this)) {
    this.response.renderTemplate(getQueryTemplate())
  }
  this.response.speak('Ok, who said meow?').listen('Who said meow?')
  this.emit(':responseReady')
}

const continueNo = function() {
  if (helpers.supportsDisplay(this)) {
    this.response.renderTemplate(getGoodbyeTemplate())
  }
  this.response.speak(templates.nobody_said_meow())
  this.emit(':responseReady')
}

const continueHandlers = createStateHandler(states.CONTINUE, {
  'AMAZON.YesIntent': continueYes,
  'AMAZON.NoIntent': continueNo
})

const getWhyTemplate = function(ctx) {
  return helpers.getDisplayTemplate({
    title: TITLE,
    image: QUESTION_IMAGE,
    primary: templates.why_display(ctx)
  })
}

const someoneSaidMeow = function () {
  try {
    console.log('Recording who said meow...')

    const person = helpers.slot(this, 'person')
    if (!person) {
      // Error, unable to determine the person value.
      return helpers.error(this, new Error('No person value was found.'))
    }
    this.attributes.person = person.charAt(0).toUpperCase() + person.slice(1)

    const message = templates.why({
      snap: voice.snap,
      person: person
    })
    this.handler.state = states.WHY
    if (helpers.supportsDisplay(this)) {
      this.response.renderTemplate(getWhyTemplate(this.attributes))
    }
    this.response.speak(message).listen(message)
    this.emit(':responseReady')
  }
  catch (err) {
    return helpers.error(this, err)
  }
}

const queryHandlers = createStateHandler(states.QUERY, {
  'SomeoneSaidMeow': someoneSaidMeow
})

const getBecauseTemplate = function(ctx) {
  return helpers.getDisplayTemplate({
    title: TITLE,
    image: MEOW_IMAGES[random(MEOW_IMAGES.length - 1)],
    primary: templates.because_display(ctx)
  })
}

const becauseIntent = function() {
  let reason = helpers.slot(this, 'reason')
  if (reason) {
    // Save the reason for later.
    this.attributes.reason = reason
    this.handler.state = states.CONTINUE
    if (helpers.supportsDisplay(this)) {
      this.response.renderTemplate(getBecauseTemplate(this.attributes))
    }
    this.response.speak(templates.because({reason: reason})).listen('Did someone else say meow?')
    this.emit(':responseReady')
  } else {
    const message = 'I didn\'t quite get that reason.'
    this.response.speak(message).listen(message)
    this.emit(':responseReady')
  }
}

const whyHandlers = createStateHandler(states.WHY, {
  'BecauseIntent': becauseIntent
})

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
  if (helpers.supportsDisplay(this)) {
    this.response.renderTemplate(getGoodbyeTemplate())
  }
  this.emit(':tell', templates.goodbye())
}

const clearHandlers = createStateHandler(states.CLEAR, {
  'AMAZON.YesIntent': ClearYes,
  'AMAZON.NoIntent': ClearNo
})

function extend(o = {}) {
  for (let k of Object.keys(commonHandlers)) {
    if (!o[k]) {
      o[k] = commonHandlers[k]
    }
  }
  return o
}

function createStateHandler(state, handlers) {
  return Alexa.CreateStateHandler(state, extend(handlers))
}

function createHandler(handlers) {
  return extend(handlers)
}

function random(max) {
  assert(max)
  return Math.floor(Math.random() * max)
}

/**
 * Handler function.
 */
module.exports.handler = function(event, context, callback) {
  const alexa = Alexa.handler(event, context, callback)
  alexa.appId = 'amzn1.ask.skill.5fe09c40-bb1c-4398-af2e-939081be95e3'
  alexa.dynamoDBTableName = 'who_said_meow'
  alexa.registerHandlers(defaultHandlers, continueHandlers, queryHandlers, whyHandlers, clearHandlers)
  alexa.execute()
}


