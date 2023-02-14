export interface DiagnosesEntry {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
}
export interface PatientsEntry {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
}

export type NonSensitivePatientsEntry = Omit<PatientsEntry, "ssn">;

export type NewPatientEntry = Omit<PatientsEntry, "id">;
