import { JobResolvers, RegressionType, ModelStatus } from '../../types';
import { Model } from '../../../storage/types/model';

export const Job: JobResolvers = {
  model: async (jobDb) => {
    const modelDb = await Model.findByPk(jobDb.modelId);
    if (!modelDb) return null;
    return {
      id: modelDb.id,
      type: modelDb.type as RegressionType,
      inputData: modelDb.inputData,
      status: modelDb.status as unknown as ModelStatus,
      createdAt: modelDb.createdAt.toISOString(),
      updatedAt: modelDb.updatedAt?.toISOString(),
    };
  },
};
