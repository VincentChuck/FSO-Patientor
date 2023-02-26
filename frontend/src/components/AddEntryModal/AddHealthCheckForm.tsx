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

import { Diagnosis, EntryForm, HealthCheckRating } from "../../types";

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

interface HealthCheckRatingOption {
  value: HealthCheckRating;
  label: string;
}

const healthCheckRatingOptions: HealthCheckRatingOption[] = Object.values(
  HealthCheckRating
)
  .filter((value) => typeof value === "number")
  .map((v) => ({
    value: Number(v),
    label: String(v),
  }));

const AddHealthCheckForm = ({ onCancel, onSubmit, diagnoses }: Props) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [specialist, setSpecialist] = useState("");
  const [healthCheckRating, setHealthCheckRating] =
    useState<HealthCheckRating>(0);
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const diagnosisCodeOptions: Array<string> = diagnoses.reduce(
    (arr: Array<string>, i: Diagnosis) => [...arr, i.code],
    []
  );

  const onRatingChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if (typeof event.target.value === "number") {
      const value = event.target.value;
      const rating = Object.values(HealthCheckRating).find((r) => r === value);
      if (rating) {
        setHealthCheckRating(Number(rating));
      }
    }
  };

  const onDiagnosisChange = (event: SelectChangeEvent<string[]>) => {
    event.preventDefault();
    const value = event.target.value;
    setDiagnosisCodes(typeof value === "string" ? value.split(",") : value);
  };

  const addHealthCheck = (event: SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      type: "HealthCheck",
      description,
      date,
      specialist,
      healthCheckRating: Number(healthCheckRating),
      diagnosisCodes,
    });
  };

  return (
    <div>
      <Typography variant="h5" style={{ marginBottom: "0.5em" }}>
        Health Check
      </Typography>
      <form onSubmit={addHealthCheck}>
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

        <FormControl fullWidth style={{ marginTop: 20 }}>
          <InputLabel id="healthCheckRatingInputLabel">
            Health Check Rating
          </InputLabel>
          <Select
            labelId="healthCheckRatingInputLabel"
            label="Health Check Rating"
            value={String(healthCheckRating)}
            onChange={onRatingChange}
          >
            {healthCheckRatingOptions.map((option) => (
              <MenuItem key={option.label} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth style={{ marginTop: 20 }}>
          <InputLabel id="diagnosisCodeInputLabel">Diagnosis Codes</InputLabel>
          <Select
            multiple
            labelId="diagnosisCodeInputLabel"
            value={diagnosisCodes}
            onChange={onDiagnosisChange}
            input={<OutlinedInput label="Diagnosis Codes" />}
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

export default AddHealthCheckForm;
