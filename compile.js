
// Import the utility,
const pug = require('pug-ssml')

// Compile the templates into a Node module.
pug.precompile('./templates', {
  basedir: './node_modules/pug-ssml',
  file: 'ssml-speech.js',
  pretty: false
})