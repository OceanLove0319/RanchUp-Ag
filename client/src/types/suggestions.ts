export type SuggestionCategory = "NUTRITION" | "PROTECTION" | "PROGRAM_GAP" | "INVENTORY" | "TEMPLATE";

export type BlockSuggestion = {
  id: string;
  blockId: string;
  title: string;
  category: SuggestionCategory;
  inputType?: string;
  productId?: string;
  productName?: string;
  operationType?: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  reasonLines: string[];
  sourceSignals: string[];
  suggestedRate?: number;
  suggestedRateUnit?: string;
  estimatedTotal?: number;
  estimatedTotalUnit?: string;
  inventoryStatus?: "ON_HAND" | "LOW" | "UNKNOWN";
  templateReference?: string;
  dismissed?: boolean;
  savedForLater?: boolean;
};
