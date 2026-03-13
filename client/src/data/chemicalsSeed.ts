import { Chemical } from "@/hooks/useData";

export const CHEMICALS_SEED: Chemical[] = [
  // -------------------------
  // HERBICIDES (20)
  // -------------------------
  { id: "cv-001", name: "Glyphosate (Roundup PowerMAX / generics)", category: "HERBICIDE", unit: "GAL", unitCostLow: 15, unitCostHigh: 30, cropTags: ["A","P","W","C","S"], aliases: ["glyphosate","roundup","powermax","glypho"], notes: "Burndown/strip." },
  { id: "cv-002", name: "Paraquat (Gramoxone / generics)", category: "HERBICIDE", unit: "GAL", unitCostLow: 18, unitCostHigh: 60, cropTags: ["A","P","W","C","S"], aliases: ["paraquat","gramoxone"], notes: "Burndown; restricted-use handling varies." },
  { id: "cv-003", name: "Rimsulfuron (Matrix SG)", category: "HERBICIDE", unit: "20OZ", unitCostLow: 120, unitCostHigh: 150, cropTags: ["A","P","W","C","S"], aliases: ["rimsulfuron","matrix"], notes: "Residual strip partner." },
  { id: "cv-004", name: "Oxyfluorfen (Goal / generics)", category: "HERBICIDE", unit: "GAL", unitCostLow: 90, unitCostHigh: 170, cropTags: ["A","P","W","C","S"], aliases: ["oxyfluorfen","goal"], notes: "Residual/strip programs." },
  { id: "cv-005", name: "Pendimethalin (Prowl H2O / generics)", category: "HERBICIDE", unit: "GAL", unitCostLow: 60, unitCostHigh: 140, cropTags: ["A","P","W","C","S"], aliases: ["pendimethalin","prowl"], notes: "Pre-emergent." },
  { id: "cv-006", name: "Indaziflam (Alion)", category: "HERBICIDE", unit: "GAL", unitCostLow: 1000, unitCostHigh: 1600, cropTags: ["A","P","W","C","S"], aliases: ["indaziflam","alion"], notes: "Premium residual." },
  { id: "cv-007", name: "Flumioxazin (Chateau / generics)", category: "HERBICIDE", unit: "LB", unitCostLow: 180, unitCostHigh: 350, cropTags: ["A","P","W","C","S"], aliases: ["flumioxazin","chateau"], notes: "Residual partner." },
  { id: "cv-008", name: "Saflufenacil (Treevix)", category: "HERBICIDE", unit: "LB", unitCostLow: 200, unitCostHigh: 450, cropTags: ["A","P","W","C","S"], aliases: ["saflufenacil","treevix"], notes: "Contact + residual partner." },
  { id: "cv-009", name: "Simazine (labeled uses)", category: "HERBICIDE", unit: "GAL", unitCostLow: 25, unitCostHigh: 60, cropTags: ["A","P","W","C","S"], aliases: ["simazine"], notes: "Residual; restrictions vary." },
  { id: "cv-010", name: "Norflurazon (Solicam)", category: "HERBICIDE", unit: "GAL", unitCostLow: 120, unitCostHigh: 250, cropTags: ["A","P","W","C","S"], aliases: ["norflurazon","solicam"], notes: "Residual orchard floor." },
  { id: "cv-011", name: "Oryzalin (Surflan)", category: "HERBICIDE", unit: "GAL", unitCostLow: 70, unitCostHigh: 160, cropTags: ["A","P","W","C","S"], aliases: ["oryzalin","surflan"], notes: "Residual partner." },
  { id: "cv-012", name: "Carfentrazone (Shark)", category: "HERBICIDE", unit: "GAL", unitCostLow: 250, unitCostHigh: 600, cropTags: ["A","P","W","C","S"], aliases: ["carfentrazone","shark"], notes: "Contact burn; tank partner." },
  { id: "cv-013", name: "Glufosinate (Rely / generics)", category: "HERBICIDE", unit: "GAL", unitCostLow: 25, unitCostHigh: 60, cropTags: ["A","P","W","C","S"], aliases: ["glufosinate","rely"], notes: "Post-emerge." },
  { id: "cv-014", name: "Clethodim (Select Max / generics)", category: "HERBICIDE", unit: "GAL", unitCostLow: 70, unitCostHigh: 170, cropTags: ["A","P","W","C","S"], aliases: ["clethodim","select"], notes: "Grass control." },
  { id: "cv-015", name: "Fluazifop (Fusilade)", category: "HERBICIDE", unit: "GAL", unitCostLow: 160, unitCostHigh: 350, cropTags: ["A","P","W","C","S"], aliases: ["fluazifop","fusilade"], notes: "Grass control." },
  { id: "cv-016", name: "Diuron (labeled uses)", category: "HERBICIDE", unit: "GAL", unitCostLow: 25, unitCostHigh: 70, cropTags: ["A","P","W","C","S"], aliases: ["diuron"], notes: "Residual; restrictions vary." },
  { id: "cv-017", name: "Napropamide (Devrinol)", category: "HERBICIDE", unit: "GAL", unitCostLow: 80, unitCostHigh: 180, cropTags: ["A","P","W","C","S"], aliases: ["napropamide","devrinol"], notes: "Pre-emergent." },
  { id: "cv-018", name: "Trifluralin (Treflan / generics)", category: "HERBICIDE", unit: "GAL", unitCostLow: 55, unitCostHigh: 140, cropTags: ["A","P","W","C","S"], aliases: ["trifluralin","treflan"], notes: "Pre-emergent." },
  { id: "cv-019", name: "2,4-D (labeled uses)", category: "HERBICIDE", unit: "GAL", unitCostLow: 15, unitCostHigh: 35, cropTags: ["A","P","W","C","S"], aliases: ["2,4-d","24d"], notes: "Broadleaf; drift rules apply." },
  { id: "cv-020", name: "Metsulfuron (labeled orchard uses)", category: "HERBICIDE", unit: "OZ", unitCostLow: 12, unitCostHigh: 35, cropTags: ["A","P","W","C","S"], aliases: ["metsulfuron"], notes: "Low-rate residual; label-specific." },

  // -------------------------
  // FUNGICIDES (30)
  // -------------------------
  { id: "cv-021", name: "Chlorothalonil (Bravo Weather Stik / generics)", category: "FUNGICIDE", unit: "2.5GAL", unitCostLow: 85, unitCostHigh: 120, cropTags: ["A","P","W","C","S"], aliases: ["chlorothalonil","bravo","weather stik"], notes: "Broad protectant." },
  { id: "cv-022", name: "Boscalid + Pyraclostrobin (Pristine)", category: "FUNGICIDE", unit: "7.5LB", unitCostLow: 450, unitCostHigh: 550, cropTags: ["A","P","W","C","S"], aliases: ["pristine","boscalid","pyraclostrobin"], notes: "Premium fruit/nut fungicide." },
  { id: "cv-023", name: "Fluxapyroxad + Pyraclostrobin (Merivon)", category: "FUNGICIDE", unit: "GAL", unitCostLow: 900, unitCostHigh: 1700, cropTags: ["A","P","W","C","S"], aliases: ["merivon","fluxapyroxad"], notes: "SDHI/QoI mix." },
  { id: "cv-024", name: "Fluopyram + Trifloxystrobin (Luna Sensation)", category: "FUNGICIDE", unit: "GAL", unitCostLow: 800, unitCostHigh: 1600, cropTags: ["A","P","W","C","S"], aliases: ["luna sensation","fluopyram"], notes: "Premium rotation tool." },
  { id: "cv-025", name: "Penthiopyrad (Fontelis)", category: "FUNGICIDE", unit: "GAL", unitCostLow: 650, unitCostHigh: 1200, cropTags: ["A","P","W","C","S"], aliases: ["fontelis","penthiopyrad"], notes: "SDHI." },
  { id: "cv-026", name: "Azoxystrobin (Quadris / generics)", category: "FUNGICIDE", unit: "GAL", unitCostLow: 250, unitCostHigh: 600, cropTags: ["A","P","W","C","S"], aliases: ["quadris","azoxystrobin"], notes: "QoI; resistance stewardship." },
  { id: "cv-027", name: "Pyraclostrobin (Cabrio / generics)", category: "FUNGICIDE", unit: "5LB", unitCostLow: 400, unitCostHigh: 900, cropTags: ["A","P","W","C","S"], aliases: ["cabrio","pyraclostrobin"], notes: "QoI." },
  { id: "cv-028", name: "Trifloxystrobin (Flint / generics)", category: "FUNGICIDE", unit: "LB", unitCostLow: 250, unitCostHigh: 550, cropTags: ["A","P","W","C","S"], aliases: ["flint","trifloxystrobin"], notes: "QoI." },
  { id: "cv-029", name: "Myclobutanil (Rally / generics)", category: "FUNGICIDE", unit: "LB", unitCostLow: 90, unitCostHigh: 220, cropTags: ["A","P","W","C","S"], aliases: ["rally","myclobutanil"], notes: "DMI; common in stone fruit." },
  { id: "cv-030", name: "Propiconazole (Tilt / generics)", category: "FUNGICIDE", unit: "GAL", unitCostLow: 60, unitCostHigh: 170, cropTags: ["A","P","W","C","S"], aliases: ["tilt","propiconazole"], notes: "DMI." },
  { id: "cv-031", name: "Tebuconazole (generics)", category: "FUNGICIDE", unit: "GAL", unitCostLow: 70, unitCostHigh: 180, cropTags: ["A","P","W","C","S"], aliases: ["tebuconazole"], notes: "DMI." },
  { id: "cv-032", name: "Difenoconazole", category: "FUNGICIDE", unit: "GAL", unitCostLow: 250, unitCostHigh: 600, cropTags: ["A","P","W","C","S"], aliases: ["difenoconazole"], notes: "DMI." },
  { id: "cv-033", name: "Cyprodinil (Vangard)", category: "FUNGICIDE", unit: "LB", unitCostLow: 160, unitCostHigh: 350, cropTags: ["A","P","W","C","S"], aliases: ["vangard","cyprodinil"], notes: "Stone fruit/citrus rotations." },
  { id: "cv-034", name: "Cyprodinil + Fludioxonil (Switch)", category: "FUNGICIDE", unit: "LB", unitCostLow: 300, unitCostHigh: 650, cropTags: ["A","P","W","C","S"], aliases: ["switch","fludioxonil"], notes: "Premium fruit fungicide." },
  { id: "cv-035", name: "Fenbuconazole (Indar)", category: "FUNGICIDE", unit: "GAL", unitCostLow: 200, unitCostHigh: 450, cropTags: ["S","C","A","P","W"], aliases: ["indar","fenbuconazole"], notes: "Classic brown rot tool." },
  { id: "cv-036", name: "Iprodione (Rovral / generics)", category: "FUNGICIDE", unit: "GAL", unitCostLow: 60, unitCostHigh: 160, cropTags: ["S","C","A","P","W"], aliases: ["rovral","iprodione"], notes: "Older chemistry; use varies." },
  { id: "cv-037", name: "Captan", category: "FUNGICIDE", unit: "50LB", unitCostLow: 120, unitCostHigh: 280, cropTags: ["S","C","A","P","W"], aliases: ["captan"], notes: "Protectant." },
  { id: "cv-038", name: "Sulfur (wettable)", category: "FUNGICIDE", unit: "50LB", unitCostLow: 35, unitCostHigh: 90, cropTags: ["A","P","W","C","S"], aliases: ["sulfur","wettable sulfur"], notes: "Low-cost protectant." },
  { id: "cv-039", name: "Copper (hydroxide/oxychloride class)", category: "FUNGICIDE", unit: "50LB", unitCostLow: 140, unitCostHigh: 320, cropTags: ["A","P","W","C","S"], aliases: ["copper","kocide","champ","copper hydroxide"], notes: "Dormant/bloom programs." },
  { id: "cv-040", name: "Mancozeb (Manzate / generics)", category: "FUNGICIDE", unit: "25LB", unitCostLow: 40, unitCostHigh: 120, cropTags: ["A","P","W","C","S"], aliases: ["mancozeb","manzate"], notes: "Protectant; restrictions vary." },
  { id: "cv-041", name: "Ziram", category: "FUNGICIDE", unit: "GAL", unitCostLow: 60, unitCostHigh: 150, cropTags: ["A","P","W","C","S"], aliases: ["ziram"], notes: "Protectant." },
  { id: "cv-042", name: "Phosphites/Phosphonates (class)", category: "FUNGICIDE", unit: "GAL", unitCostLow: 50, unitCostHigh: 140, cropTags: ["A","P","W","C","S"], aliases: ["phosphite","phosphonate","fosetyl-al"], notes: "Systemic-like support; varies by product." },
  { id: "cv-043", name: "Potassium bicarbonate (Kaligreen/Armicarb)", category: "FUNGICIDE", unit: "25LB", unitCostLow: 70, unitCostHigh: 170, cropTags: ["A","P","W","C","S"], aliases: ["kaligreen","armicarb","potassium bicarbonate"], notes: "Organic-friendly option." },
  { id: "cv-044", name: "Metconazole (Quash)", category: "FUNGICIDE", unit: "GAL", unitCostLow: 250, unitCostHigh: 550, cropTags: ["A","P","W","C","S"], aliases: ["quash","metconazole"], notes: "DMI; hull rot/alternaria rotations." },
  { id: "cv-045", name: "Pydiflumetofen (Miravis)", category: "FUNGICIDE", unit: "GAL", unitCostLow: 900, unitCostHigh: 1800, cropTags: ["A","P","W","C","S"], aliases: ["miravis","pydiflumetofen"], notes: "Premium SDHI." },
  { id: "cv-046", name: "Isopyrazam (Kenja)", category: "FUNGICIDE", unit: "GAL", unitCostLow: 700, unitCostHigh: 1400, cropTags: ["A","P","W","C","S"], aliases: ["kenja","isopyrazam"], notes: "SDHI." },
  { id: "cv-047", name: "Kresoxim-methyl (Sovran)", category: "FUNGICIDE", unit: "LB", unitCostLow: 200, unitCostHigh: 500, cropTags: ["A","P","W","C","S"], aliases: ["sovran","kresoxim-methyl"], notes: "QoI." },
  { id: "cv-048", name: "Fludioxonil (Scholar / generics)", category: "FUNGICIDE", unit: "GAL", unitCostLow: 250, unitCostHigh: 600, cropTags: ["A","P","W","C","S"], aliases: ["scholar","fludioxonil"], notes: "Pre/post-harvest uses vary." },
  
  // -------------------------
  // ADJUVANTS & OTHERS (Remaining)
  // -------------------------
  { id: "cv-089", name: "Compatibility agent", category: "ADJUVANT", unit: "GAL", unitCostLow: 12, unitCostHigh: 45, cropTags: ["A","P","W","C","S"], aliases: ["compatibility agent"], notes: "Jar-test helper." },
  { id: "cv-090", name: "Wetting agent / infiltration aid", category: "ADJUVANT", unit: "GAL", unitCostLow: 20, unitCostHigh: 80, cropTags: ["A","P","W","C","S"], aliases: ["wetting agent","infiltration"], notes: "Water infiltration support." },

  // -------------------------
  // NUTRITIONALS (10) — core Central Valley materials
  // -------------------------
  { id: "cv-091", name: "UAN32 / UN-32 (liquid N)", category: "FERTILIZER", unit: "TON", unitCostLow: 420, unitCostHigh: 520, cropTags: ["A","P","W","C","S"], aliases: ["uan32","un-32","32-0-0","32%"], notes: "Convert to $/gal in Cost Engine if desired." },
  { id: "cv-092", name: "UAN28 (liquid N)", category: "FERTILIZER", unit: "TON", unitCostLow: 360, unitCostHigh: 460, cropTags: ["A","P","W","C","S"], aliases: ["uan28","28-0-0","28%"], notes: "Common liquid N." },
  { id: "cv-093", name: "CAN-17 (calcium ammonium nitrate)", category: "FERTILIZER", unit: "TON", unitCostLow: 500, unitCostHigh: 900, cropTags: ["A","P","W","C","S"], aliases: ["can-17","can 17","17%"], notes: "Liquid/dry programs vary by supplier." },
  { id: "cv-094", name: "Calcium nitrate (solution grade)", category: "FERTILIZER", unit: "TON", unitCostLow: 750, unitCostHigh: 1200, cropTags: ["A","P","W","C","S"], aliases: ["calcium nitrate"], notes: "Common fertigation material." },
  { id: "cv-095", name: "ATS (ammonium thiosulfate)", category: "FERTILIZER", unit: "TON", unitCostLow: 350, unitCostHigh: 650, cropTags: ["A","P","W","C","S"], aliases: ["ats","thiosulfate"], notes: "N + S; common." },
  { id: "cv-096", name: "10-34-0 (starter phosphorus)", category: "FERTILIZER", unit: "TON", unitCostLow: 600, unitCostHigh: 750, cropTags: ["A","P","W","C","S"], aliases: ["10-34-0","10340"], notes: "Convert to $/gal if needed." },
  { id: "cv-097", name: "MAP (11-52-0)", category: "FERTILIZER", unit: "TON", unitCostLow: 780, unitCostHigh: 950, cropTags: ["A","P","W","C","S"], aliases: ["map","11-52-0"], notes: "Dry P source; blends common." },
  { id: "cv-098", name: "Potash (0-0-60)", category: "FERTILIZER", unit: "TON", unitCostLow: 420, unitCostHigh: 650, cropTags: ["A","P","W","C","S"], aliases: ["potash","0-0-60","kcl"], notes: "Dry K source." },
  { id: "cv-099", name: "Potassium nitrate (13-0-44)", category: "FERTILIZER", unit: "TON", unitCostLow: 900, unitCostHigh: 1600, cropTags: ["A","P","W","C","S"], aliases: ["potassium nitrate","kno3","13-0-44"], notes: "Common fertigation/foliar K + N." },
  { id: "cv-100", name: "Solution-grade gypsum", category: "FERTILIZER", unit: "TON", unitCostLow: 120, unitCostHigh: 350, cropTags: ["A","P","W","C","S"], aliases: ["gypsum","solution gypsum"], notes: "Injection/infiltration; Ca/S support." }
];
