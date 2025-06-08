import { Job } from "../../../storage/types/job";
import { QueryResolvers, JobStatus } from "../../types";
import { logger } from "../../../utils/logger";

export const listJobs: QueryResolvers["listJobs"] = async () => {
  const jobs = await Job.findAll({ order: [["createdAt", "DESC"]] });
  logger.debug(`Found ${jobs.length} jobs in DB`);
  return jobs.map((job) => ({
    id: job.id,
    status: job.status as unknown as JobStatus,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt?.toISOString(),
    modelId: job.modelId,
  }));
};
