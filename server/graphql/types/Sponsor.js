const {UserInputError, gql} = require('apollo-server-koa')

const typeDef = gql`
  type Sponsor {
    description: String
    id: Int!
    jobUrl: String
    logoUrl: String
    name: String!
    url: String
    rating: String!
  }
  type sponsorConnection {
    total: Int!
    hasMore: Boolean!
    sponsors: [Sponsor]!
  } 

  extend type Query {
    countSponsors: Int
    sponsors(pageSize: Int, page: Int, order: String): sponsorConnection!
    getSponsor(id: ID!): Sponsor
    sponsorGroups: [String]
    sponsorsGrouped(group: String) : [Sponsor]
  }

  extend type Mutation {
    createSponsor(
      description: String
      id: Int!
      jobUrl: String
      logoUrl: String
      name: String!
      url: String
      rating: String!
    ): Sponsor!
    updateSponsor(
      description: String
      id: Int!
      jobUrl: String
      logoUrl: String
      name: String
      url: String
      rating: String
    ): Sponsor!
    deleteSponsor(id: ID!): Boolean!
  }
`

const resolvers = {
  Query: {
    countSponsors: (root, args, {models}) => {
      return models.Sponsor.count()
    },
    sponsorGroups: async (root, data, {models}) => {
      return models.Sponsor.groups()
    },
    sponsorsGrouped: async (root, {group}, {models}) => {
      return models.Sponsor.grouped(group)
    },
    sponsors: async (root, data, {models}) => {
      const page = await models.Sponsor.findAll(data)
      return {sponsors:page.data, hasMore: page.last_page > page.current_page, total: page.total}
    },
    getSponsor: async (root, {id}, {models}) => {
      return await models.Sponsor.findById(id)
    }
  },
  Mutation: {
    createSponsor: async (root, data, {models}) => {
      const rt = await models.Sponsor.create(data)
      if (!rt) throw new UserInputError('ID already exists')
      return rt
    },
    updateSponsor: async (root, data, {models}) => {
      return await models.Sponsor.update(data)
    },
    deleteSponsor: async (root, {id}, {models}) => {
      return await models.Sponsor.delete(id)
    }
  }
}

module.exports = {typeDef, resolvers}
