import { z } from "zod";

export const packerShipperSchema = z.object({
  id: z.string().uuid(),
  type: z.literal("PACKER_SHIPPER"),
  createdAt: z.string(),
  
  // Section A1
  operationName: z.string().min(1, "Operation name is required"),
  primaryContactName: z.string().min(1, "Contact name is required"),
  primaryContactPhone: z.string().min(1, "Phone is required"),
  pcaName: z.string().min(1, "PCA name is required"),
  packerShipper: z.string().min(1, "Packer/Shipper is required"),
  
  // Section A2
  blockId: z.string().min(1, "Block is required"),
  blockName: z.string().min(1, "Block name is required"),
  acresTreated: z.number().min(0.1, "Acres required"),
  crop: z.string().min(1, "Crop is required"),
  variety: z.string().optional(),
  irrigationType: z.enum(["Double-line drip", "Micro", "Fan-jets", "Flood", "Other"]).optional(),
  
  // Section A3
  intendedMarket: z.enum(["Domestic", "Export", "Both"], {
    required_error: "Market is required",
  }),
  buyerRestrictions: z.boolean(),
  restrictionsNotes: z.string().optional(),
  
  // Section A4
  estimatedHarvestWindowStart: z.string().min(1, "Start date required"),
  estimatedHarvestWindowEnd: z.string().min(1, "End date required"),
  crewConstraintsNotes: z.string().optional(),
  
  // Section A5
  confirmLogsComplete: z.boolean().refine((val) => val === true, {
    message: "Must confirm logs are complete",
  }),
  missingLogsNotes: z.string().optional(),
  
  // Section A6
  issueType: z.enum(["Pest", "Disease", "Weed", "Nutrition", "Irrigation-stress", "Other"], {
    required_error: "Issue type is required",
  }),
  observations: z.string().min(1, "Observations required"),
  locationInBlock: z.enum(["Whole block", "Edges", "Hotspots", "Rows", "Other"], {
    required_error: "Location is required",
  }),
  
  // Section A7
  outputTypes: z.array(z.string()).min(1, "Select at least one output type"),
  cadence: z.enum(["Weekly", "Monthly", "On-demand"], {
    required_error: "Cadence is required",
  }),
});

export const restrictedMaterialSchema = z.object({
  id: z.string().uuid(),
  type: z.literal("RESTRICTED_MATERIAL"),
  createdAt: z.string(),
  
  blockId: z.string().min(1, "Block is required"),
  blockName: z.string().min(1, "Block name is required"),
  acresTreated: z.number().min(0.1, "Acres required"),
  crop: z.string().min(1, "Crop is required"),
  variety: z.string().optional(),
  
  // Section B1
  restrictedMaterialsProgram: z.boolean(),
  permitHolderName: z.string().optional(),
  county: z.string().optional(),
  
  // Section B2
  sensitiveSitesNearby: z.boolean(),
  sensitiveSiteTypes: z.array(z.string()).optional(),
  bufferRequirementsKnown: z.enum(["Yes", "No", "Not sure"]).optional(),
  
  // Section B3
  applicationMethodsAvailable: z.array(z.string()).min(1, "Select at least one method"),
  crewAvailabilityWindow: z.string().min(1, "Crew availability required"),
  
  // Section B4
  productProhibitionsPresent: z.boolean(),
  prohibitionsNotes: z.string().optional(),
  knownNoGoList: z.string().optional(),
  
  // Section B5
  highCrewPresence: z.boolean(),
  upcomingOperations: z.array(z.string()).min(1, "Select at least one operation"),
  upcomingOperationsDatesNotes: z.string().min(1, "Dates/notes required"),
  windCutoffMph: z.number().optional(),
  preferredSprayWindow: z.string().optional(),
  
  // Section B6
  mustCapture: z.array(z.string()).min(1, "Select at least one record requirement"),
  mustAttach: z.array(z.string()).min(1, "Select at least one attachment requirement"),
  
  // Section B7
  driftComplaintHistory: z.boolean(),
  stopSprayEvents: z.boolean(),
  incidentNotes: z.string().optional(),
});

export type PackerShipperIntake = z.infer<typeof packerShipperSchema>;
export type RestrictedMaterialIntake = z.infer<typeof restrictedMaterialSchema>;
export type PcaIntake = PackerShipperIntake | RestrictedMaterialIntake;

// Default initial states
export const defaultPackerShipper: Partial<PackerShipperIntake> = {
  type: "PACKER_SHIPPER",
  buyerRestrictions: false,
  confirmLogsComplete: false,
  outputTypes: [],
};

export const defaultRestrictedMaterial: Partial<RestrictedMaterialIntake> = {
  type: "RESTRICTED_MATERIAL",
  restrictedMaterialsProgram: false,
  sensitiveSitesNearby: false,
  sensitiveSiteTypes: [],
  applicationMethodsAvailable: [],
  productProhibitionsPresent: false,
  highCrewPresence: false,
  upcomingOperations: [],
  mustCapture: [],
  mustAttach: [],
  driftComplaintHistory: false,
  stopSprayEvents: false,
};
