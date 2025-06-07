import { runLinearRegression } from "../../run-linear-regression";

export async function runModelJobAsync(
  data: { x: number; y: number }[],
  alpha: number
) {
  await runLinearRegression(data, alpha);
}
