import { logger } from "../../../utils/logger";
import { JobStatus as DbJobStatus } from "../../../storage/types/job";
import { sequelize } from "../../../storage/config";
import { Job } from "../../../storage/types/job";
import { Model, ModelStatus } from "../../../storage/types/model";
import { MutationResolvers, ResolversTypes, JobStatus } from "../../types";
import { runModel } from "../../handlers/run-model";

export const createJob: MutationResolvers["createJob"] = async (
  _,
  { input },
  __,
  ___
) => {
  if (typeof input.model.alpha === "number" && input.model.alpha <= 0) {
    throw new Error("Alpha must be greater than 0");
  }

  try {
    const result = await sequelize.transaction(async (t) => {
      // Create the model first
      const model = await Model.create(
        {
          type: input.model.type,
          inputData: JSON.stringify({
            data: input.model.data,
            alpha: input.model.alpha,
          }),
          status: ModelStatus.TRAINING,
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

      return {
        id: job.id,
        status: JobStatus.Running,
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt?.toISOString(),
        modelId: job.modelId,
      } as ResolversTypes["Job"];
    });

    runModel(input.model.data, input.model.alpha, result.id, result.modelId);

    logger.debug(
      `Created new job with ID: ${result.id}, model ID: ${result.modelId}`
    );
    return result;
  } catch (error) {
    logger.error("Error creating job:", error);
    throw error;
  }
};
