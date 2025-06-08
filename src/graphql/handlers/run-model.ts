import { publishJobStatusUpdated } from "../../pubsub";
import { runLinearRegression } from "../../run-linear-regression";
import { Job, JobStatus as DBJobStatus } from "../../storage/types/job";
import { Model, ModelStatus } from "../../storage/types/model";
import { logger } from "../../utils/logger";
import { JobStatus } from "../types";

export async function runModel(
  data: { x: number; y: number }[],
  alpha: number,
  jobId: string,
  modelId: string
) {
  try {
    await runLinearRegression(data, alpha);
    await Model.update(
      { status: ModelStatus.TRAINED },
      { where: { id: modelId } }
    );
    await Job.update(
      { status: DBJobStatus.COMPLETED },
      { where: { id: jobId } }
    );
    logger.debug(`Model ${modelId} trained, job ${jobId} marked as COMPLETED`);
    publishJobStatusUpdated({
      jobId,
      modelId,
      status: JobStatus.Completed,
    });
  } catch (error) {
    logger.error(`Error training model ${modelId}:`, error);
    // Update both job and model status to failed
    await Model.update(
      { status: ModelStatus.TRAINING }, // Keep as TRAINING since it failed
      { where: { id: modelId } }
    );
    await Job.update({ status: DBJobStatus.FAILED }, { where: { id: jobId } });
    logger.debug(
      `Model ${modelId} training failed, job ${jobId} marked as FAILED`
    );
    publishJobStatusUpdated({
      jobId,
      modelId,
      status: JobStatus.Failed,
    });
  }
}
