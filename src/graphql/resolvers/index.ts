import { dateTimeScalar } from "../scalars/date-time";
import { listJobs } from "./jobs/list-jobs";
import { createJob } from "./jobs/create-job";

export const resolvers = {
  DateTime: dateTimeScalar,
  Query: {
    listJobs,
  },
  Mutation: {
    createJob,
  },
};
