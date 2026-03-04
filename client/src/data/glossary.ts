export type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
  category: string;
};

export const categories = [
  "All",
  "Core Ranch Structure",
  "Logging & Execution",
  "Materials & Cost Engine",
  "Templates & Programs",
  "Projections & Variance",
  "Flags & Data Quality",
  "Compliance & Reporting",
  "App Experience"
];

export const glossaryData: GlossaryTerm[] = [
  // 1) Core Ranch Structure
  { id: "ranch", term: "Ranch", definition: "The overall operation (one business) that contains multiple blocks.", category: "Core Ranch Structure" },
  { id: "block", term: "Block", definition: "A defined planting area (variety + rootstock + year + acres + irrigation system). The core unit for logging and costing.", category: "Core Ranch Structure" },
  { id: "acres", term: "Acres (Block Acres)", definition: "The measured size of the block used for “total material needed” and cost math.", category: "Core Ranch Structure" },
  { id: "crop-tag", term: "Crop / Commodity Tag", definition: "Labels like Almond / Pistachio / Citrus / Stone Fruit used to filter templates, materials, and reports.", category: "Core Ranch Structure" },
  { id: "season", term: "Season", definition: "The time window you’re tracking (e.g., 2026 season). Logs roll up by season.", category: "Core Ranch Structure" },
  
  // 2) Logging & Execution
  { id: "quick-log", term: "Quick Log", definition: "Fast entry for what happened today (spray, fertigation, irrigation set, mowing, etc.) tied to a block.", category: "Logging & Execution" },
  { id: "log-entry", term: "Log Entry", definition: "One recorded activity (date + block + activity + materials + rates + notes).", category: "Logging & Execution" },
  { id: "activity-type", term: "Activity Type", definition: "The category of work: Spray / Fertigation / Irrigation / Soil Amendment / Weed / Pest / Cultural.", category: "Logging & Execution" },
  { id: "application", term: "Application", definition: "A spray or injection event where products were applied at a rate.", category: "Logging & Execution" },
  { id: "rate", term: "Rate", definition: "How much product is applied per acre or per set (e.g., 15 GAL/AC).", category: "Logging & Execution" },
  { id: "total-material-needed", term: "Total Material Needed", definition: "Auto-calculated total product for that block: rate × acres.", category: "Logging & Execution" },
  { id: "tank-load-helper", term: "Tank / Load Helper", definition: "Optional calculator: converts total needed into number of loads based on tank size.", category: "Logging & Execution" },
  { id: "copy-forward", term: "Copy-Forward (Log Again)", definition: "Reuse a prior log’s products/rates for speed; edit only what changed.", category: "Logging & Execution" },
  { id: "crew-operator", term: "Crew / Operator", definition: "Who performed the work (foreman, irrigator, custom applicator, etc.).", category: "Logging & Execution" },
  
  // 3) Materials & Cost Engine
  { id: "material", term: "Material", definition: "Any input used: chemical, fertilizer, adjuvant, water treatment, surfactant, etc.", category: "Materials & Cost Engine" },
  { id: "material-library", term: "Material Library", definition: "The standardized list of materials with units, pack sizes, and planning prices.", category: "Materials & Cost Engine" },
  { id: "unit", term: "Unit", definition: "How a material is measured (GAL, LB, OZ, TON, QT, PT).", category: "Materials & Cost Engine" },
  { id: "rate-unit", term: "Rate Unit", definition: "The “per-acre” format (GAL/AC, LB/AC, OZ/AC).", category: "Materials & Cost Engine" },
  { id: "pack-size", term: "Pack Size", definition: "Container size used for pricing (e.g., 2.5 GAL, 50 LB bag).", category: "Materials & Cost Engine" },
  { id: "normalized-unit", term: "Normalized Unit", definition: "The base unit after converting pack size to a per-unit cost (e.g., $/GAL or $/LB).", category: "Materials & Cost Engine" },
  { id: "planning-price-range", term: "Planning Price Range", definition: "Low/high cost estimate used until an invoice replaces it.", category: "Materials & Cost Engine" },
  { id: "estimated-cost", term: "Estimated Cost", definition: "What the engine calculates for a log based on rate × acres × unit price.", category: "Materials & Cost Engine" },
  { id: "actual-cost", term: "Actual Cost", definition: "Invoice/quote-entered cost that overrides planning estimates.", category: "Materials & Cost Engine" },
  { id: "cost-engine", term: "Cost Engine", definition: "The math layer that converts logs into spend totals safely and consistently.", category: "Materials & Cost Engine" },
  
  // 4) Templates & Programs
  { id: "template", term: "Template", definition: "A pre-built “recipe” for a common job (e.g., bloom spray, hull-split, N shot, frost set).", category: "Templates & Programs" },
  { id: "template-library", term: "Template Library", definition: "Your saved templates (by crop, timing, or problem).", category: "Templates & Programs" },
  { id: "template-fill", term: "Template Fill", definition: "Applying a template to a block/date to generate a ready log entry.", category: "Templates & Programs" },
  { id: "standard-program", term: "Standard Program", definition: "A repeatable seasonal plan (e.g., pre-bloom → bloom → post-bloom → summer).", category: "Templates & Programs" },
  { id: "timing-tag", term: "Timing Tag", definition: "“Bloom,” “Petal fall,” “Hull split,” “Post-harvest,” etc. used to organize templates.", category: "Templates & Programs" },

  // 5) Projections & Variance
  { id: "block-projection", term: "Block Projection", definition: "What you expect to spend/apply on that block over a period (week/month/season).", category: "Projections & Variance" },
  { id: "season-projection", term: "Season Projection", definition: "Expected total spend for the ranch or commodity for the season.", category: "Projections & Variance" },
  { id: "budget", term: "Budget (Planned Spend)", definition: "A target spend number used to compare against actuals.", category: "Projections & Variance" },
  { id: "variance", term: "Variance", definition: "The difference between planned and actual spend/use: actual − planned.", category: "Projections & Variance" },
  { id: "variance-flag", term: "Variance Flag", definition: "A warning when variance crosses a threshold (e.g., +15% over plan).", category: "Projections & Variance" },
  { id: "over-under", term: "Over/Under Indicator", definition: "Simple label showing you’re trending above or below projection.", category: "Projections & Variance" },
  { id: "spend-allocation", term: "Spend Allocation", definition: "Splitting spend by block, commodity, activity type, or material category.", category: "Projections & Variance" },

  // 6) Flags & Data Quality
  { id: "unit-mismatch", term: "Unit Mismatch", definition: "Entered unit/rate doesn’t match the library unit, so cost math is blocked (cost set to 0) until fixed.", category: "Flags & Data Quality" },
  { id: "data-mismatch", term: "Data Mismatch", definition: "The log conflicts with saved reference data (wrong block acres, wrong material unit, missing crop tag, etc.).", category: "Flags & Data Quality" },
  { id: "missing-data-flag", term: "Missing Data Flag", definition: "Required fields aren’t filled (no acres, no unit price, no rate, no date).", category: "Flags & Data Quality" },
  { id: "outlier-flag", term: "Outlier Flag", definition: "A value is unusually high/low compared to normal ranges (e.g., 80 GAL/AC UN-32).", category: "Flags & Data Quality" },
  { id: "duplicate-log", term: "Duplicate Log Warning", definition: "Similar logs entered twice for the same block/date/activity.", category: "Flags & Data Quality" },
  { id: "review-queue", term: "Review Queue", definition: "A list of flagged items needing correction (units, prices, acres, duplicates).", category: "Flags & Data Quality" },
  { id: "locked-fields", term: "Locked Fields", definition: "Protected values that shouldn’t change casually (block acres, base units) without admin confirmation.", category: "Flags & Data Quality" },

  // 7) Compliance & Reporting
  { id: "compliance-packet", term: "Compliance Packet", definition: "An organized export of logs for audits, QA, and reporting (sprays, fertigation, irrigation notes).", category: "Compliance & Reporting" },
  { id: "audit-ready", term: "Audit-Ready Record", definition: "A log that has required details: date, block, products, rates, acres, operator.", category: "Compliance & Reporting" },
  { id: "export", term: "Export", definition: "Download/share reports (PDF/CSV) for PCA, packer-shipper QA, or internal records.", category: "Compliance & Reporting" },
  { id: "retention", term: "Retention", definition: "How long records are kept in the vault (policy-driven).", category: "Compliance & Reporting" },
  { id: "pur-support", term: "Pesticide Use Reporting (PUR) Support", definition: "Reports structured to help monthly reporting (not a replacement for legal requirements, just organized output).", category: "Compliance & Reporting" },

  // 8) App Experience / Navigation
  { id: "active-apps", term: "Active Apps", definition: "The modules currently enabled in your account (e.g., Logging, Templates, Cost Engine, Projections, Vault, Export).", category: "App Experience" },
  { id: "module", term: "Module", definition: "A functional area of the product (Templates, Vault, Projections).", category: "App Experience" },
  { id: "role", term: "Role", definition: "Permissions level (Owner/Admin, Foreman, Irrigator, PCA view-only, Accounting).", category: "App Experience" },
  { id: "workspace", term: "Workspace", definition: "Your operation’s “home” inside the app (ranches/blocks/users/settings).", category: "App Experience" },
  { id: "vault", term: "Vault", definition: "The permanent storage area for season logs, exports, and compliance packets.", category: "App Experience" }
];