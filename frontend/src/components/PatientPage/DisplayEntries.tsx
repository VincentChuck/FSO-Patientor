import {
  Entry,
  HealthCheckRating,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  Diagnosis,
} from "../../types";
import { Typography, List, ListItem, ListItemText } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

interface Props {
  entries: Entry[];
  diagnoses: Diagnosis[];
}

const DisplayEntries = ({ entries, diagnoses }: Props) => {
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

  const Diagnoses = ({ codes }: { codes: string[] }) => (
    <div style={{ marginTop: "10px" }}>
      <List
        sx={{ listStyleType: "circle", width: "100%" }}
        subheader={<Typography variant="body1">Diagnoses:</Typography>}
      >
        {codes.map((code: string) => {
          const diagnosisName = findDiagnosisName(code);
          return (
            <ListItem
              key={code}
              sx={{ display: "list-item", paddingY: "0", ml: "20px" }}
            >
              <ListItemText
                primary={`${code}`}
                secondary={`${diagnosisName}`}
              ></ListItemText>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  const ShowHealthcheckEntry = ({ entry }: { entry: HealthCheckEntry }) => (
    <div
      style={{
        border: "1px solid black",
        borderRadius: "5px",
        padding: "5px",
        marginBottom: "10px",
      }}
    >
      <Typography variant="body1">
        {entry.date} <FavoriteIcon /> Health Check
      </Typography>
      <Typography variant="body1" sx={{ fontStyle: "italic" }}>
        {entry.description}
      </Typography>
      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <Diagnoses codes={entry.diagnosisCodes} />
      )}
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
    <div
      style={{
        border: "1px solid black",
        borderRadius: "5px",
        padding: "5px",
        marginBottom: "10px",
      }}
    >
      <Typography variant="body1">
        {entry.date} <MedicalServicesIcon /> Hospital
      </Typography>
      <Typography variant="body1" sx={{ fontStyle: "italic" }}>
        {entry.description}
      </Typography>
      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <Diagnoses codes={entry.diagnosisCodes} />
      )}
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
    <div
      style={{
        border: "1px solid black",
        borderRadius: "5px",
        padding: "5px",
        marginBottom: "10px",
      }}
    >
      <Typography variant="body1">
        {entry.date} <WorkIcon /> Occupational Healthcare by:{" "}
        {entry.employerName}
      </Typography>
      <Typography variant="body1" sx={{ fontStyle: "italic" }}>
        {entry.description}
      </Typography>
      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <Diagnoses codes={entry.diagnosisCodes} />
      )}
      <Typography variant="body1">Diagnosed by {entry.specialist}</Typography>
      {entry.sickLeave && (
        <Typography variant="body1">
          {`Sick leave from ${entry.sickLeave.startDate} to ${entry.sickLeave.endDate}`}
        </Typography>
      )}
    </div>
  );

  return (
    <div>
      {entries && entries.length > 0 && (
        <Typography variant="h5" style={{ margin: "0.5em auto" }}>
          entries
        </Typography>
      )}
      {entries &&
        entries.map((entry: Entry) => (
          <EntryDetails entry={entry} key={entry.id} />
        ))}
    </div>
  );
};

export default DisplayEntries;
