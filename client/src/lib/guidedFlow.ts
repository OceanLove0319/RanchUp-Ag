import { GuidedStep } from "@/types/guidedFlow";

export function deriveStepFromRoute(pathname: string): GuidedStep | null {
  if (pathname === "/app" || pathname.startsWith("/app/blocks")) return "TODAY";
  if (pathname === "/app/log") return "LOG";
  if (pathname === "/app/reports/variance") return "REVIEW";
  if (pathname === "/app/projections" || pathname.startsWith("/app/projections/")) return "PLAN";
  if (pathname === "/app/vault" || pathname.startsWith("/app/reports/")) return "SHARE";
  
  return null; // For pages that don't map directly (like settings or inputs library)
}

export function getNextStepLabel(step: GuidedStep): string {
  switch (step) {
    case "TODAY": return "Log";
    case "LOG": return "Review";
    case "REVIEW": return "Plan";
    case "PLAN": return "Share";
    case "SHARE": return "Today";
    default: return "Continue";
  }
}

export function getNextStepPath(step: GuidedStep): string {
  switch (step) {
    case "TODAY": return "/app/log";
    case "LOG": return "/app/reports/variance";
    case "REVIEW": return "/app/projections";
    case "PLAN": return "/app/vault";
    case "SHARE": return "/app";
    default: return "/app";
  }
}

export function determineNextStep(currentStep: GuidedStep, action: string): GuidedStep {
  // Logic based on actions
  if (action === "SAVE_LOG") return "REVIEW";
  if (action === "FIX_ISSUE") return "PLAN"; // In a real app this would check if more issues exist
  if (action === "APPLY_TEMPLATE") return "LOG";
  if (action === "GENERATE_REPORT") return "SHARE";
  
  // Default fallback progression
  switch (currentStep) {
    case "TODAY": return "LOG";
    case "LOG": return "REVIEW";
    case "REVIEW": return "PLAN";
    case "PLAN": return "SHARE";
    case "SHARE": return "TODAY";
    default: return "LOG";
  }
}
