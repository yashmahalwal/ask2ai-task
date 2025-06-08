import { dateTimeScalar } from '../scalars/date-time';
import { listJobs } from './jobs/list-jobs';
import { createJob } from './jobs/create-job';
import { jobStatusUpdated } from './jobs/job-status-updated';
import { Job } from './jobs/job';
import { getJob } from './jobs/get-job';
import { getModel } from './models/get-model';
import { predict } from './models/predict';
import { Resolvers } from '../types';

export const resolvers: Resolvers = {
  DateTime: dateTimeScalar,
  Query: {
    listJobs,
    getJob,
    getModel,
  },
  Mutation: {
    createJob,
    predict,
  },
  Subscription: {
    jobStatusUpdated,
  },
  Job,
};
