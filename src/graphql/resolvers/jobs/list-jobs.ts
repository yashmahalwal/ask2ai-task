import { Job } from "../../../storage/types/job";
import { Model } from "../../../storage/types/model";
import { RegressionType, QueryResolvers, JobStatus } from "../../types";
import { logger } from "../../../utils/logger";

export const listJobs: QueryResolvers["listJobs"] = async () => {
  const jobs = await Job.findAll({ order: [["createdAt", "DESC"]] });
  logger.debug(`Found ${jobs.length} jobs in DB`);
  return Promise.all(
    jobs.map(async (job) => {
      const modelDb = await Model.findByPk(job.modelId);
      logger.debug(
        `Mapping job ${job.id} with model ${modelDb ? modelDb.id : "null"}`
      );
      return {
        id: job.id,
        status: job.status as unknown as JobStatus,
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt?.toISOString(),
        model: modelDb
          ? {
              id: modelDb.id,
              type: modelDb.type as RegressionType,
              inputData: modelDb.inputData,
              result: modelDb.result,
              createdAt: modelDb.createdAt.toISOString(),
              updatedAt: modelDb.updatedAt?.toISOString(),
            }
          : null,
      };
    })
  );
};
