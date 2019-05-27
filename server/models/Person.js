const Person = function(knex) {
  this.knex = knex
}
Person.prototype.findAll = async function({pageSize = 20, page = 1, order = 'id asc'}) { 
  const persons = await this.knex.select().from('person').orderByRaw(order).paginate(pageSize, page, true)
  return persons
}
Person.prototype.findById = async function(id) {
  const persons = await this.knex('person').where({id})
  if (persons && persons.length !== 0) return persons[0]
  return null
}
Person.prototype.count = async function() {
  const [{count}] = await this.knex('person').count('id')
  if (count) return count
  return 0
}
Person.prototype.update = async function(data) {
  this.knex('person')
    .where({id: data.id})
    .update(data)
  return this.findById(data.id)
}
Person.prototype.create = async function(data) {
  try {
    const persons = await this.knex
      .select()
      .from('person')
      .where({id: data.id})
    if (persons && persons.length > 0) return null
    await this.knex.insert(data).into('person')
    return this.findById(data.id)
  } catch (e) {}
}
Person.prototype.delete = async function(id) {
  const deleted = await this.knex('person')
    .where({id})
    .del()
  return deleted ? true : false
}

module.exports = Person
