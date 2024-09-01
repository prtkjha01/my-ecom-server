import { CronJob } from "cron";
import { updateOrderStatus } from "../services/order.service";

export const dailyCron = (handler: any) => new CronJob("0 * * * *", handler);

const productCron = dailyCron(updateOrderStatus);
/**
 * Starts the cron jobs and logs a message indicating that the jobs have started.
 *
 * @return {void} This function does not return anything.
 */
const startJobs = (): void => {
  productCron.start();
  console.log("Cron Jobs Started");
};

export default startJobs;
