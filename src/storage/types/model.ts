import {
  Model as SequelizeModel,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../config";

export enum ModelStatus {
  TRAINING = "TRAINING",
  TRAINED = "TRAINED",
}

export class Model extends SequelizeModel<
  InferAttributes<Model>,
  InferCreationAttributes<Model>
> {
  declare id: CreationOptional<string>;
  declare type: string;
  // JSON string to store array of {x,y} points, maintaining data structure in SQLite's TEXT field
  declare inputData: string;
  declare status: ModelStatus;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Model.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: { type: DataTypes.STRING, allowNull: false },
    inputData: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM(...Object.values(ModelStatus)),
      allowNull: false,
      defaultValue: ModelStatus.TRAINING,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "models",
    timestamps: true,
  }
);
