import {
  Model as SequelizeModel,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../config";
import { Model as MLModel } from "./model";

export enum JobStatus {
  QUEUED = "QUEUED",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

// Job model: Represents a processing job that is always linked to a Model via a foreign key (modelId).
// Each Job references one Model, and each Model can have one Job. This enforces relational integrity and allows easy access to model details for each job.

export class Job extends SequelizeModel<
  InferAttributes<Job>,
  InferCreationAttributes<Job>
> {
  declare id: CreationOptional<string>;
  declare status: JobStatus;
  // Foreign key linking this job to its model
  declare modelId: ForeignKey<MLModel["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Job.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(JobStatus)),
      allowNull: false,
      defaultValue: JobStatus.QUEUED,
    },
    modelId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: MLModel,
        key: "id",
      },
      onDelete: "CASCADE",
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
    tableName: "jobs",
    timestamps: true,
  }
);

Job.belongsTo(MLModel, { foreignKey: "modelId", as: "model" });
MLModel.hasOne(Job, { foreignKey: "modelId", as: "job" });
