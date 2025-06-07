import { GraphQLScalarType, Kind } from "graphql";

export const dateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  description: "Date time custom scalar type",
  serialize(value) {
    if (typeof value === "string") {
      return value;
    }
    throw Error("GraphQL Date Scalar serializer expected a `string`");
  },
  parseValue(value) {
    if (typeof value === "string") {
      return value;
    }
    throw new Error("GraphQL Date Scalar parser expected a `string`");
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }

    return null;
  },
});
