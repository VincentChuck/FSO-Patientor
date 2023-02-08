import diagnosesData from "../../data/diagnoses.json";

import { DiagnosesEntry } from "../types";

const diagnoses: Array<DiagnosesEntry> = diagnosesData;

const getEntries = (): Array<DiagnosesEntry> => {
  return diagnoses;
};

const addDiagnosis = () => {
  return null;
};

export default {
  getEntries,
  addDiagnosis,
};
