import { z } from "zod";

const CreateShiftSchema = z.object({
  date: z.string().or(z.date()),
  start: z.string(),
  end: z.string(),
  roleRequired: z.string(),
  skillRequired: z.string().optional(),
  location: z.string(),
  assignedEmployee: z.string().optional().nullable(),
});

const updateShift = CreateShiftSchema.partial();

const AssignShiftSchema = z.object({ employeeId: z.string().min(24) });

export const shiftValidation = {
  CreateShiftSchema,
  AssignShiftSchema,
  updateShift,
};

export type IShift = z.infer<typeof CreateShiftSchema>;
