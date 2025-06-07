import type { Sequelize } from "sequelize";

export type GraphqlContext = {
  database: Sequelize;
};
