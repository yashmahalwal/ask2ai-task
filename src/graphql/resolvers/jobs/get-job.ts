import { JobStatus, QueryResolvers } from '../../types';
import { Job } from '../../../storage/types/job';
import { logger } from '../../../utils/logger';

export const getJob: QueryResolvers['getJob'] = async (_parent, { id }) => {
  logger.debug(`Fetching job with ID: ${id}`);
  const job = await Job.findByPk(id);
  if (!job) {
    logger.debug(`Job not found with ID: ${id}`);
    return null;
  }
  logger.debug(`Found job with ID: ${id}, status: ${job.status}`);
  return {
    id: job.id,
    status: job.status as unknown as JobStatus,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt?.toISOString(),
    modelId: job.modelId,
  };
};
