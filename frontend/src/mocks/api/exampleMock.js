import { exampleData } from "../data/exampleData.js";

// Drop-in replacement for exampleService.js while the backend/db isn't
// running yet. Returns data in the exact shape listExamples() would.
export async function listExamplesMock() {
  await new Promise((r) => setTimeout(r, 300)); // simulate latency
  return exampleData;
}
