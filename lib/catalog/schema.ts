import { z } from "zod";

const text = z.string().trim().min(1);

const httpUrl = z.url({ protocol: /^https?$/ });

const commonFields = {
  id: z.string().regex(/^[a-zA-Z0-9_-]+$/),
  name: text,
  manufacturer: text.optional(),
  manufacturerPartNumber: text.optional(),
  quantity: z.number().int().nonnegative().nullable(),
  datasheets: z.array(httpUrl).optional(),
  link: httpUrl.optional(),
};

const resistorSpecificationsSchema = z.strictObject({
  resistanceOhms: z.number().finite().nonnegative(),
  tolerancePercent: z.number().finite().positive().max(100).optional(),
  bandCount: z.literal(5).optional(),
});

export const resistorPartSchema = z.strictObject({
  ...commonFields,
  type: z.literal("resistor"),
  specifications: resistorSpecificationsSchema,
});

const capacitorSpecificationsSchema = z.strictObject({
  capacitanceFarads: z.number().finite().positive(),
  technology: text.optional(),
  construction: text.optional(),
  mounting: text.optional(),
  tolerancePercent: z.number().finite().positive().max(100).optional(),
  ratedVoltageVolts: z.number().finite().positive().optional(),
  dielectric: text.optional(),
  leadSpacingMm: z.number().finite().positive().optional(),
});

export const capacitorPartSchema = z.strictObject({
  ...commonFields,
  type: z.literal("capacitor"),
  specifications: capacitorSpecificationsSchema,
});

const bjtSpecificationsSchema = z.strictObject({
  polarity: z.enum(["npn", "pnp"]),
  package: text.optional(),
  maxCollectorEmitterVoltageVolts: z.number().finite().positive().optional(),
  maxCollectorCurrentAmps: z.number().finite().positive().optional(),
});

export const bjtPartSchema = z.strictObject({
  ...commonFields,
  type: z.literal("bjt"),
  specifications: bjtSpecificationsSchema,
});

const ledSpecificationsSchema = z.strictObject({
  color: text,
  diameterMm: z.number().finite().positive().optional(),
  mounting: text.optional(),
  luminousIntensityMillicandelas: z.number().finite().nonnegative().optional(),
  viewingAngleDegrees: z.number().finite().positive().max(360).optional(),
});

export const ledPartSchema = z.strictObject({
  ...commonFields,
  type: z.literal("led"),
  specifications: ledSpecificationsSchema,
});

export const logicPartSchema = z.strictObject({
  ...commonFields,
  type: z.literal("logic"),
  specifications: z.strictObject({
    family: text.optional(),
    function: z.enum(["nand", "inverter", "and", "or", "nor"]),
    inputType: z.enum(["standard", "schmitt-trigger"]).optional(),
    gateCount: z.number().int().positive(),
    inputsPerGate: z.number().int().positive(),
    package: text.optional(),
    supplyVoltageMinVolts: z.number().finite().positive().optional(),
    supplyVoltageMaxVolts: z.number().finite().positive().optional(),
  }).refine(
    s => s.function !== "inverter" || s.inputsPerGate === 1,
    { message: "An inverter has exactly one input", path: ["inputsPerGate"] },
  ).refine(
    s => s.supplyVoltageMinVolts === undefined ||
      s.supplyVoltageMaxVolts === undefined ||
      s.supplyVoltageMinVolts <= s.supplyVoltageMaxVolts,
    { message: "Minimum supply voltage must not exceed maximum", path: ["supplyVoltageMaxVolts"] },
  ),
});

export const icSocketPartSchema = z.strictObject({
  ...commonFields,
  type: z.literal("ic-socket"),
  specifications: z.strictObject({
    pinCount: z.number().int().positive(),
    rowSpacingMm: z.number().finite().positive().optional(),
    contactType: text.optional(),
    contactPlating: text.optional(),
  }),
});

export const switchPartSchema = z.strictObject({
  ...commonFields,
  type: z.literal("switch"),
  specifications: z.strictObject({
    style: text,
    action: z.enum(["momentary", "latching"]),
    contactForm: text,
    poleCount: z.number().int().positive(),
    mounting: text.optional(),
    leadSpacingMm: z.number().finite().positive().optional(),
    dimensionsMm: z.strictObject({
      length: z.number().finite().positive(),
      width: z.number().finite().positive(),
      height: z.number().finite().positive(),
    }).optional(),
  }),
});

export const timerPartSchema = z.strictObject({
  ...commonFields,
  type: z.literal("timer"),
  specifications: z.strictObject({
    channelCount: z.number().int().positive(),
    technology: text.optional(),
    package: text.optional(),
    supplyVoltageMinVolts: z.number().finite().positive().optional(),
    supplyVoltageMaxVolts: z.number().finite().positive().optional(),
  }).refine(
    s => s.supplyVoltageMinVolts === undefined ||
      s.supplyVoltageMaxVolts === undefined ||
      s.supplyVoltageMinVolts <= s.supplyVoltageMaxVolts,
    { message: "Minimum supply voltage must not exceed maximum", path: ["supplyVoltageMaxVolts"] },
  ),
});

export const potentiometerPartSchema = z.strictObject({
  ...commonFields,
  type: z.literal("potentiometer"),
  specifications: z.strictObject({
    resistanceOhms: z.number().finite().positive(),
    taper: z.enum(["linear", "logarithmic"]).optional(),
    style: z.enum(["rotary", "trimmer"]).optional(),
    gangCount: z.number().int().positive(),
    shaftDiameterMm: z.number().finite().positive().optional(),
  }),
});

export const connectorPartSchema = z.strictObject({
  ...commonFields,
  type: z.literal("connector"),
  specifications: z.strictObject({
    style: z.enum(["pin-header", "socket-header"]),
    rows: z.number().int().positive(),
    pinsPerRow: z.number().int().positive(),
    pitchMm: z.number().finite().positive(),
    orientation: z.enum(["straight", "right-angle"]).optional(),
    heightMm: z.number().finite().positive().optional(),
  }),
});

export const displayPartSchema = z.strictObject({
  ...commonFields,
  type: z.literal("display"),
  specifications: z.strictObject({
    technology: text,
    widthPixels: z.number().int().positive(),
    heightPixels: z.number().int().positive(),
    diagonalInches: z.number().finite().positive().optional(),
    controller: text.optional(),
    interfaces: z.array(text).min(1).optional(),
  }),
});

export const audioModulePartSchema = z.strictObject({
  ...commonFields,
  type: z.literal("audio-module"),
  specifications: z.strictObject({
    codec: text,
    compatibleWith: z.array(text).min(1).optional(),
    sampleRateHz: z.number().finite().positive().optional(),
    bitDepth: z.number().int().positive().optional(),
  }),
});

export const speakerPartSchema = z.strictObject({
  ...commonFields,
  type: z.literal("speaker"),
  specifications: z.strictObject({
    impedanceOhms: z.number().finite().positive(),
    ratedPowerWatts: z.number().finite().positive().optional(),
  }),
});

export const microphonePartSchema = z.strictObject({
  ...commonFields,
  type: z.literal("microphone"),
  specifications: z.strictObject({
    technology: z.enum(["electret", "dynamic", "mems"]),
  }),
});

export const amplifierPartSchema = z.strictObject({
  ...commonFields,
  type: z.literal("amplifier"),
  specifications: z.strictObject({
    form: z.enum(["ic", "module"]),
    channelCount: z.number().int().positive(),
    amplifierClass: text.optional(),
    chip: text.optional(),
    package: text.optional(),
  }),
});

export const diodePartSchema = z.strictObject({
  ...commonFields,
  type: z.literal("diode"),
  specifications: z.strictObject({
    function: z.enum(["switching", "rectifier"]),
    package: text.optional(),
  }),
});

export const voltageRegulatorPartSchema = z.strictObject({
  ...commonFields,
  type: z.literal("voltage-regulator"),
  specifications: z.strictObject({
    technology: z.enum(["linear", "switching"]),
    outputVoltageVolts: z.number().finite(),
    package: text.optional(),
  }),
});

export const counterPartSchema = z.strictObject({
  ...commonFields,
  type: z.literal("counter"),
  specifications: z.strictObject({
    function: z.enum(["binary", "decade-seven-segment"]),
    counterCount: z.number().int().positive(),
    bitsPerCounter: z.number().int().positive().optional(),
    package: text.optional(),
  }),
});

export const sevenSegmentPartSchema = z.strictObject({
  ...commonFields,
  type: z.literal("seven-segment"),
  specifications: z.strictObject({
    digitCount: z.number().int().positive(),
    commonPin: z.enum(["cathode", "anode"]),
    color: text,
    digitHeightMm: z.number().finite().positive().optional(),
  }),
});

export const relayPartSchema = z.strictObject({
  ...commonFields,
  type: z.literal("relay"),
  specifications: z.strictObject({
    coilVoltageVolts: z.number().finite().positive(),
    coilSupply: z.enum(["dc", "ac"]),
    contactForm: z.enum(["normally-open", "normally-closed", "changeover"]),
    poleCount: z.number().int().positive(),
  }),
});

export const jfetPartSchema = z.strictObject({
  ...commonFields,
  type: z.literal("jfet"),
  specifications: z.strictObject({
    channel: z.enum(["n-channel", "p-channel"]),
    package: text.optional(),
  }),
});

export type JfetPart = z.infer<typeof jfetPartSchema>;

export const partSchema = z.discriminatedUnion("type", [
  jfetPartSchema,
  speakerPartSchema,
  microphonePartSchema,
  amplifierPartSchema,
  diodePartSchema,
  voltageRegulatorPartSchema,
  counterPartSchema,
  sevenSegmentPartSchema,
  relayPartSchema,
  potentiometerPartSchema,
  connectorPartSchema,
  displayPartSchema,
  audioModulePartSchema,
  resistorPartSchema,
  capacitorPartSchema,
  bjtPartSchema,
  ledPartSchema,
  logicPartSchema,
  icSocketPartSchema,
  switchPartSchema,
  timerPartSchema,
]);

export type Part = z.infer<typeof partSchema>;
export type ResistorPart = z.infer<typeof resistorPartSchema>;
export type CapacitorPart = z.infer<typeof capacitorPartSchema>;
export type BjtPart = z.infer<typeof bjtPartSchema>;
export type LedPart = z.infer<typeof ledPartSchema>;
export type LogicPart = z.infer<typeof logicPartSchema>;
export type IcSocketPart = z.infer<typeof icSocketPartSchema>;
export type SwitchPart = z.infer<typeof switchPartSchema>;
export type TimerPart = z.infer<typeof timerPartSchema>;
export type PotentiometerPart = z.infer<typeof potentiometerPartSchema>;
export type ConnectorPart = z.infer<typeof connectorPartSchema>;
export type DisplayPart = z.infer<typeof displayPartSchema>;
export type AudioModulePart = z.infer<typeof audioModulePartSchema>;
export type SpeakerPart = z.infer<typeof speakerPartSchema>;
export type MicrophonePart = z.infer<typeof microphonePartSchema>;
export type AmplifierPart = z.infer<typeof amplifierPartSchema>;
export type DiodePart = z.infer<typeof diodePartSchema>;
export type VoltageRegulatorPart = z.infer<typeof voltageRegulatorPartSchema>;
export type CounterPart = z.infer<typeof counterPartSchema>;
export type SevenSegmentPart = z.infer<typeof sevenSegmentPartSchema>;
export type RelayPart = z.infer<typeof relayPartSchema>;
