import express from "express";

const diagnosesRouter = express.Router();

import diagnosesService from "../services/diagnosesService";

diagnosesRouter.get("/", (_req, res) => {
  res.send(diagnosesService.getEntries());
});

diagnosesRouter.post("/", (_req, res) => {
  res.send("Saving a diagnosis!");
});

export default diagnosesRouter;
