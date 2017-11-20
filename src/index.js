'use strict'

const Alexa = require('alexa-sdk')


const handlers = {

  'RoundTimerStart': function () {
    this.emit(':tell', 'Yo, I\'ll start a round timer!')
  }

}

exports.handler = function(event, context, callback) {
  const alexa = Alexa.handler(event, context, callback)
  alexa.registerHandlers(handlers)
  alexa.execute();
}
