const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const {ApolloServer} = require('apollo-server-koa')

const schema = require('./graphql')
const models = require('./models')

const graphql = new ApolloServer({
  schema,
  context: ({ctx: {state: user}}) => ({
    user,
    models
  }),
  introspection: true,
  playground: true
})

graphql.applyMiddleware({app})
app.use(bodyParser()).use(async ctx => {
  ctx.body = `Koa-Docker-PG-GraphQL API test. 
  Use <a href="${graphql.graphqlPath}">${graphql.graphqlPath}</a> endpoint.`
})

module.exports = app
