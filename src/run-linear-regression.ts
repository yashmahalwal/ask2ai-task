import { isDev } from "./utils/environment";
import { logger } from "./utils/logger";

export async function runLinearRegression(
  data: { x: number; y: number }[],
  alpha: number | null | undefined
) {
  logger.debug("Running linear regression");
  logger.debug(`Data: ${JSON.stringify(data)}`);
  logger.debug(`Alpha: ${alpha}`);

  try {
    await new Promise((resolve) =>
      setTimeout(resolve, isDev() ? 20000 : 60 * 1000)
    );
    logger.debug("Linear regression completed");
    return {
      result: "mock_result",
    };
  } catch (error) {
    logger.error("Error in linear regression:", error);
    throw error;
  }
}
