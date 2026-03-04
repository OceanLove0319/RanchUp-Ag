export type CropType = "STONE_FRUIT" | "CITRUS" | "NUT" | "OTHER";

export function inferCropType(variety: string): CropType {
  const v = variety.toLowerCase();
  
  if (v.includes("peach") || v.includes("nectarine") || v.includes("plum") || v.includes("apricot") || v.includes("cherry")) {
    return "STONE_FRUIT";
  }
  
  if (v.includes("citrus") || v.includes("orange") || v.includes("mandarin") || v.includes("lemon") || v.includes("lime") || v.includes("grapefruit")) {
    return "CITRUS";
  }
  
  if (v.includes("almond") || v.includes("pistachio") || v.includes("walnut")) {
    return "NUT";
  }
  
  return "OTHER";
}