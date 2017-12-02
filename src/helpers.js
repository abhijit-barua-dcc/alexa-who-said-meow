"use strict"

const assert = require('assert')

function getIntent(context) {
  assert(context)
  if (context && context.event && context.event.request && context.event.request.intent) {
    return context.event.request.intent
  } else {
    return null
  }
}

function getIntentName(context) {
  const intent = getIntent(context)
  if (intent) {
    return intent.name
  } else {
    return null
  }
}

function getSlots(context) {
  const intent = getIntent(context)
  if (intent) {
    return intent.slots
  } else {
    return null
  }
}

/**
 * Retrieve a slot value.
 * @param context - the environment context.
 * @param slot - the slot name.
 * @returns {*} - the slot value or null.
 */
function getSlot(context, slot) {
  const slots = getSlots(context)
  if (slots) {
    const value = slots[slot]
    return value ? value.value : null
  } else {
    return null
  }
}

/**
 * https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs/issues/69
 * @param context
 */
function clearState(context) {
  context.handler.state = '' // delete this.handler.state might cause reference errors
  delete context.attributes.STATE
  context.emit(':saveState', true)
}

const error = function (context, err) {
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

exports.intent = getIntent
exports.intentName = getIntentName
exports.slots = getSlots
exports.slot = getSlot
exports.clearState = clearState
exports.error = error
