import { ModelStatus, QueryResolvers, RegressionType } from '../../types';
import { Model } from '../../../storage/types/model';
import { logger } from '../../../utils/logger';

export const getModel: QueryResolvers['getModel'] = async (_parent, { id }) => {
  logger.debug(`Fetching model with ID: ${id}`);
  const model = await Model.findByPk(id);
  if (!model) {
    logger.debug(`Model not found with ID: ${id}`);
    return null;
  }
  logger.debug(`Found model with ID: ${id}, status: ${model.status}`);
  return {
    id: model.id,
    type: model.type as RegressionType,
    inputData: model.inputData,
    status: model.status as unknown as ModelStatus,
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt?.toISOString(),
  };
};
