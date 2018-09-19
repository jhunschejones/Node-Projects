# Koa Postgres Movies

In development, run Postgres app, then: 
* `knex migrate:latest --env development`
* `knex seed:run --env development`

In production, run:
* `heroku run knex migrate:latest`
* `heroku run knex seed:run --env production`