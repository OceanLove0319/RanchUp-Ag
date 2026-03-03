export const TEMPLATES_SEED = [
  {
    id: "tpl-sf-base",
    name: "Stone Fruit Base Program",
    cropTags: ["STONE_FRUIT"],
    notes: "Standard fungicide and fertigation program.",
    lines: [
      { id: "line-1", type: "SPRAY", materialName: "Pristine", rateValue: 1, rateUnit: "lb/ac", passesPlanned: 2 },
      { id: "line-2", type: "SPRAY", materialName: "Rovral", rateValue: 2, rateUnit: "pt/ac", passesPlanned: 1 },
      { id: "line-3", type: "FERT", materialName: "CAN-17", rateValue: 15, rateUnit: "gal/ac", passesPlanned: 3 },
      { id: "line-4", type: "FERT", materialName: "Potassium Nitrate", rateValue: 25, rateUnit: "lb/ac", passesPlanned: 2 }
    ]
  },
  {
    id: "tpl-sf-high",
    name: "Stone Fruit High-Pressure",
    cropTags: ["STONE_FRUIT"],
    notes: "Aggressive program for high disease pressure years.",
    lines: [
      { id: "line-1", type: "SPRAY", materialName: "Pristine", rateValue: 1, rateUnit: "lb/ac", passesPlanned: 3 },
      { id: "line-2", type: "SPRAY", materialName: "Rovral", rateValue: 2, rateUnit: "pt/ac", passesPlanned: 2 },
      { id: "line-3", type: "SPRAY", materialName: "Luna Sensation", rateValue: 7.6, rateUnit: "oz/ac", passesPlanned: 1 },
      { id: "line-4", type: "FERT", materialName: "CAN-17", rateValue: 15, rateUnit: "gal/ac", passesPlanned: 3 }
    ]
  },
  {
    id: "tpl-citrus-fert",
    name: "Citrus Fertigation-Heavy",
    cropTags: ["CITRUS"],
    notes: "Continuous feed program via drip/fanjet.",
    lines: [
      { id: "line-1", type: "FERT", materialName: "UN-32", rateValue: 10, rateUnit: "gal/ac", passesPlanned: 6 },
      { id: "line-2", type: "FERT", materialName: "CAN-17", rateValue: 12, rateUnit: "gal/ac", passesPlanned: 4 },
      { id: "line-3", type: "SPRAY", materialName: "Success", rateValue: 6, rateUnit: "oz/ac", passesPlanned: 2 }
    ]
  },
  {
    id: "tpl-almond-base",
    name: "Almond Base",
    cropTags: ["NUT"],
    lines: [
      { id: "line-1", type: "SPRAY", materialName: "Pristine", rateValue: 1, rateUnit: "lb/ac", passesPlanned: 2 },
      { id: "line-2", type: "SPRAY", materialName: "Intrepid", rateValue: 16, rateUnit: "oz/ac", passesPlanned: 2 },
      { id: "line-3", type: "FERT", materialName: "UAN-32", rateValue: 15, rateUnit: "gal/ac", passesPlanned: 4 }
    ]
  },
  {
    id: "tpl-pistachio-base",
    name: "Pistachio Base",
    cropTags: ["NUT"],
    lines: [
      { id: "line-1", type: "SPRAY", materialName: "Luna Sensation", rateValue: 6, rateUnit: "oz/ac", passesPlanned: 2 },
      { id: "line-2", type: "FERT", materialName: "CAN-17", rateValue: 20, rateUnit: "gal/ac", passesPlanned: 3 }
    ]
  },
  {
    id: "tpl-walnut-base",
    name: "Walnut Base",
    cropTags: ["NUT"],
    lines: [
      { id: "line-1", type: "SPRAY", materialName: "Kocide", rateValue: 2, rateUnit: "lb/ac", passesPlanned: 3 },
      { id: "line-2", type: "FERT", materialName: "UN-32", rateValue: 15, rateUnit: "gal/ac", passesPlanned: 3 }
    ]
  }
];
