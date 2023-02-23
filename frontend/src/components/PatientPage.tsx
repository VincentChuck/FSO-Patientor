import { Diagnosis, Patient } from "./../types";
import { Typography, List, ListItem, ListItemText } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { useEffect, useState } from "react";
import patientService from "../services/patients";

interface Props {
  patientID: string;
  diagnoses: Diagnosis[];
}

const PatientPage = ({ patientID, diagnoses }: Props) => {
  const [patient, setPatient] = useState<Patient>();
  useEffect(() => {
    patientService
      .getPatient(patientID)
      .then((response) => setPatient(response));
  }, [patientID]);

  const findDiagnosisName = (code: string): string | undefined => {
    const diagnosis = diagnoses.find((diagnosis) => diagnosis.code === code);
    if (diagnosis) {
      return diagnosis.name;
    }
  };

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
      <Typography variant="h5" style={{ marginBottom: "0.5em" }}>
        entries
      </Typography>
      {patient.entries.map((entry) => (
        <div key={entry.id}>
          <Typography variant="body1">
            {entry.date} <i>{entry.description}</i>
          </Typography>
          {entry.diagnosisCodes && (
            <List sx={{ listStyleType: "disc", pl: 4 }}>
              {entry.diagnosisCodes.map((code) => {
                const diagnosisName = findDiagnosisName(code);
                return (
                  <ListItem key={code} sx={{ display: "list-item", p: 0 }}>
                    <ListItemText
                      primary={`${code} ${diagnosisName}`}
                    ></ListItemText>
                  </ListItem>
                );
              })}
            </List>
          )}
        </div>
      ))}
    </div>
  ) : (
    <div>loading...</div>
  );
};

export default PatientPage;
