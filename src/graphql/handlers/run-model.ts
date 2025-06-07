import { runLinearRegression } from "../../run-linear-regression";
import { Job, JobStatus } from "../../storage/types/job";
import { Model } from "../../storage/types/model";
import { logger } from "../../utils/logger";

export async function runModelJobAsync(
  data: { x: number; y: number }[],
  alpha: number,
  jobId: string,
  modelId: string
) {
  const { result } = await runLinearRegression(data, alpha);
  await Model.update({ result }, { where: { id: modelId } });
  await Job.update({ status: JobStatus.COMPLETED }, { where: { id: jobId } });
  logger.debug(`Model ${modelId} trained, job ${jobId} marked as COMPLETED`);
}
