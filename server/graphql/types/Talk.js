const {gql} = require('apollo-server-koa')

const typeDef = gql`
  type Talk {
    description: String
    event: Int!
    person: Int!
    id: Int!
    length: Int
    startDate: String
    title: String
    type: Int
  }

  type talkConnection {
    total: Int!
    hasMore: Boolean!
    talks: [Talk]!
  }

  extend type Query {
    countTalks: Int
    talks(pageSize: Int, page: Int, order: String): talkConnection!
    getTalk(id: ID!): Talk
    getTalksByEventPerson(event: Int!, person: Int!): [Talk]
  }

  extend type Mutation {
    createTalk(
      description: String
      event: Int
      person: Int
      id: Int!
      length: Int
      startDate: String
      title: String
      type: Int
    ): Talk!
    updateTalk(
      description: String
      event: Int
      person: Int
      id: Int!
      length: Int
      startDate: String
      title: String
      type: Int
    ): Talk!
    deleteTalk(id: ID!): Boolean!
  }
`

const resolvers = {
  Query: {
    countTalks: (root, args, {models}) => {
      return models.Talk.count()
    },
    talks: async (root, data, {models}) => {
      const page = await models.Talk.findAll(data)
      return {
        talks: page.data,
        hasMore: page.last_page > page.current_page,
        total: page.total
      }
    },
    getTalk: async (root, {id}, {models}) => {
      return models.Talk.findById(id)
    },
    getTalksByEventPerson: async (root, {person, event}, {models}) => {
      return models.Talk.findByEventPerson({person, event})
    }
  },
  Mutation: {
    createTalk: async (root, data, {models}) => {
      const rt = await models.Talk.create(data)
      if (!rt) throw new UserInputError('ID already exists')
    },
    updateTalk: async (root, data, {models}) => {
      return models.Talk.update(data)
    },
    deleteTalk: async (root, {id}, {models}) => {
      return models.Talk.delete(id)
    }
  }
}
module.exports = {typeDef, resolvers}
