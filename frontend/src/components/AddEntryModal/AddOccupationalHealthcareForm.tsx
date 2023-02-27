import { useState, SyntheticEvent } from "react";

import {
  TextField,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Button,
  SelectChangeEvent,
  Typography,
  OutlinedInput,
  Box,
  Chip,
  FormControl,
} from "@mui/material";

import { Diagnosis, EntryForm } from "../../types";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryForm) => void;
  diagnoses: Diagnosis[];
}

const AddOccupationalHealthcareForm = ({
  onCancel,
  onSubmit,
  diagnoses,
}: Props) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [specialist, setSpecialist] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState<string>();
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState<string>();
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const diagnosisCodeOptions: Array<string> = diagnoses.reduce(
    (arr: Array<string>, i: Diagnosis) => [...arr, i.code],
    []
  );

  const onDiagnosisChange = (event: SelectChangeEvent<string[]>) => {
    event.preventDefault();
    const value = event.target.value;
    setDiagnosisCodes(typeof value === "string" ? value.split(",") : value);
  };

  const addOccupationalHealthcare = (event: SyntheticEvent) => {
    event.preventDefault();
    const newEntry: EntryForm = {
      type: "OccupationalHealthcare",
      description,
      date,
      specialist,
      employerName,
    };
    if (diagnosisCodes) {
      newEntry.diagnosisCodes = diagnosisCodes;
    }
    if (sickLeaveStartDate || sickLeaveEndDate) {
      newEntry.sickLeave = {
        startDate: sickLeaveStartDate as string,
        endDate: sickLeaveEndDate as string,
      };
    }
    onSubmit(newEntry);
  };

  return (
    <div>
      <Typography variant="h5" style={{ marginBottom: "0.5em" }}>
        Occupational Healthcare Entry
      </Typography>
      <form onSubmit={addOccupationalHealthcare}>
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          style={{ marginTop: 20 }}
          label="Date"
          type="date"
          fullWidth
          value={date}
          InputLabelProps={{ shrink: true }}
          onChange={({ target }) => setDate(target.value)}
        />
        <TextField
          style={{ marginTop: 20 }}
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        <TextField
          style={{ marginTop: 20 }}
          label="Employer Name"
          fullWidth
          value={employerName}
          onChange={({ target }) => setEmployerName(target.value)}
        />
        <InputLabel sx={{ mt: "20px" }}>Sick Leave (Optional)</InputLabel>
        <TextField
          style={{ marginTop: 10 }}
          label="Start Date"
          type="date"
          fullWidth
          value={sickLeaveStartDate}
          InputLabelProps={{ shrink: true }}
          onChange={({ target }) => setSickLeaveStartDate(target.value)}
        />
        <TextField
          style={{ marginTop: 10 }}
          label="End Date"
          type="date"
          fullWidth
          value={sickLeaveEndDate}
          InputLabelProps={{ shrink: true }}
          onChange={({ target }) => setSickLeaveEndDate(target.value)}
        />

        <FormControl fullWidth style={{ marginTop: 20 }}>
          <InputLabel id="diagnosisCodeInputLabel">
            Diagnosis Codes (Optional)
          </InputLabel>
          <Select
            multiple
            labelId="diagnosisCodeInputLabel"
            value={diagnosisCodes}
            onChange={onDiagnosisChange}
            input={<OutlinedInput label="Diagnosis Codes (Optional)" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {diagnosisCodeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Grid style={{ marginTop: "1em" }}>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddOccupationalHealthcareForm;
