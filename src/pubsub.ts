import { PubSub } from "graphql-subscriptions";
import { Job, JobStatus, Model } from "./graphql/types";

export const JOB_STATUS_UPDATED = "JOB_STATUS_UPDATED";

export type JobStatusUpdatedPayload = {
  jobId: Job["id"];
  modelId: Model["id"];
  status: JobStatus;
};

export type PubSubPayloads = {
  [JOB_STATUS_UPDATED]: JobStatusUpdatedPayload;
};

export const pubsub = new PubSub<PubSubPayloads>();

export function publishJobStatusUpdated(payload: JobStatusUpdatedPayload) {
  return pubsub.publish(JOB_STATUS_UPDATED, payload);
}
