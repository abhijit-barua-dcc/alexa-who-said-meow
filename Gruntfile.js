"use strict"

module.exports = function (grunt) {

  const jshintOptions = {
    jshintrc: true,
    globals: {
      jQuery: true
    }
  }

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', '*.js', 'test/**/*.js'],
      options: jshintOptions
    },
    clean: {
      folder: ['./dist']
    },
    lambda_package: {
      default: {
        options: {
          include_version: false,
          include_time: false,
          include_files: [
            'index.js',
            'src/**/*.js',
            'InteractionMode.json',
            'node_modules/**/*'
          ]
        }
      }
    },
    lambda_deploy: {
      default: {
        arn: 'arn:aws:lambda:us-east-1:553670172214:function:meow-function',
        options: {
          profile: 'meow-user',
          timeout: 60,
          memory: 256
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-aws-lambda')
  grunt.loadNpmTasks('grunt-contrib-clean')

  grunt.registerTask('package', ['jshint', 'lambda_package'])
  grunt.registerTask('deploy', ['lambda_deploy'])
  grunt.registerTask('default', ['jshint', 'deploy'])

}
