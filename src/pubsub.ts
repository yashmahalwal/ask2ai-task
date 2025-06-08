import { PubSub } from "graphql-subscriptions";
import { Job, JobStatus, Model } from "./graphql/types";

export const JOB_STATUS_UPDATED = "JOB_STATUS_UPDATED";

export function getJobStatusUpdatedTopic(jobId: Job["id"]) {
  return `${JOB_STATUS_UPDATED}_${jobId}`;
}

export type JobStatusUpdatedPayload = {
  jobId: Job["id"];
  modelId: Model["id"];
  status: JobStatus;
};

export const pubsub = new PubSub<Record<string, JobStatusUpdatedPayload>>();

export function publishJobStatusUpdated(payload: JobStatusUpdatedPayload) {
  return pubsub.publish(getJobStatusUpdatedTopic(payload.jobId), payload);
}
