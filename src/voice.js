"use strict"

const assert = require('assert')


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

exports.yo = yo
exports.snap = snap

