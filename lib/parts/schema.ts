import { z } from "zod";

const shortText = z.string().trim().min(1).max(200);

export const specificationSchema = z.strictObject({
  name: shortText,
  value: z.union([shortText, z.number().finite(), z.boolean()]),
  unit: shortText.optional(),
  note: z.string().trim().max(1000).optional(),
});

export const partInputSchema = z.strictObject({
  name: shortText,
  category: shortText,
  description: z.string().trim().max(5000).optional(),
  manufacturer: shortText.optional(),
  manufacturerPartNumber: shortText.optional(),
  datasheetUrl: z.url({ protocol: /^https?$/ }).max(2048).optional(),
  specifications: z.array(specificationSchema).max(100).default([]),
});

export type PartInput = z.infer<typeof partInputSchema>;

/** Serializable representation; database identifiers stay on the server. */
export type Part = PartInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
