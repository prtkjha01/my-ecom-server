import express, { Router } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose, { ConnectOptions } from "mongoose";
import router from "../src/routes/router";
dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

/********************************************* CONNECTED APPLICATION WITH THE DATABASE ******************************************/
mongoose.connect(
  process.env.URI_FOR_DB as string,
  {
    useNewUrlParser: true,
    //useFindAndModify: false,
    useUnifiedTopology: true,
  } as ConnectOptions
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("DB Connected successfully");
});

app.get("/", (req: any, res) => {
  res.send("<h1>Welcome to My E-com server</h1>");
});
app.get("/test", (req: any, res) => {
  res.send("<h1>Hello Test</h1>");
});
/****************************************************************** ROUTER *************************************************************************/
app.use(router);

/********************************************* IF THE URL PROVIDED IS NOT CORRECT THEN THROW THESE ******************************************/
app.get("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "Page not found",
  });
});

app.post("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "Page not found",
  });
});

app.patch("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "Page not found",
  });
});

app.put("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "Page not found",
  });
});

app.delete("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "Page not found",
  });
});

app.listen(port, () => {
  console.log("server is running on port", port);
});
