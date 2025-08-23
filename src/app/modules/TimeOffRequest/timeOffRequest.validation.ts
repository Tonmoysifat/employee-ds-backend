import { z } from "zod";

const TimeOffCreateSchema = z.object({
  employee: z.string(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  reason: z.string().optional(),
});

const ApproveRejectSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

export const timeOffValidation = {
  TimeOffCreateSchema,
  ApproveRejectSchema,
};
