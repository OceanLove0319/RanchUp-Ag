import type { Express } from "express";
import type { Server } from "http";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import {
  users, ranches, blocks, fieldLogs, chemicalApps, chemicals,
  productLibrary, programTemplates, programTemplateLines, blockProjections,
  recommendations, userBilling, sessions,
  insertUserSchema, loginSchema, insertRanchSchema, insertBlockSchema,
  insertFieldLogSchema, insertChemicalAppSchema, insertRecommendationSchema,
  insertTemplateSchema,
} from "@shared/schema";
import {
  hashPassword, verifyPassword, generateToken, authMiddleware, requireRole,
} from "./auth";

/** Extract a single route param as string (Express types it as string | string[]). */
const p = (v: string | string[] | undefined): string => Array.isArray(v) ? v[0] : v ?? "";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {

  // ════════════════════════════════════════════
  // AUTH
  // ════════════════════════════════════════════

  app.post("/api/auth/register", async (req, res) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      }
      const { password, email, name, org, role } = parsed.data;

      // check duplicate
      const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existing) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const passwordHash = await hashPassword(password);
      const [user] = await db.insert(users).values({
        email, name, org, role, passwordHash,
      }).returning();

      // create default billing
      await db.insert(userBilling).values({ userId: user.id });

      const token = generateToken(user.id);
      const { passwordHash: _, ...safeUser } = user;
      return res.status(201).json({ user: safeUser, token });
    } catch (err: any) {
      console.error("Register error:", err);
      return res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      const { email, password } = parsed.data;

      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = generateToken(user.id);
      const { passwordHash: _, ...safeUser } = user;
      return res.json({ user: safeUser, token });
    } catch (err: any) {
      console.error("Login error:", err);
      return res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/auth/me", authMiddleware, async (req, res) => {
    const { passwordHash: _, ...safeUser } = req.user!;
    return res.json({ user: safeUser });
  });

  // ════════════════════════════════════════════
  // RANCHES
  // ════════════════════════════════════════════

  app.get("/api/ranches", authMiddleware, async (req, res) => {
    const result = await db.select().from(ranches)
      .where(eq(ranches.userId, req.userId!))
      .orderBy(desc(ranches.createdAt));
    return res.json(result);
  });

  app.post("/api/ranches", authMiddleware, async (req, res) => {
    const parsed = insertRanchSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }
    const [ranch] = await db.insert(ranches).values({
      ...parsed.data,
      userId: req.userId!,
    }).returning();
    return res.status(201).json(ranch);
  });

  app.put("/api/ranches/:id", authMiddleware, async (req, res) => {
    const ranchId = p(req.params.id);
    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, ranchId), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(404).json({ error: "Ranch not found" });

    const [updated] = await db.update(ranches)
      .set({ name: req.body.name, region: req.body.region })
      .where(eq(ranches.id, ranchId))
      .returning();
    return res.json(updated);
  });

  app.delete("/api/ranches/:id", authMiddleware, async (req, res) => {
    const ranchId = p(req.params.id);
    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, ranchId), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(404).json({ error: "Ranch not found" });

    await db.delete(ranches).where(eq(ranches.id, ranchId));
    return res.json({ success: true });
  });

  // ════════════════════════════════════════════
  // BLOCKS
  // ════════════════════════════════════════════

  app.get("/api/ranches/:ranchId/blocks", authMiddleware, async (req, res) => {
    // verify ranch ownership
    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, p(req.params.ranchId)), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(404).json({ error: "Ranch not found" });

    const result = await db.select().from(blocks)
      .where(eq(blocks.ranchId, p(req.params.ranchId)))
      .orderBy(blocks.name);
    return res.json(result);
  });

  app.post("/api/ranches/:ranchId/blocks", authMiddleware, async (req, res) => {
    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, p(req.params.ranchId)), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(404).json({ error: "Ranch not found" });

    const parsed = insertBlockSchema.safeParse({ ...req.body, ranchId: p(req.params.ranchId) });
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }
    const [block] = await db.insert(blocks).values(parsed.data).returning();
    return res.status(201).json(block);
  });

  app.put("/api/blocks/:id", authMiddleware, async (req, res) => {
    const [block] = await db.select().from(blocks).where(eq(blocks.id, p(req.params.id))).limit(1);
    if (!block) return res.status(404).json({ error: "Block not found" });

    // verify ownership through ranch
    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, block.ranchId), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(403).json({ error: "Not your block" });

    const { id, createdAt, ...updateData } = req.body;
    const [updated] = await db.update(blocks)
      .set(updateData)
      .where(eq(blocks.id, p(req.params.id)))
      .returning();
    return res.json(updated);
  });

  app.delete("/api/blocks/:id", authMiddleware, async (req, res) => {
    const [block] = await db.select().from(blocks).where(eq(blocks.id, p(req.params.id))).limit(1);
    if (!block) return res.status(404).json({ error: "Block not found" });

    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, block.ranchId), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(403).json({ error: "Not your block" });

    await db.delete(blocks).where(eq(blocks.id, p(req.params.id)));
    return res.json({ success: true });
  });

  // ════════════════════════════════════════════
  // FIELD LOGS
  // ════════════════════════════════════════════

  app.get("/api/ranches/:ranchId/field-logs", authMiddleware, async (req, res) => {
    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, p(req.params.ranchId)), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(404).json({ error: "Ranch not found" });

    const result = await db.select().from(fieldLogs)
      .where(eq(fieldLogs.ranchId, p(req.params.ranchId)))
      .orderBy(desc(fieldLogs.createdAt));
    return res.json(result);
  });

  app.post("/api/ranches/:ranchId/field-logs", authMiddleware, async (req, res) => {
    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, p(req.params.ranchId)), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(404).json({ error: "Ranch not found" });

    const parsed = insertFieldLogSchema.safeParse({ ...req.body, ranchId: p(req.params.ranchId) });
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }
    const [log] = await db.insert(fieldLogs).values(parsed.data).returning();
    return res.status(201).json(log);
  });

  app.delete("/api/field-logs/:id", authMiddleware, async (req, res) => {
    const [log] = await db.select().from(fieldLogs).where(eq(fieldLogs.id, p(req.params.id))).limit(1);
    if (!log) return res.status(404).json({ error: "Field log not found" });

    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, log.ranchId), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(403).json({ error: "Not your log" });

    await db.delete(fieldLogs).where(eq(fieldLogs.id, p(req.params.id)));
    return res.json({ success: true });
  });

  // ════════════════════════════════════════════
  // CHEMICAL APPLICATIONS
  // ════════════════════════════════════════════

  app.get("/api/ranches/:ranchId/chemical-apps", authMiddleware, async (req, res) => {
    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, p(req.params.ranchId)), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(404).json({ error: "Ranch not found" });

    const result = await db.select().from(chemicalApps)
      .where(eq(chemicalApps.ranchId, p(req.params.ranchId)))
      .orderBy(desc(chemicalApps.createdAt));
    return res.json(result);
  });

  app.post("/api/ranches/:ranchId/chemical-apps", authMiddleware, async (req, res) => {
    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, p(req.params.ranchId)), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(404).json({ error: "Ranch not found" });

    const parsed = insertChemicalAppSchema.safeParse({ ...req.body, ranchId: p(req.params.ranchId) });
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }
    const [app_] = await db.insert(chemicalApps).values(parsed.data).returning();
    return res.status(201).json(app_);
  });

  app.delete("/api/chemical-apps/:id", authMiddleware, async (req, res) => {
    const [ca] = await db.select().from(chemicalApps).where(eq(chemicalApps.id, p(req.params.id))).limit(1);
    if (!ca) return res.status(404).json({ error: "Chemical app not found" });

    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, ca.ranchId), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(403).json({ error: "Not yours" });

    await db.delete(chemicalApps).where(eq(chemicalApps.id, p(req.params.id)));
    return res.json({ success: true });
  });

  // ════════════════════════════════════════════
  // CHEMICALS LIBRARY (shared, read-only for non-admin)
  // ════════════════════════════════════════════

  app.get("/api/chemicals", authMiddleware, async (_req, res) => {
    const result = await db.select().from(chemicals);
    return res.json(result);
  });

  app.post("/api/chemicals", authMiddleware, requireRole("ADMIN"), async (req, res) => {
    const [chem] = await db.insert(chemicals).values(req.body).returning();
    return res.status(201).json(chem);
  });

  // ════════════════════════════════════════════
  // PRODUCT LIBRARY (per-user)
  // ════════════════════════════════════════════

  app.get("/api/product-library", authMiddleware, async (req, res) => {
    const result = await db.select().from(productLibrary)
      .where(eq(productLibrary.userId, req.userId!));
    return res.json(result);
  });

  app.post("/api/product-library", authMiddleware, async (req, res) => {
    const [item] = await db.insert(productLibrary).values({
      ...req.body,
      userId: req.userId!,
    }).returning();
    return res.status(201).json(item);
  });

  app.put("/api/product-library/:id", authMiddleware, async (req, res) => {
    const [item] = await db.select().from(productLibrary)
      .where(and(eq(productLibrary.id, p(req.params.id)), eq(productLibrary.userId, req.userId!)))
      .limit(1);
    if (!item) return res.status(404).json({ error: "Product not found" });

    const { id, ...updateData } = req.body;
    const [updated] = await db.update(productLibrary)
      .set(updateData)
      .where(eq(productLibrary.id, p(req.params.id)))
      .returning();
    return res.json(updated);
  });

  app.delete("/api/product-library/:id", authMiddleware, async (req, res) => {
    const [item] = await db.select().from(productLibrary)
      .where(and(eq(productLibrary.id, p(req.params.id)), eq(productLibrary.userId, req.userId!)))
      .limit(1);
    if (!item) return res.status(404).json({ error: "Product not found" });

    await db.delete(productLibrary).where(eq(productLibrary.id, p(req.params.id)));
    return res.json({ success: true });
  });

  // ════════════════════════════════════════════
  // PROGRAM TEMPLATES
  // ════════════════════════════════════════════

  app.get("/api/templates", authMiddleware, async (req, res) => {
    const templates = await db.select().from(programTemplates)
      .where(eq(programTemplates.userId, req.userId!))
      .orderBy(desc(programTemplates.createdAt));

    // attach lines for each template
    const result = await Promise.all(templates.map(async (t) => {
      const lines = await db.select().from(programTemplateLines)
        .where(eq(programTemplateLines.templateId, t.id));
      return { ...t, lines };
    }));
    return res.json(result);
  });

  app.post("/api/templates", authMiddleware, async (req, res) => {
    const parsed = insertTemplateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }
    const { lines, ...templateData } = parsed.data;

    const [template] = await db.insert(programTemplates).values({
      ...templateData,
      userId: req.userId!,
    }).returning();

    const insertedLines = await Promise.all(lines.map(async (line) => {
      const [inserted] = await db.insert(programTemplateLines).values({
        ...line,
        templateId: template.id,
      }).returning();
      return inserted;
    }));

    return res.status(201).json({ ...template, lines: insertedLines });
  });

  app.delete("/api/templates/:id", authMiddleware, async (req, res) => {
    const [template] = await db.select().from(programTemplates)
      .where(and(eq(programTemplates.id, p(req.params.id)), eq(programTemplates.userId, req.userId!)))
      .limit(1);
    if (!template) return res.status(404).json({ error: "Template not found" });

    // cascade deletes lines
    await db.delete(programTemplates).where(eq(programTemplates.id, p(req.params.id)));
    return res.json({ success: true });
  });

  // ════════════════════════════════════════════
  // BLOCK PROJECTIONS
  // ════════════════════════════════════════════

  app.get("/api/blocks/:blockId/projections", authMiddleware, async (req, res) => {
    const result = await db.select().from(blockProjections)
      .where(eq(blockProjections.blockId, p(req.params.blockId)));
    return res.json(result);
  });

  app.post("/api/blocks/:blockId/projections", authMiddleware, async (req, res) => {
    const [proj] = await db.insert(blockProjections).values({
      blockId: p(req.params.blockId),
      templateId: req.body.templateId,
      overrides: req.body.overrides,
    }).returning();
    return res.status(201).json(proj);
  });

  app.delete("/api/projections/:id", authMiddleware, async (req, res) => {
    await db.delete(blockProjections).where(eq(blockProjections.id, p(req.params.id)));
    return res.json({ success: true });
  });

  // ════════════════════════════════════════════
  // RECOMMENDATIONS (PCA → Grower)
  // ════════════════════════════════════════════

  app.get("/api/ranches/:ranchId/recommendations", authMiddleware, async (req, res) => {
    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, p(req.params.ranchId)), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(404).json({ error: "Ranch not found" });

    const result = await db.select().from(recommendations)
      .where(eq(recommendations.ranchId, p(req.params.ranchId)))
      .orderBy(desc(recommendations.createdAt));
    return res.json(result);
  });

  app.post("/api/ranches/:ranchId/recommendations", authMiddleware, async (req, res) => {
    const parsed = insertRecommendationSchema.safeParse({
      ...req.body,
      ranchId: p(req.params.ranchId),
      createdBy: req.userId!,
    });
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }
    const [rec] = await db.insert(recommendations).values(parsed.data).returning();
    return res.status(201).json(rec);
  });

  app.put("/api/recommendations/:id", authMiddleware, async (req, res) => {
    const { id, createdAt, ...updateData } = req.body;
    const [updated] = await db.update(recommendations)
      .set(updateData)
      .where(eq(recommendations.id, p(req.params.id)))
      .returning();
    if (!updated) return res.status(404).json({ error: "Recommendation not found" });
    return res.json(updated);
  });

  app.delete("/api/recommendations/:id", authMiddleware, async (req, res) => {
    await db.delete(recommendations).where(eq(recommendations.id, p(req.params.id)));
    return res.json({ success: true });
  });

  // ════════════════════════════════════════════
  // USER BILLING
  // ════════════════════════════════════════════

  app.get("/api/billing", authMiddleware, async (req, res) => {
    const [billing] = await db.select().from(userBilling)
      .where(eq(userBilling.userId, req.userId!))
      .limit(1);
    if (!billing) {
      // create default
      const [created] = await db.insert(userBilling).values({ userId: req.userId! }).returning();
      return res.json(created);
    }
    return res.json(billing);
  });

  app.put("/api/billing", authMiddleware, async (req, res) => {
    const { planId, isAnnual, addOns, onboardingPurchased } = req.body;
    const [updated] = await db.update(userBilling)
      .set({ planId, isAnnual, addOns, onboardingPurchased })
      .where(eq(userBilling.userId, req.userId!))
      .returning();
    return res.json(updated);
  });

  // ════════════════════════════════════════════
  // USER PROFILE
  // ════════════════════════════════════════════

  app.put("/api/user/profile", authMiddleware, async (req, res) => {
    const { name, org, onboarded } = req.body;
    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (org !== undefined) updates.org = org;
    if (onboarded !== undefined) updates.onboarded = onboarded;

    const [updated] = await db.update(users)
      .set(updates)
      .where(eq(users.id, req.userId!))
      .returning();
    const { passwordHash: _, ...safeUser } = updated;
    return res.json(safeUser);
  });

  // ════════════════════════════════════════════
  // ADMIN
  // ════════════════════════════════════════════

  app.get("/api/admin/users", authMiddleware, requireRole("ADMIN"), async (_req, res) => {
    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      org: users.org,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
    }).from(users);
    return res.json(allUsers);
  });

  app.put("/api/admin/users/:id/role", authMiddleware, requireRole("ADMIN"), async (req, res) => {
    const { role } = req.body;
    const [updated] = await db.update(users)
      .set({ role })
      .where(eq(users.id, p(req.params.id)))
      .returning();
    return res.json(updated);
  });

  // ════════════════════════════════════════════
  // HEALTH CHECK
  // ════════════════════════════════════════════

  app.get("/api/health", async (_req, res) => {
    try {
      await db.select().from(users).limit(1);
      return res.json({ status: "ok", db: "connected" });
    } catch (err: any) {
      return res.status(500).json({ status: "error", db: err.message });
    }
  });

  // ════════════════════════════════════════════
  // DEMO SEED
  // ════════════════════════════════════════════

  app.post("/api/seed/demo", async (_req, res) => {
    try {
      const { format, subDays } = await import("date-fns");
      const today = new Date();
      const fmtDate = (daysAgo: number) => format(subDays(today, daysAgo), "yyyy-MM-dd");

      // ── Helper: upsert user (skip if exists) ──
      const ensureUser = async (email: string, name: string, org: string, role: "GROWER" | "PCA", password: string) => {
        const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existing) return existing;
        const passwordHash = await hashPassword(password);
        const [user] = await db.insert(users).values({ email, name, org, role, passwordHash, onboarded: true }).returning();
        await db.insert(userBilling).values({ userId: user.id });
        return user;
      };

      // ── 1. Create Demo Users ──
      const grower = await ensureUser("grower@ranchup.ag", "Ryan Neufeld", "Neufeld Farms", "GROWER", "RanchUp2026");
      const pca = await ensureUser("pca@ranchup.ag", "Karl W.", "Simplot Grower Solutions", "PCA", "RanchUp2026");

      // ── 2. Grower: Ryan Neufeld — ranches, blocks, logs, apps, templates ──
      // Check if grower already has data
      const growerRanches = await db.select().from(ranches).where(eq(ranches.userId, grower.id));
      if (growerRanches.length === 0) {
        // Ranches
        const [traver] = await db.insert(ranches).values({ userId: grower.id, name: "Traver Ranch", region: "Central Valley" }).returning();
        const [dinuba] = await db.insert(ranches).values({ userId: grower.id, name: "Dinuba Home", region: "Central Valley" }).returning();

        // Blocks
        const growerBlockDefs = [
          { ranchId: traver.id, name: "Early Peach Block", acreage: 22.5, variety: "Spring Snow Peach", seasonGroup: "Early", irrigationType: "Micro", yieldTargetBins: 32, waterTargetAcreFeet: 3.2 },
          { ranchId: traver.id, name: "Late Peach Block", acreage: 35, variety: "O'Henry Peach", seasonGroup: "Late", irrigationType: "Drip", yieldTargetBins: 38, waterTargetAcreFeet: 3.5 },
          { ranchId: traver.id, name: "Nectarine Block", acreage: 18, variety: "Summer Fire Nectarine", seasonGroup: "Mid", irrigationType: "Micro", yieldTargetBins: 28, waterTargetAcreFeet: 3.2 },
          { ranchId: dinuba.id, name: "Black Plum Block", acreage: 28, variety: "Black Splendor Plum", seasonGroup: "Mid", irrigationType: "Drip", yieldTargetBins: 25, waterTargetAcreFeet: 3.0 },
          { ranchId: dinuba.id, name: "Apricot Trial", acreage: 10, variety: "Patterson Apricot", seasonGroup: "Early", irrigationType: "Drip", yieldTargetBins: 20, waterTargetAcreFeet: 2.8 },
        ];
        const growerBlocks = await db.insert(blocks).values(growerBlockDefs).returning();

        // Templates
        const templateDefs = [
          { userId: grower.id, name: "Bloom Fungicide Pass", cropTags: ["Stone Fruit"], lines: [
            { type: "SPRAY", materialName: "Rovral 4 Flowable", rateValue: 1, rateUnit: "pt/ac", passesPlanned: 1, monthHint: 2 },
            { type: "SPRAY", materialName: "Vangard WG", rateValue: 5, rateUnit: "oz/ac", passesPlanned: 1, monthHint: 2 },
          ]},
          { userId: grower.id, name: "Shuck Split Protection", cropTags: ["Stone Fruit"], lines: [
            { type: "SPRAY", materialName: "Pristine", rateValue: 10.5, rateUnit: "oz/ac", passesPlanned: 1, monthHint: 3 },
            { type: "SPRAY", materialName: "Altacor", rateValue: 12, rateUnit: "oz/ac", passesPlanned: 1, monthHint: 3 },
          ]},
          { userId: grower.id, name: "Spring N Push", cropTags: ["Stone Fruit"], lines: [
            { type: "FERT", materialName: "CAN-17", rateValue: 15, rateUnit: "gal/ac", passesPlanned: 2, monthHint: 4 },
          ]},
          { userId: grower.id, name: "Summer Mite Program", cropTags: ["Stone Fruit"], lines: [
            { type: "SPRAY", materialName: "Acramite 50WS", rateValue: 0.75, rateUnit: "lb/ac", passesPlanned: 1, monthHint: 6 },
            { type: "SPRAY", materialName: "Agri-Mek SC", rateValue: 2.25, rateUnit: "fl oz/ac", passesPlanned: 1, monthHint: 6 },
          ]},
          { userId: grower.id, name: "Post-Harvest Rebuild", cropTags: ["Stone Fruit"], lines: [
            { type: "FERT", materialName: "Zinc Sulfate", rateValue: 10, rateUnit: "lb/ac", passesPlanned: 1, monthHint: 9 },
            { type: "FERT", materialName: "Solubor", rateValue: 5, rateUnit: "lb/ac", passesPlanned: 1, monthHint: 9 },
          ]},
        ];

        for (const tpl of templateDefs) {
          const { lines, ...tplData } = tpl;
          const [template] = await db.insert(programTemplates).values(tplData).returning();
          if (lines.length > 0) {
            await db.insert(programTemplateLines).values(
              lines.map(l => ({ ...l, templateId: template.id }))
            );
          }
        }

        // Field logs & chemical apps for each block
        for (const blk of growerBlocks) {
          // Two months ago: Bloom fungicide
          await db.insert(fieldLogs).values({ ranchId: blk.ranchId, blockId: blk.id, date: fmtDate(60), actionType: "SPRAY", material: "Rovral 4 Flowable", amount: 1, unit: "pt/ac", cost: 35 });
          await db.insert(chemicalApps).values({ ranchId: blk.ranchId, blockId: blk.id, chemicalName: "Iprodione (Rovral)", category: "FUNGICIDE", dateApplied: fmtDate(60), method: "SPRAY", estimatedCost: 35 * blk.acreage, costStatus: "ESTIMATED" });

          await db.insert(fieldLogs).values({ ranchId: blk.ranchId, blockId: blk.id, date: fmtDate(60), actionType: "SPRAY", material: "Vangard WG", amount: 5, unit: "oz/ac", cost: 15 });
          await db.insert(chemicalApps).values({ ranchId: blk.ranchId, blockId: blk.id, chemicalName: "Cyprodinil (Vangard)", category: "FUNGICIDE", dateApplied: fmtDate(60), method: "SPRAY", estimatedCost: 75 * blk.acreage, costStatus: "ESTIMATED" });

          // Last month: Shuck split + spring N
          await db.insert(fieldLogs).values({ ranchId: blk.ranchId, blockId: blk.id, date: fmtDate(30), actionType: "SPRAY", material: "Pristine", amount: 10.5, unit: "oz/ac", cost: 42 });
          await db.insert(chemicalApps).values({ ranchId: blk.ranchId, blockId: blk.id, chemicalName: "Boscalid + Pyraclostrobin (Pristine)", category: "FUNGICIDE", dateApplied: fmtDate(30), method: "SPRAY", estimatedCost: 441 * blk.acreage, costStatus: "ESTIMATED" });

          await db.insert(fieldLogs).values({ ranchId: blk.ranchId, blockId: blk.id, date: fmtDate(30), actionType: "FERT", material: "CAN-17", amount: 15, unit: "gal/ac", cost: 2.5 });
          await db.insert(chemicalApps).values({ ranchId: blk.ranchId, blockId: blk.id, chemicalName: "CAN-17 (calcium ammonium nitrate)", category: "NUTRITION", dateApplied: fmtDate(30), method: "FERT", estimatedCost: 37.5 * blk.acreage, costStatus: "ESTIMATED" });

          // Last week: Irrigation
          await db.insert(fieldLogs).values({ ranchId: blk.ranchId, blockId: blk.id, date: fmtDate(7), actionType: "IRRIGATE", material: "Water", amount: 24, unit: "hrs", cost: 150 });

          // Yesterday: Summer mite prep
          await db.insert(fieldLogs).values({ ranchId: blk.ranchId, blockId: blk.id, date: fmtDate(1), actionType: "SPRAY", material: "Acramite 50WS", amount: 0.75, unit: "lb/ac", cost: 65 });
          await db.insert(chemicalApps).values({ ranchId: blk.ranchId, blockId: blk.id, chemicalName: "Bifenazate (Acramite)", category: "INSECTICIDE_MITICIDE", dateApplied: fmtDate(1), method: "SPRAY", estimatedCost: 48.75 * blk.acreage, costStatus: "ESTIMATED" });

          // Today: Irrigation
          await db.insert(fieldLogs).values({ ranchId: blk.ranchId, blockId: blk.id, date: fmtDate(0), actionType: "IRRIGATE", material: "Water", amount: 12, unit: "hrs" });
        }

        // Update grower billing to PRO annual w/ cost engine
        await db.update(userBilling).set({ planId: "PRO", isAnnual: true, addOns: { COST_ENGINE: true }, onboardingPurchased: true }).where(eq(userBilling.userId, grower.id));
      }

      // ── 3. PCA: Karl W. — 4 ranches, 18 blocks, logs, apps, recs ──
      const pcaRanches = await db.select().from(ranches).where(eq(ranches.userId, pca.id));
      if (pcaRanches.length === 0) {
        // Ranches
        const [neufeld] = await db.insert(ranches).values({ userId: pca.id, name: "Neufeld Farms", region: "Traver" }).returning();
        const [jackson] = await db.insert(ranches).values({ userId: pca.id, name: "Jackson Family Orchards", region: "Kingsburg" }).returning();
        const [valley] = await db.insert(ranches).values({ userId: pca.id, name: "Valley Crest Nut Co.", region: "Tulare" }).returning();
        const [reedley] = await db.insert(ranches).values({ userId: pca.id, name: "Reedley Ridge Farms", region: "Reedley" }).returning();

        // Blocks
        const pcaBlockDefs = [
          // Neufeld
          { ranchId: neufeld.id, name: "East Ranch - Spring Flame", acreage: 20, variety: "Spring Flame Peach", seasonGroup: "Early", irrigationType: "Fanjet", yieldTargetBins: 30, waterTargetAcreFeet: 3.5 },
          { ranchId: neufeld.id, name: "East Ranch - O'Henry", acreage: 25, variety: "O'Henry Peach", seasonGroup: "Late", irrigationType: "Fanjet", yieldTargetBins: 35, waterTargetAcreFeet: 3.5 },
          { ranchId: neufeld.id, name: "Canal Ranch - Autumn Bright", acreage: 15, variety: "Autumn Bright Nectarine", seasonGroup: "Late", irrigationType: "Drip", yieldTargetBins: 25, waterTargetAcreFeet: 3.0 },
          { ranchId: neufeld.id, name: "Canal Ranch - Honey Blaze", acreage: 18, variety: "Honey Blaze Nectarine", seasonGroup: "Mid", irrigationType: "Drip", yieldTargetBins: 28, waterTargetAcreFeet: 3.0 },
          { ranchId: neufeld.id, name: "Canal Ranch - Summer Sweet", acreage: 22, variety: "Summer Sweet Peach", seasonGroup: "Mid", irrigationType: "Drip", yieldTargetBins: 32, waterTargetAcreFeet: 3.2 },
          // Jackson
          { ranchId: jackson.id, name: "River Ranch - Tango", acreage: 40, variety: "Tango Mandarin", seasonGroup: "Mid", irrigationType: "Double-line Drip", yieldTargetBins: 25, waterTargetAcreFeet: 2.5 },
          { ranchId: jackson.id, name: "River Ranch - Powell", acreage: 35, variety: "Powell Navel", seasonGroup: "Late", irrigationType: "Microsprinkler", yieldTargetBins: 30, waterTargetAcreFeet: 3.0 },
          { ranchId: jackson.id, name: "Home Place - Cara Cara", acreage: 22, variety: "Cara Cara Navel", seasonGroup: "Mid", irrigationType: "Microsprinkler", yieldTargetBins: 28, waterTargetAcreFeet: 3.0 },
          { ranchId: jackson.id, name: "Home Place - Washington", acreage: 18, variety: "Washington Navel", seasonGroup: "Mid", irrigationType: "Microsprinkler", yieldTargetBins: 25, waterTargetAcreFeet: 3.0 },
          // Valley Crest
          { ranchId: valley.id, name: "South Block - Nonpareil", acreage: 60, variety: "Nonpareil Almond", seasonGroup: "Mid", irrigationType: "Drip + Minis", yieldTargetBins: 3000, waterTargetAcreFeet: 4.0 },
          { ranchId: valley.id, name: "South Block - Monterey", acreage: 60, variety: "Monterey Almond", seasonGroup: "Late", irrigationType: "Drip + Minis", yieldTargetBins: 2800, waterTargetAcreFeet: 4.0 },
          { ranchId: valley.id, name: "Turner Ranch - Kerman", acreage: 80, variety: "Kerman Pistachio", seasonGroup: "Late", irrigationType: "Double-line Drip", yieldTargetBins: 3500, waterTargetAcreFeet: 3.8 },
          { ranchId: valley.id, name: "Turner Ranch - Golden Hills", acreage: 40, variety: "Golden Hills Pistachio", seasonGroup: "Late", irrigationType: "Double-line Drip", yieldTargetBins: 3200, waterTargetAcreFeet: 3.8 },
          // Reedley
          { ranchId: reedley.id, name: "Ridge Ranch - Nonpareil", acreage: 45, variety: "Nonpareil Almond", seasonGroup: "Mid", irrigationType: "Fanjet", yieldTargetBins: 2900, waterTargetAcreFeet: 4.0 },
          { ranchId: reedley.id, name: "Schoolhouse - Zee Lady", acreage: 20, variety: "Zee Lady Peach", seasonGroup: "Mid", irrigationType: "Fanjet", yieldTargetBins: 32, waterTargetAcreFeet: 3.5 },
          { ranchId: reedley.id, name: "Schoolhouse - O'Henry", acreage: 25, variety: "O'Henry Peach", seasonGroup: "Late", irrigationType: "Fanjet", yieldTargetBins: 34, waterTargetAcreFeet: 3.5 },
        ];
        const pcaBlocks = await db.insert(blocks).values(pcaBlockDefs).returning();

        // Map block names → IDs for logs/apps/recs
        const blkMap: Record<string, typeof pcaBlocks[0]> = {};
        for (const b of pcaBlocks) blkMap[b.name] = b;

        // Field logs
        const pcaLogDefs = [
          { ranchId: neufeld.id, blockId: blkMap["East Ranch - Spring Flame"].id, date: fmtDate(45), actionType: "SPRAY" as const, material: "Pristine", amount: 1, unit: "lb/ac", notes: "Bloom fungicide pass" },
          { ranchId: neufeld.id, blockId: blkMap["East Ranch - O'Henry"].id, date: fmtDate(30), actionType: "SPRAY" as const, material: "Rovral", amount: 2, unit: "pt/ac", notes: "Petal fall spray" },
          { ranchId: neufeld.id, blockId: blkMap["Canal Ranch - Autumn Bright"].id, date: fmtDate(15), actionType: "FERT" as const, material: "UN-32", amount: 10, unit: "gal/ac", notes: "Spring push" },
          { ranchId: neufeld.id, blockId: blkMap["East Ranch - Spring Flame"].id, date: fmtDate(5), actionType: "LABOR" as const, material: "Thinning", amount: 1, unit: "pass", notes: "" },
          { ranchId: jackson.id, blockId: blkMap["River Ranch - Tango"].id, date: fmtDate(60), actionType: "IRRIGATE" as const, material: "Water", amount: 12, unit: "hrs", notes: "Frost-protection irrigation" },
          { ranchId: jackson.id, blockId: blkMap["River Ranch - Powell"].id, date: fmtDate(40), actionType: "FERT" as const, material: "Calcium Nitrate", amount: 25, unit: "lb/ac", notes: "Fertigation event" },
          { ranchId: jackson.id, blockId: blkMap["River Ranch - Tango"].id, date: fmtDate(20), actionType: "IRRIGATE" as const, material: "Water", amount: 24, unit: "hrs", notes: "Heavy set week adjustment" },
          { ranchId: jackson.id, blockId: blkMap["Home Place - Cara Cara"].id, date: fmtDate(10), actionType: "SPRAY" as const, material: "Success", amount: 6, unit: "oz/ac", notes: "Citrus thrips control" },
          { ranchId: valley.id, blockId: blkMap["South Block - Nonpareil"].id, date: fmtDate(50), actionType: "SPRAY" as const, material: "Merivon", amount: 6.5, unit: "oz/ac", notes: "Dormant spray" },
          { ranchId: valley.id, blockId: blkMap["South Block - Monterey"].id, date: fmtDate(35), actionType: "FERT" as const, material: "Solution-grade Gypsum", amount: 100, unit: "lb/ac", notes: "Gypsum injection" },
          { ranchId: valley.id, blockId: blkMap["Turner Ranch - Kerman"].id, date: fmtDate(15), actionType: "SPRAY" as const, material: "Intrepid 2F", amount: 16, unit: "oz/ac", notes: "Insect control" },
          { ranchId: reedley.id, blockId: blkMap["Ridge Ranch - Nonpareil"].id, date: fmtDate(25), actionType: "SPRAY" as const, material: "Abamectin", amount: 0, unit: "", notes: "Miticide pass - NEED RATE" },
          { ranchId: reedley.id, blockId: blkMap["Schoolhouse - Zee Lady"].id, date: fmtDate(12), actionType: "FERT" as const, material: "Foliar Zinc", amount: 5, unit: "lb/ac", notes: "Foliar zinc pass" },
          { ranchId: reedley.id, blockId: blkMap["Schoolhouse - O'Henry"].id, date: fmtDate(2), actionType: "IRRIGATE" as const, material: "Water", amount: 12, unit: "hrs", notes: "Microsprinkler repair line 4" },
        ];
        await db.insert(fieldLogs).values(pcaLogDefs);

        // Chemical apps
        const pcaAppDefs = [
          { ranchId: neufeld.id, blockId: blkMap["East Ranch - Spring Flame"].id, chemicalName: "Pristine", category: "FUNGICIDE", dateApplied: fmtDate(45), method: "SPRAY", estimatedCost: 1850, costStatus: "ESTIMATED" },
          { ranchId: neufeld.id, blockId: blkMap["East Ranch - Spring Flame"].id, chemicalName: "Merivon", category: "FUNGICIDE", dateApplied: fmtDate(30), method: "SPRAY", estimatedCost: 2100, costStatus: "ESTIMATED" },
          { ranchId: neufeld.id, blockId: blkMap["East Ranch - Spring Flame"].id, chemicalName: "Luna Sensation", category: "FUNGICIDE", dateApplied: fmtDate(15), method: "SPRAY", estimatedCost: 1950, costStatus: "ESTIMATED" },
          { ranchId: neufeld.id, blockId: blkMap["East Ranch - O'Henry"].id, chemicalName: "Rovral", category: "FUNGICIDE", dateApplied: fmtDate(30), method: "SPRAY", estimatedCost: 900, costStatus: "ESTIMATED" },
          { ranchId: neufeld.id, blockId: blkMap["Canal Ranch - Autumn Bright"].id, chemicalName: "UN-32", category: "NUTRITION", dateApplied: fmtDate(15), method: "FERT", estimatedCost: 600, costStatus: "ESTIMATED" },
          { ranchId: jackson.id, blockId: blkMap["River Ranch - Powell"].id, chemicalName: "Calcium Nitrate", category: "NUTRITION", dateApplied: fmtDate(40), method: "FERT", estimatedCost: 850, costStatus: "ESTIMATED" },
          { ranchId: jackson.id, blockId: blkMap["Home Place - Cara Cara"].id, chemicalName: "Success", category: "INSECTICIDE_MITICIDE", dateApplied: fmtDate(10), method: "SPRAY", estimatedCost: 1200, costStatus: "ESTIMATED" },
          { ranchId: valley.id, blockId: blkMap["South Block - Nonpareil"].id, chemicalName: "Merivon", category: "FUNGICIDE", dateApplied: fmtDate(50), method: "SPRAY", estimatedCost: 1500, costStatus: "ESTIMATED" },
          { ranchId: valley.id, blockId: blkMap["South Block - Monterey"].id, chemicalName: "Solution-grade Gypsum", category: "AMENDMENT", dateApplied: fmtDate(35), method: "FERT", estimatedCost: 750, costStatus: "ESTIMATED" },
          { ranchId: valley.id, blockId: blkMap["Turner Ranch - Kerman"].id, chemicalName: "Intrepid 2F", category: "INSECTICIDE_MITICIDE", dateApplied: fmtDate(15), method: "SPRAY", estimatedCost: 2200, costStatus: "ESTIMATED" },
          { ranchId: reedley.id, blockId: blkMap["Ridge Ranch - Nonpareil"].id, chemicalName: "Abamectin", category: "INSECTICIDE_MITICIDE", dateApplied: fmtDate(25), method: "SPRAY", costStatus: "UNIT_MISMATCH" },
          { ranchId: reedley.id, blockId: blkMap["Schoolhouse - Zee Lady"].id, chemicalName: "Foliar Zinc", category: "NUTRITION", dateApplied: fmtDate(12), method: "SPRAY", estimatedCost: 400, costStatus: "ESTIMATED" },
        ];
        await db.insert(chemicalApps).values(pcaAppDefs);

        // Recommendations
        const pcaRecDefs = [
          { ranchId: neufeld.id, blockId: blkMap["East Ranch - O'Henry"].id, createdBy: pca.id, title: "Bloom protection", status: "ACKNOWLEDGED", date: fmtDate(5), notes: "Grower asked whether second zinc pass is necessary.", cropStage: "Bloom", product: "Pristine", rate: 14.5, rateUnit: "oz/ac", estimatedPricePerUnit: 2.15, estimatedCostPerAcre: 31.18, estimatedTotalCost: 779.5, alternatives: [{ productName: "Merivon", estimatedPricePerUnit: 6.20, estimatedCostPerAcre: 40.30, note: "Higher cost but longer residual if rain is expected." }] },
          { ranchId: valley.id, blockId: blkMap["South Block - Nonpareil"].id, createdBy: pca.id, title: "Hull split fungicide + insect", status: "PENDING", date: fmtDate(2), notes: "Waiting on confirmation before hull split pass.", cropStage: "Hull Split", product: "Merivon + Intrepid", rate: 6.5, rateUnit: "fl oz/ac", estimatedPricePerUnit: 6.20, estimatedCostPerAcre: 40.30, estimatedTotalCost: 2418 },
          { ranchId: jackson.id, blockId: blkMap["River Ranch - Powell"].id, createdBy: pca.id, title: "Scale pressure monitoring", status: "DRAFT", date: fmtDate(0), notes: "Need updated observation after rain event.", cropStage: "Fruit Development", product: "Movento", rate: 10, rateUnit: "fl oz/ac", estimatedPricePerUnit: 3.45, estimatedCostPerAcre: 34.50, estimatedTotalCost: 1207.5 },
          { ranchId: valley.id, blockId: blkMap["South Block - Monterey"].id, createdBy: pca.id, title: "Mite threshold watch", status: "SENT", date: fmtDate(1), notes: "Watch threshold carefully this week.", cropStage: "Nut Fill", product: "Acramite", rate: 1.0, rateUnit: "lb/ac", estimatedPricePerUnit: 45, estimatedCostPerAcre: 45, estimatedTotalCost: 2700, alternatives: [{ productName: "FujiMite", estimatedPricePerUnit: 48.50, estimatedCostPerAcre: 48.50, note: "Faster knockdown if pressure spikes." }, { productName: "Generic Bifen", estimatedPricePerUnit: 12, estimatedCostPerAcre: 12, note: "Lower-cost option, risk of flaring other pests." }] },
          { ranchId: reedley.id, blockId: blkMap["Schoolhouse - O'Henry"].id, createdBy: pca.id, title: "Post-rain disease prevention", status: "PENDING", date: fmtDate(3), notes: "Apply within 48h of next rain.", cropStage: "Pre-harvest", product: "Luna Sensation", rate: 5.0, rateUnit: "fl oz/ac", estimatedPricePerUnit: 7.80, estimatedCostPerAcre: 39, estimatedTotalCost: 975 },
          { ranchId: neufeld.id, blockId: blkMap["East Ranch - Spring Flame"].id, createdBy: pca.id, title: "Dormant weed control", status: "APPLIED", date: fmtDate(10), notes: "Applied before rain.", cropStage: "Dormant", product: "Gramoxone", rate: 2.0, rateUnit: "pt/ac", estimatedPricePerUnit: 5.50, estimatedCostPerAcre: 11, estimatedTotalCost: 220 },
          { ranchId: neufeld.id, blockId: blkMap["East Ranch - Spring Flame"].id, createdBy: pca.id, title: "Bloom protection", status: "CLOSED", date: fmtDate(48), notes: "Bloom spray completed.", cropStage: "Bloom", product: "Pristine", rate: 1.0, rateUnit: "lb/ac", estimatedPricePerUnit: 25, estimatedCostPerAcre: 25, estimatedTotalCost: 500 },
        ];
        await db.insert(recommendations).values(pcaRecDefs);

        // Update PCA billing
        await db.update(userBilling).set({ planId: "OPS", isAnnual: true, addOns: { COST_ENGINE: true, PCA_SEAT: true }, onboardingPurchased: true }).where(eq(userBilling.userId, pca.id));
      }

      return res.json({
        ok: true,
        accounts: [
          { role: "Grower", email: "grower@ranchup.ag", password: "RanchUp2026", name: "Ryan Neufeld" },
          { role: "PCA", email: "pca@ranchup.ag", password: "RanchUp2026", name: "Karl W." },
        ],
      });
    } catch (err: any) {
      console.error("Seed error:", err);
      return res.status(500).json({ error: "Seed failed", detail: err.message });
    }
  });

  return httpServer;
}
