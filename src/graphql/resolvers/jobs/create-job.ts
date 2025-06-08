import { logger } from "../../../utils/logger";
import { JobStatus as DbJobStatus } from "../../../storage/types/job";
import { sequelize } from "../../../storage/config";
import { Job } from "../../../storage/types/job";
import { Model } from "../../../storage/types/model";
import {
  MutationResolvers,
  ResolversTypes,
  JobStatus,
  ModelStatus,
} from "../../types";
import { runModelJobAsync } from "../../handlers/run-model";

export const createJob: MutationResolvers["createJob"] = async (
  _,
  { input },
  __,
  ___
) => {
  try {
    const job = await sequelize.transaction(async (t) => {
      // Create the model first
      const model = await Model.create(
        {
          type: input.model.type,
          inputData: JSON.stringify({
            data: input.model.data,
            alpha: input.model.alpha,
          }),
        },
        { transaction: t }
      );

      // Create the job with the model
      const job = await Job.create(
        {
          status: DbJobStatus.RUNNING,
          modelId: model.id,
        },
        { transaction: t }
      );

      // Map the database model to GraphQL type
      return {
        id: job.id,
        status: JobStatus.Running,
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt?.toISOString(),
        model: {
          id: model.id,
          type: model.type,
          inputData: model.inputData,
          status: model.status as unknown as ModelStatus,
          createdAt: model.createdAt.toISOString(),
          updatedAt: model.updatedAt?.toISOString(),
        },
      } as ResolversTypes["Job"];
    });

    runModelJobAsync(input.model.data, input.model.alpha, job.id, job.model.id);

    logger.debug(
      `Created new job with ID: ${job.id}, model ID ${job.model.id}`
    );
    return job;
  } catch (error) {
    logger.error("Error creating job:", error);
    throw error;
  }
};
