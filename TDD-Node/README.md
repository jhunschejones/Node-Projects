# TDD-Node

## Overview 

This is a simple Node application using the Koa framework. It was built using Test Driven Design with the Mocha and Supertest javascript testing frameworks. It implements both unit testing on actual functions and integration testing on API endpoints. Run `npm start` to start up the app, or `npm test` to run the test suite and see it in action!

## Outcome

In the past, I think I viewed testing as just extra work standing between myself and the final product. I had written tests for other peoples projects in the past, but I had not tried to create a whole project that actually *started* with tests. After getting past the expected road-bumps of learning these two popular test frameworks, I actually started to get the point. TDD is more than just *extra work*, it can be a formalized method for writing out project expectations. It then provides a method for verifying that the final project meets the early expectations. I was also able to catch problems in the code when making bigger changes because tests that used to pass would start failing. In the end, it took more time to write the tests up front, but the amount of time it saved in both debugging functions and doing integration testing manually through the front end of the app, definitely paid off in the end!
