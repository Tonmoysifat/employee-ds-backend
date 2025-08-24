import {z} from "zod";

const RegisterSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["NURSE", "DOCTOR", "MANAGER", "CASHIER", "SECURITY"]),
    skills: z.array(z.string()).default([]),
    location: z.string().min(1),
    availability: z
        .array(
            z.object({
                dayOfWeek: z.number().int().min(0).max(6),
                start: z.string(),
                end: z.string(),
            })
        )
        .default([]),
});

const updateEmployeeSchema = RegisterSchema.partial()

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const changePasswordValidationSchema = z.object({
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8),
});

export type IRegistration = z.infer<typeof RegisterSchema>;
export type ILogin = z.infer<typeof LoginSchema>;

export const authValidation = {
    changePasswordValidationSchema,
    RegisterSchema,
    updateEmployeeSchema,
    LoginSchema,
};
