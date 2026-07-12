import * as authService from "../services/authService.js";
import { successResponse } from "../utils/apiResponse.js";

export async function register(req, res) {
  const result = await authService.register(req.body);
  res.status(201).json(successResponse(result));
}

export async function login(req, res) {
  const result = await authService.login(req.body);
  res.json(successResponse(result));
}

export async function refresh(req, res) {
  const result = await authService.refresh(req.body.refreshToken);
  res.json(successResponse(result));
}
