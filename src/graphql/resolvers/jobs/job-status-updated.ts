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
    () => {
      logger.debug("New subscription to jobStatusUpdated");
      return pubsub.asyncIterableIterator(JOB_STATUS_UPDATED);
    },
    (payload: JobStatusUpdatedPayload, { jobId }) => {
      const matches = payload.jobId === jobId;
      logger.debug(
        `Filtering subscription event: jobId=${jobId}, matches=${matches}`
      );
      return matches;
    }
  ),
  resolve: async (payload: JobStatusUpdatedPayload, { jobId }) => {
    logger.debug(
      `Received jobStatusUpdated payload for jobId: ${payload.jobId}, status: ${payload.status}`
    );
    if (payload.jobId !== jobId) {
      logger.debug(`Job ID mismatch: expected ${jobId}, got ${payload.jobId}`);
      return null;
    }
    const job = await Job.findByPk(payload.jobId);
    if (!job) {
      logger.debug(`Job not found with ID: ${payload.jobId}`);
      return null;
    }
    logger.debug(`Returning job data for ID: ${job.id}, status: ${job.status}`);
    return {
      id: job.id,
      status: job.status as unknown as JobStatus,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt?.toISOString(),
      modelId: job.modelId,
    };
  },
};
