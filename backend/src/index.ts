import express from "express";
import cors from "cors";
import diagnosesRouter from "./routes/diagnoses";
import patientsRouter from "./routes/patients";

const app = express();

app.use(express.json());
app.use(cors());

app.use((request, _response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
});

app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use("/api/diagnoses", diagnosesRouter);

app.use("/api/patients", patientsRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
