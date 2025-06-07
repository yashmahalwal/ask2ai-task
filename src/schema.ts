import fs from "fs";

export const typeDefs = fs.readFileSync(
  // Relative to cwd - where the server is running
  "./schema.graphql",
  "utf-8"
);
