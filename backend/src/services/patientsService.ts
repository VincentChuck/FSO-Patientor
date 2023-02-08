import patientsData from "../../data/patients.json";

import { NonSensitivePatientsEntry, PatientsEntry } from "../types";

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

const addPatients = () => {
  return null;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatients,
};
