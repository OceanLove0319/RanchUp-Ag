import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// ── Types (match server schema) ──
export type Ranch = {
  id: string; userId: string; name: string; region: string | null; createdAt: string;
};
export type Block = {
  id: string; ranchId: string; name: string; acreage: number; variety: string;
  seasonGroup: string; irrigationType: string; yieldTargetBins: number;
  waterTargetAcreFeet: number; crop: string | null; geometry: any; createdAt: string;
};
export type FieldLog = {
  id: string; ranchId: string; blockId: string; date: string;
  actionType: "SPRAY" | "FERT" | "IRRIGATE" | "LABOR";
  material: string; amount: number; unit: string; notes: string | null;
  cost: number | null; productEntries: any; createdAt: string;
};
export type ChemicalApp = {
  id: string; ranchId: string; blockId: string; chemicalId: string | null;
  chemicalName: string; category: string; dateApplied: string; method: string | null;
  estimatedCost: number | null; costStatus: string | null; notes: string | null; createdAt: string;
};
export type Chemical = {
  id: string; name: string; category: string; unit: string;
  unitCostLow: number | null; unitCostHigh: number | null;
  cropTags: string[] | null; aliases: string[] | null; notes: string | null;
};
export type ProductLibraryItem = {
  id: string; userId: string | null; name: string; category: string; type: string;
  unitDefault: string | null; notes: string | null; aliases: string[] | null;
  brandFamily: string | null; pricePerUnit: number | null; defaultRate: number | null;
};
export type ProgramTemplate = {
  id: string; userId: string | null; name: string; cropTags: string[] | null;
  notes: string | null; createdAt: string;
  lines: ProgramTemplateLine[];
};
export type ProgramTemplateLine = {
  id: string; templateId: string; type: string; materialId: string | null;
  materialName: string; rateValue: number; rateUnit: string;
  passesPlanned: number; monthHint: number | null; productIds: string[] | null;
};
export type BlockProjection = {
  id: string; blockId: string; templateId: string; overrides: any; updatedAt: string;
};
export type Recommendation = {
  id: string; ranchId: string; blockId: string; createdBy: string | null;
  title: string; status: string; date: string; notes: string | null;
  cropStage: string | null; product: string | null; targetPest: string | null;
  rate: number | null; rateUnit: string | null;
  estimatedPricePerUnit: number | null; estimatedCostPerAcre: number | null;
  estimatedTotalCost: number | null; alternatives: any; createdAt: string;
};
export type BillingState = {
  id: string; userId: string; planId: string; isAnnual: boolean;
  addOns: Record<string, boolean | number>; onboardingPurchased: boolean; updatedAt: string;
};

// ════════════════════════════════════════════
// RANCHES
// ════════════════════════════════════════════
export function useRanches() {
  return useQuery<Ranch[]>({
    queryKey: ["ranches"],
    queryFn: () => api.get("/api/ranches"),
  });
}

export function useCreateRanch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; region?: string }) => api.post<Ranch>("/api/ranches", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ranches"] }),
  });
}

export function useUpdateRanch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; name?: string; region?: string }) =>
      api.put<Ranch>(`/api/ranches/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ranches"] }),
  });
}

export function useDeleteRanch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/api/ranches/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ranches"] }),
  });
}

// ════════════════════════════════════════════
// BLOCKS
// ════════════════════════════════════════════
export function useBlocks(ranchId: string | null) {
  return useQuery<Block[]>({
    queryKey: ["blocks", ranchId],
    queryFn: () => api.get(`/api/ranches/${ranchId}/blocks`),
    enabled: !!ranchId,
  });
}

export function useCreateBlock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ranchId, ...data }: Partial<Block> & { ranchId: string }) =>
      api.post<Block>(`/api/ranches/${ranchId}/blocks`, { ranchId, ...data }),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["blocks", vars.ranchId] }),
  });
}

export function useUpdateBlock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Block> & { id: string }) =>
      api.put<Block>(`/api/blocks/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blocks"] }),
  });
}

export function useDeleteBlock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/api/blocks/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blocks"] }),
  });
}

// ════════════════════════════════════════════
// FIELD LOGS
// ════════════════════════════════════════════
export function useFieldLogs(ranchId: string | null) {
  return useQuery<FieldLog[]>({
    queryKey: ["fieldLogs", ranchId],
    queryFn: () => api.get(`/api/ranches/${ranchId}/field-logs`),
    enabled: !!ranchId,
  });
}

export function useCreateFieldLog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ranchId, ...data }: Partial<FieldLog> & { ranchId: string }) =>
      api.post<FieldLog>(`/api/ranches/${ranchId}/field-logs`, { ranchId, ...data }),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["fieldLogs", vars.ranchId] }),
  });
}

export function useDeleteFieldLog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/api/field-logs/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fieldLogs"] }),
  });
}

// ════════════════════════════════════════════
// CHEMICAL APPS
// ════════════════════════════════════════════
export function useChemicalApps(ranchId: string | null) {
  return useQuery<ChemicalApp[]>({
    queryKey: ["chemicalApps", ranchId],
    queryFn: () => api.get(`/api/ranches/${ranchId}/chemical-apps`),
    enabled: !!ranchId,
  });
}

export function useCreateChemicalApp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ranchId, ...data }: Partial<ChemicalApp> & { ranchId: string }) =>
      api.post<ChemicalApp>(`/api/ranches/${ranchId}/chemical-apps`, { ranchId, ...data }),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["chemicalApps", vars.ranchId] }),
  });
}

export function useDeleteChemicalApp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/api/chemical-apps/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chemicalApps"] }),
  });
}

// ════════════════════════════════════════════
// CHEMICALS (shared library)
// ════════════════════════════════════════════
export function useChemicals() {
  return useQuery<Chemical[]>({
    queryKey: ["chemicals"],
    queryFn: () => api.get("/api/chemicals"),
  });
}

// ════════════════════════════════════════════
// PRODUCT LIBRARY (per-user)
// ════════════════════════════════════════════
export function useProductLibrary() {
  return useQuery<ProductLibraryItem[]>({
    queryKey: ["productLibrary"],
    queryFn: () => api.get("/api/product-library"),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ProductLibraryItem>) =>
      api.post<ProductLibraryItem>("/api/product-library", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["productLibrary"] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<ProductLibraryItem> & { id: string }) =>
      api.put<ProductLibraryItem>(`/api/product-library/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["productLibrary"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/api/product-library/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["productLibrary"] }),
  });
}

// ════════════════════════════════════════════
// TEMPLATES
// ════════════════════════════════════════════
export function useTemplates() {
  return useQuery<ProgramTemplate[]>({
    queryKey: ["templates"],
    queryFn: () => api.get("/api/templates"),
  });
}

export function useCreateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; cropTags?: string[]; notes?: string; lines: any[] }) =>
      api.post<ProgramTemplate>("/api/templates", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["templates"] }),
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/api/templates/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["templates"] }),
  });
}

// ════════════════════════════════════════════
// PROJECTIONS
// ════════════════════════════════════════════
export function useProjections(blockId: string | null) {
  return useQuery<BlockProjection[]>({
    queryKey: ["projections", blockId],
    queryFn: () => api.get(`/api/blocks/${blockId}/projections`),
    enabled: !!blockId,
  });
}

export function useCreateProjection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ blockId, ...data }: { blockId: string; templateId: string; overrides?: any }) =>
      api.post<BlockProjection>(`/api/blocks/${blockId}/projections`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projections"] }),
  });
}

export function useDeleteProjection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/api/projections/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projections"] }),
  });
}

// ════════════════════════════════════════════
// RECOMMENDATIONS
// ════════════════════════════════════════════
export function useRecommendations(ranchId: string | null) {
  return useQuery<Recommendation[]>({
    queryKey: ["recommendations", ranchId],
    queryFn: () => api.get(`/api/ranches/${ranchId}/recommendations`),
    enabled: !!ranchId,
  });
}

export function useCreateRecommendation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ranchId, ...data }: Partial<Recommendation> & { ranchId: string }) =>
      api.post<Recommendation>(`/api/ranches/${ranchId}/recommendations`, { ranchId, ...data }),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["recommendations", vars.ranchId] }),
  });
}

export function useUpdateRecommendation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Recommendation> & { id: string }) =>
      api.put<Recommendation>(`/api/recommendations/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recommendations"] }),
  });
}

export function useDeleteRecommendation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/api/recommendations/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recommendations"] }),
  });
}

// ════════════════════════════════════════════
// BILLING
// ════════════════════════════════════════════
export function useBilling() {
  return useQuery<BillingState>({
    queryKey: ["billing"],
    queryFn: () => api.get("/api/billing"),
  });
}

export function useUpdateBilling() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<BillingState>) => api.put<BillingState>("/api/billing", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["billing"] }),
  });
}
