exports.seed = (knex, Promise) => {
  return knex('movies').del()
  .then(() => {
    return knex('movies').insert({
      name: 'The Land Before Time',
      genre: 'Fantasy',
      rating: 3,
      explicit: false
    })
  })
  .then(() => {
    return knex('movies').insert({
      name: 'Jerassic Park',
      genre: 'Science Fiction',
      rating: 7,
      explicit: true
    })
  })
  .then(() => {
    return knex('movies').insert({
      name: 'Ice Age: Dawn of the Dinosaurs',
      genre: 'Action/Romance',
      rating: 8,
      explicit: false
    })
  })
}