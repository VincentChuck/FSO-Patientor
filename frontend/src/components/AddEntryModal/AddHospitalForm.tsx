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

const AddHospitalForm = ({ onCancel, onSubmit, diagnoses }: Props) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [specialist, setSpecialist] = useState("");
  const [dischargeDate, setDischargeDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [employerName, setEmployerName] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
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

  const addHospital = (event: SyntheticEvent) => {
    event.preventDefault();
    const newEntry: EntryForm = {
      type: "Hospital",
      description,
      date,
      specialist,
      discharge: {
        date: dischargeDate,
        criteria: dischargeCriteria,
      },
    };
    if (employerName) {
      newEntry.employerName = employerName;
    }
    if (diagnosisCodes) {
      newEntry.diagnosisCodes = diagnosisCodes;
    }
    onSubmit(newEntry);
  };

  return (
    <div>
      <Typography variant="h5" style={{ marginBottom: "0.5em" }}>
        Hospital Entry
      </Typography>
      <form onSubmit={addHospital}>
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          style={{ marginTop: 20 }}
          label="Date"
          InputLabelProps={{ shrink: true }}
          type="date"
          fullWidth
          value={date}
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
          label="Discharge Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          value={dischargeDate}
          onChange={({ target }) => setDischargeDate(target.value)}
        />
        <TextField
          style={{ marginTop: 20 }}
          label="Discharge Criteria"
          fullWidth
          value={dischargeCriteria}
          onChange={({ target }) => setDischargeCriteria(target.value)}
        />
        <TextField
          style={{ marginTop: 20 }}
          label="Employer Name (Optional)"
          fullWidth
          value={employerName}
          onChange={({ target }) => setEmployerName(target.value)}
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

export default AddHospitalForm;
