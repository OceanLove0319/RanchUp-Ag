export function computeStoneFruitFertTarget(yieldTargetBins: number): { minLbsAc: number; maxLbsAc: number; basis: string } {
  const basis = `Based on ${yieldTargetBins} b/ac yield goal`;
  
  if (yieldTargetBins >= 40) return { minLbsAc: 250, maxLbsAc: 300, basis };
  if (yieldTargetBins >= 30) return { minLbsAc: 225, maxLbsAc: 275, basis };
  if (yieldTargetBins >= 20) return { minLbsAc: 200, maxLbsAc: 250, basis };
  
  return { minLbsAc: 175, maxLbsAc: 225, basis };
}