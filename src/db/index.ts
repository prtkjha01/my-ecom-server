import mongoose, { ConnectOptions } from "mongoose";

/**
 * Function to connect to the mongo database asynchronously.
 *
 * @return {Promise<void>} Promise that resolves once the database is connected
 */
const connectDB = async (): Promise<void> => {
  try {
    const dbConnection = await mongoose.connect(
      process.env.MONGO_URI as string
    );
    console.log(`MongoDB Connected: ${dbConnection.connection.host}`);
  } catch (error: any) {
    console.log("Error connecting to MongoDB :", error);
    process.exit(1);
  }
};

export default connectDB;
