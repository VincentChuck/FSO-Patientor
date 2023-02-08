import express from "express";

const patientsRouter = express.Router();

import patientsService from "../services/patientsService";

patientsRouter.get("/", (_req, res) => {
  res.send(patientsService.getNonSensitiveEntries());
});

patientsRouter.post("/", (_req, res) => {
  res.send("Saving a diagnosis!");
});

export default patientsRouter;
