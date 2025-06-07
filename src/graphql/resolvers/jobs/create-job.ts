import { logger } from "../../../utils/logger";
import { JobStatus as DbJobStatus } from "../../../storage/types/job";
import { sequelize } from "../../../storage/config";
import { Job } from "../../../storage/types/job";
import { Model } from "../../../storage/types/model";
import { MutationResolvers, ResolversTypes, JobStatus } from "../../types";



export const createJob: MutationResolvers["createJob"] = async (
  _,
  { input },
  __,
  ___
) => {
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
        },
        { transaction: t }
      );

      // Create the job with the model
      const job = await Job.create(
        {
          status: DbJobStatus.QUEUED,
          modelId: model.id,
        },
        { transaction: t }
      );


      // Map the database model to GraphQL type
      return {
        id: job.id,
        status: JobStatus.Queued,
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt?.toISOString(),
        model: {
          id: model.id,
          type: model.type,
          inputData: model.inputData,
          result: model.result,
          createdAt: model.createdAt.toISOString(),
          updatedAt: model.updatedAt?.toISOString(),
        },
      } as ResolversTypes["Job"];
    });

    logger.debug(`Created new job with ID: ${result.id}`);
    return result;
  } catch (error) {
    logger.error("Error creating job:", error);
    throw error;
  }
};
