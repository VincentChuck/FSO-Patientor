import { Diagnosis, Patient, Entry, EntryForm } from "../../types";
import { Typography, Button } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { useEffect, useState } from "react";
import patientService from "../../services/patients";
import DisplayEntries from "./DisplayEntries";
import AddEntryModal from "../AddEntryModal";
import axios from "axios";

interface Props {
  patientID: string;
  diagnoses: Diagnosis[];
}

const PatientPage = ({ patientID, diagnoses }: Props) => {
  const [patient, setPatient] = useState<Patient>();
  const entries: Entry[] = !!patient ? patient.entries : [];

  useEffect(() => {
    patientService.getPatient(patientID).then((response) => {
      setPatient(response);
    });
  }, [patientID]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryForm) => {
    if (!patient) {
      return null;
    }
    try {
      const entry = await patientService.addEntry(patientID, values);
      const updatedPatient = {
        ...patient,
        entries: [...patient.entries, entry],
      };
      setPatient(updatedPatient);
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace(
            "Something went wrong. Error: ",
            ""
          );
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
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
      <DisplayEntries entries={entries} diagnoses={diagnoses} />
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
    </div>
  ) : (
    <div>loading...</div>
  );
};

export default PatientPage;
