import {
  NewPatient,
  Gender,
  HealthCheckRating,
  Diagnosis,
  EntryWithoutId,
} from "./types";

export const toNewPatientEntry = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }
  if (
    "name" in object &&
    "ssn" in object &&
    "dateOfBirth" in object &&
    "occupation" in object &&
    "gender" in object
  ) {
    const newEntry: NewPatient = {
      name: parseString(object.name, "Name"),
      ssn: parseString(object.ssn, "ssn"),
      dateOfBirth: parseDate(object.dateOfBirth),
      occupation: parseString(object.occupation, "Occupation"),
      gender: parseGender(object.gender),
    };
    return newEntry;
  }
  throw new Error("Incorrect data: some fields are missing");
};

export const parseNewEntry = (entry: unknown): EntryWithoutId => {
  if (!entry || typeof entry !== "object" || !("type" in entry)) {
    throw new Error("Incorrect or missing entries: " + entry);
  }
  const throwError = (entryType: string, entry: unknown) => {
    throw new Error(
      `Incorrect or missing fields for ${entryType} ${JSON.stringify(entry)}`
    );
  };
  switch (entry.type) {
    case "HealthCheck":
      if (isNewHealthCheckEntry(entry)) {
        return parseNewHealthCheckEntry(entry);
      } else {
        return throwError("HealthCheckEntry", entry);
      }
    case "Hospital":
      if (isNewHospitalEntry(entry)) {
        return parseNewHospitalEntry(entry);
      } else {
        return throwError("HospitalEntry", entry);
      }
    case "OccupationalHealthcare":
      if (isNewOccupationalHealthCareEntry(entry)) {
        return parseNewOccupationalHealthcareEntry(entry);
      } else {
        return throwError("OccupationalHealthcareEntry", entry);
      }
    default:
      throw new Error(`Unhandled type of entry: ${JSON.stringify(entry)}`);
  }
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseString = (object: unknown, type: string): string => {
  if (!object || !isString(object)) {
    throw new Error("Incorrect or missing " + type);
  }
  return object;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
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
const baseEntryCheck = (entry: object): boolean => {
  return "description" in entry && "date" in entry && "specialist" in entry;
};

const isNewHealthCheckEntry = (
  entry: object & Record<"type", unknown>
): entry is EntryWithoutId & Record<"type", "HealthCheck"> => {
  return (
    baseEntryCheck(entry) &&
    "healthCheckRating" in entry &&
    entry.type === "HealthCheck"
  );
};

const parseNewHealthCheckEntry = (
  entry: EntryWithoutId & Record<"type", "HealthCheck">
): EntryWithoutId => {
  const parsedEntry: EntryWithoutId = {
    type: "HealthCheck",
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

const isNewHospitalEntry = (
  entry: object & Record<"type", unknown>
): entry is EntryWithoutId & Record<"type", "Hospital"> => {
  return (
    baseEntryCheck(entry) && "discharge" in entry && entry.type === "Hospital"
  );
};

const parseNewHospitalEntry = (
  entry: EntryWithoutId & Record<"type", "Hospital">
): EntryWithoutId => {
  const parsedEntry: EntryWithoutId = {
    type: "Hospital",
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

const isNewOccupationalHealthCareEntry = (
  entry: object & Record<"type", unknown>
): entry is EntryWithoutId & Record<"type", "OccupationalHealthcare"> => {
  return (
    baseEntryCheck(entry) &&
    "employerName" in entry &&
    entry.type === "OccupationalHealthcare"
  );
};

const parseNewOccupationalHealthcareEntry = (
  entry: EntryWithoutId & Record<"type", "OccupationalHealthcare">
): EntryWithoutId => {
  const parsedEntry: EntryWithoutId = {
    type: "OccupationalHealthcare",
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

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
  if (!object || typeof object !== "object") {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis["code"]>;
  }
  return object as Array<Diagnosis["code"]>;
};

const isHealthCheckRating = (rating: number): rating is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(rating);
};

const parseHealthCheckRating = (rating: unknown): number => {
  if (typeof rating !== "number" || !isHealthCheckRating(rating)) {
    throw new Error("Incorrect or missing health check rating: " + rating);
  }
  return rating;
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
      criteria: parseString(discharge.criteria, "discharge criteria"),
    };
    return parsedDischarge;
  }
  throw new Error("Incorrect data: some fields are missing: " + discharge);
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
  const missing = !("startDate" in sickLeave)
    ? "sick leave start date"
    : "sick leave end date";
  throw new Error(`Incorrect data: missing ${missing}`);
};
