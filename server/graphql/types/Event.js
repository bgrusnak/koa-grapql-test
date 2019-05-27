const {UserInputError, gql} = require('apollo-server-koa')

const typeDef = gql`
  type Event {
    cocUrl: String
    name: String!
    description: String
    id: Int!
    offset: Int
    slug: String!
    startDate: String
    timezoneId: String
    twitterHandle: String
    venueCity: String
    venueCountry: String
    venueName: String
    websiteUrl: String
    hasEnded: Boolean
    hasStarted: Boolean
    onGoing: Boolean
    nextFiveScheduledItems: [String]
  }

  type eventConnection {
    total: Int!
    hasMore: Boolean!
    events: [Event]!
  }

  extend type Query {
    countEvents: Int
    events(pageSize: Int, page: Int, order: String): eventConnection!
    getEvent(id: ID!): Event
  }

  extend type Mutation {
    createEvent(
      cocUrl: String
      name: String!
      description: String
      id: Int!
      offset: Int
      slug: String!
      startDate: String
      timezoneId: String
      twitterHandle: String
      venueCity: String
      venueCountry: String
      venueName: String
      websiteUrl: String
      hasEnded: Boolean
      hasStarted: Boolean
      onGoing: Boolean
      nextFiveScheduledItems: [String]
    ): Event!
    updateEvent(
      cocUrl: String
      name: String
      description: String
      id: Int!
      offset: Int
      slug: String
      startDate: String
      timezoneId: String
      twitterHandle: String
      venueCity: String
      venueCountry: String
      venueName: String
      websiteUrl: String
      hasEnded: Boolean
      hasStarted: Boolean
      onGoing: Boolean
      nextFiveScheduledItems: [String]
    ): Event!
    deleteEvent(id: ID!): Boolean!
  }
`

const resolvers = {
  Query: {
    countEvents: (root, args, {models}) => {
      return models.Event.count()
    },
    events: async (root, data, {models}) => {
      const page = await models.Event.findAll(data)
      return {
        events: page.data,
        hasMore: page.last_page > page.current_page,
        total: page.total
      }
    },
    getEvent: async (root, {id}, {models}) => {
      return await models.Event.findById(id)
    }
  },
  Mutation: {
    createEvent: async (root, data, {models}) => {
      const rt = await models.Event.create(data)
      if (!rt) throw new UserInputError('ID already exists')
      return rt
    },
    updateEvent: async (root, data, {models}) => {
      return await models.Event.update(data)
    },
    deleteEvent: async (root, {id}, {models}) => {
      return await models.Event.delete(id)
    }
  }
}

module.exports = {typeDef, resolvers}
