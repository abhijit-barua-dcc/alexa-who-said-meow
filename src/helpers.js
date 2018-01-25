"use strict"

const assert = require('assert')
const Alexa = require('alexa-sdk')
const makeImage = Alexa.utils.ImageUtils.makeImage
const textUtils = Alexa.utils.TextUtils
const templates = require('../ssml-speech')

/**
 * Retrieve the intent object from the context.
 * @param context - the skill handlers context.
 * @returns {Object} the intent object from the context or nuil if there was no intent.
 */
function getIntent(context) {
  assert(context)
  if (context && context.event && context.event.request && context.event.request.intent) {
    return context.event.request.intent
  } else {
    return null
  }
}

/**
 * Retrieve the current intent name from the context.
 * @param context - the skill handlers context.
 * @returns {String} the current intent name or null if there was no intent.
 */
function getIntentName(context) {
  const intent = getIntent(context)
  if (intent) {
    return intent.name
  } else {
    return null
  }
}

/**
 * Retrieve the slots object from the context.
 * @param context = the skill handlers context.
 * @returns {Object} the slots object or null if none were preaent.
 */
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
 * @param context - the skills context.
 * @param slot - the slot name.
 * @returns {String} - the slot value or null.
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

function supportsDisplay(that) {
  return that.event.context &&
    that.event.context.System &&
    that.event.context.System.device &&
    that.event.context.System.device.supportedInterfaces &&
    that.event.context.System.device.supportedInterfaces.Display
}

/**
 * Handle a skill error.
 * @param context - the skills context.
 * @param err - the error.
 */
const error = function (context, err) {
  if (err) {
    console.log('Error while processing Meow request: ' + err.toString())
  }
  else {
    console.log("Warning: NO error found in handler.")
    console.trace()
  }
  context.response
    .speak(templates.error())
  context.emit(':responseReady')
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

const getDisplayTemplate = function (params = {}) {
  const builder = new Alexa.templateBuilders.BodyTemplate2Builder()
  // set the primary text
  const primaryRichText = params.primary ? textUtils.makeRichText(params.primary) : undefined
  // const secondaryRichText = params.secondary ? textUtils.makeRichText(params.secondary) : undefined
  // const tertiaryRichText = params.tertiary ? textUtils.makeRichText(params.tertiary) : undefined
  // set the title
  if (params.title) {
    builder.setTitle(params.title)
  }
  // set the back button
  if (params.backButton) {
    builder.setBackButtonBehavior(params.backButton)
  } else {
    builder.setBackButtonBehavior('HIDDEN')
  }
  // set the text
  builder.setTextContent(primaryRichText)
  // set the background
  if (params.background) {
    builder.setBackgroundImage(makeImage(params.background))
  }
  // set the image
  if (params.image) {
    builder.setImage(makeImage(params.image))
  }
  // return the template
  return builder.build()
}

exports.intent = getIntent
exports.intentName = getIntentName
exports.slots = getSlots
exports.slot = getSlot
exports.supportsDisplay = supportsDisplay
exports.error = error
exports.clearState = clearState
exports.getDisplayTemplate = getDisplayTemplate