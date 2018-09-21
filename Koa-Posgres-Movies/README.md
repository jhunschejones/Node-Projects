# Koa Postgres Movies

In development, run Postgres app, then: 
* `knex migrate:latest --env development`
* `knex seed:run --env development`

In production, run:
* `heroku run knex migrate:latest`
* `heroku run knex seed:run --env production`

Start app with either of the following:
* `NODE_ENV=development nodemon start` to use local session storage
* `NODE_ENV=production npm start` to use Redis