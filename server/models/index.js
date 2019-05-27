const {env} = require('../config')
const Knex = require('knex')
const knexConfig = require('../../knexfile')
const {Model} = require('objection')
const setupPaginator = require('knex-paginator');
// set up the database connection and ORM
const knex = Knex(knexConfig[env])
// add the paginator 
setupPaginator(knex);
// create the models
const Person = new (require('./Person'))(knex)
const Sponsor = new (require('./Sponsor'))(knex)
const Talk = new (require('./Talk'))(knex)
const Event = new (require('./Event'))(knex)

module.exports = {
  Person,
  Sponsor,
  Talk,
  Event
}
