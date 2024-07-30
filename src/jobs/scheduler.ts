import { CronJob } from "cron";
import { updateOrderStatus } from "../services/order.service";

export const dailyCron = (handler: any) => new CronJob("0 0 * * *", handler);

const productCron = dailyCron(updateOrderStatus);
const startJobs = () => {
  productCron.start();
  console.log("Cron Jobs Started");
};

export default startJobs;
