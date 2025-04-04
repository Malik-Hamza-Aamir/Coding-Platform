import { z } from "zod";
import { sqlInjectionCheck } from "./regex";

export const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .regex(/^[^\d]/, "Username cannot start with a number")
    .refine(sqlInjectionCheck, { message: "Invalid username input" }),

  email: z
    .string()
    .email("Invalid email format")
    .refine(sqlInjectionCheck, { message: "Invalid email input" }),

  password: z
    .string()
    .min(3, "Too short")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/\d/, "Must contain at least one number")
    .regex(/[@$!%*?&]/, "Must contain at least one special character (@$!%*?&)")
    .refine(sqlInjectionCheck, { message: "Invalid password input" }),

  imgURL: z
    .string()
    .url("Invalid URL format")
    .refine(sqlInjectionCheck, { message: "Invalid image URL input" }),

  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "DOB must be in YYYY-MM-DD format")
    .refine(sqlInjectionCheck, { message: "Invalid date of birth input" }),
});

export type UserFormData = z.infer<typeof userSchema>;

export type User = UserFormData & {
  id: number;
  role: "USER" | "ADMIN";
  createdAt: Date;
  refreshTokens: RefreshToken[];
};

export type RefreshToken = {
  id: number;
  userId: number;
  user: User;
  token: string;
  expiresAt: Date;
};
