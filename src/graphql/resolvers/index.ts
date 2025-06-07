import { dateTimeScalar } from "../scalars/date-time";
import { listJobs } from "./jobs/list-jobs";

export const resolvers = {
  DateTime: dateTimeScalar,
  Query: {
    listJobs,
  },
};
