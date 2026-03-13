import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ── Enums ──
export const userRoleEnum = pgEnum("user_role", ["GROWER", "PCA", "ADMIN"]);
export const actionTypeEnum = pgEnum("action_type", ["SPRAY", "FERT", "IRRIGATE", "LABOR"]);
export const productCategoryEnum = pgEnum("product_category", [
  "NUTRITION", "AMENDMENT", "FUNGICIDE", "HERBICIDE",
  "INSECTICIDE_MITICIDE", "ADJUVANT", "BIOLOGICAL", "WATER_TREATMENT"
]);
export const recStatusEnum = pgEnum("rec_status", [
  "DRAFT", "SENT", "PENDING", "ACKNOWLEDGED", "APPLIED", "CLOSED"
]);
export const costStatusEnum = pgEnum("cost_status", ["ESTIMATED", "UNIT_MISMATCH", "INVOICE"]);
export const planIdEnum = pgEnum("plan_id", ["STARTER", "PRO", "OPS"]);
export const templateLineTypeEnum = pgEnum("template_line_type", ["SPRAY", "FERT", "IRRIGATE"]);

// ── Users ──
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  org: text("org"),
  role: userRoleEnum("role").notNull().default("GROWER"),
  status: text("status").notNull().default("ACTIVE"),
  onboarded: boolean("onboarded").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Ranches ──
export const ranches = pgTable("ranches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  region: text("region"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Blocks ──
export const blocks = pgTable("blocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ranchId: varchar("ranch_id").notNull().references(() => ranches.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  acreage: real("acreage").notNull().default(0),
  variety: text("variety").notNull().default(""),
  seasonGroup: text("season_group").notNull().default("Mid"),
  irrigationType: text("irrigation_type").notNull().default("Drip"),
  yieldTargetBins: real("yield_target_bins").notNull().default(0),
  waterTargetAcreFeet: real("water_target_acre_feet").notNull().default(0),
  crop: text("crop"),
  geometry: jsonb("geometry"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Field Logs ──
export const fieldLogs = pgTable("field_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ranchId: varchar("ranch_id").notNull().references(() => ranches.id, { onDelete: "cascade" }),
  blockId: varchar("block_id").notNull().references(() => blocks.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  actionType: actionTypeEnum("action_type").notNull(),
  material: text("material").notNull().default(""),
  amount: real("amount").notNull().default(0),
  unit: text("unit").notNull().default(""),
  notes: text("notes"),
  cost: real("cost"),
  productEntries: jsonb("product_entries"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Chemical Applications ──
export const chemicalApps = pgTable("chemical_apps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ranchId: varchar("ranch_id").notNull().references(() => ranches.id, { onDelete: "cascade" }),
  blockId: varchar("block_id").notNull().references(() => blocks.id, { onDelete: "cascade" }),
  chemicalId: text("chemical_id"),
  chemicalName: text("chemical_name").notNull(),
  category: text("category").notNull(),
  dateApplied: text("date_applied").notNull(),
  method: text("method"),
  estimatedCost: real("estimated_cost"),
  costStatus: text("cost_status"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Chemicals Library (shared/global) ──
export const chemicals = pgTable("chemicals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  unit: text("unit").notNull().default(""),
  unitCostLow: real("unit_cost_low"),
  unitCostHigh: real("unit_cost_high"),
  cropTags: jsonb("crop_tags"),
  aliases: jsonb("aliases"),
  notes: text("notes"),
});

// ── Product Library (per-user) ──
export const productLibrary = pgTable("product_library", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull().default(""),
  unitDefault: text("unit_default"),
  notes: text("notes"),
  aliases: jsonb("aliases"),
  brandFamily: text("brand_family"),
  pricePerUnit: real("price_per_unit"),
  defaultRate: real("default_rate"),
});

// ── Program Templates ──
export const programTemplates = pgTable("program_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  cropTags: jsonb("crop_tags"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Program Template Lines ──
export const programTemplateLines = pgTable("program_template_lines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateId: varchar("template_id").notNull().references(() => programTemplates.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  materialId: text("material_id"),
  materialName: text("material_name").notNull(),
  rateValue: real("rate_value").notNull().default(0),
  rateUnit: text("rate_unit").notNull().default(""),
  passesPlanned: integer("passes_planned").notNull().default(1),
  monthHint: integer("month_hint"),
  productIds: jsonb("product_ids"),
});

// ── Block Projections ──
export const blockProjections = pgTable("block_projections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  blockId: varchar("block_id").notNull().references(() => blocks.id, { onDelete: "cascade" }),
  templateId: varchar("template_id").notNull().references(() => programTemplates.id, { onDelete: "cascade" }),
  overrides: jsonb("overrides"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Recommendations (PCA → Grower) ──
export const recommendations = pgTable("recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ranchId: varchar("ranch_id").notNull().references(() => ranches.id, { onDelete: "cascade" }),
  blockId: varchar("block_id").notNull().references(() => blocks.id, { onDelete: "cascade" }),
  createdBy: varchar("created_by").references(() => users.id),
  title: text("title").notNull(),
  status: text("status").notNull().default("DRAFT"),
  date: text("date").notNull(),
  notes: text("notes"),
  cropStage: text("crop_stage"),
  product: text("product"),
  targetPest: text("target_pest"),
  rate: real("rate"),
  rateUnit: text("rate_unit"),
  estimatedPricePerUnit: real("estimated_price_per_unit"),
  estimatedCostPerAcre: real("estimated_cost_per_acre"),
  estimatedTotalCost: real("estimated_total_cost"),
  alternatives: jsonb("alternatives"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Billing (per-user) ──
export const userBilling = pgTable("user_billing", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  planId: text("plan_id").notNull().default("STARTER"),
  isAnnual: boolean("is_annual").notNull().default(false),
  addOns: jsonb("add_ons").notNull().default({}),
  onboardingPurchased: boolean("onboarding_purchased").notNull().default(false),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Sessions (for auth) ──
export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Zod Schemas ──
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  name: true,
  org: true,
  role: true,
}).extend({
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const insertRanchSchema = createInsertSchema(ranches).pick({
  name: true,
  region: true,
});

export const insertBlockSchema = createInsertSchema(blocks).omit({
  id: true,
  createdAt: true,
});

export const insertFieldLogSchema = createInsertSchema(fieldLogs).omit({
  id: true,
  createdAt: true,
});

export const insertChemicalAppSchema = createInsertSchema(chemicalApps).omit({
  id: true,
  createdAt: true,
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
});

export const insertTemplateSchema = z.object({
  name: z.string().min(1),
  cropTags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  lines: z.array(z.object({
    type: z.string(),
    materialId: z.string().optional(),
    materialName: z.string(),
    rateValue: z.number(),
    rateUnit: z.string(),
    passesPlanned: z.number().int().min(1),
    monthHint: z.number().int().optional(),
    productIds: z.array(z.string()).optional(),
  })),
});

// ── Types ──
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Ranch = typeof ranches.$inferSelect;
export type Block = typeof blocks.$inferSelect;
export type FieldLog = typeof fieldLogs.$inferSelect;
export type ChemicalApp = typeof chemicalApps.$inferSelect;
export type Chemical = typeof chemicals.$inferSelect;
export type ProductLibraryItem = typeof productLibrary.$inferSelect;
export type ProgramTemplate = typeof programTemplates.$inferSelect;
export type ProgramTemplateLine = typeof programTemplateLines.$inferSelect;
export type BlockProjection = typeof blockProjections.$inferSelect;
export type Recommendation = typeof recommendations.$inferSelect;
export type UserBilling = typeof userBilling.$inferSelect;
export type Session = typeof sessions.$inferSelect;
