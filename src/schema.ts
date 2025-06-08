import fs from 'fs';
import path from 'path';

const schemaPath =
  process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '..', 'schema.graphql')
    : path.join(process.cwd(), 'schema.graphql');

export const typeDefs = fs.readFileSync(schemaPath, 'utf-8');
