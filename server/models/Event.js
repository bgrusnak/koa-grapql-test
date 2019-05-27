const moment = require('moment')

const Event = function(knex) {
  this.knex = knex
}
Event.prototype.findAll = async function({pageSize = 20, page = 1, order = 'id asc'}) { 
  const events = await this.knex.select().from('event').orderByRaw(order).paginate(pageSize, page, true)
  return events.map(event =>( {...event, startDate: moment(event.startDate).format()}))
}
Event.prototype.findById = async function(id) {
  const events = await this.knex('event').where({id})
  if (events && events.length !== 0) return {...events[0], startDate: moment(events[0].startDate).format()}
  return null
}
Event.prototype.count = async function() {
  const [{count}] = await this.knex('event').count('id')
  if (count) return count
  return 0
}
Event.prototype.update = async function(data) {
  this.knex('event')
    .where({id: data.id})
    .update({...data, startDate: moment(data.startDate).format()})
  return this.findById(data.id)
}
Event.prototype.create = async function(data) {
  try {
    const events = await this.knex
      .select()
      .from('event')
      .where({id: data.id})
    if (events && events.length > 0) return null
    await this.knex.insert({...data, startDate: moment(data.startDate).format()}).into('event')
    return this.findById(data.id)
  } catch (e) {}
}
Event.prototype.delete = async function(id) {
  const deleted = await this.knex('event')
    .where({id})
    .del()
  return deleted ? true : false
}

module.exports = Event
