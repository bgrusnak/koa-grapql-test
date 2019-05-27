const Sponsor = function(knex) {
  this.knex = knex
}
Sponsor.prototype.findAll = async function({
  pageSize = 20,
  page = 1,
  order = 'id asc'
}) {
  const sponsors = await this.knex
    .select()
    .from('sponsor')
    .orderByRaw(order)
    .paginate(pageSize, page, true)
  return sponsors
}
Sponsor.prototype.findById = async function(id) {
  const sponsors = await this.knex('sponsor').where({id})
  if (sponsors && sponsors.length !== 0) return sponsors[0]
  return null
}

Sponsor.prototype.groups = async function() {
  return this.knex('sponsor')
    .select('rating').distinct()
    .map(({rating}) => rating)
}

Sponsor.prototype.grouped = async function(group) {
  return this.knex('sponsor').where('rating', group)
}

Sponsor.prototype.update = async function(data) {
  this.knex('sponsor')
    .where({id: data.id})
    .update(data)
  return this.findById(data.id)
}
Sponsor.prototype.create = async function(data) {
  try {
    const sponsors = await this.knex
      .select()
      .from('sponsor')
      .where({id: data.id})
    if (sponsors && sponsors.length > 0) return null
    await this.knex.insert(data).into('sponsor')
    return await this.findById(data.id)
  } catch (e) {}
}
Sponsor.prototype.delete = async function(id) {
  const deleted = await this.knex('sponsor')
    .where({id})
    .del()
  return deleted ? true : false
}

module.exports = Sponsor
