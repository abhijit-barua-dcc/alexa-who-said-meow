# Who Said Meow? (Alexa)

An Alexa skill for keeping track of who said meow.

## Instructions

    grunt clean
    grunt deploy
    
## ToDo

- Issues
-- Fix the no handler.
-- THe report and clear functions no longer work.

- Features
-- Randomize phrases
-- Add a time when meow was said.
-- Add a count of how many times meow was said.
-- Add a sound clip.

- Deployment
-- Look into using https://www.npmjs.com/package/node-lambda for deployments.

- Close Session
-- Close the session when we're done eliciting.

- Change the skill name
-- Update the skill phrase and test.
-- Cleanup the project and AWS references to meow game.

- Testing
-- Look into the testing interface https://developer.amazon.com/alexa-skills-kit/smapi
-- https://techblog.expedia.com/2017/02/13/conversational-integration-tests-for-your-alexa-skills-nodejs/

- logging
-- Add a logging library.

- Add auto deployment for the Lamda service using Grunt.
-- https://github.com/Tim-B/grunt-aws-lambda

- Update the template docs.
-- Set Makefile.env
-- Update the package.json name and version.

## Workflow

- Who Said Meow / Status Report
-- ? said meow, did someone day meow?
-- I don't know who said meow, did someone say meow?
- Clear
-- Ok


