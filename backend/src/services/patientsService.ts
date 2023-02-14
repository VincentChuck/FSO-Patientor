import patientsData from "../../data/patients";
import { v1 as uuid } from "uuid";

import {
  NonSensitivePatientsEntry,
  PatientsEntry,
  NewPatientEntry,
} from "../types";

const patients: PatientsEntry[] = patientsData;

const getEntries = (): PatientsEntry[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatientsEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatients = (entry: NewPatientEntry): PatientsEntry => {
  const id = uuid();
  const newPatientEntry = {
    id,
    ...entry,
  };
  patients.push(newPatientEntry);
  return newPatientEntry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatients,
};
