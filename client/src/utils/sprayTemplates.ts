import { inferCropType } from "./crops";

export function getSprayChartWindows(block: { variety: string }): Array<{ key: string; title: string; description?: string }> {
  const cropType = inferCropType(block.variety);

  if (cropType === "STONE_FRUIT") {
    return [
      { key: "dormant", title: "Dormant", description: "Pre-bloom cleanup + overwintering pressure" },
      { key: "bloom", title: "Bloom", description: "Blossom blight / brown rot protection window" },
      { key: "fruitSet", title: "Fruit set", description: "Early insect + disease prevention as crop sets" },
      { key: "preHarvest", title: "Pre-harvest", description: "Finish window as fruit matures and color develops" }
    ];
  }

  if (cropType === "CITRUS") {
    return [
      { key: "springFlush", title: "Spring flush", description: "Early season protection" },
      { key: "bloom", title: "Bloom", description: "Critical bloom timing" },
      { key: "fruitSet", title: "Fruit set", description: "Protecting early fruitlets" }
    ];
  }

  if (cropType === "NUT") {
    return [
      { key: "dormant", title: "Dormant", description: "Winter sanitation" },
      { key: "bloom", title: "Bloom", description: "Protecting sensitive bloom" },
      { key: "earlySeason", title: "Early season", description: "Spring pest management" },
      { key: "hullSplit", title: "Hull split", description: "Critical timing for NOW control" }
    ];
  }

  // Fallback
  return [
    { key: "dormant", title: "Dormant" },
    { key: "bloom", title: "Bloom" },
    { key: "growing", title: "Growing Season" }
  ];
}