export const PRODUCTS_SEED = [
  { id: "p-01", name: "Generic Nitrogen Fertilizer", category: "NUTRITION", type: "Nitrogen Fertilizer", unitDefault: "LB", brandFamily: "GENERIC" },
  { id: "p-02", name: "Generic Foliar Feed", category: "NUTRITION", type: "Foliar Nutrition", unitDefault: "GAL", brandFamily: "GENERIC" },
  { id: "p-03", name: "Generic Fungicide", category: "PROTECTION", type: "Fungicide", unitDefault: "OZ", brandFamily: "GENERIC" },
  { id: "p-04", name: "Generic Herbicide Pre", category: "PROTECTION", type: "Herbicide (Pre-emerge)", unitDefault: "OZ", brandFamily: "GENERIC" },
  { id: "p-05", name: "Generic Surfactant", category: "ADJUVANT", type: "Surfactant", unitDefault: "QT", brandFamily: "GENERIC" },
  { id: "p-06", name: "Innvictis Protection Product", category: "INNVICTIS", type: "Innvictis Product (Protection)", unitDefault: "OZ", brandFamily: "INNVICTIS" },
  { id: "p-07", name: "Innvictis Nutrition Product", category: "INNVICTIS", type: "Innvictis Product (Nutrition)", unitDefault: "GAL", brandFamily: "INNVICTIS" },
  { id: "p-08", name: "Generic Zinc Product", category: "NUTRITION", type: "Zinc Product", unitDefault: "QT", brandFamily: "GENERIC" },
  { id: "p-09", name: "Generic Calcium Product", category: "NUTRITION", type: "Calcium Product", unitDefault: "GAL", brandFamily: "GENERIC" },
  { id: "p-10", name: "Generic Defoliant", category: "PROTECTION", type: "Defoliant", unitDefault: "GAL", brandFamily: "GENERIC" },
  { id: "p-11", name: "Generic Spreader", category: "ADJUVANT", type: "Spreader", unitDefault: "PT", brandFamily: "GENERIC" },
  { id: "p-12", name: "Generic Sticker", category: "ADJUVANT", type: "Sticker", unitDefault: "PT", brandFamily: "GENERIC" },
  { id: "p-13", name: "Generic Treated Seed", category: "SEED", type: "Treated Seed", unitDefault: "LB", brandFamily: "GENERIC" },
  { id: "p-14", name: "Innvictis Seed Solution", category: "INNVICTIS", type: "Innvictis Seed Solution", unitDefault: "LB", brandFamily: "INNVICTIS" },
  { id: "p-15", name: "Generic Miticide", category: "PROTECTION", type: "Miticide", unitDefault: "OZ", brandFamily: "GENERIC" }
];

export const PRODUCT_CATEGORIES = [
  "SEED", "NUTRITION", "PROTECTION", "ADJUVANT", "INNVICTIS"
] as const;

export const PRODUCT_TYPES_BY_CATEGORY: Record<string, string[]> = {
  SEED: [
    "Seed", "Variety / Cultivar", "Treated Seed", "Untreated Seed", "Replant Seed"
  ],
  NUTRITION: [
    "Nitrogen Fertilizer", "Phosphorus Fertilizer", "Potassium Fertilizer", 
    "Dry Fertilizer Blend", "Liquid Fertilizer", "Starter Fertilizer", 
    "Foliar Nutrition", "Fertigation Material", "Calcium Product", 
    "Magnesium Product", "Sulfur Product", "Zinc Product", "Boron Product", 
    "Iron Product", "Manganese Product", "Copper Product", "Micronutrient Blend", 
    "Organic Nutrition Product", "Soil Amendment"
  ],
  PROTECTION: [
    "Herbicide (Pre-emerge)", "Herbicide (Post-emerge)", "Fungicide", 
    "Insecticide", "Miticide", "Bactericide", "Nematicide", "Rodenticide", 
    "Defoliant", "Desiccant", "Dormant Spray Material", "Soil-applied Pesticide", 
    "Foliar-applied Pesticide"
  ],
  ADJUVANT: [
    "Surfactant", "Spreader", "Sticker", "Wetter", "Crop Oil Concentrate", 
    "Methylated Seed Oil", "Drift Control Agent", "Deposition Aid", 
    "Water Conditioner", "Compatibility Agent", "Buffer / pH Modifier", 
    "Defoamer", "Penetrant"
  ],
  INNVICTIS: [
    "Innvictis Product (Protection)", "Innvictis Product (Nutrition)", 
    "Innvictis Product (Adjuvant)", "Innvictis Seed Solution"
  ]
};
