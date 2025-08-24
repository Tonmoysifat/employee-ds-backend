import { z } from "zod";

const TimeOffCreateSchema = z.object({
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

export type ITimeOff = z.infer<typeof TimeOffCreateSchema>;
export type IArtor = z.infer<typeof ApproveRejectSchema>;
