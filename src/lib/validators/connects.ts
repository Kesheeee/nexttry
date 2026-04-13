import { z } from "zod";

export const addConnectSchema = z.object({
  share_link_code: z.string().length(12),
});

export const updateConnectSchema = z.object({
  note: z.string().max(500).optional(),
});

export type AddConnectInput = z.infer<typeof addConnectSchema>;
export type UpdateConnectInput = z.infer<typeof updateConnectSchema>;
