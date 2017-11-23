'use strict'

const assert = require('assert')

const handleError = function (err) {
  if (err) {
    console.log('Error while processing Meow request: ' + err.toString())
    console.log(err)
  }
  else {
    console.log("Warning: No error found in handler.")
    console.trace()
  }
  emitError.call(this)
}

const emitError = function() {
  const words = [
    '<say-as interpret-as="interjection">Shucks!</say-as>\'',
    'I am having trouble figuring out who said meow.  Try again right meow!'
  ]
  this.emit(':tell', words.join())
}

const emitUnhandled = function() {
  this.emit(':tell', 'Un-fur-tunately that\'s not something I understand.  Try again right meow.')
}

const emitSomeoneSaidMeow = function(person) {
  assert(person)
  const words = [
    '<prosody pitch="high">Yo!</prosody>',
    `<prosody pitch="high"><prosody volume="x-loud">${person} said meow!</prosody></prosody>`
  ]
  this.emit(':tell', words.join())
}

const emitWhyDidYouSayMeow = function(person) {
  assert(person)
  const words = [
    '<say-as interpret-as="interjection">oh snap!</say-as>',
    `<prosody pitch="high"><prosody volume="x-loud">${person} why did you say meow!</prosody></prosody>`
  ]
  this.emit(':tell', words.join())
}

const emitDontKnowWhoSaidMeow = function() {
  const words = [
    '<say-as interpret-as="interjection">Shucks!</say-as>',
    '<prosody pitch="high"><prosody volume="x-loud">I don\'t know who said meow!</prosody></prosody>'
  ]
  this.emit(":tell", words.join())
}

const emitAskWhoSaidMeow = function() {
  const words = [
    '<say-as interpret-as="interjection">Shucks!</say-as>',
    '<prosody pitch="high"><prosody volume="x-loud">',
    'I don\'t know who said meow, can you tell me who said meow?',
    '</prosody></prosody>'
  ]
  const message = words.join()
  return this.emit(":elicitSlot", 'person', message, message)
}

const emitClear = function() {
  const words = [
    '<say-as interpret-as="interjection">all righty!</say-as>',
    'I cleared the current person that said meow for you.'
  ]
  this.emit(":tell", words.join())
}

const ClearIntent = function() {
  console.log('Clearing current value...')
  this.attributes.person = null
  emitClear.call(this)
}

const LaunchRequest = function () {
  // const userId = this.event.session.user.userId
  const person = this.attributes.person
  if (person) {
    // I know who said meow.
    console.log(`${person} said meow!`)
    emitSomeoneSaidMeow.call(this, person)
  } else {
    emitDontKnowWhoSaidMeow.call(this)
  }
}

const WhoSaidMeow = function () {
  console.log('WhoSaidMeow intent...')
  try {
    const intent = this.event.request.intent

    let personSlot
    if (intent && intent.slots && intent.slots.person) {
      personSlot = intent.slots.person.value
    }

    const person = this.attributes.person

    if (person) {
      console.log('I know who said meow...')
      emitSomeoneSaidMeow.call(this, person)
    } else if (personSlot) {
      console.log('You told me who said meow...')
      this.attributes.person = personSlot
      emitSomeoneSaidMeow.call(this, personSlot)
    } else {
      console.log('I\'ll ask you you said meow...')
      return emitAskWhoSaidMeow.call(this)
    }
  } catch (err) {
    handleError.call(this, err)
  }
}

const SomeoneSaidMeow = function () {
  try {
    console.log(JSON.stringify(this.event.request, null, 2))
    console.log('Recording who said meow...')
    const intent = this.event.request.intent
    const person = intent.slots.person.value
    this.attributes.person = person

    emitWhyDidYouSayMeow.call(this, person)
  }
  catch (err) {
    handleError.call(this, err)
  }
}

const Unhandled = function () {
  // I don't understand this request.
  emitUnhandled().call(this)
}

exports.ClearIntent = ClearIntent
exports.LaunchRequest = LaunchRequest
exports.WhoSaidMeow = WhoSaidMeow
exports.SomeoneSaidMeow = SomeoneSaidMeow
exports.Unhandled = Unhandled
