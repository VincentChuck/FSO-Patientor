import patientsData from "../../data/patients";
import { v1 as uuid } from "uuid";

import {
  NonSensitivePatient,
  Patient,
  NewPatient,
  EntryWithoutId,
  Entry,
} from "../types";

const patients: Patient[] = patientsData;

const getPatients = (): Patient[] => {
  return patients;
};

const getPatient = (id: string): Patient | undefined => {
  const patient = patients.find((patient) => patient.id === id);
  if (patient) {
    patient.entries = patient.entries || [];
  }
  return patient;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatient): Patient => {
  const id = uuid();
  const newPatientEntry: Patient = {
    id,
    ...entry,
    entries: [],
  };
  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (entry: EntryWithoutId, patient: Patient): Entry => {
  const id = uuid();
  const newEntry = {
    id,
    ...entry,
  };
  patients.map((p) => {
    if (p.id === patient.id) {
      p.entries.push(newEntry);
    }
  });

  return newEntry;
};

export default {
  getPatients,
  getPatient,
  getNonSensitivePatients,
  addPatient,
  addEntry,
};
