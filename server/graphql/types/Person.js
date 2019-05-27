const {gql} = require('apollo-server-koa')

const typeDef = gql`
  type Person {
    avatarUrl: String
    firstName: String!
    github: String
    id: Int!
    lastName: String!
    role: String
    twitter: String
    url: String
  }

  type personConnection {
    total: Int!
    hasMore: Boolean!
    persons: [Person]!
  }

  extend type Query {
    countPersons: Int
    persons(pageSize: Int, page: Int, order: String): personConnection!
    getPerson(id: ID!): Person
  }

  extend type Mutation {
    createPerson(
      avatarUrl: String
      firstName: String
      github: String
      id: Int!
      lastName: String
      role: String
      twitter: String
      url: String
    ): Person!
    updatePerson(
      avatarUrl: String
      firstName: String
      github: String
      id: Int!
      lastName: String
      role: String
      twitter: String
      url: String
    ): Person!
    deletePerson(id: ID!): Boolean!
  }
`

const resolvers = {
  Query: {
    countPersons: (root, args, {models}) => {
      return models.Person.count()
    },
    persons: async (root, data, {models}) => {
      const page = await models.Person.findAll(data)
      return {persons:page.data, hasMore: page.last_page > page.current_page, total: page.total}
    },
    getPerson: async (root, {id}, {models}) => {
      return models.Person.findById(id)
    }
  },
  Mutation: {
    createPerson: async (root, data, {models}) => {
      const rt = await models.Person.create(data)
      if (!rt) throw new UserInputError('ID already exists')
    },
    updatePerson: async (root, data, {models}) => {
      return models.Person.update(data)
    },
    deletePerson: async (root, {id}, {models}) => {
      return models.Person.delete(id)
    }
  }
}
module.exports = {typeDef, resolvers}
