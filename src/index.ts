// Load env vars - must be the first import
import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema";
import { resolvers } from "./graphql/resolvers";
import { initialiseStorage } from "./storage/initialise-storage";
import { logger } from "./utils/logger";
import { isDev } from "./utils/environment";

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function main() {
  // Start database
  logger.debug("Setting up database");
  await initialiseStorage();

  // Read and parse the port
  const port = process.env.PORT && parseInt(process.env.PORT);

  // Set up graphql server
  logger.debug("Starting GraphQL server");

  const { url } = await startStandaloneServer(server, {
    // Fallback to port 4000
    listen: { port: isNaN(port) ? 4000 : port },
  });
  logger.info(`🚀  Server ready at: ${url}`);
  logger.debug(`🌍  Environment: ${isDev() ? "Development" : "Production"}`);
}

// Start the server

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
