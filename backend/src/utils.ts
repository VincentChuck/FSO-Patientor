import {
  NewPatient,
  Gender,
  Entry,
  HealthCheckRating,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  Diagnosis,
} from "./types";

export const toNewPatientEntry = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "ssn" in object &&
    "gender" in object &&
    "occupation" in object &&
    "entries" in object
  ) {
    const newEntry: NewPatient = {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseSsn(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: parseEntries(object.entries),
    };
    return newEntry;
  }
  throw new Error("Incorrect data: some fields are missing");
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error("Incorrect or missing name");
  }
  return name;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};

const parseSsn = (ssn: unknown): string => {
  if (!isString(ssn)) {
    throw new Error("Incorrect or missing ssn: " + ssn);
  }
  return ssn;
};

const isGender = (gender: string): gender is Gender => {
  return Object.values(Gender)
    .map((g) => g.toString())
    .includes(gender);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};

const parseOccupation = (occ: unknown): string => {
  if (!isString(occ)) {
    throw new Error("Incorrect or missing occupation: " + occ);
  }
  return occ;
};

const baseEntryCheck = (entry: object): boolean => {
  return (
    "id" in entry &&
    "description" in entry &&
    "date" in entry &&
    "specialist" in entry
  );
};

const parseString = (object: unknown, type: string): string => {
  if (!isString(object)) {
    throw new Error("Incorrect or missing " + type);
  }
  return object;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis["code"]>;
  }

  return object.diagnosisCodes as Array<Diagnosis["code"]>;
};

const isHealthCheckRating = (rating: number): rating is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(rating);
};

const parseHealthCheckRating = (rating: unknown): number => {
  if (typeof rating !== "number" || isHealthCheckRating(rating)) {
    throw new Error("Incorrect or missing health check rating: " + rating);
  }
  return rating;
};

const isHealthCheckEntry = (entry: object): entry is HealthCheckEntry => {
  return baseEntryCheck(entry) && "healthCheckRating" in entry;
};

const parseHealthCheckEntry = (entry: unknown): HealthCheckEntry => {
  if (!entry || typeof entry !== "object" || !isHealthCheckEntry(entry)) {
    throw new Error(
      "Incorrect or missing fields for Health Check Entry: " + entry
    );
  }
  const parsedEntry: HealthCheckEntry = {
    type: "HealthCheck",
    id: parseString(entry.id, "id"),
    description: parseString(entry.description, "description"),
    date: parseDate(entry.date),
    specialist: parseString(entry.specialist, "specialist"),
    healthCheckRating: parseHealthCheckRating(entry.healthCheckRating),
  };
  if ("diagnosisCodes" in entry) {
    parsedEntry.diagnosisCodes = parseDiagnosisCodes(entry.diagnosisCodes);
  }
  return parsedEntry;
};

const parseDischarge = (
  discharge: unknown
): { date: string; criteria: string } => {
  if (!discharge || typeof discharge !== "object") {
    throw new Error("Incorrect or missing data: " + discharge);
  }
  if ("date" in discharge && "criteria" in discharge) {
    const parsedDischarge = {
      date: parseDate(discharge.date),
      criteria: parseDate(discharge.criteria),
    };
    return parsedDischarge;
  }
  throw new Error("Incorrect data: some fields are missing: " + discharge);
};

const isHospitalEntry = (entry: object): entry is HospitalEntry => {
  return baseEntryCheck(entry) && "discharge" in entry;
};

const parseHospitalEntry = (entry: unknown): HospitalEntry => {
  if (!entry || typeof entry !== "object" || !isHospitalEntry(entry)) {
    throw new Error("Incorrect or missing fields for Hospital Entry: " + entry);
  }
  const parsedEntry: HospitalEntry = {
    type: "Hospital",
    id: parseString(entry.id, "id"),
    description: parseString(entry.description, "description"),
    date: parseDate(entry.date),
    specialist: parseString(entry.specialist, "specialist"),
    discharge: parseDischarge(entry.discharge),
  };
  if ("diagnosisCodes" in entry) {
    parsedEntry.diagnosisCodes = parseDiagnosisCodes(entry.diagnosisCodes);
  }
  if ("employerName" in entry) {
    parsedEntry.employerName = parseString(entry.employerName, "employer name");
  }
  return parsedEntry;
};

const parseSickLeave = (
  sickLeave: unknown
): { startDate: string; endDate: string } => {
  if (!sickLeave || typeof sickLeave !== "object") {
    throw new Error("Incorrect or missing data: " + sickLeave);
  }
  if ("startDate" in sickLeave && "endDate" in sickLeave) {
    const parsedSickLeave = {
      startDate: parseDate(sickLeave.startDate),
      endDate: parseDate(sickLeave.endDate),
    };
    return parsedSickLeave;
  }
  throw new Error("Incorrect data: some fields are missing: " + sickLeave);
};

const isOccupationalHealthcareEntry = (
  entry: object
): entry is OccupationalHealthcareEntry => {
  return baseEntryCheck(entry) && "employerName" in entry;
};

const parseOccupationalHealthcareEntry = (
  entry: unknown
): OccupationalHealthcareEntry => {
  if (
    !entry ||
    typeof entry !== "object" ||
    !isOccupationalHealthcareEntry(entry)
  ) {
    throw new Error(
      "Incorrect or missing fields for Occupational Healthcare Entry: " + entry
    );
  }
  const parsedEntry: OccupationalHealthcareEntry = {
    type: "OccupationalHealthcare",
    id: parseString(entry.id, "id"),
    description: parseString(entry.description, "description"),
    date: parseDate(entry.date),
    specialist: parseString(entry.specialist, "specialist"),
    employerName: parseString(entry.employerName, "employer name"),
  };
  if ("diagnosisCodes" in entry) {
    parsedEntry.diagnosisCodes = parseDiagnosisCodes(entry.diagnosisCodes);
  }
  if ("sickLeave" in entry) {
    parsedEntry.sickLeave = parseSickLeave(entry.sickLeave);
  }
  return parsedEntry;
};

export const parseEntry = (entry: unknown): Entry => {
  if (!entry || typeof entry !== "object" || !("type" in entry)) {
    throw new Error("Incorrect or missing entries: " + entry);
  }
  switch (entry.type) {
    case "HealthCheck":
      return parseHealthCheckEntry(entry);
    case "HospitalEntry":
      return parseHospitalEntry(entry);
    case "OccupationalHealthcareEntry":
      return parseOccupationalHealthcareEntry(entry);
    default:
      throw new Error("Incorrect entry type: " + entry);
  }
};

const parseEntries = (entries: unknown): Entry[] => {
  if (!entries || !Array.isArray(entries)) {
    throw new Error("Incorrect or missing entries" + entries);
  }
  const parsedEntries: Entry[] = [];
  entries.forEach((entry) => {
    parsedEntries.push(parseEntry(entry));
  });
  return parsedEntries;
};
