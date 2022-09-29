import express from "express";
import cors from "cors";
import { config } from "dotenv";
import bodyParser from "body-parser";
import setToken from "./middleware/setToken.js";
import gamesRoute from "./routes/games.js";
import companyRoute from "./routes/company.js";
config();

const app = express();

app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

const run = () => {
  try {
    app.use("/api/v1/games", setToken, gamesRoute);
    app.use("/api/v1/company", setToken, companyRoute);
  } catch (error) {
    res.status(501).send({ message: "internel server error", error });
  }
};
run();

export default app;
