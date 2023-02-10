/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from "express";

const patientsRouter = express.Router();

import patientsService from "../services/patientsService";

patientsRouter.get("/", (_req, res) => {
  res.send(patientsService.getNonSensitiveEntries());
});

patientsRouter.post("/", (req, res) => {
  const { name, dateOfBirth, ssn, gender, occupation } = req.body;
  const addedEntry = patientsService.addPatients({
    name,
    dateOfBirth,
    ssn,
    gender,
    occupation,
  });
  res.send(addedEntry);
});

export default patientsRouter;
