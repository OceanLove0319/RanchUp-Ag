export type PlanId = "STARTER" | "PRO" | "OPS";
export type AddOnId = "COST_ENGINE" | "PCA_SEAT" | "EXTRA_USER" | "EXTRA_RANCH" | "PACKET_BUNDLE";

export const PLANS = {
  STARTER: {
    id: "STARTER" as PlanId,
    name: "Starter",
    monthlyPrice: 249,
    annualPrice: 2490, // ~2 months free
    features: [
      "Quick Log (Basic)",
      "Season Vault",
      "PDF Season Packet (Standard)",
      "Up to 3 blocks"
    ]
  },
  PRO: {
    id: "PRO" as PlanId,
    name: "Pro",
    monthlyPrice: 499,
    annualPrice: 4990,
    features: [
      "Unlimited blocks",
      "Pinned & Recent Quick Templates",
      "Audit-Ready Packet Exports",
      "Multi-user access (up to 3)"
    ]
  },
  OPS: {
    id: "OPS" as PlanId,
    name: "Ops",
    monthlyPrice: 1199,
    annualPrice: 11990,
    features: [
      "Multi-ranch management",
      "Advanced roles & permissions",
      "Custom compliance exports",
      "Dedicated account manager"
    ]
  }
};

export const ADD_ONS = {
  COST_ENGINE: {
    id: "COST_ENGINE" as AddOnId,
    name: "Cost Engine",
    description: "Real-time $/ac tracking and chemical inventory pricing.",
    price: 149,
    requires: "PRO" as PlanId
  },
  PCA_SEAT: {
    id: "PCA_SEAT" as AddOnId,
    name: "PCA Seat",
    description: "Dedicated access for Pest Control Advisors.",
    price: 99,
    type: "quantity"
  },
  EXTRA_USER: {
    id: "EXTRA_USER" as AddOnId,
    name: "Extra User",
    description: "Additional team member access.",
    price: 25,
    type: "quantity",
    requires: "PRO" as PlanId
  },
  EXTRA_RANCH: {
    id: "EXTRA_RANCH" as AddOnId,
    name: "Extra Ranch",
    description: "Manage additional ranches under one org.",
    price: 99,
    type: "quantity",
    requires: "OPS" as PlanId
  },
  PACKET_BUNDLE: {
    id: "PACKET_BUNDLE" as AddOnId,
    name: "Audit Packet Bundle",
    description: "Export full multi-block audit packets.",
    price: 99,
    requires: "PRO" as PlanId
  }
};

export const ONBOARDING_FEES = {
  BASIC: {
    id: "BASIC",
    name: "Season Start Setup",
    price: 750,
    description: "We configure your first 5 blocks and import your spray templates."
  },
  FULL: {
    id: "FULL",
    name: "Full Onboarding",
    price: 1500,
    description: "Complete ranch setup, historical data import, and 1-on-1 team training."
  }
};
