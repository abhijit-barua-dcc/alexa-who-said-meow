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
      files: ['Gruntfile.js', 'index.js', './src/**/*.js', 'test/**/*.js'],
      options: jshintOptions
    },
    clean: {
      folder: ['./dist']
    },
    lambda_package: {
      prod: {
        options: {
          include_version: true,
          include_time: false,
          include_files: [
            'index.js',
            'src/**/*.js',
            'InteractionMode.json',
            'node_modules/**/*'
          ]
        }
      },
      beta: {
        options: {
          include_version: true,
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
      prod: {
        arn: 'arn:aws:lambda:us-east-1:553670172214:function:meow-function',
        options: {
          // enableVersioning: true,
          aliases: 'prod',
          profile: 'deploy-user',
          memory: 256
        }
      },
      beta: {
        arn: 'arn:aws:lambda:us-east-1:553670172214:function:meow-function',
        options: {
          // enableVersioning: true,
          aliases: 'beta',
          profile: 'deploy-user',
          memory: 256
        }
      }
    },
  })

  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-aws-lambda')
  grunt.loadNpmTasks('grunt-contrib-clean')

  grunt.registerTask('default', ['jshint', 'lambda_package:beta', 'lambda_deploy:beta'])
  grunt.registerTask('beta', ['default'])
  grunt.registerTask('prod', ['jshint', 'lambda_package:prod', 'lambda_deploy:prod'])

}
