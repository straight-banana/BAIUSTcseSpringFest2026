import { api } from "./api.js";

// Matches contracts/db-schema.md's `examples` table and
// backend/src/routes/exampleRoutes.js. Swap the shape/endpoint as you
// build real features.

export async function listExamples() {
  const { data } = await api.get("/examples");
  return data.data; // unwrap the {success,data,error,message} envelope
}

export async function createExample({ name, status = "active" }) {
  const { data } = await api.post("/examples", { name, status });
  return data.data;
}
