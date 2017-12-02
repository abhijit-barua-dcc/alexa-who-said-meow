"use strict"

const assert = require('assert')

//
// Utilities.
//

function sayAs(interpretAs, value) {
  return `<say-as interpret-as="${interpretAs}">${value}</say-as>`
}

function interjection(value) {
  return sayAs('interjection', value)
}

function prosody(attr, attrValue, value) {
  return `<prosody ${attr}="${attrValue}">${value}</prosody>`
}


//
// Volume
//

function volume(attrValue, value) {
  return prosody('volume', attrValue, value)
}

function silent(value) {
  return volume('silent', value)
}

function xsoft(value) {
  return volume('x-soft', value)
}

function soft(value) {
  return volume('soft', value)
}

function loud(value) {
  return volume('loud', value)
}

function xloud(value) {
  return volume('x-loud', value)
}


//
// Rate
//

function rate(attrValue, value) {
  return prosody('rate', attrValue, value)
}

function xslow(value) {
  return rate('slow', value)
}

function slow(value) {
  return rate('slow', value)
}

function fast(value) {
  return rate('fast', value)
}

function xfast(value) {
  rate('x-fast', value)
}


//
// Pitch
//

function pitch(attrValue, value) {
  return prosody('pitch', attrValue, value)
}

function xlow(value) {
  return pitch('x-low', value)
}

function low(value) {
  return pitch('low', value)
}

function high(value) {
  return pitch('high', value)
}

function xhigh(value) {
  return pitch('x-high', value)
}


//
// Specialty
//

const yoInterjections = ['yo', 'aw man', 'booya', 'd\'oh', 'dynomite', 'great scott', 'huzzah', 'kapow', 'mamma mia',
  'spoiler alert', 'watch out']

function yo() {
  const i = random(0, yoInterjections.length)
  return yoInterjections[i]
}

const snapInterjections = ['oh snap', 'yowzer', 'woo hoo', 'uh oh', 'mamma mia', 'good grief', 'dun dun dun']

function snap() {
  const i = random(0 ,snapInterjections.length)
  return snapInterjections[i]
}

function random(min, max) {
  assert(min === 0 || min)
  assert(max)
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

// Utilities.
exports.sayAs = sayAs
exports.interjection = interjection
exports.prosody = prosody

// Volume
exports.volume = volume
exports.silent = silent
exports.xsoft = xsoft
exports.soft = soft
exports.loud = loud
exports.xloud = xloud

// Rate
exports.rate = rate
exports.xslow = xslow
exports.slow = slow
exports.fast = fast
exports.xfast = xfast

// Pitch
exports.pitch = pitch
exports.xlow = xlow
exports.low = low
exports.high = high
exports.xhigh = xhigh

// Specialty
exports.yo = yo
exports.snap = snap

