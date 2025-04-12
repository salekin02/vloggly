import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
  email: z.string()
    .superRefine((val, ctx) => {
      if (val.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "The Email field is required",
        });
        return;
      }

      if (!val.includes('@')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid email address",
        });
        return;
      }
    }),
  password: z.string()
    .superRefine((val, ctx) => {
      if (val.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "The Password field is required",
        });
        return;
      }

      if (val.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must be at least 8 characters",
        });
        return;
      }
    }),
  mobile: z.boolean({ required_error: "This option is required" })
    .refine((val) => val === true, { message: "You must agree to the terms" })
});

// Step 1: Initial registration schema (name and email only)
export const registerStep1Schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string()
    .superRefine((val, ctx) => {
      if (val.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "The Email field is required",
        });
        return;
      }

      if (!val.includes('@')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid email address",
        });
        return;
      }
    }),
  mobile: z.boolean({ required_error: "This option is required" })
    .refine((val) => val === true, { message: "You must agree to the terms" })
});

export const verifyEmailSchema = z.object({
  verificationCode: z.string().min(6, "Code must be at least 6 digit"),
});

// Step 3: Password creation schema
export const registerStep3Schema = z
  .object({
    password: z.string()
      .superRefine((val, ctx) => {
        if (val.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "The Password field is required",
          });
          return;
        }

        if (val.length < 8) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must be at least 8 characters",
          });
          return;
        }
      }),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords don't match",
        code: "custom",
      });
    }
  });

// Complete Register Schema (for reference or when needed)
export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string()
      .superRefine((val, ctx) => {
        if (val.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "The Email field is required",
          });
          return;
        }

        if (!val.includes('@')) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please enter a valid email address",
          });
          return;
        }
      }),
    password: z.string()
      .superRefine((val, ctx) => {
        if (val.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "The Password field is required",
          });
          return;
        }

        if (val.length < 8) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must be at least 8 characters",
          });
          return;
        }
      }),
    confirmPassword: z.string(),
    mobile: z.boolean({ required_error: "This option is required" })
      .refine((val) => val === true, { message: "You must agree to the terms" })
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords don't match",
        code: "custom",
      });
    }
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type RegisterStep1Values = z.infer<typeof registerStep1Schema>;
export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;
export type RegisterStep3Values = z.infer<typeof registerStep3Schema>;
export type LoginFormValues = z.infer<typeof loginSchema>;

