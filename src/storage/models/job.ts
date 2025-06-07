import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../config";
import { Calculation } from "./calculation";

export enum JobStatus {
  QUEUED = "QUEUED",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

// Job model: Represents a processing job that is always linked to a Calculation via a foreign key (calculationId).
// Each Job references one Calculation, and each Calculation can have one Job. This enforces relational integrity and allows easy access to calculation details for each job.

export class Job extends Model<
  InferAttributes<Job>,
  InferCreationAttributes<Job>
> {
  declare id: CreationOptional<string>;
  declare status: JobStatus;
  // Foreign key linking this job to its calculation
  declare calculationId: ForeignKey<Calculation["id"]>;
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
    calculationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Calculation,
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

Job.belongsTo(Calculation, { foreignKey: "calculationId", as: "calculation" });
Calculation.hasOne(Job, { foreignKey: "calculationId", as: "job" });
