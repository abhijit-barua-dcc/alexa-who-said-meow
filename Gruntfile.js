"use strict"

module.exports = function(grunt) {

  const jshintOptions = {
    jshintrc: true,
    globals: {
      jQuery: true
    }
  }

  grunt.initConfig({
      jshint: {
        files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
                                        options: jshintOptions
      },
      zip: {
        'dist/AlexaRoundTimer.zip': [
          'index.js',
          'InteractionModel.json',
          'node_modules/**/*'
        ]
      }
  })

  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-zip')

  grunt.registerTask('default', ['jshint', 'zip'])

}
