import connectDB from "./db/index";
import app from "./app";
import * as dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 3000;

connectDB()
  .then(() => {

    app.listen(port, () => {

      console.log("Server is running on Port :", port);
    });
  })
  .catch((error: Error) => {
    
    console.log("Error connecting to MongoDB :", error);
  });


