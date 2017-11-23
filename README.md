# Who Said Meow? (Alexa)

An Alexa skill for keeping track of who said meow.

## Instructions

    grunt clean
    grunt deploy
    
### Define Name and Tag Environment Variables

    AWS_REGION=us-east-1
    AWS_ACCESS_KEY_ID=<key>
    AWS_SECRET_ACCESS_KEY=<secret>

## ToDo

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
