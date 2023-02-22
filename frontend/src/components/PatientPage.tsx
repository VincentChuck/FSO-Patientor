import { Patient } from "./../types";
import { Typography, List, ListItem, ListItemText } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { useEffect, useState } from "react";
import patientService from "../services/patients";

interface Props {
  patientID: string;
}

const PatientPage = ({ patientID }: Props) => {
  const [patient, setPatient] = useState<Patient>();
  useEffect(() => {
    patientService
      .getPatient(patientID)
      .then((response) => setPatient(response));
  }, [patientID]);

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
              {entry.diagnosisCodes.map((code) => (
                <ListItem key={code} sx={{ display: "list-item", p: 0 }}>
                  <ListItemText
                    primary={<Typography variant="body1">{code}</Typography>}
                  ></ListItemText>
                </ListItem>
              ))}
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
