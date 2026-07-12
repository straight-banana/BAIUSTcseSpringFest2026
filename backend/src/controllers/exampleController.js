import * as exampleService from "../services/exampleService.js";
import { successResponse } from "../utils/apiResponse.js";

export async function list(req, res) {
  const examples = await exampleService.listExamples();
  res.json(successResponse(examples));
}

export async function create(req, res) {
  const example = await exampleService.createExample(req.body, req.user.sub);
  res.status(201).json(successResponse(example));
}
