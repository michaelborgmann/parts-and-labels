import type { Part } from "../../lib/catalog/schema";
import { jfetSpecifications } from "../../lib/catalog/jfet-specifications";
import { ledSpecifications } from "../../lib/catalog/led-specifications";
import { logicSpecifications } from "../../lib/catalog/logic-specifications";
import { icSocketSpecifications } from "../../lib/catalog/ic-socket-specifications";
import { switchSpecifications } from "../../lib/catalog/switch-specifications";
import { timerSpecifications } from "../../lib/catalog/timer-specifications";
import { speakerSpecifications } from "../../lib/catalog/speaker-specifications";
import { microphoneSpecifications } from "../../lib/catalog/microphone-specifications";
import { amplifierSpecifications } from "../../lib/catalog/amplifier-specifications";
import { diodeSpecifications } from "../../lib/catalog/diode-specifications";
import { voltageRegulatorSpecifications } from "../../lib/catalog/voltage-regulator-specifications";
import { counterSpecifications } from "../../lib/catalog/counter-specifications";
import { sevenSegmentSpecifications } from "../../lib/catalog/seven-segment-specifications";
import { relaySpecifications } from "../../lib/catalog/relay-specifications";
import { potentiometerSpecifications } from "../../lib/catalog/potentiometer-specifications";
import { connectorSpecifications } from "../../lib/catalog/connector-specifications";
import { displaySpecifications } from "../../lib/catalog/display-specifications";
import { audioModuleSpecifications } from "../../lib/catalog/audio-module-specifications";
import type { Locale, Messages } from "../../lib/i18n";

type PartSpecificationsProps = {
  part: Part;
  locale: Locale;
  messages: Messages;
};

export function PartSpecifications({
  part,
  locale,
  messages,
}: PartSpecificationsProps) {
  const text = messages.details;
  const number = new Intl.NumberFormat(locale, {
    maximumSignificantDigits: 12,
  });
  const rows: { label: string; value: string }[] = [];
  if (part.type === "jfet") rows.push(...jfetSpecifications(part, messages));

  if (part.type === "resistor") {
    rows.push({
      label: text.resistance,
      value: `${number.format(part.specifications.resistanceOhms)} Ω`,
    });
  } else if (part.type === "capacitor") {
    const farads = part.specifications.capacitanceFarads;
    const [scale, unit]: [number, string] = farads >= 1 ? [1, "F"]
      : farads >= 1e-6 ? [1e-6, "µF"]
      : farads >= 1e-9 ? [1e-9, "nF"]
      : [1e-12, "pF"];

    rows.push({
      label: text.capacitance,
      value: `${number.format(farads / scale)} ${unit}`,
    });
  }

  if (
    (part.type === "resistor" || part.type === "capacitor") &&
    part.specifications.tolerancePercent !== undefined
  ) {
    rows.push({
      label: text.tolerance,
      value: `±${number.format(part.specifications.tolerancePercent)} %`,
    });
  }

  if (part.type === "resistor" && part.specifications.bandCount !== undefined) {
    rows.push({
      label: text.bandCount,
      value: number.format(part.specifications.bandCount),
    });
  }

  if (part.type === "capacitor") {
    const specs = part.specifications;
    if (specs.ratedVoltageVolts !== undefined) {
      rows.push({
        label: text.ratedVoltage,
        value: `${number.format(specs.ratedVoltageVolts)} V`,
      });
    }
    if (specs.dielectric !== undefined) {
      rows.push({ label: text.dielectric, value: specs.dielectric });
    }
    if (specs.leadSpacingMm !== undefined) {
      rows.push({
        label: text.leadSpacing,
        value: `${number.format(specs.leadSpacingMm)} mm`,
      });
    }
  }

  if (part.type === "bjt") {
    const specs = part.specifications;
    rows.push({ label: text.polarity, value: specs.polarity.toUpperCase() });
    if (specs.package) {
      rows.push({ label: text.package, value: specs.package });
    }
    if (specs.maxCollectorEmitterVoltageVolts !== undefined) {
      rows.push({
        label: text.maxCollectorEmitterVoltage,
        value: `${number.format(specs.maxCollectorEmitterVoltageVolts)} V`,
      });
    }
    if (specs.maxCollectorCurrentAmps !== undefined) {
      rows.push({
        label: text.maxCollectorCurrent,
        value: `${number.format(specs.maxCollectorCurrentAmps)} A`,
      });
    }
  }

  if (part.type === "led") {
    rows.push(...ledSpecifications(part, locale, messages));
  }

  if (part.type === "logic") {
    rows.push(...logicSpecifications(part, locale, messages));
  }

  if (part.type === "ic-socket") {
    rows.push(...icSocketSpecifications(part, locale, messages));
  }

  if (part.type === "switch") {
    rows.push(...switchSpecifications(part, locale, messages));
  }

  if (part.type === "timer") {
    rows.push(...timerSpecifications(part, locale, messages));
  }

  if (part.type === "potentiometer") {
    rows.push(...potentiometerSpecifications(part, locale, messages));
  }

  if (part.type === "connector") {
    rows.push(...connectorSpecifications(part, locale, messages));
  }

  if (part.type === "display") {
    rows.push(...displaySpecifications(part, locale, messages));
  }

  if (part.type === "audio-module") {
    rows.push(...audioModuleSpecifications(part, locale, messages));
  }

  if (part.type === "speaker") {
    rows.push(...speakerSpecifications(part, locale, messages));
  }

  if (part.type === "microphone") {
    rows.push(...microphoneSpecifications(part, locale, messages));
  }

  if (part.type === "amplifier") {
    rows.push(...amplifierSpecifications(part, locale, messages));
  }

  if (part.type === "diode") {
    rows.push(...diodeSpecifications(part, locale, messages));
  }

  if (part.type === "voltage-regulator") {
    rows.push(...voltageRegulatorSpecifications(part, locale, messages));
  }

  if (part.type === "counter") {
    rows.push(...counterSpecifications(part, locale, messages));
  }

  if (part.type === "seven-segment") {
    rows.push(...sevenSegmentSpecifications(part, locale, messages));
  }

  if (part.type === "relay") {
    rows.push(...relaySpecifications(part, locale, messages));
  }

  return (
    <table className="spec-table" aria-label={text.specifications}>
      <tbody>
        {rows.map(({ label, value }) => (
          <tr key={label}>
            <th scope="row">{label}</th>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
