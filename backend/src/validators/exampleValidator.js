import { z } from "zod";

export const createExampleSchema = z.object({
  name: z.string().min(1, "name is required"),
  status: z.enum(["active", "inactive"]).default("active"),
});
