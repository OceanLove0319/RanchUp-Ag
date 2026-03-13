import { PlanId, AddOnId } from "@/config/pricing";
import { useBilling } from "@/hooks/useData";

const PLAN_HIERARCHY: Record<PlanId, number> = {
  STARTER: 1,
  PRO: 2,
  OPS: 3
};

export function hasPlanAtLeast(currentPlan: PlanId, requiredPlan: PlanId): boolean {
  return PLAN_HIERARCHY[currentPlan] >= PLAN_HIERARCHY[requiredPlan];
}

export function useGating() {
  const { data: billing } = useBilling();
  const planId = (billing?.planId ?? "STARTER") as PlanId;
  const addOns = billing?.addOns ?? {};

  return {
    hasPlanAtLeast: (requiredPlan: PlanId) => hasPlanAtLeast(planId, requiredPlan),
    hasAddOn: (addOnId: AddOnId) => !!addOns[addOnId],
    getAddOnCount: (addOnId: AddOnId) => {
      const val = addOns[addOnId];
      return typeof val === 'number' ? val : (val ? 1 : 0);
    },
    requirePro: (featureName: string) => {
      const allowed = hasPlanAtLeast(planId, "PRO");
      return {
        allowed,
        reason: allowed ? null : `${featureName} requires Pro plan`,
        upgradePath: "/app/pricing"
      };
    },
    requireOps: (featureName: string) => {
      const allowed = hasPlanAtLeast(planId, "OPS");
      return {
        allowed,
        reason: allowed ? null : `${featureName} requires Ops plan`,
        upgradePath: "/app/pricing"
      };
    },
    requireCostEngine: () => {
      const hasPro = hasPlanAtLeast(planId, "PRO");
      const hasCost = !!addOns["COST_ENGINE"];
      const allowed = hasPro && hasCost;
      return {
        allowed,
        reason: allowed ? null : (!hasPro ? "Cost Engine requires Pro plan" : "Cost Engine add-on required"),
        upgradePath: "/app/pricing"
      };
    }
  };
}
