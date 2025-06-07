import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../config";

export class Calculation extends Model<
  InferAttributes<Calculation>,
  InferCreationAttributes<Calculation>
> {
  declare id: CreationOptional<string>;
  declare type: string;
  declare inputData: string;
  declare result: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Calculation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: { type: DataTypes.STRING, allowNull: false },
    inputData: { type: DataTypes.TEXT, allowNull: false },
    result: { type: DataTypes.TEXT, allowNull: true },
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
    tableName: "calculations",
    timestamps: true,
  }
);
