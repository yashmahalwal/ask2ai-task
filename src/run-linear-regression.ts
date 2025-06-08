import { isDev } from "./utils/environment";
import { logger } from "./utils/logger";

export async function runLinearRegression(
  data: { x: number; y: number }[],
  alpha: number
) {
  logger.debug("Running linear regression");
  logger.debug(`Data: ${JSON.stringify(data)}`);
  logger.debug(`Alpha: ${alpha}`);
  await new Promise((resolve) =>
    setTimeout(resolve, isDev() ? 20000 : 60 * 1000)
  );
  logger.debug("Linear regression completed");
  return {
    result: "mock_result",
  };
}
