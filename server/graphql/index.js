const {gql} = require('apollo-server-koa')
const {makeExecutableSchema} = require('graphql-tools')
const {merge} = require('lodash')
const {typeDef: Person, resolvers: PersonResolvers} = require('./types/Person')
const {
  typeDef: Sponsor,
  resolvers: SponsorResolvers
} = require('./types/Sponsor')
const {typeDef: Talk, resolvers: TalkResolvers} = require('./types/Talk')
const {typeDef: Event, resolvers: EventResolvers} = require('./types/Event')
const Query = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    null: Boolean
  }
`

const SchemaDefinition = gql`
  schema {
    query: Query
    mutation: Mutation
  }
`
// merge all resolvers in one
const resolvers = merge(PersonResolvers, SponsorResolvers, TalkResolvers, EventResolvers)
// combine all type definitions
const typeDefs = [SchemaDefinition, Query, Person, Sponsor, Talk, Event]
// return the schema
module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
})