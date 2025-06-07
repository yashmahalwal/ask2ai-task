import { logger } from "../../../utils/logger";
import { JobStatus as DbJobStatus } from "../../../storage/models/job";
import { sequelize } from "../../../storage/config";
import { Job } from "../../../storage/models/job";
import { Calculation } from "../../../storage/models/calculation";
import { MutationResolvers, ResolversTypes, JobStatus } from "../../types";

export const createJob: MutationResolvers["createJob"] = async (
  _,
  { input },
  __,
  ___
) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      // Create the calculation first
      const calculation = await Calculation.create(
        {
          type: input.calculation.type,
          inputData: JSON.stringify({
            data: input.calculation.data,
            alpha: input.calculation.alpha,
          }),
        },
        { transaction: t }
      );

      // Create the job with the calculation
      const job = await Job.create(
        {
          status: DbJobStatus.QUEUED,
          calculationId: calculation.id,
        },
        { transaction: t }
      );

      // Map the database model to GraphQL type
      return {
        id: job.id,
        status: JobStatus.Queued,
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt?.toISOString(),
        calculation: {
          id: calculation.id,
          type: calculation.type,
          inputData: calculation.inputData,
          result: calculation.result,
          createdAt: calculation.createdAt.toISOString(),
          updatedAt: calculation.updatedAt?.toISOString(),
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
