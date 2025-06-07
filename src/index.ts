import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema";
import { resolvers } from "./graphql/resolvers";
import { config as readEnv } from "dotenv";
import { initialiseDatabase } from "./storage/initialise-database";
import { GraphqlContext } from "./types";
import { logger } from "./logger";

// Load .env vars
readEnv();

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer<GraphqlContext>({
  typeDefs,
  resolvers,
});

async function main() {
  // Start database
  logger.debug("Setting up database");
  const database = initialiseDatabase();

  // Read and parse the port
  const port = process.env.PORT && parseInt(process.env.PORT);

  // Set up graphql server
  logger.debug("Starting GraphQL server");

  const { url } = await startStandaloneServer(server, {
    // Fallback to port 4000
    listen: { port: isNaN(port) ? 4000 : port },
    context: async () => ({
      database,
    }),
  });

  logger.info(`🚀  Server ready at: ${url}`);
}

// Start the server

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
