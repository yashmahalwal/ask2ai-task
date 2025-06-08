import {
  JOB_STATUS_UPDATED,
  JobStatusUpdatedPayload,
  pubsub,
} from "../../../pubsub";
import { SubscriptionResolvers, JobStatus } from "../../types";
import { Job } from "../../../storage/types/job";
import { logger } from "../../../utils/logger";
import { withFilter } from "graphql-subscriptions";

export const jobStatusUpdated: SubscriptionResolvers["jobStatusUpdated"] = {
  subscribe: withFilter(
    () => pubsub.asyncIterableIterator(JOB_STATUS_UPDATED),
    (payload: JobStatusUpdatedPayload, { jobId }) => {
      return payload.jobId === jobId;
    }
  ),
  resolve: async (payload: JobStatusUpdatedPayload, { jobId }) => {
    logger.debug(
      `Received jobStatusUpdated payload for jobId: ${payload.jobId}`
    );
    if (payload.jobId !== jobId) return null;
    const job = await Job.findByPk(payload.jobId);
    if (!job) return null;
    return {
      id: job.id,
      status: job.status as unknown as JobStatus,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt?.toISOString(),
      modelId: job.modelId,
    };
  },
};
