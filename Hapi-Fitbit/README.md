# Hapi Fitbit

## Overview
This project is an API that allows users to sign into their Fitbit account using Fitbit's own Oauth configuration. The application features 10 rout handlers for users to interact with the Fitbit API--including GET, POST, and DELETE on individual activities. MongoDB is integrated for storing user tokens and data to speed up the login and data retrieval process. 

## Outcome
Of the Node frameworks I have now worked with, Hapi definitely felt like the most API-centric. It was easy to spin up an API in only one file without very many different pieces of middleware. I can definitely see the advantage of a framework like this for building micro-services or your own middleware API's to help manage databases within a larger technology stack. 

New Relic was able to instrument the framework out of the box without much configuration. The ability to set my own custom names for different transactions comes in handy in an application with this many endpoints so that the data could be easily understandable in the New Relic UI by teams who were not directly involved in building the application.

You can view the live application [here](https://hapi-fitbit.herokuapp.com/), including instructions on how to use it!
