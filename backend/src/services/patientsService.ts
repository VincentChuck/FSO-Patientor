import patientsData from "../../data/patients";
import { v1 as uuid } from "uuid";

import { NonSensitivePatient, Patient, NewPatient } from "../types";

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

const addPatients = (entry: NewPatient): Patient => {
  const id = uuid();
  const newPatientEntry = {
    id,
    ...entry,
  };
  patients.push(newPatientEntry);
  return newPatientEntry;
};

export default {
  getPatients,
  getPatient,
  getNonSensitivePatients,
  addPatients,
};
