// Load env vars - must be the first import
import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { createServer } from 'http';
import { typeDefs } from './schema';
import { resolvers } from './graphql/resolvers';
import { initialiseStorage } from './storage/initialise-storage';
import { logger } from './utils/logger';
import { isDev } from './utils/environment';
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

async function main() {
  logger.debug('Setting up database');
  await initialiseStorage();

  const port = (process.env.PORT && parseInt(process.env.PORT)) || 4000;

  const app = express();
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Set up WebSocket server for subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // Save the returned server's info so we can shutdown this server later
  const wsServerCleanup = useServer({ schema }, wsServer);

  const graphqlServer = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await wsServerCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await graphqlServer.start();
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(graphqlServer)
  );

  httpServer.listen(port, () => {
    logger.info(`🚀  Server ready at: http://localhost:${port}/graphql`);
    logger.debug(`🌍  Environment: ${isDev() ? 'Development' : 'Production'}`);
  });
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
