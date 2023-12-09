import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import http from 'http'
import cors from 'cors'
import morganLogger from './config/morgan'
import logger from './config/winston'
import 'dotenv/config'
import typeDefs from './schema'
import resolvers from './resolvers'

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
      // Log the error with Winston logger
      logger.error('Apollo Server Error:', error.name);

      // Return a formatted error for the client
      return {
        message: error.message,
        path: error.path,
        extensions: {
          code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          exception: {
            stacktrace: error.extensions?.exception?.stacktrace,
          },
        },
      };
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
