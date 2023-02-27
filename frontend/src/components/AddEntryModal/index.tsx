import {
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Alert,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import AddHealthCheckForm from "./AddHealthCheckForm";
import AddHospitalForm from "./AddHospitalForm";
import AddOccupationalHealthcareForm from "./AddOccupationalHealthcareForm";
import { Diagnosis, EntryForm } from "../../types";
import { useState } from "react";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryForm) => void;
  error?: string;
  clearError: () => void;
  diagnoses: Diagnosis[];
}

const entryTypeOptions = [
  "Health Check",
  "Hospital",
  "Occupational Healthcare",
] as const;
type EntryType = (typeof entryTypeOptions)[number];

const AddEntryModal = ({
  modalOpen,
  onClose,
  onSubmit,
  error,
  clearError,
  diagnoses,
}: Props) => {
  const [entryType, setEntryType] = useState<EntryType>("Health Check");
  const onEntryTypeChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if (typeof event.target.value === "string") {
      const value = event.target.value;
      const validEntryType = entryTypeOptions.find((e) => e === value);
      if (validEntryType) {
        setEntryType(validEntryType);
        clearError();
      }
    }
  };

  return (
    <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
      <DialogTitle>
        <FormControl fullWidth>
          <InputLabel id="entryTypeLabel">Entry Type</InputLabel>
          <Select
            labelId="entryTypeLabel"
            label="Entry Type"
            value={entryType}
            onChange={onEntryTypeChange}
          >
            {entryTypeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogTitle>
      <Divider />

      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <DisplayForm {...{ entryType, onClose, onSubmit, diagnoses }} />
      </DialogContent>
    </Dialog>
  );
};

export default AddEntryModal;

interface DisplayProps {
  entryType: EntryType;
  onClose: () => void;
  onSubmit: (values: EntryForm) => void;
  diagnoses: Diagnosis[];
}

const DisplayForm = ({
  entryType,
  onSubmit,
  onClose,
  diagnoses,
}: DisplayProps) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };
  switch (entryType) {
    case "Health Check":
      return (
        <AddHealthCheckForm
          onSubmit={onSubmit}
          onCancel={onClose}
          diagnoses={diagnoses}
        />
      );
    case "Hospital":
      return (
        <AddHospitalForm
          onSubmit={onSubmit}
          onCancel={onClose}
          diagnoses={diagnoses}
        />
      );
    case "Occupational Healthcare":
      return (
        <AddOccupationalHealthcareForm
          onSubmit={onSubmit}
          onCancel={onClose}
          diagnoses={diagnoses}
        />
      );
    default:
      return assertNever(entryType);
  }
};
