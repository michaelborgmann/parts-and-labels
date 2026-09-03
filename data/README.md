# Dateibasierter Katalog

Eine UTF-8-JSON-Datei pro Bauteil in `data/parts/`. Produktdaten gehören
hierher, nicht in React-Komponenten. Die Seite liest bei jedem vollständigen
Neuladen alle JSON-Dateien im Ordner serverseitig ein; keine Importliste nötig.
Die Dateien werden validiert. Fehler nennen im Serverprotokoll die betroffene Datei.

- `yageo-mf0207fte52-330r.json`: echter Artikel aus den bereitgestellten
  Händlerdaten und dem bisherigen Quellenvergleich.
- `example-*.json`: illustrative Beispiele, keine weiteren gekauften Artikel.
- `inventory.json`: Einkäufe und aktuelle Bestandsfeststellungen, per `partId`
  mit dem Katalog verknüpft. Einkaufsmenge ist nicht automatisch Restbestand.

## Ein Bauteil ergänzen

1. Passende Datei kopieren und eindeutig benennen.
2. Neue stabile `id` vergeben. Hersteller/Teilenummer bei unbekannter Herkunft
   weglassen, nicht erfinden. Jede bekannte Herstellervariante erhält eine eigene Datei.
3. Daten, Quellen und Hinweise anpassen; beim Kopieren keine fremden
   technischen Angaben oder Quellenhinweise übernehmen.
4. `npm run validate:catalog` ausführen und die Webseite vollständig neu laden.

`schemaVersion` ist derzeit 1. Alle Felder außer ausdrücklich optionalen Feldern
sind erforderlich; unbenutzte Listen bleiben leer. Verbindliches Schema:
`lib/catalog/schema.ts`.

Für `kind: "resistor"` sind Widerstand in Ohm, Toleranz in Prozent und Leistung
in Watt numerisch unter `resistor` hinterlegt. `bandCount: 5` aktiviert die
berechnete Fünfringgrafik; `null` lässt sie weg. Nicht darstellbare Kombinationen
erhalten keine Grafik. Die Zeichnung ist berechnet, keine bestätigte Produktaufnahme.
Andere Bauteile verwenden vorerst `kind: "generic"`, `name` und
`specifications` aus Einträgen mit `label`, `value` und optionaler `unit`.

`facts` erscheinen offen in der Detailansicht. `sections` bestehen aus
`title`, `entries` und `notes` und erscheinen als aufklappbare Abschnitte.
`notices` enthalten hervorgehobene Hinweise aus `title` und `text`.
Einträge können mit `sourceId` eine Quelle aus `sources` referenzieren.
`label.qrSourceId` bestimmt das QR-Ziel. URLs werden nicht verkürzt.
Labelwert, Farbcode und technische Hauptwerte werden aus denselben Daten erzeugt.

In `inventory.json` sind Preise optionale Dezimalstrings (z. B. `"0.035"`),
keine gerundeten Stückpreise. Datum: `YYYY-MM-DD`.
Ein unbekannter Bestand hat `quantity: null`, `status: "unknown"`;
gezählte bzw. geschätzte Mengen haben einen ganzzahligen Wert (auch 0)
und `status: "counted"` bzw. `"estimated"`.
Weitere Käufe werden ergänzt, nicht auf den bestehenden Kauf addiert.
Bestandsfeststellungen werden aktuell manuell gepflegt, nicht automatisch berechnet.

## Betrieb und Grenzen

Node.js ab 22.18 verwenden. `npm test`, `npm run typecheck` und
`npm run build` prüfen Code und Daten; der Build validiert den Katalog automatisch.
Der Node-Server benötigt den `data/`-Ordner im Projektverzeichnis auch zur Laufzeit.
Dies ist kein statischer Export und keine Schreiboberfläche. Bei Deployment muss
der Ordner mit ausgeliefert werden; die Dateien sind dort nur eine Lesequelle.

Alle an den Katalog übergebenen Daten sind im Browser sichtbar. Private Einkaufs-
oder Bestandsdaten nicht ungeprüft auf einer öffentlichen Instanz bereitstellen.
Die bestehenden MongoDB-Dateien unter `lib/parts/` sind eine ungenutzte Grundlage;
der Katalog verwendet ausschließlich `lib/catalog/` und `data/`.
