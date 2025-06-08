import { MutationResolvers } from "../../types";
import { Model } from "../../../storage/types/model";
import { logger } from "../../../utils/logger";

export const predict: MutationResolvers["predict"] = async (
  _parent,
  { modelId, input }
) => {
  logger.debug(`Making prediction for model ${modelId} with input ${input}`);

  const model = await Model.findByPk(modelId);
  if (!model) {
    logger.debug(`Model not found with ID: ${modelId}`);
    throw new Error(`Model not found with ID: ${modelId}`);
  }

  if (model.status !== "TRAINED") {
    logger.debug(
      `Model ${modelId} is not trained yet. Current status: ${model.status}`
    );
    throw new Error(`Model ${modelId} is not trained yet`);
  }

  // For now, we just return y = x + 1 as specified
  const prediction = input + 1;
  logger.debug(`Prediction for input ${input}: ${prediction}`);

  return {
    value: prediction,
    modelId,
    input,
    timestamp: new Date().toISOString(),
  };
};
