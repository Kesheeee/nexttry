import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  locale: z.enum(["en", "zh"]).optional(),
  life_stage: z
    .enum(["secondary_school", "university", "early_career", "career_change", "retired"])
    .optional(),
  bio: z.string().max(500).optional(),
  social_links: z
    .object({
      linkedin: z.string().url().optional().or(z.literal("")),
      instagram: z.string().url().optional().or(z.literal("")),
      website: z.string().url().optional().or(z.literal("")),
    })
    .optional(),
  onboarding_completed: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
