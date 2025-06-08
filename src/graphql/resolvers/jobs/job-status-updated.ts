import {
  getJobStatusUpdatedTopic,
  JobStatusUpdatedPayload,
  pubsub,
} from "../../../pubsub";
import {
  SubscriptionResolvers,
  RegressionType,
  JobStatus,
  ModelStatus,
} from "../../types";
import { Job } from "../../../storage/types/job";
import { Model } from "../../../storage/types/model";
import { logger } from "../../../utils/logger";

export const jobStatusUpdated: SubscriptionResolvers["jobStatusUpdated"] = {
  subscribe: (_parent, { jobId }) =>
    pubsub.asyncIterableIterator(getJobStatusUpdatedTopic(jobId)),
  resolve: async (payload: JobStatusUpdatedPayload, { jobId }) => {
    logger.debug(
      `Received jobStatusUpdated payload for jobId: ${payload.jobId}`
    );
    if (payload.jobId !== jobId) return null;
    const job = await Job.findByPk(payload.jobId);
    if (!job) return null;
    const modelDb = await Model.findByPk(job.modelId);
    logger.debug(
      `Fetched job ${job.id} and model ${modelDb ? modelDb.id : "null"}`
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
            status: modelDb.status as unknown as ModelStatus,
            createdAt: modelDb.createdAt.toISOString(),
            updatedAt: modelDb.updatedAt?.toISOString(),
          }
        : null,
    };
  },
};
