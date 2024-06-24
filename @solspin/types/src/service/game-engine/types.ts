import { z } from "zod";

// Define the CaseType enum using Zod
const CaseType = z.enum(["nft", "csgo"]);

// Define the schema for BaseCaseItem
const BaseCaseItemSchema = z.object({
  price: z.number(),
  probability: z.number(),
  item_id: z.number(),
  item_type: z.string(),
  item_name: z.string(),
  image_url: z.string().url(),
  number_range: z.object({}),
  rarity: z.string(),
});

// Define the schema for CsgoCaseItem
const CsgoCaseItemSchema = BaseCaseItemSchema.extend({
  is_stattrak: z.boolean(),
  is_souvenir: z.boolean(),
  item_wear: z.string(),
});

const NftCaseItemSchema = BaseCaseItemSchema;

const CaseItemSchema = z.union([CsgoCaseItemSchema, NftCaseItemSchema]);

const BaseCaseSchema = z.object({
  caseType: CaseType,
  caseName: z.string(),
  casePrice: z.number(),
  caseId: z.string().uuid(),
  image_url: z.string().url(),
});

const CaseSchema = BaseCaseSchema.extend({
  caseHash: z.string(),
  items: z.array(CaseItemSchema),
  item_prefix_sums: z.array(z.number()),
});

const CaseOverviewSchema = BaseCaseSchema;

export const GetCaseByIdRequestSchema = CaseSchema.pick({ caseId: true });

export const CaseQuerySchema = z.object({
  caseType: CaseType.optional(),
  caseName: z.string().optional(),
  casePrice: z.number().positive().optional(),
});

export const GetCaseByIdResponseSchema = CaseSchema;

export {
  CaseType,
  BaseCaseItemSchema,
  CsgoCaseItemSchema,
  NftCaseItemSchema,
  CaseItemSchema,
  BaseCaseSchema,
  CaseSchema,
  CaseOverviewSchema,
};

export type BaseCaseItem = z.infer<typeof BaseCaseItemSchema>;
export type CsgoCaseItem = z.infer<typeof CsgoCaseItemSchema>;
export type NftCaseItem = z.infer<typeof NftCaseItemSchema>;
export type CaseItem = z.infer<typeof CaseItemSchema>;
export type BaseCase = z.infer<typeof BaseCaseSchema>;
export type Case = z.infer<typeof CaseSchema>;
export type CaseOverview = z.infer<typeof CaseOverviewSchema>;
