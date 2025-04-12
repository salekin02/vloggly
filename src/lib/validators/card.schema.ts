import { z } from "zod";

// Card Schema
export const cardSchema = z.object({
    cardNumber: z.string()
        .superRefine((val, ctx) => {
            if (val.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Card number is required",
                });
                return;
            }

            const digitsOnly = val.replace(/\s/g, '');
            if (!/^\d{13,19}$/.test(digitsOnly)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Invalid card number",
                });
                return;
            }
        }),
    nameOnCard: z.string()
        .superRefine((val, ctx) => {
            if (val.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Name on card is required",
                });
                return;
            }
        }),
    expiryDate: z.string()
        .superRefine((val, ctx) => {
            if (val.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Expiry date is required",
                });
                return;
            }

            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(val)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Invalid format (MM/YY)",
                });
                return;
            }
        }),
    cvc: z.string()
        .superRefine((val, ctx) => {
            if (val.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "CVC is required",
                });
                return;
            }

            if (!/^\d{3,4}$/.test(val)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Invalid CVC",
                });
                return;
            }
        }),
    name: z.string()
        .superRefine((val, ctx) => {
            if (val.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Name is required",
                });
                return;
            }
        }),
    email: z.string()
        .superRefine((val, ctx) => {
            if (val.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Email is required",
                });
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Invalid email format",
                });
                return;
            }
        }),
    address: z.string()
        .superRefine((val, ctx) => {
            if (val.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Address is required",
                });
                return;
            }
        }),
    selectedCard: z.string().nullable(),
});

export type CardFormValues = z.infer<typeof cardSchema>;