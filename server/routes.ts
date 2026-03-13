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
    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, req.params.id), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(404).json({ error: "Ranch not found" });

    const [updated] = await db.update(ranches)
      .set({ name: req.body.name, region: req.body.region })
      .where(eq(ranches.id, req.params.id))
      .returning();
    return res.json(updated);
  });

  app.delete("/api/ranches/:id", authMiddleware, async (req, res) => {
    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, req.params.id), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(404).json({ error: "Ranch not found" });

    await db.delete(ranches).where(eq(ranches.id, req.params.id));
    return res.json({ success: true });
  });

  // ════════════════════════════════════════════
  // BLOCKS
  // ════════════════════════════════════════════

  app.get("/api/ranches/:ranchId/blocks", authMiddleware, async (req, res) => {
    // verify ranch ownership
    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, req.params.ranchId), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(404).json({ error: "Ranch not found" });

    const result = await db.select().from(blocks)
      .where(eq(blocks.ranchId, req.params.ranchId))
      .orderBy(blocks.name);
    return res.json(result);
  });

  app.post("/api/ranches/:ranchId/blocks", authMiddleware, async (req, res) => {
    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, req.params.ranchId), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(404).json({ error: "Ranch not found" });

    const parsed = insertBlockSchema.safeParse({ ...req.body, ranchId: req.params.ranchId });
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }
    const [block] = await db.insert(blocks).values(parsed.data).returning();
    return res.status(201).json(block);
  });

  app.put("/api/blocks/:id", authMiddleware, async (req, res) => {
    const [block] = await db.select().from(blocks).where(eq(blocks.id, req.params.id)).limit(1);
    if (!block) return res.status(404).json({ error: "Block not found" });

    // verify ownership through ranch
    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, block.ranchId), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(403).json({ error: "Not your block" });

    const { id, createdAt, ...updateData } = req.body;
    const [updated] = await db.update(blocks)
      .set(updateData)
      .where(eq(blocks.id, req.params.id))
      .returning();
    return res.json(updated);
  });

  app.delete("/api/blocks/:id", authMiddleware, async (req, res) => {
    const [block] = await db.select().from(blocks).where(eq(blocks.id, req.params.id)).limit(1);
    if (!block) return res.status(404).json({ error: "Block not found" });

    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, block.ranchId), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(403).json({ error: "Not your block" });

    await db.delete(blocks).where(eq(blocks.id, req.params.id));
    return res.json({ success: true });
  });

  // ════════════════════════════════════════════
  // FIELD LOGS
  // ════════════════════════════════════════════

  app.get("/api/ranches/:ranchId/field-logs", authMiddleware, async (req, res) => {
    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, req.params.ranchId), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(404).json({ error: "Ranch not found" });

    const result = await db.select().from(fieldLogs)
      .where(eq(fieldLogs.ranchId, req.params.ranchId))
      .orderBy(desc(fieldLogs.createdAt));
    return res.json(result);
  });

  app.post("/api/ranches/:ranchId/field-logs", authMiddleware, async (req, res) => {
    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, req.params.ranchId), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(404).json({ error: "Ranch not found" });

    const parsed = insertFieldLogSchema.safeParse({ ...req.body, ranchId: req.params.ranchId });
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }
    const [log] = await db.insert(fieldLogs).values(parsed.data).returning();
    return res.status(201).json(log);
  });

  app.delete("/api/field-logs/:id", authMiddleware, async (req, res) => {
    const [log] = await db.select().from(fieldLogs).where(eq(fieldLogs.id, req.params.id)).limit(1);
    if (!log) return res.status(404).json({ error: "Field log not found" });

    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, log.ranchId), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(403).json({ error: "Not your log" });

    await db.delete(fieldLogs).where(eq(fieldLogs.id, req.params.id));
    return res.json({ success: true });
  });

  // ════════════════════════════════════════════
  // CHEMICAL APPLICATIONS
  // ════════════════════════════════════════════

  app.get("/api/ranches/:ranchId/chemical-apps", authMiddleware, async (req, res) => {
    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, req.params.ranchId), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(404).json({ error: "Ranch not found" });

    const result = await db.select().from(chemicalApps)
      .where(eq(chemicalApps.ranchId, req.params.ranchId))
      .orderBy(desc(chemicalApps.createdAt));
    return res.json(result);
  });

  app.post("/api/ranches/:ranchId/chemical-apps", authMiddleware, async (req, res) => {
    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, req.params.ranchId), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(404).json({ error: "Ranch not found" });

    const parsed = insertChemicalAppSchema.safeParse({ ...req.body, ranchId: req.params.ranchId });
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }
    const [app_] = await db.insert(chemicalApps).values(parsed.data).returning();
    return res.status(201).json(app_);
  });

  app.delete("/api/chemical-apps/:id", authMiddleware, async (req, res) => {
    const [ca] = await db.select().from(chemicalApps).where(eq(chemicalApps.id, req.params.id)).limit(1);
    if (!ca) return res.status(404).json({ error: "Chemical app not found" });

    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, ca.ranchId), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(403).json({ error: "Not yours" });

    await db.delete(chemicalApps).where(eq(chemicalApps.id, req.params.id));
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
      .where(and(eq(productLibrary.id, req.params.id), eq(productLibrary.userId, req.userId!)))
      .limit(1);
    if (!item) return res.status(404).json({ error: "Product not found" });

    const { id, ...updateData } = req.body;
    const [updated] = await db.update(productLibrary)
      .set(updateData)
      .where(eq(productLibrary.id, req.params.id))
      .returning();
    return res.json(updated);
  });

  app.delete("/api/product-library/:id", authMiddleware, async (req, res) => {
    const [item] = await db.select().from(productLibrary)
      .where(and(eq(productLibrary.id, req.params.id), eq(productLibrary.userId, req.userId!)))
      .limit(1);
    if (!item) return res.status(404).json({ error: "Product not found" });

    await db.delete(productLibrary).where(eq(productLibrary.id, req.params.id));
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
      .where(and(eq(programTemplates.id, req.params.id), eq(programTemplates.userId, req.userId!)))
      .limit(1);
    if (!template) return res.status(404).json({ error: "Template not found" });

    // cascade deletes lines
    await db.delete(programTemplates).where(eq(programTemplates.id, req.params.id));
    return res.json({ success: true });
  });

  // ════════════════════════════════════════════
  // BLOCK PROJECTIONS
  // ════════════════════════════════════════════

  app.get("/api/blocks/:blockId/projections", authMiddleware, async (req, res) => {
    const result = await db.select().from(blockProjections)
      .where(eq(blockProjections.blockId, req.params.blockId));
    return res.json(result);
  });

  app.post("/api/blocks/:blockId/projections", authMiddleware, async (req, res) => {
    const [proj] = await db.insert(blockProjections).values({
      blockId: req.params.blockId,
      templateId: req.body.templateId,
      overrides: req.body.overrides,
    }).returning();
    return res.status(201).json(proj);
  });

  app.delete("/api/projections/:id", authMiddleware, async (req, res) => {
    await db.delete(blockProjections).where(eq(blockProjections.id, req.params.id));
    return res.json({ success: true });
  });

  // ════════════════════════════════════════════
  // RECOMMENDATIONS (PCA → Grower)
  // ════════════════════════════════════════════

  app.get("/api/ranches/:ranchId/recommendations", authMiddleware, async (req, res) => {
    const [ranch] = await db.select().from(ranches)
      .where(and(eq(ranches.id, req.params.ranchId), eq(ranches.userId, req.userId!)))
      .limit(1);
    if (!ranch) return res.status(404).json({ error: "Ranch not found" });

    const result = await db.select().from(recommendations)
      .where(eq(recommendations.ranchId, req.params.ranchId))
      .orderBy(desc(recommendations.createdAt));
    return res.json(result);
  });

  app.post("/api/ranches/:ranchId/recommendations", authMiddleware, async (req, res) => {
    const parsed = insertRecommendationSchema.safeParse({
      ...req.body,
      ranchId: req.params.ranchId,
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
      .where(eq(recommendations.id, req.params.id))
      .returning();
    if (!updated) return res.status(404).json({ error: "Recommendation not found" });
    return res.json(updated);
  });

  app.delete("/api/recommendations/:id", authMiddleware, async (req, res) => {
    await db.delete(recommendations).where(eq(recommendations.id, req.params.id));
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
      .where(eq(users.id, req.params.id))
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

  return httpServer;
}
