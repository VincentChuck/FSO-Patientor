import patientsData from "../../data/patients.json";
import { v1 as uuid } from "uuid";

import {
  NonSensitivePatientsEntry,
  PatientsEntry,
  NewPatientsEntry,
} from "../types";

const patients: Array<PatientsEntry> = patientsData;

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

const addPatients = (entry: NewPatientsEntry): PatientsEntry => {
  const id = uuid();
  const newPatientEntry = {
    id,
    ...entry,
  };
  return newPatientEntry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatients,
};
