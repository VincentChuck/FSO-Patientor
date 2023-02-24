import {
  Diagnosis,
  Patient,
  Entry,
  HealthCheckRating,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from "./../types";
import { Typography, List, ListItem, ListItemText } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import WorkIcon from "@mui/icons-material/Work";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { useEffect, useState } from "react";
import patientService from "../services/patients";

interface Props {
  patientID: string;
  diagnoses: Diagnosis[];
}

const PatientPage = ({ patientID, diagnoses }: Props) => {
  const [patient, setPatient] = useState<Patient>();
  const [entries, setEntries] = useState<Entry[]>();

  useEffect(() => {
    patientService
      .getPatient(patientID)
      .then((response) => setPatient(response))
      .then(() => {
        if (!!patient) {
          setEntries(patient.entries);
        }
      });
  }, [patient, patientID]);

  const findDiagnosisName = (code: string): string | undefined => {
    const diagnosis = diagnoses.find((diagnosis) => diagnosis.code === code);
    if (diagnosis) {
      return diagnosis.name;
    }
  };

  const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    const assertNever = (value: never): never => {
      throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
      );
    };
    switch (entry.type) {
      case "HealthCheck":
        return <ShowHealthcheckEntry entry={entry} />;
      case "Hospital":
        return <ShowHospitalEntry entry={entry} />;
      case "OccupationalHealthcare":
        return <ShowOccupationalHealthcareEntry entry={entry} />;
      default:
        return assertNever(entry);
    }
  };

  const Diagnoses = (codes: string[]) => (
    <List sx={{ listStyleType: "disc", pl: 4 }}>
      {codes.map((code: string) => {
        const diagnosisName = findDiagnosisName(code);
        return (
          <ListItem key={code} sx={{ display: "list-item", p: 0 }}>
            <ListItemText primary={`${code} ${diagnosisName}`}></ListItemText>
          </ListItem>
        );
      })}
    </List>
  );

  const ShowHealthcheckEntry = ({ entry }: { entry: HealthCheckEntry }) => (
    <div>
      <Typography variant="body1">
        {entry.date} <FavoriteIcon />
      </Typography>
      <Typography variant="body1" sx={{ fontStyle: "italic" }}>
        {entry.description}
      </Typography>
      {entry.diagnosisCodes && Diagnoses(entry.diagnosisCodes)}
      <Typography variant="body1">diagnosed by {entry.specialist}</Typography>
      <Typography variant="body1">
        {`Health check rating: ${
          Object.keys(HealthCheckRating)[
            Object.values(HealthCheckRating).indexOf(entry.healthCheckRating)
          ]
        }`}
      </Typography>
    </div>
  );

  const ShowHospitalEntry = ({ entry }: { entry: HospitalEntry }) => (
    <div>
      <Typography variant="body1">
        {entry.date} <MedicalServicesIcon />
      </Typography>
      <Typography variant="body1" sx={{ fontStyle: "italic" }}>
        {entry.description}
      </Typography>
      {entry.diagnosisCodes && Diagnoses(entry.diagnosisCodes)}
      <Typography variant="body1">diagnosed by {entry.specialist}</Typography>
      {entry.employerName && (
        <Typography variant="body1">
          Employed by {entry.employerName}
        </Typography>
      )}
      <Typography variant="body1">
        {`Discharged on ${entry.discharge.date} with the following criteria: ${entry.discharge.criteria}`}
      </Typography>
    </div>
  );

  const ShowOccupationalHealthcareEntry = ({
    entry,
  }: {
    entry: OccupationalHealthcareEntry;
  }) => (
    <div>
      <Typography variant="body1">
        {entry.date} <WorkIcon /> {entry.employerName}
      </Typography>
      <Typography variant="body1" sx={{ fontStyle: "italic" }}>
        {entry.description}
      </Typography>
      {entry.diagnosisCodes && Diagnoses(entry.diagnosisCodes)}
      <Typography variant="body1">Diagnosed by {entry.specialist}</Typography>
      {entry.sickLeave && (
        <Typography variant="body1">
          {`Sick leave from ${entry.sickLeave.startDate} to ${entry.sickLeave.endDate}`}
        </Typography>
      )}
    </div>
  );

  return patient ? (
    <div>
      <Typography variant="h4" style={{ marginBottom: "0.5em" }}>
        {patient.name}{" "}
        {patient.gender === "male" ? <MaleIcon /> : <FemaleIcon />}
      </Typography>
      {patient.dateOfBirth && (
        <Typography variant="body1">
          date of birth: {patient.dateOfBirth}
        </Typography>
      )}
      {patient.ssn && (
        <Typography variant="body1">ssn: {patient.ssn}</Typography>
      )}
      <Typography variant="body1">occupation: {patient.occupation}</Typography>
      {entries && entries.length > 0 && (
        <Typography variant="h5" style={{ margin: "0.5em" }}>
          entries
        </Typography>
      )}
      {entries &&
        patient.entries.map((entry: Entry) => (
          <EntryDetails entry={entry} key={entry.id} />
        ))}
    </div>
  ) : (
    <div>loading...</div>
  );
};

export default PatientPage;
