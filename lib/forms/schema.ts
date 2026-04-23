import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  company: z.string().max(160).optional(),
  budget: z.string().max(60).optional(),
  message: z.string().min(10).max(4000),
  locale: z.enum(["en", "ru"]),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
