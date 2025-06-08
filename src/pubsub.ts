import { PubSub } from 'graphql-subscriptions';
import { Job, JobStatus, Model } from './graphql/types';
import { logger } from './utils/logger';

export const JOB_STATUS_UPDATED = 'JOB_STATUS_UPDATED';

export type JobStatusUpdatedPayload = {
  jobId: Job['id'];
  modelId: Model['id'];
  status: JobStatus;
};

export type PubSubPayloads = {
  [JOB_STATUS_UPDATED]: JobStatusUpdatedPayload;
};

export const pubsub = new PubSub<PubSubPayloads>();

export function publishJobStatusUpdated(payload: JobStatusUpdatedPayload) {
  logger.debug(`Publishing job status update: ${JSON.stringify(payload)}`);
  return pubsub.publish(JOB_STATUS_UPDATED, payload);
}

export function isJobStatusUpdatedPayload(
  obj: unknown
): obj is JobStatusUpdatedPayload {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.jobId === 'string' &&
    typeof o.modelId === 'string' &&
    typeof o.status === 'string'
  );
}
