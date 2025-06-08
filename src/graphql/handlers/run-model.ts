import { publishJobStatusUpdated } from "../../pubsub";
import { runLinearRegression } from "../../run-linear-regression";
import { Job, JobStatus as DBJobStatus } from "../../storage/types/job";
import { Model, ModelStatus } from "../../storage/types/model";
import { logger } from "../../utils/logger";
import { JobStatus } from "../types";

export async function runModelJobAsync(
  data: { x: number; y: number }[],
  alpha: number,
  jobId: string,
  modelId: string
) {
  await runLinearRegression(data, alpha);
  await Model.update(
    { status: ModelStatus.TRAINED },
    { where: { id: modelId } }
  );
  await Job.update({ status: DBJobStatus.COMPLETED }, { where: { id: jobId } });
  logger.debug(`Model ${modelId} trained, job ${jobId} marked as COMPLETED`);
  publishJobStatusUpdated({
    jobId,
    modelId,
    status: JobStatus.Completed,
  });
}
