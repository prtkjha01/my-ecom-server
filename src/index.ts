import connectDB from "./db/index";
import app from "./app";
import startJobs from "./jobs/scheduler";
import * as dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      startJobs();
      console.log("Server is running on Port :", port);
    });
  })
  .catch((error: Error) => {
    console.log("Error connecting to MongoDB :", error);
  });
