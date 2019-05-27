const Talk = function(knex) {
  this.knex = knex
}
Talk.prototype.findAll = async function({pageSize = 20, page = 1, order = 'id asc'}) { 
  const talks = await this.knex.select().from('talk').orderByRaw(order).paginate(pageSize, page, true)
  return talks
}
Talk.prototype.findById = async function(id) {
  const talks = await this.knex('talk').where({id})
  if (talks && talks.length !== 0) return talks[0]
  return null
}
Talk.prototype.findByEventPerson = async function({person, event}) {
  return  await this.knex('talk').where({person, event})
}
Talk.prototype.update = async function(data) {
  this.knex('talk')
    .where({id: data.id})
    .update(data)
  return this.findById(data.id)
}
Talk.prototype.create = async function(data) {
  try {
    const talks = await this.knex
      .select()
      .from('talk')
      .where({id: data.id}) 
    if (talks && talks.length > 0) return null
    await this.knex.insert(data).into('talk')
    return await this.findById(data.id)
  } catch (e) {}
}
Talk.prototype.delete = async function(id) {
  const deleted = await this.knex('talk')
    .where({id})
    .del()
  return deleted ? true : false
}

module.exports = Talk
