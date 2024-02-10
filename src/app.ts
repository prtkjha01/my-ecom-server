import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "../src/routes/router";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use('/api/v1', router);
export default app;
