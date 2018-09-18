# Restify To-Do List

## Overview
This is a to-do list API that uses the Restify framework to enable a user to preform GET, POST, and DELETE functions on a hosted MongoDB. Feel free to pull down this folder to test it out using Postman, or hit a live version of the app [here](https://restify-to-do.herokuapp.com/). 

## Outcomes
Working with the Restify framework was interesting after all my experience using Express. I can definitely see the advantage for smaller, straight-forward API construction. Having less 'magic behind the scenes' also makes this framework easier to de-bug since I was able to build the entire application from the ground up. Finally, instrumenting the API with New Relic was no harder than my past experience with Express applications. Though it is not intended to be a logging service, I found New Relic especially helpful when constructing a back end service where problems in the code or architecture can be harder to see at first glance. New Relic was able to surface some opportunities for improvement and catch a couple small mistakes I made that were causing the application to crash unpredictably.

If you are interested to see more Restify and Node projects, I highly recommend checking out the tutorial I recorded [here](https://github.com/jhunschejones/Node-Restify-New-Relic)!
