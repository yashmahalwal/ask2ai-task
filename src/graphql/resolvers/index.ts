import { dateTimeScalar } from "../scalars/date-time";
import { listJobs } from "./jobs/list-jobs";
import { createJob } from "./jobs/create-job";
import { jobStatusUpdated } from "./jobs/job-status-updated";
import { Job } from "./jobs/job";
import { Resolvers } from "../types";

export const resolvers: Resolvers = {
  DateTime: dateTimeScalar,
  Query: {
    listJobs,
  },
  Mutation: {
    createJob,
  },
  Subscription: {
    jobStatusUpdated,
  },
  Job,
};
