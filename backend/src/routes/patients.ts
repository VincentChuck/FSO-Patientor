import express from "express";
import { toNewPatientEntry, parseNewEntry } from "../utils";
import patientsService from "../services/patientsService";

const patientsRouter = express.Router();

patientsRouter.get("/", (_req, res) => {
  res.send(patientsService.getNonSensitivePatients());
});

patientsRouter.get("/:id", (req, res) => {
  const patient = patientsService.getPatient(req.params.id);
  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

patientsRouter.post("/:id/entries", (req, res) => {
  try {
    const patient = patientsService.getPatient(req.params.id);
    if (!patient) {
      return res.sendStatus(404);
    }
    const newEntry = parseNewEntry(req.body);
    const addedEntry = patientsService.addEntry(newEntry, patient);
    return res.status(200).json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong";
    if (error instanceof Error) {
      errorMessage = "Error: " + error.message;
    }
    return res.status(400).send(errorMessage);
  }
});

patientsRouter.post("/", (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);
    const addedEntry = patientsService.addPatient(newPatientEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong";
    if (error instanceof Error) {
      errorMessage = "Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default patientsRouter;
