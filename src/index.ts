import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import http from 'http'
import cors from 'cors'
import morganLogger from './config/morgan'
import logger from './config/winston'
import 'dotenv/config'
import typeDefs from './schema'
import resolvers from './resolvers'
import ApiError from './utils/ApiError'
import httpStatus from 'http-status'

async function startApolloServer() {
  const app = express()
  const httpServer = http.createServer(app)
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return { context: req }
    },
    cache: 'bounded',
    formatError: (error) => {
      const statusCode = error.extensions?.exception?.statusCode || 500
      const message = error.message || 'Internal Server Error'
      const response = {
        message,
        status: statusCode,
        ...(process.env.NODE_ENV === 'development' && {
          stack: error.extensions?.exception?.stacktrace,
        }),
      }
      return response
    },
  })

  await server.start()

  app.use(morganLogger)

  app.use(express.json())

  app.use(express.urlencoded({ extended: true }))

  const corsOptions = {
    origin: process.env.HOST,
    credentials: true,
  }

  app.use(cors(corsOptions))

  server.applyMiddleware({ app, cors: corsOptions, path: '/graphql' })

  // send 404 for an unknown api request
  app.use((req, res, next) => {
    next(
      new ApiError(
        'Not Found',
        httpStatus.NOT_FOUND,
        httpStatus[httpStatus.NOT_FOUND],
      ),
    )
  })

  // global error handler
  app.use((err, req, res, next) => {
    console.log('called global error handler')
    const { statusCode, message, data } = err
    const response = {
      ...data,
      message,
      status: statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    }
    res.status(statusCode).json(response)
  })

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: process.env.PORT }, () => resolve()),
  )

  if (process.env.NODE_ENV === 'development') {
    logger.info(
      `Server is running at http://localhost:${process.env.PORT}${server.graphqlPath}`,
    )
  }

  return { server, app }
}

startApolloServer()
