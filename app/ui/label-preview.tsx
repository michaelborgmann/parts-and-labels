import type { Part } from "../../lib/catalog/schema";
import type { Locale, Messages } from "../../lib/i18n";
import { ResistorLabel } from "./resistor-label";
import { CapacitorLabel } from "./capacitor-label";
import { BjtLabel } from "./bjt-label";
import { JfetLabel } from "./jfet-label";
import { LedLabel } from "./led-label";
import { LogicLabel } from "./logic-label";
import { IcSocketLabel } from "./ic-socket-label";
import { SwitchLabel } from "./switch-label";
import { TimerLabel } from "./timer-label";
import { SpeakerLabel } from "./speaker-label";
import { MicrophoneLabel } from "./microphone-label";
import { AmplifierLabel } from "./amplifier-label";
import { DiodeLabel } from "./diode-label";
import { VoltageRegulatorLabel } from "./voltage-regulator-label";
import { CounterLabel } from "./counter-label";
import { SevenSegmentLabel } from "./seven-segment-label";
import { RelayLabel } from "./relay-label";
import { PotentiometerLabel } from "./potentiometer-label";
import { ConnectorLabel } from "./connector-label";
import { DisplayLabel } from "./display-label";
import { AudioModuleLabel } from "./audio-module-label";

type LabelPreviewProps = {
  part: Part;
  locale: Locale;
  messages: Messages;
};

export function LabelPreview({ part, locale, messages }: LabelPreviewProps) {
  let label;

  switch (part.type) {
    case "jfet":
      label = <JfetLabel part={part} messages={messages} />;
      break;
    case "speaker":
      label = <SpeakerLabel part={part} locale={locale} messages={messages} />;
      break;
    case "microphone":
      label = <MicrophoneLabel part={part} locale={locale} messages={messages} />;
      break;
    case "amplifier":
      label = <AmplifierLabel part={part} locale={locale} messages={messages} />;
      break;
    case "diode":
      label = <DiodeLabel part={part} locale={locale} messages={messages} />;
      break;
    case "voltage-regulator":
      label = <VoltageRegulatorLabel part={part} locale={locale} messages={messages} />;
      break;
    case "counter":
      label = <CounterLabel part={part} locale={locale} messages={messages} />;
      break;
    case "seven-segment":
      label = <SevenSegmentLabel part={part} locale={locale} messages={messages} />;
      break;
    case "relay":
      label = <RelayLabel part={part} locale={locale} messages={messages} />;
      break;
    case "potentiometer":
      label = <PotentiometerLabel part={part} locale={locale} messages={messages} />;
      break;
    case "connector":
      label = <ConnectorLabel part={part} locale={locale} messages={messages} />;
      break;
    case "display":
      label = <DisplayLabel part={part} locale={locale} messages={messages} />;
      break;
    case "audio-module":
      label = <AudioModuleLabel part={part} locale={locale} messages={messages} />;
      break;
    case "timer":
      label = <TimerLabel part={part} locale={locale} messages={messages} />;
      break;
    case "switch":
      label = <SwitchLabel part={part} locale={locale} messages={messages} />;
      break;
    case "ic-socket":
      label = <IcSocketLabel part={part} locale={locale} messages={messages} />;
      break;
    case "logic":
      label = <LogicLabel part={part} locale={locale} messages={messages} />;
      break;
    case "resistor":
      label = <ResistorLabel part={part} locale={locale} messages={messages} />;
      break;
    case "capacitor":
      label = <CapacitorLabel part={part} locale={locale} messages={messages} />;
      break;
    case "bjt":
      label = <BjtLabel part={part} locale={locale} messages={messages} />;
      break;
    case "led":
      label = <LedLabel part={part} locale={locale} messages={messages} />;
      break;
  }

  return (
    <section className="panel preview-section" aria-label={messages.labels.preview}>
      <div className="preview-heading">
        <h2>{messages.labels.preview}</h2>
        <span>{messages.labels.previewOnly}</span>
      </div>
      <div className="label-stage">
        {label}
      </div>
    </section>
  );
}
