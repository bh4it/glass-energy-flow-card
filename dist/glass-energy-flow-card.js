/**
 * Glass Energy Flow Card
 * Dark Glassmorphism + Neon energy flow for Home Assistant.
 * Vanilla Web Components, no build step.
 * v0.9.5 — the PV total is centred in the run instead of hugging the panel
 * v0.9.4 — the frame is sized from the measured text, so it never clips it
 * v0.9.3 — the PV total gets a frame in the colour of its own flow
 * v0.9.2 — PV total sits centred on its own wire, which is cut away behind it
 * v0.9.1 — light scheme reworked into a Fluent look: frosted panels on a
 *           periwinkle wash, flows in one cool cyan/blue/violet family
 * v0.9.0 — light scheme selectable from the editor; uploaded pictures are
 *           freed from their backdrop automatically
 * v0.8.5 — battery values keep clear of the artwork; second line for every consumer
 */
(function () {
  const CARD_VERSION = "1.4.0";

  // ------------------------------------------------------------------ i18n
  // The UI follows Home Assistant's language: German for "de", English
  // otherwise. The German texts double as keys, EN maps them to English.
  const langOf = (l) => (/^de\b/i.test(l || "") ? "de" : "en");
  let LANG = langOf(typeof navigator !== "undefined" ? navigator.language : "");
  let DEC = LANG === "de" ? "," : ".";
  /** Adopt the language of hass; returns true when it changed. */
  const setLang = (hass) => {
    const l = hass && ((hass.locale && hass.locale.language) || hass.language);
    if (!l || langOf(l) === LANG) return false;
    LANG = langOf(l);
    DEC = LANG === "de" ? "," : ".";
    return true;
  };
  const EN = {
    "Energie": "Energy",
    "Netz nicht verfügbar": "Grid unavailable",
    "Netzbezug": "Grid import",
    "Einspeisung": "Export",
    "Netz": "Grid",
    "Bezug heute": "Import today",
    "lädt": "charging",
    "entlädt": "discharging",
    "hält": "idle",
    "Realer Bezug": "Metered import",
    "Reale Einspeisung": "Metered export",
    "Unvollständig": "Incomplete",
    "SPEICHER": "STORAGE",
    "PV-TOTAL": "PV TOTAL",
    "PV-VORHERSAGE": "PV FORECAST",
    "KLIMA": "CLIMATE",
    "Ertrag heute": "Yield today",
    "Heute": "Today",
    "Rest": "Remaining",
    "Morgen": "Tomorrow",
    "Keine Daten": "No data",
    "Lädt": "Charging",
    "Entlädt": "Discharging",
    "Bereit": "Idle",
    "Batterie": "Battery",
    "Energiefluss mit PV, Speicher, Netz, Klima, Verbrauchern und PV-Prognose.": "Energy flow with PV, storage, grid, climate, consumers and PV forecast.",
    "Akku mit Ladestand, Leistung und Kennzahlen im selben Glas-Look.": "Battery with state of charge, power and metrics in the same glass look.",
    "PV-Quellen": "PV sources",
    "PV-Ertrag & Vorhersage": "PV yield & forecast",
    "Speicher": "Storage",
    "Haus": "House",
    "Klima": "Climate",
    "Verbraucher": "Consumers",
    "Kopfzeile": "Header",
    "Farben": "Colours",
    "Bereiche": "Sections",
    "E-AUTO": "EV", "E-Auto": "EV", "Auto": "Car", "Verbunden": "Plugged in",
    "Nicht verbunden": "Not plugged in", "Voll": "Full", "Ladeleistung (W)": "Charging power (W)",
    "Stecker / Verbindung (optional)": "Plug / connection (optional)",
    "Reichweite in km (optional)": "Range in km (optional)",
    "Restzeit bis voll in Minuten (optional)": "Time to full in minutes (optional)",
    "Ziel-Ladestand (optional)": "Target charge level (optional)",
    "Lädt ab … W (Standard 50)": "Charging from … W (default 50)",
    "Vorzeichen umkehren (Ladeleistung negativ)": "Invert sign (charging power negative)",
    "Bildschirm wachhalten": "Keep screen awake", "Aus": "Off",
    "Nur Echo Show / Fire-Tablets (empfohlen)": "Echo Show / Fire tablets only (recommended)",
    "Auf allen Geräten": "On all devices",
    "Titel": "Title",
    "Layout": "Layout",
    "Automatisch (empfohlen)": "Automatic (recommended)",
    "Immer breit (Desktop)": "Always wide (desktop)",
    "Immer mittel (Tablet)": "Always medium (tablet)",
    "Immer gestapelt (Handy)": "Always stacked (phone)",
    "Breit ab … px": "Wide from … px",
    "Mittel ab … px": "Medium from … px",
    "Höhe anpassen": "Fit height",
    "In Vollbild-Sichten (empfohlen)": "In full-screen views (recommended)",
    "Immer an Fensterhöhe anpassen": "Always fit the window height",
    "Nie (natürliche Höhe)": "Never (natural height)",
    "Abstand nach unten (px)": "Bottom gap (px)",
    "Design": "Appearance",
    "Dunkel": "Dark",
    "Hell": "Light",
    "Farbschema": "Colour scheme",
    "Dunkel · Blau (Standard)": "Dark · Blue (default)",
    "Dunkel · Nachtblau": "Dark · Night blue",
    "Dunkel · Mitternacht": "Dark · Midnight",
    "Dunkel · Petrol": "Dark · Petrol",
    "Dunkel · Violett": "Dark · Violet",
    "Dunkel · Grafit": "Dark · Graphite",
    "Hell · Fluent": "Light · Fluent",
    "Hell · Blau": "Light · Blue",
    "Hell · Violett": "Light · Violet",
    "Leitungen": "Wires",
    "Lichtimpuls (empfohlen)": "Light pulse (recommended)",
    "Laufende Striche (wie bisher)": "Running dashes (classic)",
    "Ruhig – ohne Bewegung": "Calm – no motion",
    "Farbe innen": "Inner colour",
    "Farbe außen": "Outer colour",
    "Ausdehnung innen (%)": "Inner spread (%)",
    "Deckkraft der Kacheln (%)": "Tile opacity (%)",
    "Realer Bezug (Zähler)": "Metered import (meter)",
    "Reale Einspeisung (Zähler)": "Metered export (meter)",
    "Außentemperatur": "Outdoor temperature",
    "Luftfeuchtigkeit": "Humidity",
    "UV-Index": "UV index",
    "Wetter": "Weather",
    "Netzleistung": "Grid power",
    "Name": "Name",
    "Symbol": "Icon",
    "Einspeisung heute": "Export today",
    "Vorzeichen umkehren (positiv = Bezug)": "Invert sign (positive = import)",
    "Hausverbrauch": "House consumption",
    "Leistungssensor": "Power sensor",
    "Ertrag heute (Tageszähler)": "Yield today (daily counter)",
    "Einheit, falls der Sensor noch keine meldet": "Unit, if the sensor reports none",
    "Gesamtertrag heute (gemessen)": "Total yield today (measured)",
    "PV-Vorhersage heute": "PV forecast today",
    "PV-Vorhersage Resttag": "PV forecast rest of day",
    "PV-Vorhersage morgen": "PV forecast tomorrow",
    "Ladestand (%)": "State of charge (%)",
    "Leistung (W)": "Power (W)",
    "Vorzeichen umkehren (negativ = lädt)": "Invert sign (negative = charging)",
    "Status-Entität (optional)": "State entity (optional)",
    "Standby bis … W ausblenden (Standard 5)": "Hide standby up to … W (default 5)",
    "Optionales eigenes Foto im eingesteckten Zustand (sonst zeigt ein Stecker-Symbol die Verbindung)": "Optional own photo while plugged in (otherwise a plug symbol shows the connection)",
    "Eigenes Foto": "Own photo",
    "Fläche füllen": "Fill the area",
    "Ganz zeigen": "Show completely",
    "Zusatzwert 1": "Extra value 1",
    "Zusatzwert 2": "Extra value 2",
    "Zusatzwert 3": "Extra value 3",
    "Zusatzwert 4": "Extra value 4",
    "Zusatzwert 5": "Extra value 5",
    "Zusatzwert 6": "Extra value 6",
    "Symbol (optional)": "Icon (optional)",
    "Einheit (optional, sonst vom Sensor)": "Unit (optional, otherwise from the sensor)",
    "Kennzahl 1": "Metric 1",
    "Kennzahl 2": "Metric 2",
    "Entität": "Entity",
    "Beschriftung": "Label",
    "Einheit": "Unit",
    "Anzeigename": "Display name",
    "Farbe (z. B. #4dd0e1)": "Colour (e.g. #4dd0e1)",
    "Ausblenden": "Hide",
    "Bei 0 W ausblenden": "Hide at 0 W",
    "Zweite Zeile (z. B. Tagesverbrauch)": "Second line (e.g. daily usage)",
    "Entität für die zweite Zeile": "Entity for the second line",
    "Beschriftung (z. B. Heute)": "Label (e.g. Today)",
    "(ohne Entität)": "(no entity)",
    "Das ist keine Bilddatei.": "This is not an image file.",
    "Bild ist größer als 4 MB.": "The image is larger than 4 MB.",
    "Upload fehlgeschlagen": "Upload failed",
    "Editor konnte nicht geladen werden": "The editor could not be loaded",
    "Eigenes Bild": "Custom image",
    "Kein Bild — Symbol wird verwendet": "No image — the icon is used",
    "Ersetzt das Symbol auf der Karte.": "Replaces the icon on the card.",
    "Datei hierher ziehen oder auswählen (max. 4 MB).": "Drop a file here or choose one (max. 4 MB).",
    "Ersetzen": "Replace",
    "Eigenes Bild hochladen": "Upload image",
    "Zurücksetzen": "Reset",
    "Wird hochgeladen …": "Uploading …",
    "Standard-Grafik": "Default artwork",
    "Mitgelieferte Grafik": "Built-in artwork",
    "Nur Symbol": "Icon only",
    "Automatisch passend zum Bild oben": "Automatically matches the image above",
    "Noch nichts konfiguriert": "Nothing configured yet",
    "Keine Entität": "No entity",
    "Nichts angezeigt": "Nothing shown",
    "Zurück": "Back",
    "Optionales Bild im hellen Design": "Optional image for the light theme",
    "Reihenfolge bestimmt die Platzierung: die ersten füllen die rechte Spalte, der Rest die Reihen darunter.": "The order sets the placement: the first ones fill the right column, the rest the rows below.",
    "Mit den Pfeilen sortieren, mit dem Stift bearbeiten.": "Sort with the arrows, edit with the pencil.",
    "Noch nichts konfiguriert — unten eine Entität auswählen.": "Nothing configured yet — pick an entity below.",
    "Einblenden": "Show",
    "Nach oben": "Move up",
    "Nach unten": "Move down",
    "Bearbeiten": "Edit",
    "Entfernen": "Remove",
    "Hinzufügen": "Add",
    "Tipp: Steckdosen-Sensoren heißen meist „sensor.steckdose_…_power“.": "Tip: smart plug sensors are usually named “sensor.…_power”.",
    "Leistung (W, negativ = lädt)": "Power (W, negative = charging)",
    "Akzentfarbe (z. B. #33d6ff)": "Accent colour (e.g. #33d6ff)",
    "Zweite Akzentfarbe für den Verlauf (z. B. #32e2ad)": "Second accent colour for the gradient (e.g. #32e2ad)",
    "Kennzahlen": "Metrics",
    "Kennzahl": "Metric",
    "Name (optional, sonst vom Sensor)": "Name (optional, otherwise from the sensor)",
    "Kennzahlen erscheinen als Kacheln unter dem Balken. Mit den Pfeilen sortieren, mit dem Stift bearbeiten.": "Metrics appear as tiles below the bar. Sort with the arrows, edit with the pencil.",
    "Noch keine Kennzahlen — unten eine Entität auswählen.": "No metrics yet — pick an entity below.",
  };
  const T = (s) => (LANG === "de" ? s : (EN[s] ?? s));

  // ---------------------------------------------------------------- helpers
  const num = (hass, id) => {
    if (!id || !hass || !hass.states[id]) return null;
    const v = hass.states[id].state;
    if (v === "unknown" || v === "unavailable" || v === "" || v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const fmtW = (w) => {
    if (w == null) return "–";
    const a = Math.abs(w);
    if (a >= 1000) return (w / 1000).toFixed(2).replace(".", DEC) + " kW";
    // Below 10 W keep one decimal: rounding 0.4 W to "0 W" makes a device that
    // is genuinely drawing power look switched off.
    if (a > 0 && a < 10) return w.toFixed(1).replace(".", DEC) + " W";
    return Math.round(w) + " W";
  };
  const fmtKWh = (v) => (v == null ? "–" : v.toFixed(1).replace(".", DEC) + " kWh");
  const energyKWh = (hass, id, configuredUnit) => {
    const value = num(hass, id);
    if (value == null) return null;
    const unit = hass.states[id].attributes.unit_of_measurement || configuredUnit;
    return unit === "kWh" ? value : unit === "Wh" ? value / 1000 : unit === "MWh" ? value * 1000 : null;
  };
  const fmtPvEnergy = (value) => value == null ? "– kWh" : value.toFixed(2).replace(".", DEC) + " kWh";
  const PV_FORECAST = [
    { key: "forecast_today", label: "Heute" },
    { key: "forecast_remaining", label: "Rest" },
    { key: "forecast_tomorrow", label: "Morgen" },
  ];
  const fmtMeter = (v) => (v == null ? "–" : new Intl.NumberFormat(LANG === "de" ? "de-DE" : "en-US", {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(v) + " kWh");
  const fmtTemp = (v) => (v == null ? "–" : v.toFixed(1).replace(".", DEC) + " °C");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  // Any entity as short text: numbers localised with their unit ("10.746 km",
  // "417 d"), everything else as Home Assistant itself would show it.
  const fmtEntity = (hass, m) => {
    const st = hass.states[m.entity];
    if (!st || st.state === "unknown" || st.state === "unavailable") return "–";
    const n = Number(st.state);
    if (st.state === "" || !Number.isFinite(n)) {
      return typeof hass.formatEntityState === "function" ? hass.formatEntityState(st) : st.state;
    }
    const unit = m.unit || st.attributes.unit_of_measurement || "";
    const text = new Intl.NumberFormat(LANG === "de" ? "de-DE" : "en-US",
      { maximumFractionDigits: Math.abs(n) >= 100 ? 0 : 1 }).format(n);
    return unit ? `${text} ${unit}` : text;
  };
  const fmtBy = (unit, v) => {
    switch (unit) {
      case "kWh": return fmtKWh(v);
      case "°C": return fmtTemp(v);
      case "%": return v == null ? "–" : Math.round(v) + " %";
      default: return fmtW(v);
    }
  };

  const WEATHER_ICONS = {
    "clear-night": "mdi:weather-night", cloudy: "mdi:weather-cloudy",
    exceptional: "mdi:alert-circle-outline", fog: "mdi:weather-fog",
    hail: "mdi:weather-hail", lightning: "mdi:weather-lightning",
    "lightning-rainy": "mdi:weather-lightning-rainy", partlycloudy: "mdi:weather-partly-cloudy",
    pouring: "mdi:weather-pouring", rainy: "mdi:weather-rainy",
    snowy: "mdi:weather-snowy", "snowy-rainy": "mdi:weather-snowy-rainy",
    sunny: "mdi:weather-sunny", windy: "mdi:weather-windy",
    "windy-variant": "mdi:weather-windy-variant",
  };

  /**
   * Colour presets. `center` pools behind the house, `edge` takes over towards
   * the corners, `spread` is how far out the centre colour reaches, and `tile`
   * is how brightly the panels lift off that background (in percent).
   */
  const THEMES = {
    blau:        { mode: "dunkel", center: "#1a2655", edge: "#05070f", spread: 78, tile: 5.5 },
    dunkel:      { mode: "dunkel", center: "#0a1122", edge: "#05070f", spread: 85, tile: 5.5 },
    mitternacht: { mode: "dunkel", center: "#101c3d", edge: "#03040a", spread: 70, tile: 5.0 },
    petrol:      { mode: "dunkel", center: "#0f3242", edge: "#04090e", spread: 78, tile: 5.5 },
    violett:     { mode: "dunkel", center: "#241a52", edge: "#07050f", spread: 78, tile: 5.5 },
    grafit:      { mode: "dunkel", center: "#242a33", edge: "#0b0d11", spread: 85, tile: 6.5 },
    // Fluent-style light schemes: an almost white core that only turns into a
    // saturated periwinkle towards the rim, so frosted white panels still read
    // as panels instead of dissolving into the backdrop.
    hell:          { mode: "hell", center: "#fdfdff", edge: "#b6c4f2", spread: 62, tile: 58 },
    "hell-blau":   { mode: "hell", center: "#f7fbff", edge: "#93b6ea", spread: 58, tile: 62 },
    "hell-violett":{ mode: "hell", center: "#fefdff", edge: "#c0b2f0", spread: 62, tile: 58 },
  };

  /**
   * The two ink sets. Everything the stylesheet reads through a custom property
   * is listed here, so switching schemes never means editing CSS: `_applyTheme`
   * simply pushes one of these onto the host element.
   *
   * The light set is not the dark one inverted. On a pale background a thin
   * glowing hairline disappears, so panels there are opaque white cards with a
   * real border and a soft cast shadow, and the flow colours are darkened until
   * they carry against white.
   */
  const INK = {
    dunkel: {
      "--sc-ink": "#fff",
      "--sc-ink-soft": "#a9ddff",
      "--sc-ink-body": "#dbe6f5",
      "--sc-accent": "#7fd4ff",
      "--sc-halo": "rgba(5,12,24,.95)",
      "--sc-text-stroke": "rgba(0,0,0,.28)",
      "--sc-chip-bg": "rgba(255,255,255,.07)",
      "--sc-chip-line": "rgba(150,190,230,.28)",
      "--sc-chip-shadow": "inset 0 0 14px rgba(90,160,220,.08), 0 3px 12px rgba(0,0,0,.18)",
      "--sc-frame-fill": "rgba(255,255,255,.045)",
      "--sc-frame-line": "rgba(96,184,255,.5)",
      "--sc-frame-glow": "drop-shadow(0 0 12px rgba(55,160,255,.14))",
      "--sc-cell-line": "rgba(135,200,255,.22)",
      "--sc-wrap-line": "rgba(120,180,255,0.16)",
      "--sc-wrap-shadow": "0 0 60px rgba(0,120,255,0.08), inset 0 0 90px rgba(0,0,0,0.42)",
      "--sc-bar-bg": "rgba(255,255,255,0.08)",
      "--sc-prod": "#22e6a4",
      "--sc-cons": "#ff5f6d",
      "--sc-disch": "#ffb028",
      "--sc-idle": "rgba(125,155,195,.16)",
      "--sc-pv-fill": "rgba(34,230,164,0.055)",
      "--sc-pv-line": "rgba(34,230,164,0.38)",
      "--sc-pv-glow": "drop-shadow(0 0 12px rgba(34,230,164,.12))",
      "--sc-title-glow": "0 0 12px rgba(0,190,255,.55)",
      "--sc-center-glow": "drop-shadow(0 0 16px rgba(0,170,255,.35))",
      "--sc-glow-prod": "rgba(34,230,164,.95)",
      "--sc-glow-cons": "rgba(255,95,109,.95)",
      "--sc-glow-disch": "rgba(255,176,40,.9)",
    },
    hell: {
      "--sc-ink": "#16214a",
      "--sc-ink-soft": "#5a6bad",
      "--sc-ink-body": "#243059",
      "--sc-accent": "#2f7ee6",
      "--sc-halo": "rgba(255,255,255,.95)",
      "--sc-text-stroke": "rgba(255,255,255,.62)",
      // Frosted glass: a white wash held by a bright white rim and lifted by a
      // wide, very soft blue shadow. A dark hairline would look drawn-on here.
      "--sc-chip-bg": "rgba(255,255,255,.70)",
      "--sc-chip-line": "rgba(255,255,255,.95)",
      "--sc-chip-shadow": "0 4px 16px rgba(64,96,190,.14), inset 0 1px 0 rgba(255,255,255,.9)",
      "--sc-frame-fill": "rgba(255,255,255,.40)",
      "--sc-frame-line": "rgba(255,255,255,.92)",
      "--sc-frame-glow": "drop-shadow(0 6px 18px rgba(64,96,190,.16))",
      "--sc-cell-line": "rgba(255,255,255,.95)",
      "--sc-wrap-line": "rgba(255,255,255,.75)",
      "--sc-wrap-shadow": "0 10px 40px rgba(64,96,190,.16), inset 0 0 90px rgba(255,255,255,.5)",
      "--sc-bar-bg": "rgba(64,96,190,.16)",
      // One cool family instead of the traffic-light set: the flows stay
      // distinguishable, but the card reads as a single blue system.
      "--sc-prod": "#10b6d4",
      "--sc-cons": "#3f6fe8",
      "--sc-disch": "#7c5cff",
      "--sc-idle": "rgba(120,140,205,.30)",
      "--sc-pv-fill": "rgba(16,182,212,0.10)",
      "--sc-pv-line": "rgba(16,182,212,0.45)",
      "--sc-pv-glow": "drop-shadow(0 6px 18px rgba(64,96,190,.16))",
      "--sc-title-glow": "0 0 18px rgba(90,140,255,.35)",
      "--sc-center-glow": "drop-shadow(0 8px 24px rgba(64,110,220,.24))",
      "--sc-glow-prod": "rgba(16,182,212,.75)",
      "--sc-glow-cons": "rgba(63,111,232,.75)",
      "--sc-glow-disch": "rgba(124,92,255,.7)",
    },
  };

  /**
   * Force a colour to carry on the current background.
   *
   * The per-device colours in the configuration were picked against a near-black
   * card. Pale cyan on white is barely a colour at all, so in the light scheme
   * every icon tint is pushed down to a readable lightness while its hue — which
   * is what actually identifies the device — is left alone.
   */
  function inkify(hex, light) {
    if (!light || typeof hex !== "string") return hex;
    const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
    if (!m) return hex;
    const n = parseInt(m[1], 16);
    let r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    let l = (mx + mn) / 2;
    if (l <= 0.56) return hex;                        // already vivid enough
    const k = 0.56 / l;                               // scale towards black
    const to = (v) => Math.round(Math.max(0, Math.min(1, v * k)) * 255)
      .toString(16).padStart(2, "0");
    return "#" + to(r) + to(g) + to(b);
  }

  function normalize(raw) {
    const cfg = JSON.parse(JSON.stringify(raw || {}));
    cfg.title = cfg.title ?? T("Energie");
    if (cfg.keep_awake === true) cfg.keep_awake = "fire_os";
    cfg.layout = Object.assign({ mode: "auto", wide_min: 1100, mid_min: 680 }, cfg.layout || {});
    if (cfg.layout.aspect) {
      const a = Number(cfg.layout.aspect);
      cfg.layout.aspect = Number.isFinite(a) && a > 0.3 ? a : undefined;
    }
    // Panel views hand the card the whole viewport. Without this the card keeps
    // its natural height and the bottom row is cut off on short screens such as
    // an Echo Show, where the browser chrome eats part of the 1080 px.
    cfg.layout.fit_height = cfg.layout.fit_height || "auto";
    if (cfg.layout.bottom_gap == null) cfg.layout.bottom_gap = 10;

    // ------------------------------------------------------------- appearance
    cfg.theme = Object.assign({ preset: "blau", wires: "puls" }, cfg.theme || {});
    const preset = THEMES[cfg.theme.preset] || THEMES.blau;
    cfg.theme = Object.assign({}, preset, cfg.theme);
    if (cfg.theme.spread == null) cfg.theme.spread = preset.spread;
    cfg.theme.spread = clamp(Number(cfg.theme.spread) || preset.spread, 20, 140);
    cfg.theme.tile = clamp(Number(cfg.theme.tile) == null ? preset.tile
                                                         : Number(cfg.theme.tile), 0, 90);
    if (cfg.theme.mode !== "hell" && cfg.theme.mode !== "dunkel") {
      cfg.theme.mode = preset.mode || "dunkel";
    }

    cfg.header = cfg.header || {};
    cfg.pv = cfg.pv || {};
    cfg.solar = (cfg.solar || []).filter((x) => x && x.entity);
    cfg.batteries = (cfg.batteries || []).filter((x) => x && (x.soc || x.power));
    cfg.grid = cfg.grid || {};
    cfg.home = cfg.home || {};
    cfg.climate = (cfg.climate || []).filter((x) => x && (x.entity || x.state_entity));
    cfg.vehicles = (cfg.vehicles || []).filter((x) => x && (x.soc || x.power));
    cfg.consumers = (cfg.consumers || []).filter((x) => x && x.entity);
    return cfg;
  }

  // ------------------------------------------------------------ layout modes
  const MODES = {
    wide:   { vbw: 1560, pad: 26, tileW: 142, tileH: 104, gap: 18, houseR: 66, rightMax: 5, leftW: 252, batH: 90, lane: 34 },
    mid:    { vbw: 1080, pad: 22, tileW: 124, tileH: 96,  gap: 14, houseR: 58, rightMax: 4, leftW: 234, batH: 88, lane: 28 },
    narrow: { vbw: 480,  pad: 14, tileH: 90,  gap: 10, houseR: 44, cols: 3, batH: 78, lane: 20 },
  };

  const pickMode = (w, cfg) => {
    const m = cfg.layout.mode;
    if (m && m !== "auto") return MODES[m] ? m : "mid";
    if (!w) return "mid";
    if (w >= (cfg.layout.wide_min || 1100)) return "wide";
    if (w >= (cfg.layout.mid_min || 680)) return "mid";
    return "narrow";
  };


  /** Minimal binary heap keyed by float priority. */
  class Heap {
    constructor() { this.k = []; this.v = []; }
    get size() { return this.k.length; }
    push(key, val) {
      const k = this.k, v = this.v;
      k.push(key); v.push(val);
      let i = k.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (k[p] <= k[i]) break;
        [k[p], k[i]] = [k[i], k[p]]; [v[p], v[i]] = [v[i], v[p]];
        i = p;
      }
    }
    pop() {
      const k = this.k, v = this.v;
      const top = v[0];
      const lk = k.pop(), lv = v.pop();
      if (k.length) {
        k[0] = lk; v[0] = lv;
        let i = 0;
        for (;;) {
          const l = 2 * i + 1, r = l + 1;
          let m = i;
          if (l < k.length && k[l] < k[m]) m = l;
          if (r < k.length && k[r] < k[m]) m = r;
          if (m === i) break;
          [k[m], k[i]] = [k[i], k[m]]; [v[m], v[i]] = [v[i], v[m]];
          i = m;
        }
      }
      return top;
    }
  }

  // ---------------------------------------------------------------- router
  /**
   * Orthogonal A* router on a coarse grid. Every box registered via addBox()
   * becomes an obstacle, so connections are guaranteed never to cross a tile
   * or a group frame. Paths are simplified and drawn with rounded corners.
   */
  class Router {
    constructor(w, h, cell) {
      this.cell = cell;
      this.cols = Math.ceil(w / cell) + 1;
      this.rows = Math.ceil(h / cell) + 1;
      this.blocked = new Uint8Array(this.cols * this.rows);
      this.w = w; this.h = h;
    }
    _idx(cx, cy) { return cy * this.cols + cx; }
    addBox(x, y, w, h, pad) {
      const p = pad == null ? 6 : pad;
      const c = this.cell;
      const x0 = Math.max(0, Math.floor((x - p) / c));
      const x1 = Math.min(this.cols - 1, Math.ceil((x + w + p) / c));
      const y0 = Math.max(0, Math.floor((y - p) / c));
      const y1 = Math.min(this.rows - 1, Math.ceil((y + h + p) / c));
      for (let cy = y0; cy <= y1; cy++) for (let cx = x0; cx <= x1; cx++) this.blocked[this._idx(cx, cy)] = 1;
    }
    addCircle(cx, cy, r, pad) { this.addBox(cx - r, cy - r, 2 * r, 2 * r, pad == null ? 4 : pad); }
    _free(cx, cy, exempt) {
      if (cx < 0 || cy < 0 || cx >= this.cols || cy >= this.rows) return false;
      if (!this.blocked[this._idx(cx, cy)]) return true;
      if (!exempt) return false;
      const x = cx * this.cell, y = cy * this.cell;
      for (let i = 0; i < exempt.length; i++) {
        const e = exempt[i];
        if (x >= e.x0 && x <= e.x1 && y >= e.y0 && y <= e.y1) return true;
      }
      return false;
    }
    /** Nearest walkable cell to a point, searched in rings. */
    _snap(pt, exempt) {
      const c = this.cell;
      const bx = clamp(Math.round(pt.x / c), 0, this.cols - 1);
      const by = clamp(Math.round(pt.y / c), 0, this.rows - 1);
      if (this._free(bx, by, exempt)) return [bx, by];
      for (let r = 1; r <= 14; r++) {
        for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
          if (this._free(bx + dx, by + dy, exempt)) return [bx + dx, by + dy];
        }
      }
      return [bx, by];
    }
    /**
     * @param a {x,y}    start point (on the source box edge)
     * @param b {x,y}    end point (on the target box edge)
     * @param exempt     array of rects the path may pass through (source/target)
     */
    route(a, b, exempt) {
      const c = this.cell;
      const ex = (exempt || []).map((r) => ({ x0: r.x - c, y0: r.y - c, x1: r.x + r.w + c, y1: r.y + r.h + c }));
      const [sx, sy] = this._snap(a, ex);
      const [gx, gy] = this._snap(b, ex);
      const n = this.cols * this.rows;
      const start = this._idx(sx, sy), goal = this._idx(gx, gy);
      if (start === goal) return [a, b];
      const g = new Float32Array(n).fill(Infinity);
      const prev = new Int32Array(n).fill(-1);
      const dir = new Int8Array(n).fill(-1);
      const open = new Heap();
      const closed = new Uint8Array(n);
      g[start] = 0;
      open.push(0, start);
      const H = (i) => { const cx = i % this.cols, cy = (i / this.cols) | 0; return Math.abs(cx - gx) + Math.abs(cy - gy); };
      const D = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      let found = false, guard = 0;
      while (open.size && guard++ < 200000) {
        const cur = open.pop();
        if (closed[cur]) continue;
        closed[cur] = 1;
        if (cur === goal) { found = true; break; }
        const cx = cur % this.cols, cy = (cur / this.cols) | 0;
        for (let d = 0; d < 4; d++) {
          const nx = cx + D[d][0], ny = cy + D[d][1];
          if (!this._free(nx, ny, ex)) continue;
          const ni = this._idx(nx, ny);
          const turn = dir[cur] !== -1 && dir[cur] !== d ? 2.2 : 0;
          const ng = g[cur] + 1 + turn;
          if (ng < g[ni] - 1e-6) { g[ni] = ng; prev[ni] = cur; dir[ni] = d; open.push(ng + H(ni) * 1.06, ni); }
        }
      }
      if (!found) return [a, b];
      const pts = [];
      for (let i = goal; i !== -1; i = prev[i]) pts.push({ x: (i % this.cols) * c, y: ((i / this.cols) | 0) * c });
      pts.reverse();
      pts[0] = { x: a.x, y: a.y };
      pts[pts.length - 1] = { x: b.x, y: b.y };
      return simplify(pts);
    }
  }

  /**
   * Candidate-based orthogonal routing. Diagrams look best with simple L, Z and
   * U shapes, so we try those first and only fall back to A* when every simple
   * variant is blocked. `hit` reports whether a polyline crosses an obstacle.
   */
  function segHitsRect(a, b, r, pad) {
    const x0 = r.x - pad, y0 = r.y - pad, x1 = r.x + r.w + pad, y1 = r.y + r.h + pad;
    let t0 = 0, t1 = 1;
    const dx = b.x - a.x, dy = b.y - a.y;
    const P = [-dx, dx, -dy, dy];
    const Q = [a.x - x0, x1 - a.x, a.y - y0, y1 - a.y];
    for (let i = 0; i < 4; i++) {
      if (Math.abs(P[i]) < 1e-9) { if (Q[i] < 0) return false; continue; }
      const t = Q[i] / P[i];
      if (P[i] < 0) { if (t > t1) return false; if (t > t0) t0 = t; }
      else { if (t < t0) return false; if (t < t1) t1 = t; }
    }
    return t1 - t0 > 0.02;
  }

  function polyBlocked(pts, rects, pad) {
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      for (let j = 0; j < rects.length; j++) if (segHitsRect(a, b, rects[j], pad)) return true;
    }
    return false;
  }

  /** Build the simple orthogonal candidates between two points. */
  function candidates(a, b, lanes) {
    const list = [];
    const push = (...p) => list.push(simplify(p));
    if (Math.abs(a.x - b.x) < 1.5 || Math.abs(a.y - b.y) < 1.5) push(a, b);
    push(a, { x: b.x, y: a.y }, b);                       // horizontal first
    push(a, { x: a.x, y: b.y }, b);                       // vertical first
    (lanes.x || []).forEach((mx) => push(a, { x: mx, y: a.y }, { x: mx, y: b.y }, b));
    (lanes.y || []).forEach((my) => push(a, { x: a.x, y: my }, { x: b.x, y: my }, b));
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    push(a, { x: mx, y: a.y }, { x: mx, y: b.y }, b);
    push(a, { x: a.x, y: my }, { x: b.x, y: my }, b);
    return list;
  }

  const polyLen = (p) => { let l = 0; for (let i = 0; i < p.length - 1; i++) l += Math.abs(p[i + 1].x - p[i].x) + Math.abs(p[i + 1].y - p[i].y); return l; };

  /**
   * How badly a candidate route conflicts with the ones already placed.
   * All segments are axis-aligned, so this only has to consider a vertical
   * meeting a horizontal (a crossing) and two parallels sharing a line
   * (an overlap, which looks like a single merged wire on screen).
   *
   * Endpoints are ignored: many links legitimately meet at the house or on a
   * bus bar, and those junctions are meant to touch.
   */
  function conflictScore(pts, placed, ends) {
    const near = (p, q) => Math.abs(p.x - q.x) < 3 && Math.abs(p.y - q.y) < 3;
    const atJunction = (x, y) => ends.some((e) => Math.abs(e.x - x) < 12 && Math.abs(e.y - y) < 12);
    let cross = 0, overlap = 0;

    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const aVert = Math.abs(a.x - b.x) < 1;
      const [aLo, aHi] = aVert ? [Math.min(a.y, b.y), Math.max(a.y, b.y)]
                               : [Math.min(a.x, b.x), Math.max(a.x, b.x)];
      const aFix = aVert ? a.x : a.y;

      for (const poly of placed) {
        for (let j = 0; j < poly.length - 1; j++) {
          const c = poly[j], d = poly[j + 1];
          if (near(a, c) || near(a, d) || near(b, c) || near(b, d)) continue;
          const cVert = Math.abs(c.x - d.x) < 1;
          const [cLo, cHi] = cVert ? [Math.min(c.y, d.y), Math.max(c.y, d.y)]
                                   : [Math.min(c.x, d.x), Math.max(c.x, d.x)];
          const cFix = cVert ? c.x : c.y;

          if (aVert !== cVert) {
            // perpendicular: they cross if each spans the other's fixed line
            const px = aVert ? aFix : cFix;
            const py = aVert ? cFix : aFix;
            const inA = px >= (aVert ? aFix - 1 : aLo - 1) && px <= (aVert ? aFix + 1 : aHi + 1);
            const inB = py >= (aVert ? aLo - 1 : aFix - 1) && py <= (aVert ? aHi + 1 : aFix + 1);
            const inC = aVert ? (px >= cLo - 1 && px <= cHi + 1) : (py >= cLo - 1 && py <= cHi + 1);
            if (inA && inB && inC && !atJunction(px, py)) cross++;
          } else if (Math.abs(aFix - cFix) < 6) {
            // parallel and on top of each other
            const len = Math.min(aHi, cHi) - Math.max(aLo, cLo);
            if (len > 12) overlap += len;
          }
        }
      }
    }
    return cross * 240 + overlap * 1.2;
  }

  /** Drop collinear intermediate points. */
  function simplify(pts) {
    if (pts.length < 3) return pts;
    const out = [pts[0]];
    for (let i = 1; i < pts.length - 1; i++) {
      const p = out[out.length - 1], q = pts[i], r = pts[i + 1];
      const cross = (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
      if (Math.abs(cross) > 0.5) out.push(q);
    }
    out.push(pts[pts.length - 1]);
    return out;
  }

  /** Polyline -> SVG path with rounded corners. */
  function toPath(pts, radius) {
    if (!pts || pts.length < 2) return "";
    if (pts.length === 2) return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;
    const R = radius == null ? 16 : radius;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const p = pts[i - 1], q = pts[i], r = pts[i + 1];
      const d1 = Math.hypot(q.x - p.x, q.y - p.y), d2 = Math.hypot(r.x - q.x, r.y - q.y);
      const t = Math.min(R, d1 / 2, d2 / 2);
      if (t < 1) { d += ` L ${q.x} ${q.y}`; continue; }
      const a = { x: q.x + ((p.x - q.x) / d1) * t, y: q.y + ((p.y - q.y) / d1) * t };
      const b = { x: q.x + ((r.x - q.x) / d2) * t, y: q.y + ((r.y - q.y) / d2) * t };
      d += ` L ${a.x} ${a.y} Q ${q.x} ${q.y} ${b.x} ${b.y}`;
    }
    const e = pts[pts.length - 1];
    d += ` L ${e.x} ${e.y}`;
    return d;
  }

  // ---------------------------------------------------------------- layouts
  // A layout returns { vbw, vbh, nodes, links }. Each link carries the two
  // port points; the router turns them into an obstacle-free path afterwards.

  const housePort = (h, side, offset) => {
    const o = offset || 0;
    switch (side) {
      case "n": return { x: h.x + o, y: h.y - h.r };
      case "s": return { x: h.x + o, y: h.y + h.r };
      case "w": return { x: h.x - h.r, y: h.y + o };
      default:  return { x: h.x + h.r, y: h.y + o };
    }
  };
  const fan = (i, n, spread) => (n <= 1 ? 0 : (i - (n - 1) / 2) * spread);

  function pvSpacing(d, compact, width) {
    const summaryStacked = !!d.pvEnergy.entity && width < 350;
    return {
      headH: (compact ? 42 : 46) + (d.pvForecast.length ? 78 : 0) + (summaryStacked ? 22 : 0),
      cellH: (compact ? 108 : 120) + (d.solar.some(s => s.energy_today) ? 26 : 0),
      summaryStacked,
    };
  }

  /**
   * Ring layout for desktop and tablet.
   * @param split.right  number of consumers placed in the right-hand column
   * @param split.cols   columns used by the consumer rows underneath
   */
  function layoutRing(P, d, split) {
    const { vbw, pad, tileW, tileH, gap, houseR, leftW, lane } = P;
    const nodes = [], links = [];
    const distribution = { right: null, rows: [], gap };

    const climW = tileW + 26;
    const climX = vbw - pad - climW;
    const leftX = pad;
    const centerX = Math.round((leftX + leftW + climX) / 2);

    // ---- PV band (top, centred) ---------------------------------------
    const nS = d.solar.length;
    let pvBottom = pad, pvNode = null;
    if (nS) {
      const maxPvW = climX - (leftX + leftW) - 34;
      const cellGap = 12, minCell = 110, maxCell = 172;
      const perRow = Math.max(1, Math.min(nS, Math.floor((maxPvW - 36 + cellGap) / (minCell + cellGap))));
      const cellW = clamp((maxPvW - 36 - (perRow - 1) * cellGap) / perRow, minCell, maxCell);
      const rows = Math.ceil(nS / perRow);
      const pvW = Math.round(perRow * cellW + (perRow - 1) * cellGap + 36);
      const spacing = pvSpacing(d, false, pvW);
      const { cellH, headH } = spacing;
      const pvH = headH + rows * cellH + (rows - 1) * 8 + 26;
      pvNode = { t: "pvgroup", x: Math.round(centerX - pvW / 2), y: pad, w: pvW, h: pvH, cellW, ...spacing, cellGap, perRow, rows, total: d.pvTotal };
      nodes.push(pvNode);
      pvBottom = pad + pvH;
    }

    // ---- house ---------------------------------------------------------
    const houseY = pvBottom + (nS ? lane + 62 : 70) + houseR;
    const house = { t: "house", x: centerX, y: houseY, r: houseR };
    nodes.push(house);
    if (pvNode) {
      links.push({
        from: { x: pvNode.x + pvNode.w / 2, y: pvNode.y + pvNode.h },
        to: housePort(house, "n"), flow: { type: "pv" },
        label: { text: fmtW(d.pvTotal), x: pvNode.x + pvNode.w / 2,
                 // Centred in the run between the PV frame and the house, so it
                 // crowds neither; 16 px is the floor when the run is short.
                 y: labelY(pvBottom, houseY - houseR, 20, 16),
                 cls: "pv-total", size: 20, knockout: true },
      });
    }

    // ---- grid + storage on the left -------------------------------------
    const gridW = leftW, gridH = 168;
    const gridY = houseY - Math.round(gridH / 2) - 26;
    let leftBottom = gridY;
    if (d.grid.entity) {
      nodes.push({ t: "grid", x: leftX, y: gridY, w: gridW, h: gridH });
      links.push({
        from: { x: leftX + gridW, y: gridY + gridH / 2 }, to: housePort(house, "w", -18),
        viaX: centerX - houseR - 18 - d.batteries.length * 16,
        flow: { type: "grid" },
      });
      leftBottom = gridY + gridH;
    }
    if (d.batteries.length) {
      const stY = leftBottom + 20, batH = P.batH;
      const stH = 42 + d.batteries.length * (batH + 10) - 10 + 12;
      nodes.push({ t: "storage", x: leftX, y: stY, w: leftW, h: stH, batH });
      leftBottom = stY + stH;
      d.batteries.forEach((b, i) => {
        links.push({
          from: { x: leftX + leftW, y: stY + 42 + i * (batH + 10) + batH / 2 },
          to: housePort(house, "w", 20 + i * 16),
          // stagger the vertical runs so parallel battery lines never overlap
          viaX: centerX - houseR - 18 - i * 16,
          flow: { type: "battery", index: i },
        });
      });
    }

    // ---- right-hand side: climate group + consumer column ------------------
    // Everything on the right is fed from one vertical trunk, mirroring the bus
    // bar used underneath, so the wiring stays readable as items are added.
    const vis = d.consumers;
    const nRight = clamp(split?.right ?? Math.min(P.rightMax, vis.length), 0, vis.length);
    const tileX = climX + Math.round((climW - tileW) / 2);
    const stubs = [];

    let rightY = pad, rightEdgeX = climX;
    // ---- electric vehicles, top right above the climate group -----------
    // Wider than the column when the PV band leaves room, so the car stays legible.
    if (d.vehicles.length) {
      const room = vbw - pad - (pvNode ? pvNode.x + pvNode.w : leftX + leftW) - lane - 14;
      const evW = Math.round(clamp(room, climW, 280));
      const evX = vbw - pad - evW;
      const vehH = vehicleArtH(d.vehicles, evW - 34) + 104 + vehicleExtraH(d.vehicles, evW - 18);
      const evH = 42 + d.vehicles.length * (vehH + 10) - 10 + 12;
      nodes.push({ t: "vehicles", x: evX, y: rightY, w: evW, h: evH, vehH });
      d.vehicles.forEach((v, i) => {
        stubs.push({ y: rightY + 42 + i * (vehH + 10) + vehH / 2, x: evX, ref: ["vehicles", i] });
      });
      rightEdgeX = Math.min(climX, evX);
      rightY += evH + 16;
    }
    if (d.climate.length) {
      const cellH = 80;
      const climH = 42 + d.climate.length * (cellH + 10) - 10 + 10;
      nodes.push({ t: "climate", x: climX, y: rightY, w: climW, h: climH, cellH });
      d.climate.forEach((c, i) => {
        stubs.push({ y: rightY + 42 + i * (cellH + 10) + cellH / 2, x: climX, ref: ["climate", i] });
      });
      rightY += climH + 16;
    }
    const trunkX = Math.round(Math.max(rightEdgeX - lane / 2 - 6,
      pvNode ? (pvNode.x + pvNode.w + rightEdgeX) / 2 : 0));
    for (let i = 0; i < nRight; i++) {
      const y = rightY + i * (tileH + gap);
      nodes.push({ t: "load", i, x: tileX, y, w: tileW, h: tileH });
      stubs.push({ y: y + tileH / 2, x: tileX, ref: ["consumers", i] });
    }
    const rightBottom = nRight ? rightY + nRight * (tileH + gap) - gap : (rightY > pad ? rightY - 16 : pad);

    if (stubs.length) {
      distribution.right = { x: trunkX, targets: stubs };
    }

    const rest = vis.length - nRight;
    let vbh = Math.max(leftBottom, rightBottom, houseY + houseR + 40) + pad;
    if (rest > 0) {
      const maxCols = Math.max(1, Math.floor((vbw - 2 * pad + gap) / (tileW + gap)));
      const cols = clamp(split?.cols ?? Math.min(rest, maxCols), 1, maxCols);
      const rows = Math.ceil(rest / cols);
      const top = Math.max(leftBottom, rightBottom, houseY + houseR) + lane + 26;
      const busY = top - 24;
      for (let r = 0; r < rows; r++) {
        const n = Math.min(cols, rest - r * cols);
        const rowW = n * tileW + (n - 1) * gap;
        const x0 = Math.round((vbw - rowW) / 2);
        const y = top + r * (tileH + gap + 26);
        const bY = r === 0 ? busY : y - 24;
        const row = { y: bY, targets: [] };
        for (let c = 0; c < n; c++) {
          const idx = nRight + r * cols + c;
          const x = x0 + c * (tileW + gap);
          nodes.push({ t: "load", i: idx, x, y, w: tileW, h: tileH });
          row.targets.push({ x: x + tileW / 2, y, left: x, width: tileW, ref: ["consumers", idx] });
        }
        distribution.rows.push(row);
        vbh = y + tileH + pad;
      }
    }
    return { vbw, vbh: Math.round(vbh), nodes, links, centerX, houseY, distribution };
  }

  /**
   * Try all sensible canvas widths, tile scales and column splits, and keep the
   * variant whose aspect ratio comes closest to the target. Widening the canvas
   * is what makes a very flat target reachable at all: with a fixed width the
   * tiles can only stack downwards once a row is full.
   */
  function layoutRingFitted(P, d, targetAspect) {
    const nC = d.consumers.length;
    // Progressively shrink the tiles so wide screens fill sideways instead of
    // growing tall. Icon and text sizes scale with the tile via `scale`.
    const scales = [1, 0.94, 0.88, 0.82, 0.76, 0.7];

    const search = (widths) => {
      let best = null;
      for (const wf of widths) {
        for (const sc of scales) {
          const Q = Object.assign({}, P, {
            vbw: Math.round(P.vbw * wf),
            tileW: Math.round(P.tileW * sc),
            tileH: Math.round(P.tileH * sc),
            gap: Math.max(8, Math.round(P.gap * sc)),
            scale: sc,
            rightMax: sc < 1 ? P.rightMax + 2 : P.rightMax,
          });
          const maxCols = Math.max(1, Math.floor((Q.vbw - 2 * Q.pad + Q.gap) / (Q.tileW + Q.gap)));
          const maxRight = Math.min(Q.rightMax, nC);
          for (let right = maxRight; right >= 0; right--) {
            const rest = nC - right;
            const colOptions = rest > 0
              ? Array.from(new Set([maxCols, Math.min(rest, maxCols), Math.ceil(rest / 2),
                                    Math.ceil(rest / 3), Math.ceil(rest / 4)]))
                  .filter((c) => c >= 1 && c <= maxCols)
              : [1];
            for (const cols of colOptions) {
              const L = layoutRing(Q, d, { right, cols });
              const aspect = L.vbw / L.vbh;
              // Being taller than the target is the harmful case (it gets cut
              // off or shrunk away), so punish it far harder than being wider.
              // Prefer bigger tiles and the unwidened canvas on a tie.
              const err = (aspect >= targetAspect ? (aspect - targetAspect) * 0.55
                                                  : (targetAspect - aspect) * 1.7)
                          + (1 - sc) * 0.45
                          + (wf - 1) * 0.30;
              if (!best || err < best.err) { best = { err, L, scale: sc, aspect }; }
            }
          }
        }
        if (best && best.scale === 1 && best.err < 0.16) break;  // good at full size
      }
      return best;
    };

    // First pass at the natural canvas width. Only if the result stays clearly
    // taller than asked for is it worth widening the canvas, which lets more
    // tiles sit side by side but makes everything smaller on screen.
    let best = search([1]);
    if (best && best.aspect < targetAspect * 0.93) {
      const wide = search([1.12, 1.25, 1.4, 1.6, 1.8]);
      if (wide && wide.err < best.err) best = wide;
    }
    best.L.scale = best.scale;
    return best.L;
  }

  /** Stacked layout for phones: everything centred in one column. */
  function layoutStack(P, d) {
    const { vbw, pad, gap, houseR, cols, lane } = P;
    const nodes = [], links = [];
    const distribution = { right: null, rows: [], gap };
    const tileW = Math.floor((vbw - 2 * pad - (cols - 1) * gap) / cols);
    const tileH = P.tileH;
    const centerX = Math.round(vbw / 2);

    const nS = d.solar.length;
    let pvBottom = pad, pvNode = null;
    if (nS) {
      const cellGap = 8;
      const perRow = Math.min(nS, nS <= 2 ? nS : nS === 4 ? 2 : 3);
      const cellW = Math.floor((vbw - 2 * pad - 28 - (perRow - 1) * cellGap) / perRow);
      const rows = Math.ceil(nS / perRow);
      const spacing = pvSpacing(d, true, vbw - 2 * pad);
      const { cellH, headH } = spacing;
      const pvH = headH + rows * cellH + (rows - 1) * 8 + 24;
      pvNode = { t: "pvgroup", x: pad, y: pad, w: vbw - 2 * pad, h: pvH, cellW, ...spacing, cellGap, perRow, rows, total: d.pvTotal, compact: true };
      nodes.push(pvNode);
      pvBottom = pad + pvH;
    }

    const sideW = Math.floor((vbw - 2 * pad - 2 * houseR - 76) / 2);
    const gridH = 122, batH = P.batH;
    const batsH = d.batteries.length ? d.batteries.length * (batH + 8) - 8 : 0;
    const sideH = Math.max(d.grid.entity ? gridH : 0, batsH, houseR * 2);
    const rowTop = pvBottom + (nS ? lane + 18 : 10);
    const houseY = rowTop + Math.round(sideH / 2);
    const house = { t: "house", x: centerX, y: houseY, r: houseR };

    if (pvNode) {
      links.push({
        from: { x: centerX, y: pvBottom }, to: housePort(house, "n"),
        flow: { type: "pv" }, straight: true,
        label: { text: fmtW(d.pvTotal), x: centerX,
                 y: labelY(pvBottom, houseY - houseR, 15, 12),
                 cls: "pv-total-sm", size: 15, knockout: true },
      });
    }
    if (d.grid.entity) {
      const gy = houseY - gridH / 2;
      nodes.push({ t: "grid", x: pad, y: gy, w: sideW, h: gridH, compact: true });
      links.push({
        from: { x: pad + sideW, y: houseY }, to: housePort(house, "w"),
        flow: { type: "grid" }, straight: true,
      });
    }
    const batX = vbw - pad - sideW;
    d.batteries.forEach((b, i) => {
      const by = houseY - batsH / 2 + i * (batH + 8);
      nodes.push({ t: "battery", i, x: batX, y: by, w: sideW, h: batH, compact: true });
      links.push({
        from: { x: batX, y: by + batH / 2 },
        to: housePort(house, "e", fan(i, d.batteries.length, 14)),
        flow: { type: "battery", index: i },
      });
    });
    nodes.push(house);
    const rowBottom = rowTop + sideH;

    const items = d.stackTiles;
    let vbh = rowBottom + pad;
    if (items.length) {
      const busY = rowBottom + lane;
      const rows = Math.ceil(items.length / cols);
      for (let r = 0; r < rows; r++) {
        const n = Math.min(cols, items.length - r * cols);
        const rowW = n * tileW + (n - 1) * gap;
        const x0 = Math.round((vbw - rowW) / 2);
        const y = busY + 22 + r * (tileH + gap + 22);
        const bY = r === 0 ? busY : y - 22;
        const row = { y: bY, targets: [] };
        for (let c = 0; c < n; c++) {
          const idx = r * cols + c;
          const x = x0 + c * (tileW + gap);
          nodes.push({ t: "stacktile", i: idx, x, y, w: tileW, h: tileH });
          row.targets.push({ x: x + tileW / 2, y, left: x, width: tileW, ref: ["stackTiles", idx] });
        }
        distribution.rows.push(row);
        vbh = y + tileH + pad;
      }
    }
    // Vehicles hang off the same feed as the tiles, one full-width panel each.
    d.vehicles.forEach((v, i) => {
      const h = (vehiclePhoto(v) ? vehicleArtH([v], vbw - 2 * pad - 16) + 96 : P.vehStackH || 210)
        + vehicleExtraH([v], vbw - 2 * pad);
      const bY = distribution.rows.length ? vbh - pad + gap : rowBottom + lane;
      const y = bY + 22;
      nodes.push({ t: "vehicle", i, x: pad, y, w: vbw - 2 * pad, h });
      distribution.rows.push({ y: bY, targets: [{ x: centerX, y, left: pad, width: vbw - 2 * pad, ref: ["vehicles", i] }] });
      vbh = y + h + pad;
    });
    return { vbw, vbh: Math.round(vbh), nodes, links, centerX, houseY, distribution };
  }

  // Each edge points away from the house and owns only its downstream loads.
  // The same tree supplies both live activation and cumulative animation distance.
  function consumerNetwork(L) {
    const house = L.nodes.find(n => n.t === "house");
    const { right, rows, gap } = L.distribution;
    const refs = targets => targets.map(t => t.ref);
    const edge = (from, to, targets, parent, straight = true) => {
      if (from.x === to.x && from.y === to.y) return parent;
      const index = L.links.length;
      L.links.push({ from, to, parent, straight, flow: { type: "consumer", refs: targets } });
      return index;
    };
    const branch = (origin, targets, axis, parent) => {
      const sides = [
        targets.filter(t => t[axis] < origin[axis]).sort((a, b) => b[axis] - a[axis]),
        targets.filter(t => t[axis] >= origin[axis]).sort((a, b) => a[axis] - b[axis]),
      ];
      for (const side of sides) {
        let from = origin, previous = parent;
        side.forEach((target, i) => {
          const junction = { ...origin, [axis]: target[axis] };
          const feed = edge(from, junction, refs(side.slice(i)), previous);
          edge(junction, { x: target.x, y: target.y }, [target.ref], feed);
          from = junction;
          previous = feed;
        });
      }
    };
    if (right) {
      const origin = { x: right.x, y: house.y };
      const feed = edge(housePort(house, "e"), origin, refs(right.targets), null, false);
      branch(origin, right.targets, "y", feed);
    }
    if (rows.length) {
      const first = rows[0].targets;
      // A shared down-feed must use a tile gap, never pass through an appliance.
      const gaps = first.slice(1).map((t, i) => (first[i].left + first[i].width + t.left) / 2);
      const choices = gaps.length ? gaps : [first[0].left - gap / 2];
      const x = rows.length === 1 ? house.x
        : choices.reduce((a, b) => Math.abs(a - house.x) <= Math.abs(b - house.x) ? a : b);
      let from = housePort(house, "s"), parent = null;
      rows.forEach((row, i) => {
        const junction = { x, y: row.y };
        const feed = edge(from, junction, refs(rows.slice(i).flatMap(r => r.targets)), parent, i > 0);
        branch(junction, row.targets, "x", feed);
        from = junction;
        parent = feed;
      });
    }
    return L;
  }

  function liveFlow(link, data) {
    switch (link.flow.type) {
      case "pv":
        return { cls: "prod", on: data.pvTotal > 5, rev: false };
      case "grid":
        return { cls: data.gridImport ? "cons" : "prod",
          on: data.gridImport || data.gridExport, rev: data.gridExport };
      case "battery": {
        const battery = data.batteries[link.flow.index];
        return { cls: battery.charging ? "prod" : "disch",
          on: battery.active, rev: battery.charging };
      }
      case "consumer":
        return { cls: "cons", on: link.flow.refs.some(([collection, i]) => data[collection][i].active), rev: false };
      default:
        throw new Error("Unknown energy flow connection: " + link.flow.type);
    }
  }

  /**
   * Run the router over a finished layout. Every node becomes an obstacle;
   * source and target boxes are exempted so ports stay reachable.
   */
  function routeLinks(L, cell) {
    const R = new Router(L.vbw, L.vbh, cell);
    const rects = [];
    L.nodes.forEach((n) => {
      if (n.t === "house") {
        // treat the house as a square so lines keep a clean distance
        const r = { x: n.x - n.r, y: n.y - n.r, w: 2 * n.r, h: 2 * n.r, t: "house" };
        R.addBox(r.x, r.y, r.w, r.h, 6);
        rects.push(r);
        return;
      }
      if (n.t === "bus" || n.t === "vbus") return;
      R.addBox(n.x, n.y, n.w, n.h, 8);
      rects.push({ x: n.x, y: n.y, w: n.w, h: n.h, t: n.t });
    });

    // free vertical / horizontal corridors used as preferred routing lanes
    const lanes = { x: [], y: [] };
    const xs = rects.map((r) => [r.x, r.x + r.w]).flat().sort((p, q) => p - q);
    for (let i = 0; i < xs.length - 1; i++) {
      const gapW = xs[i + 1] - xs[i];
      if (gapW > 46) lanes.x.push(Math.round((xs[i] + xs[i + 1]) / 2));
    }
    const ys = rects.map((r) => [r.y, r.y + r.h]).flat().sort((p, q) => p - q);
    for (let i = 0; i < ys.length - 1; i++) {
      const gapH = ys[i + 1] - ys[i];
      if (gapH > 46) lanes.y.push(Math.round((ys[i] + ys[i + 1]) / 2));
    }

    const touching = (p) => rects.filter((r) =>
      p.x >= r.x - 14 && p.x <= r.x + r.w + 14 && p.y >= r.y - 14 && p.y <= r.y + r.h + 14);

    // Routes are laid one after another and each finished one becomes an
    // obstacle for the next, so wires no longer cross or run on top of each
    // other. Longer links go first: they have the least freedom, and letting
    // them claim their corridor early keeps the short ones out of their way.
    const placed = [];
    const ends = [];
    L.links.forEach((k) => { ends.push(k.from, k.to); });
    const order = L.links.map((k, i) => ({ k, i }))
      .sort((a, b) => (Math.abs(b.k.to.x - b.k.from.x) + Math.abs(b.k.to.y - b.k.from.y))
                    - (Math.abs(a.k.to.x - a.k.from.x) + Math.abs(a.k.to.y - a.k.from.y)));

    order.forEach(({ k }) => {
      if (k.straight) {
        k.d = `M ${k.from.x} ${k.from.y} L ${k.to.x} ${k.to.y}`;
        placed.push([k.from, k.to]);
        return;
      }
      const skip = new Set(touching(k.from).concat(touching(k.to)));
      const obstacles = rects.filter((r) => !skip.has(r));

      // Score every clear shape by length, corner count and — decisively —
      // how much it conflicts with what has already been drawn.
      let best = null;
      const consider = (pts, bonus) => {
        if (polyBlocked(pts, obstacles, 5)) return;
        const cost = polyLen(pts) + (pts.length - 2) * 26
                   + conflictScore(pts, placed, ends) - (bonus || 0);
        if (!best || cost < best.cost) best = { cost, pts };
      };

      // The hand-placed viaX/viaY lanes still get a head start, but they no
      // longer win unconditionally — previously a preferred lane was taken even
      // when it ran straight through another wire.
      if (k.viaX != null) {
        consider(simplify([k.from, { x: k.viaX, y: k.from.y }, { x: k.viaX, y: k.to.y }, k.to]), 150);
      }
      if (k.viaY != null) {
        consider(simplify([k.from, { x: k.from.x, y: k.viaY }, { x: k.to.x, y: k.viaY }, k.to]), 150);
      }
      // Nudged variants of those lanes, so a blocked corridor can shift aside
      // instead of forcing the route into a completely different shape.
      if (k.viaX != null) {
        [-34, -22, -12, 12, 22, 34].forEach((dx) => {
          consider(simplify([k.from, { x: k.viaX + dx, y: k.from.y },
                             { x: k.viaX + dx, y: k.to.y }, k.to]), 60);
        });
      }
      candidates(k.from, k.to, lanes).forEach((pts) => consider(pts, 0));

      // Fall back to A* when every shape is blocked by a tile.
      const pts = best ? best.pts : R.route(k.from, k.to, [...skip]);
      k.d = toPath(pts, Math.max(9, cell));
      placed.push(pts);
    });
    const measure = document.createElementNS("http://www.w3.org/2000/svg", "path");
    L.links.forEach(k => {
      measure.setAttribute("d", k.d);
      k.length = measure.getTotalLength();
      const parent = k.parent == null ? null : L.links[k.parent];
      k.distance = parent ? parent.distance + parent.length : 0;
    });
    return L;
  }

  // ------------------------------------------------------------------ styles
  const CARD_CSS = `
    :host { display:block; }
    /* Colours come from custom properties so the theme can be changed from the
       card configuration without rebuilding this stylesheet. */
    :host {
      --sc-bg-center: #1a2655;
      --sc-bg-edge: #05070f;
      --sc-bg-hold: 33%;
      --sc-tile: rgba(255,255,255,.055);
      --sc-tile-line: rgba(150,195,255,.22);
      /* Everything below is swapped wholesale by _applyTheme() when the light
         scheme is picked, so a single stylesheet serves both looks. */
      --sc-ink: #fff;
      --sc-ink-soft: #a9ddff;
      --sc-ink-body: #dbe6f5;
      --sc-accent: #7fd4ff;
      --sc-halo: rgba(5,12,24,.95);
      --sc-text-stroke: rgba(0,0,0,.28);
      --sc-chip-bg: rgba(255,255,255,.07);
      --sc-chip-line: rgba(150,190,230,.28);
      --sc-chip-shadow: inset 0 0 14px rgba(90,160,220,.08), 0 3px 12px rgba(0,0,0,.18);
      --sc-frame-fill: rgba(255,255,255,.045);
      --sc-frame-line: rgba(96,184,255,.5);
      --sc-frame-glow: drop-shadow(0 0 12px rgba(55,160,255,.14));
      --sc-cell-fill: rgba(255,255,255,.055);
      --sc-cell-line: rgba(135,200,255,.22);
      --sc-wrap-line: rgba(120,180,255,0.16);
      --sc-wrap-shadow: 0 0 60px rgba(0,120,255,0.08), inset 0 0 90px rgba(0,0,0,0.42);
      --sc-bar-bg: rgba(255,255,255,0.08);
      --sc-prod: #22e6a4;
      --sc-cons: #ff5f6d;
      --sc-disch: #ffb028;
      --sc-idle: rgba(125,155,195,.16);
      --sc-pv-fill: rgba(34,230,164,0.055);
      --sc-pv-line: rgba(34,230,164,0.38);
      --sc-pv-glow: drop-shadow(0 0 12px rgba(34,230,164,.12));
      --sc-title-glow: 0 0 12px rgba(0,190,255,.55);
      --sc-center-glow: drop-shadow(0 0 16px rgba(0,170,255,.35));
      --sc-glow-prod: rgba(34,230,164,.95);
      --sc-glow-cons: rgba(255,95,109,.95);
      --sc-glow-disch: rgba(255,176,40,.9);
    }
    .wrap {
      position:relative; border-radius:22px; overflow:hidden;
      /* Radial wash: the accent colour holds across the middle of the card and
         only gives way to the darker edge colour towards the rim, so the
         corners stay calm without the whole panel looking washed out. The
         ellipse is wider than tall to match a 16:9 stage. */
      background:
        radial-gradient(ellipse 128% 150% at 50% 45%,
          var(--sc-bg-center) 0%,
          var(--sc-bg-center) var(--sc-bg-hold),
          var(--sc-bg-edge) 100%);
      background-color: var(--sc-bg-edge);
      border:1px solid var(--sc-wrap-line);
      box-shadow: var(--sc-wrap-shadow);
      padding:14px 12px 10px; color:var(--sc-ink-body);
      font-family: "Segoe UI", Roboto, system-ui, sans-serif;
      container-type: inline-size;
    }
    /* The light scheme uses a different construction: a diagonal drift from the
       near-white core colour into the saturated rim colour, with a soft white
       bloom sitting behind the house. A purely radial wash left the card almost
       entirely white, because the stage is far wider than it is tall. */
    :host([data-light]) .wrap {
      background:
        radial-gradient(ellipse 62% 88% at 46% 44%,
          rgba(255,255,255,.88) 0%,
          rgba(255,255,255,.40) var(--sc-bg-hold),
          rgba(255,255,255,0) 72%),
        linear-gradient(132deg,
          var(--sc-bg-center) 0%,
          var(--sc-bg-edge) 72%,
          var(--sc-bg-edge) 100%);
      background-color: var(--sc-bg-edge);
    }
    .hdr { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; padding:2px 8px 10px; flex-wrap:wrap; }
    .hdr-left { display:flex; flex-direction:column; gap:3px; min-width:0; }
    .hdr .t { font-size:16px; letter-spacing:.14em; text-transform:uppercase; color:var(--sc-ink);
              text-shadow:var(--sc-title-glow); font-weight:600; }
    .hdr .meter { font-size:12px; line-height:1.35; color:var(--sc-ink); font-weight:550; }
    .hdr .meter strong { color:var(--sc-accent); font-weight:650; }
    .status-chips { display:flex; justify-content:flex-end; gap:7px; flex-wrap:wrap; }
    .status-chip {
      display:flex; align-items:center; gap:6px; min-height:30px; padding:0 11px;
      border:1px solid var(--sc-chip-line); border-radius:17px;
      background:var(--sc-chip-bg); color:var(--sc-ink); font-size:13px; font-weight:600;
      box-shadow:var(--sc-chip-shadow);
    }
    .status-chip ha-icon { --mdc-icon-size:17px; color:var(--sc-accent); }
    :host([data-mode="narrow"]) .hdr { justify-content:flex-start; }
    :host([data-mode="narrow"]) .status-chips { justify-content:flex-start; }
    :host([data-mode="narrow"]) .status-chip { font-size:12px; min-height:27px; padding:0 9px; }
    svg { width:100%; height:auto; display:block; overflow:visible; }
    .glass { fill: var(--sc-tile); stroke: var(--sc-tile-line); stroke-width:1; }
    .pv-group { fill: var(--sc-pv-fill); stroke: var(--sc-pv-line); stroke-width:1.3;
                filter: var(--sc-pv-glow); }
    .pv-cell { fill: var(--sc-cell-fill); stroke: var(--sc-pv-line); stroke-width:1; opacity:.8; }
    .pv-title { fill:var(--sc-ink); font-size:14px; font-weight:650; letter-spacing:.13em; }
    .pv-total { fill:var(--sc-ink); font-size:20px; font-weight:750; stroke:var(--sc-halo); stroke-width:4px; }
    .pv-total-sm { fill:var(--sc-ink); font-size:15px; font-weight:750; stroke:var(--sc-halo); stroke-width:4px; }
    /* Frame around a value that sits on its own wire. It carries the colour of
       the flow it belongs to, so it reads as part of the cable run. */
    .label-chip { fill:none; stroke:var(--sc-prod); stroke-width:1.5;
                  filter:drop-shadow(0 0 6px var(--sc-glow-prod, rgba(34,230,164,.5))); }
    .pv-bus { fill:none; stroke:var(--sc-prod); stroke-width:1.7; stroke-linecap:round;
              filter:drop-shadow(0 0 4px var(--sc-glow-prod, rgba(34,230,164,.65))); }
    .group-frame { fill:var(--sc-frame-fill); stroke:var(--sc-frame-line); stroke-width:1.4;
                   filter: var(--sc-frame-glow); }
    .group-cell { fill:var(--sc-cell-fill); stroke:var(--sc-cell-line); stroke-width:1; }
    .group-title { fill:var(--sc-ink); font-size:14px; font-weight:700; letter-spacing:.13em; }
    .cell-name { fill:var(--sc-ink); font-size:13px; font-weight:700; }
    .cell-state { fill:var(--sc-ink-soft); font-size:12px; font-weight:650; }
    .cell-metric { fill:var(--sc-ink); font-size:11px; font-weight:600; }
    .tileLabel { fill:var(--sc-ink); font-size:13px; font-weight:600; }
    .tileVal { fill:var(--sc-ink); font-size:17px; font-weight:650; }
    .tileSub { fill:var(--sc-ink); font-size:12px; font-weight:550; }
    text { font-family:inherit; fill:var(--sc-ink); paint-order:stroke;
           stroke:var(--sc-text-stroke); stroke-width:.35px; }
    /* A wire is drawn in three layers so it reads as a real conductor rather
       than a moving dashed line:
         .wire-halo  a wide, very soft bloom around energised cable
         .wire-core  the cable itself, always visible, dim when nothing flows
         .wire-tail  a travelling capsule of light
         .wire-head  a short bright crest riding at the front of that capsule
       The two moving layers share one period, so they stay locked together and
       read as a single pulse with a trailing glow. */
    .flow { fill:none; stroke-linecap:round; stroke-linejoin:round; }

    .wire-core { stroke-width:2.6; opacity:.30; }
    .wire-halo { stroke-width:10; opacity:.07; }
    /* A 30 % line vanishes on pale paper, so the resting cable is drawn a
       little firmer and its bloom a little wider in the light scheme. */
    :host([data-light]) .wire-core { stroke-width:2.8; opacity:.48; }
    :host([data-light]) .wire-halo { stroke-width:11; opacity:.11; }
    :host([data-light]) .wire-core.live { animation:none; opacity:.5; }

    .flow.prod  { stroke:var(--sc-prod); }
    .flow.cons  { stroke:var(--sc-cons); }
    .flow.disch { stroke:var(--sc-disch); }
    .flow.idle  { stroke:var(--sc-idle); opacity:1; }

    /* A surge is built from stacked segments that all end at the same leading
       edge but reach progressively further back, each dimmer and thinner than
       the one in front. That yields a comet with a genuinely fading tail
       instead of the hard-edged capsule a single dash pattern produces — the
       hard edges were what made the old version read as a repeating pattern
       rather than as something flowing. */
    /* Fixed SVG-unit spacing and distance from the house keep a pulse continuous
       through every junction. Reverse flow shares the opposite leading edge. */
    .cm1 { stroke-width:4.2; opacity:1.0; stroke-dasharray:5 95; stroke-dashoffset:5; }
    .cm1.run { animation: cm1f var(--sp,3s) linear infinite; animation-delay:var(--dl,0s); }
    @keyframes cm1f { from { stroke-dashoffset:calc(5px + var(--fo,0px)); } to { stroke-dashoffset:calc(-95px + var(--fo,0px)); } }
    .cm2 { stroke-width:3.9; opacity:0.55; stroke-dasharray:12 88; stroke-dashoffset:12; }
    .cm2.run { animation: cm2f var(--sp,3s) linear infinite; animation-delay:var(--dl,0s); }
    @keyframes cm2f { from { stroke-dashoffset:calc(12px + var(--fo,0px)); } to { stroke-dashoffset:calc(-88px + var(--fo,0px)); } }
    .cm3 { stroke-width:3.5; opacity:0.33; stroke-dasharray:22 78; stroke-dashoffset:22; }
    .cm3.run { animation: cm3f var(--sp,3s) linear infinite; animation-delay:var(--dl,0s); }
    @keyframes cm3f { from { stroke-dashoffset:calc(22px + var(--fo,0px)); } to { stroke-dashoffset:calc(-78px + var(--fo,0px)); } }
    .cm4 { stroke-width:3.1; opacity:0.19; stroke-dasharray:35 65; stroke-dashoffset:35; }
    .cm4.run { animation: cm4f var(--sp,3s) linear infinite; animation-delay:var(--dl,0s); }
    @keyframes cm4f { from { stroke-dashoffset:calc(35px + var(--fo,0px)); } to { stroke-dashoffset:calc(-65px + var(--fo,0px)); } }
    .cm5 { stroke-width:2.7; opacity:0.1; stroke-dasharray:50 50; stroke-dashoffset:50; }
    .cm5.run { animation: cm5f var(--sp,3s) linear infinite; animation-delay:var(--dl,0s); }
    @keyframes cm5f { from { stroke-dashoffset:calc(50px + var(--fo,0px)); } to { stroke-dashoffset:calc(-50px + var(--fo,0px)); } }
    .cm6 { stroke-width:2.3; opacity:0.045; stroke-dasharray:68 32; stroke-dashoffset:68; }
    .cm6.run { animation: cm6f var(--sp,3s) linear infinite; animation-delay:var(--dl,0s); }
    @keyframes cm6f { from { stroke-dashoffset:calc(68px + var(--fo,0px)); } to { stroke-dashoffset:calc(-32px + var(--fo,0px)); } }
    /* Shared leading edge on the left; identical for every layer. */
    .cm1.run.rev, .cm2.run.rev, .cm3.run.rev,
    .cm4.run.rev, .cm5.run.rev, .cm6.run.rev { animation-name: cm-rev; }
    @keyframes cm-rev { from { stroke-dashoffset:calc(-100px + var(--fo,0px)); } to { stroke-dashoffset:var(--fo,0px); } }

    .cm1.prod  { filter:drop-shadow(0 0 7px var(--sc-glow-prod, rgba(34,230,164,.95))); }
    .cm1.cons  { filter:drop-shadow(0 0 7px var(--sc-glow-cons, rgba(255,95,109,.95))); }
    .cm1.disch { filter:drop-shadow(0 0 7px var(--sc-glow-disch, rgba(255,176,40,.9))); }

    .wire-core.live { animation: core-breathe calc(var(--sp,3s) * 1.3) ease-in-out infinite;
                      animation-delay:var(--dl,0s); }
    @keyframes core-breathe { 0%,100% { opacity:.28; } 50% { opacity:.46; } }

    /* Legacy look, still selectable from the configuration. */
    .dash { stroke-width:2.4; opacity:.9; stroke-dasharray: 6 12;
      animation: dashmove .216s linear infinite; animation-delay:var(--dl,0s); }
    @keyframes dashmove { from { stroke-dashoffset:var(--fo,0px); } to { stroke-dashoffset:calc(-18px + var(--fo,0px)); } }
    .dash.rev { animation-name:dashrev; }
    @keyframes dashrev { from { stroke-dashoffset:var(--fo,0px); } to { stroke-dashoffset:calc(18px + var(--fo,0px)); } }
    .flow-hidden { visibility:hidden; }
    .ev-badge { fill:var(--sc-panel, rgba(16,28,52,.9)); stroke-width:2; }
    .ev-photo-frame { fill:none; stroke:var(--sc-bar-bg); stroke-width:1.5; }
    .wire-steady { stroke-width:3; opacity:.8; }
    .center { filter: var(--sc-center-glow, drop-shadow(0 0 16px rgba(0,170,255,.35))); }
    .socbar-bg { fill: var(--sc-bar-bg); }
    /* Tiles used to breathe between 85% and 100% opacity permanently. It
       carried no information, and because a re-render restarted it at a random
       point the whole card appeared to shimmer. Tiles are now simply steady. */
    .pulse { opacity:1; }
    .clickable { cursor:pointer; }
    @media (prefers-reduced-motion: reduce) {
      .dash, .run, .wire-core.live, .pulse { animation:none; }
    }`;

  // -------------------------------------------------------------- svg pieces
  // Icons are drawn as native <path>, never <foreignObject>. WebKit/Safari
  // does not apply the viewBox scale to foreignObject content the way Blink
  // does, so an <ha-icon> parked inside one lands at the wrong place and size
  // — which is exactly what made the icons scatter across the card in Safari.
  // A native path is laid out by the same transform as everything else and is
  // therefore identical in Safari, Edge/Chromium and Brave.
  const ICONS = (window.__glassEnergyFlowIconCache = window.__glassEnergyFlowIconCache || {});

  /**
   * Resolve an "mdi:name" to its raw path data by asking Home Assistant's own
   * <ha-icon> once and caching the result. Returns null until it is known;
   * callers redraw when the promise settles.
   */
  function iconPath(name, onReady) {
    const key = name || "mdi:flash";
    if (ICONS[key] !== undefined) return ICONS[key];
    if (ICONS["__p_" + key]) return null;             // already in flight
    ICONS["__p_" + key] = true;
    const probe = document.createElement("ha-icon");
    probe.setAttribute("icon", key);
    probe.style.cssText = "position:fixed;left:-9999px;top:-9999px;opacity:0;pointer-events:none";
    document.body.appendChild(probe);
    let tries = 0;
    const look = () => {
      const inner = probe.shadowRoot && probe.shadowRoot.querySelector("ha-svg-icon");
      const p = inner && inner.shadowRoot && inner.shadowRoot.querySelector("path");
      const d = p && p.getAttribute("d");
      if (d) {
        ICONS[key] = d;
        probe.remove();
        if (onReady) onReady();
        return;
      }
      if (++tries > 60) { ICONS[key] = null; probe.remove(); return; }
      setTimeout(look, 50);
    };
    setTimeout(look, 0);
    return null;
  }

  const icon = (x, y, size, name, color, glow, onReady) => {
    const d = iconPath(name, onReady);
    const col = inkify(color || "#7fd4ff", LIGHT);
    // A neon bloom is invisible on a pale card, so the light scheme trades it
    // for a small cast shadow that lifts the symbol off the panel instead.
    const sh = LIGHT
      ? `filter:drop-shadow(0 0 7px ${col}55) drop-shadow(0 2px 3px rgba(40,70,150,.22))`
      : `filter:drop-shadow(0 0 6px ${glow || "rgba(0,180,255,.5)"})`;
    if (!d) {
      // Placeholder while the path is being resolved; replaced on redraw.
      return `<circle cx="${x + size / 2}" cy="${y + size / 2}" r="${size * 0.30}"
               fill="none" stroke="${col}" stroke-width="${Math.max(1, size * 0.08)}"
               opacity=".45"/>`;
    }
    // mdi paths live in a 24x24 box.
    const k = size / 24;
    return `<g transform="translate(${x} ${y}) scale(${k})" style="${sh}">
              <path d="${d}" fill="${col}"/>
            </g>`;
  };
  const artworkSvg = (x, y, size, img, name, color, glow, boxW) =>
    img
      ? `<image href="${esc(img)}" x="${x}" y="${y}" width="${boxW || size}" height="${size}" preserveAspectRatio="xMidYMid meet" style="filter:drop-shadow(${LIGHT ? "0 3px 8px rgba(64,96,190,.30)" : `0 0 6px ${glow || "rgba(0,180,255,.5)"}`})"/>`
      : icon(x, y, size, name, color, glow, REDRAW);

  // Bundled artwork: `image: builtin:<name>` loads <name>.png from next to
  // this module, switching to <name>-light.png in the light scheme where one exists.
  // `image: none` forces the icon.
  const BUILTIN_BASE = new URL("./", import.meta.url).href;
  const BUILTIN_LIGHT = new Set(["home", "grid", "battery", "battery-stack", "ev", "ev-plugged",
    "solar-roof", "solar-balcony", "solar-garage", "solar-ground"]);
  const resolveImage = (img) => {
    if (!img || img === "none") return null;
    if (!String(img).startsWith("builtin:")) return img;
    const name = String(img).slice(8);
    return BUILTIN_BASE + (LIGHT && BUILTIN_LIGHT.has(name) ? name + "-light" : name) + ".png";
  };
  const artwork = (x, y, size, img, ...rest) => artworkSvg(x, y, size, resolveImage(img), ...rest);

  // Set by the card while it renders, so a late-arriving icon path can trigger
  // exactly one repaint instead of every pending icon triggering its own.
  let REDRAW = null;
  // Whether the light scheme is active. Read by icon()/artwork(), which are
  // plain functions outside the element and so cannot reach the config.
  let LIGHT = false;

  /** Fit a label to the tile width by shrinking the font, then ellipsising. */
  function fitText(txt, maxW, fontSize) {
    const t = String(txt == null ? "" : txt);
    const avg = fontSize * 0.55;
    const max = Math.max(3, Math.floor(maxW / avg));
    return t.length <= max ? t : t.slice(0, max - 1) + "…";
  }

  // One clock for all branches; animation shows activity, not source percentages.
  const T0 = (typeof performance !== "undefined" ? performance.now() : Date.now()) / 1000;
  const nowSec = () => (typeof performance !== "undefined" ? performance.now() : Date.now()) / 1000 - T0;

  function wireDelay(duration = 1.2) {
    return (-(nowSec() % duration)).toFixed(3) + "s";
  }

  /**
   * Draw one wire. `style` picks the look:
   *   puls   layered conductor with a travelling crest (default)
   *   strich the original moving dashes
   *   ruhig  no motion at all
   */
  function wireSvg(dAttr, cls, on, rev, distance, style) {
    if (!dAttr) return "";
    const c = on ? cls : "idle";
    const hidden = on ? "" : " flow-hidden";
    const r = rev ? " rev" : "";
    const period = style === "strich" ? 18 : 100;
    const sp = ` style="--sp:1.2s;--fo:${((distance || 0) % period).toFixed(3)}px"`;
    if (style === "strich") {
      return `<path class="flow wire-core ${c}" d="${dAttr}"/>
        <path class="flow ${c} dash${r}${hidden}" d="${dAttr}"${sp}/>`;
    }
    if (style === "ruhig") {
      return `<path class="flow wire-core ${c}${on ? " wire-steady" : ""}" d="${dAttr}"/>`;
    }
    // Keep the same DOM nodes when a load turns on/off; hidden pulses keep time.
    let out = `<path class="flow wire-halo ${c}${hidden}" d="${dAttr}"/>
      <path class="flow wire-core ${c}${on ? " live" : ""}" d="${dAttr}"${sp}/>`;
    for (let i = 6; i >= 1; i--) {
      out += `<path class="flow cm${i} ${c} run${r}${hidden}" d="${dAttr}"${sp}/>`;
    }
    return out;
  }

  /**
   * Update `live` so it matches `next`, touching only what actually differs.
   * Returns false when the two trees are shaped differently, in which case the
   * caller falls back to a full rebuild.
   *
   * Patching matters because the card re-renders several times a second: a
   * wholesale replacement restarts every CSS animation and forces every icon to
   * be looked up again, which shows up as the whole card flickering.
   */
  function patchSvg(live, next) {
    if (!live || !next) return false;
    if (live.tagName !== next.tagName) return false;
    if (live.childElementCount !== next.childElementCount) return false;

    // Attributes: apply differences, remove what is gone. `style` is skipped
    // when the incoming element carries none, so the phase offsets written
    // afterwards by _syncPhases survive.
    const seen = new Set();
    for (const a of next.attributes) {
      seen.add(a.name);
      if (a.name === "style") {
        const delay = live.style.getPropertyValue("--dl");
        if (live.getAttribute("style") !== a.value) live.setAttribute("style", a.value);
        if (delay) live.style.setProperty("--dl", delay);
        continue;
      }
      if (a.name === "class" && live.classList.contains("rev") !== next.classList.contains("rev")) {
        live.style.setProperty("--dl", wireDelay(next.classList.contains("dash") ? .216 : 1.2));
      }
      if (live.getAttribute(a.name) !== a.value) live.setAttribute(a.name, a.value);
    }
    for (const a of [...live.attributes]) {
      if (!seen.has(a.name) && a.name !== "style") live.removeAttribute(a.name);
    }

    // Leaf text (values, labels) is the part that genuinely changes.
    if (!next.childElementCount) {
      if (live.textContent !== next.textContent) live.textContent = next.textContent;
      return true;
    }
    const lc = live.children, nc = next.children;
    for (let i = 0; i < nc.length; i++) {
      if (!patchSvg(lc[i], nc[i])) return false;
    }
    return true;
  }

  function tileSvg(n, o) {
    const cx = n.x + n.w / 2;
    const k = o.scale == null ? 1 : o.scale;             // tile scale factor
    const size = Math.round((o.iconSize || 28) * k);
    const fLabel = Math.max(9, Math.round(13 * k));
    const fVal = Math.max(11, Math.round(17 * k));
    const fSub = Math.max(8, Math.round(12 * k));
    const padTop = Math.round(8 * k);
    const inner = n.w - 12;
    const subY = n.y + n.h - Math.round(8 * k);
    const labelY = o.sub ? subY - fSub - fVal - 3 : n.y + n.h - Math.round(30 * k);
    const valueY = o.sub ? subY - fSub - 3 : n.y + n.h - Math.round(11 * k);
    // photos read poorly at glyph size, so grow them into the free space above
    // the label while keeping a small breathing gap
    const artMax = labelY - fLabel - (n.y + padTop) - 4;
    const art = o.image ? Math.round(clamp(size * 1.5, size, Math.max(size, Math.min(artMax, inner)))) : size;
    const artY = n.y + padTop + Math.max(0, Math.round((artMax - art) / 2));
    return `<g class="pulse${o.entity ? " clickable" : ""}"${o.entity ? ` data-entity="${esc(o.entity)}"` : ""}>
      <rect class="glass" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="${Math.round(14 * k)}"/>
      ${artwork(cx - art / 2, artY, art, o.image, o.icon, o.color, o.glow)}
      <text class="tileLabel" x="${cx}" y="${labelY}" text-anchor="middle" font-size="${fLabel}">${esc(fitText(o.label, inner, fLabel))}</text>
      <text class="tileVal" x="${cx}" y="${valueY}" text-anchor="middle" font-size="${fVal}">${esc(fitText(o.value, inner, fVal))}</text>
      ${o.sub ? `<text class="tileSub" x="${cx}" y="${subY}" text-anchor="middle" font-size="${fSub}">${esc(fitText(o.sub, inner, fSub))}</text>` : ""}
    </g>`;
  }

  /** Largest font size at which `txt` still fits into `maxW`. */
  function fitFont(txt, maxW, base, min) {
    const t = String(txt == null ? "" : txt);
    if (!t) return base;
    // Measured against the rendered result: the digits and letters that appear
    // here average about 0.44 em; 0.48 leaves a little headroom.
    const need = t.length * 0.48;
    return clamp(Math.floor(maxW / need), min || 9, base);
  }

  /**
   * Box a centred label occupies, used to cut the wire out from underneath it.
   * The width follows the same 0.48 em per character the font sizing uses, with
   * a little air on each side so the cable does not graze the digits.
   */
  /**
   * Width of a piece of text in the card's own font, measured rather than
   * estimated. A per-character average is fine for shrinking a value until it
   * fits a tile, but not for drawing a frame around it: "1,70 kW" is far wider
   * than seven average characters because the space and the capital W are, and
   * the frame ended up cutting through its own text.
   */
  const TEXTW = new Map();
  function measureText(txt, size, weight) {
    const key = size + "/" + weight + "/" + txt;
    const hit = TEXTW.get(key);
    if (hit !== undefined) return hit;
    let w;
    try {
      const g = (measureText._c || (measureText._c =
        document.createElement("canvas").getContext("2d")));
      g.font = `${weight} ${size}px "Segoe UI", Roboto, system-ui, sans-serif`;
      w = g.measureText(txt).width;
    } catch (e) {
      w = txt.length * size * 0.55;               // canvas unavailable
    }
    TEXTW.set(key, w);
    return w;
  }

  /** Height of the frame drawn around a label of this size. */
  function labelH(size) {
    return size * 0.92 + size * 0.26 + 2 * (2 + size * 0.24);
  }

  /**
   * Baseline for a label that should sit midway down a vertical wire, keeping
   * at least `minGap` between its frame and whatever the wire starts at.
   */
  function labelY(top, bottom, size, minGap) {
    const h = labelH(size);
    const free = Math.max(0, bottom - top - h);
    const off = Math.max(minGap, free / 2);
    return top + off + size * 0.92 + 2 + size * 0.24;
  }

  function labelBox(l) {
    const size = l.size || 18;
    // The label is painted with a 4 px halo stroke under the fill, so its ink
    // reaches 2 px past the glyphs on every side.
    const HALO = 2;
    // Measured against the rendered text: digits reach 0.92 em above the
    // baseline and the comma 0.26 em below it. Deriving the height from a
    // single line-height factor put the box off centre and clipped the tops.
    const asc = size * 0.92, desc = size * 0.26, pad = size * 0.24;
    const w = measureText(String(l.text || ""), size, l.weight || 750)
              + 2 * HALO + size * 0.85;
    const h = asc + desc + 2 * (HALO + pad);
    return { x: +(l.x - w / 2).toFixed(1), y: +(l.y - asc - HALO - pad).toFixed(1),
             w: +w.toFixed(1), h: +h.toFixed(1) };
  }

function step1Image(config, light) {
  return light && config.image_light ? config.image_light : config.image;
}

function step1Fit(text, width, size, weight) {
  let result=size;
  while(result>8 && measureText(String(text),result,weight)>width)result--;
  return result;
}

function step1Grid(n,d,config) {
  const compact=n.compact;
  const size=compact?16:26, labelSize=compact?11:16;
  const value=fmtW(d.gridDisplayValue);
  const name=d.gridDisplayValue == null ? T("Netz nicht verfügbar")
    : d.gridDisplayValue > 0 ? T("Netzbezug")
    : d.gridDisplayValue < 0 ? T("Einspeisung") : config.name || T("Netz");
  const image=step1Image(config,LIGHT) || "builtin:grid";
  const left=n.x+(compact?61:111), room=n.x+n.w-left-12;
  const imgW=compact?45:86, imgH=compact?60:102;
  const body=`<g class="clickable step1-grid" data-entity="${esc(config.entity)}">
    <rect class="glass" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="16"/>
    ${artwork(n.x+12,n.y+9,imgH,image,config.icon||"mdi:transmission-tower", "#7fd4ff",undefined,imgW)}
    <text class="step1-grid-label" x="${left}" y="${n.y+(compact?24:31)}"
      style="font-size:${step1Fit(name,room,labelSize,600)}px;font-weight:600;fill:var(--sc-ink-soft)">${esc(name)}</text>
    <text class="step1-grid-value" x="${left}" y="${n.y+(compact?46:65)}"
      style="font-size:${step1Fit(value,room,size,700)}px;font-weight:700">${esc(value)}</text>
    ${!compact?`<path d="M ${n.x+16} ${n.y+113} H ${n.x+n.w-16}" stroke="var(--sc-tile-line)" stroke-width="1"/>`:""}
    ${config.import_today?`<text class="step1-grid-daily" x="${n.x+14}" y="${n.y+(compact?90:134)}" style="font-size:${compact?9:12}px;fill:var(--sc-ink-soft)">${T("Bezug heute")}</text>
      <text x="${n.x+n.w-14}" y="${n.y+(compact?90:134)}" text-anchor="end"
       style="font-size:${compact?10:13}px">${esc(fmtKWh(d.gridImportToday))}</text>`:""}
    ${config.export_today?`<text class="step1-grid-daily" x="${n.x+14}" y="${n.y+(compact?109:155)}" style="font-size:${compact?9:12}px;fill:var(--sc-ink-soft)">${T("Einspeisung")}</text>
      <text x="${n.x+n.w-14}" y="${n.y+(compact?109:155)}" text-anchor="end"
       style="font-size:${compact?10:13}px">${esc(fmtKWh(d.gridExportToday))}</text>`:""}
  </g>`;
  return body;
}

function step1Battery(x,y,w,h,b,compact) {
  const level=b.socValue==null?0:clamp(b.socValue,0,100);
  const accent=level<=15?"#ff5d6c":level>=95?"#22e6a4":"#37c8ff";
  const label=b.name||"";
  const state=b.powerValue==null?"":T(b.charging?"lädt":b.active?"entlädt":"hält");
  const power=`${fmtW(b.powerValue)}${state?" · "+state:""}`;
  const image=step1Image(b,LIGHT) || "builtin:battery";
  const artW=compact?31:57, artH=compact?44:59;
  const artX=x+w-artW-10, textX=x+(compact?29:36);
  const room=artX-textX-7;
  const soc=b.socValue==null?"–":Math.round(level)+" %";
  // charge level in green while charging, red while discharging, neutral at rest
  const socFill=b.charging?inkify("#22e6a4",LIGHT):b.active?inkify("#ff5d6c",LIGHT):"currentColor";
  const barW=compact?8:11,barH=compact?36:45,barX=x+12,barY=y+10;
  return `<g class="step1-battery clickable" data-entity="${esc(b.soc||b.power)}">
    <rect class="glass" x="${x}" y="${y}" width="${w}" height="${h}" rx="14"/>
    <rect class="socbar-bg" x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="4"/>
    <rect x="${barX}" y="${barY+barH*(1-level/100)}" width="${barW}" height="${barH*level/100}" rx="4" fill="${inkify(accent,LIGHT)}"/>
    ${artwork(artX,y+5,artH,image,b.icon||"mdi:battery",accent,undefined,artW)}
    <text class="step1-battery-soc" x="${textX}" y="${y+(compact?26:31)}"
      style="font-size:${step1Fit(soc,room,compact?17:23,700)}px;font-weight:700;fill:${socFill}">${esc(soc)}</text>
    <text class="step1-battery-name" x="${textX}" y="${y+(compact?44:51)}"
      style="font-size:${step1Fit(label,room,compact?11:14,600)}px;font-weight:600;fill:var(--sc-ink-soft)">${esc(label)}</text>
    <text class="step1-battery-power" x="${textX}" y="${y+h-11}"
      style="font-size:${step1Fit(power,x+w-10-textX,compact?11:14,650)}px;font-weight:650">${esc(power)}</text>
  </g>`;
}

  function batterySvg(x,y,w,h,b,compact) { return step1Battery(x,y,w,h,b,compact); }

  const fmtDuration = (min) => {
    if (min == null || min <= 0) return null;
    const m = Math.round(min);
    return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")} h`;
  };

  // Extra values of a vehicle (service, odometer, …) sit in a quiet icon row;
  // the row wraps when the panel is too narrow for all of them.
  const vehicleMetricRows = (v, w) => {
    const n = (v.metricValues || []).length;
    return n ? Math.ceil(n / Math.max(1, Math.min(n, Math.floor((w - 16) / 56)))) : 0;
  };
  const vehicleExtraH = (vehicles, w) => Math.max(0, ...vehicles.map((v) => vehicleMetricRows(v, w) * 40));
  // Own photos are shown as a rounded, filled picture, which needs a taller box
  // than the wide drawn artwork.
  const vehiclePhoto = (v) => !!v.image && v.image !== "none" && !String(v.image).startsWith("builtin:");
  const vehicleArtH = (vehicles, artW) =>
    Math.round(artW / (vehicles.some(vehiclePhoto) ? 1.9 : 3.5));
  let photoSeq = 0;

  /**
   * One vehicle: the car (at the charging pillar while plugged in, with the
   * cable coiled up otherwise) across the top; charge level and charging power
   * as the two big values underneath, then name/status, the optional icon row
   * and the charge bar along the bottom. Custom photos get a plug badge
   * instead of the drawn pillar, so the connection state stays visible.
   */
  function vehicleSvg(x, y, w, h, v, compact) {
    const level = v.socValue == null ? 0 : clamp(v.socValue, 0, 100);
    const accent = v.charging ? "#22e6a4" : level <= 15 ? "#ff5d6c" : "#37c8ff";
    const green = inkify("#22e6a4", LIGHT);
    const full = v.plugged && !v.charging && v.socValue != null
      && level >= (v.targetSoc ?? 100) - 1;
    const status = T(v.charging ? "Lädt" : full ? "Voll" : v.plugged ? "Verbunden" : "Nicht verbunden");
    const custom = vehiclePhoto(v);
    const image = custom ? (v.plugged && v.image_plugged ? v.image_plugged : v.image)
      : v.image === "none" ? "none"
      : v.image ? v.image
      : v.plugged ? "builtin:ev-plugged" : "builtin:ev";
    const big = compact ? 30 : 28, kpi = compact ? 20 : 18, mid = 13, small = 12;
    const metrics = v.metricValues || [];
    const mRows = vehicleMetricRows(v, w);
    const textTop = y + h - 20 - mRows * 40 - 62;
    const artX = x + 8, artY = y + 8, artW = w - 16, artH = textTop - artY - 6;
    const soc = v.socValue == null ? "–" : Math.round(level) + " %";
    const dur = v.charging ? fmtDuration(v.timeToFull) : null;
    const range = v.rangeValue != null ? `${Math.round(v.rangeValue)} km` : "";
    const lx = x + 12, rx = x + w - 12, half = (w - 24) / 2;
    const barX = x + 10, barW = w - 20, barY = y + h - 12;
    let badge = "";
    if (custom && v.plugged && !v.image_plugged) {
      const bx = artX + artW - 18, by = artY + artH - 16;
      badge = `<g${v.charging ? ' class="pulse"' : ""}><circle cx="${bx}" cy="${by}" r="14" class="ev-badge"
        style="stroke:${inkify(accent, LIGHT)}"/>${icon(bx - 10, by - 10, 20, "mdi:ev-plug-type-2", accent, accent + "aa")}</g>`;
    }
    // the two key figures: charge level left, charging power (or status) right
    const right1 = v.charging ? fmtW(v.powerValue) : status;
    const right2 = v.charging ? [status, dur].filter(Boolean).join(" · ") : "";
    let row = "";
    if (metrics.length) {
      const cols = Math.ceil(metrics.length / mRows), cw = (w - 16) / cols, mTop = textTop + 66;
      row = metrics.map((m, j) => {
        const cx = x + 8 + cw * ((j % cols) + 0.5), iy = mTop + Math.floor(j / cols) * 40;
        return `<g class="clickable" data-entity="${esc(m.entity)}">
          <rect x="${(cx - cw / 2).toFixed(1)}" y="${iy - 2}" width="${cw.toFixed(1)}" height="38" fill="transparent"/>
          ${icon(cx - 8, iy, 16, m.icon, "#37c8ff")}
          <text x="${cx.toFixed(1)}" y="${iy + 30}" text-anchor="middle"
            style="font-size:${step1Fit(m.text, cw - 4, small, 600)}px;font-weight:600;fill:var(--sc-ink-soft)">${esc(m.text)}</text></g>`;
      }).join("");
    }
    return `<g class="ev clickable" data-entity="${esc(v.soc || v.power)}">
      <rect class="glass" x="${x}" y="${y}" width="${w}" height="${h}" rx="14"/>
      ${custom ? (() => {
        const id = "ev-photo-" + (++photoSeq), fit = v.image_fit === "contain" ? "meet" : "slice";
        return `<clipPath id="${id}"><rect x="${artX}" y="${artY}" width="${artW}" height="${artH}" rx="10"/></clipPath>
        <image href="${esc(image)}" x="${artX}" y="${artY}" width="${artW}" height="${artH}"
          preserveAspectRatio="xMidYMid ${fit}" clip-path="url(#${id})"/>
        <rect class="ev-photo-frame" x="${artX}" y="${artY}" width="${artW}" height="${artH}" rx="10"/>`;
      })() : artwork(artX, artY, artH, image, v.icon || "mdi:car-electric", accent, undefined, artW)}${badge}
      <text class="ev-soc" x="${lx}" y="${textTop + 24}"
        style="font-size:${step1Fit(soc, half, big, 700)}px;font-weight:700">${esc(soc)}</text>
      <text x="${rx}" y="${textTop + 24}" text-anchor="end"
        style="font-size:${step1Fit(right1, half + 6, v.charging ? kpi : 14, 700)}px;font-weight:700;fill:${v.charging ? green : "currentColor"}">${esc(right1)}</text>
      <text x="${lx}" y="${textTop + 44}"
        style="font-size:${step1Fit(v.name || "", half, mid, 600)}px;font-weight:600;fill:var(--sc-ink-soft)">${esc(v.name || "")}</text>
      ${right2 ? `<text x="${rx}" y="${textTop + 44}" text-anchor="end"
        style="font-size:${step1Fit(right2, half + 6, mid, 650)}px;font-weight:650;fill:${green}">${esc(right2)}</text>` : ""}
      ${range ? `<text x="${lx}" y="${textTop + 60}"
        style="font-size:${step1Fit(range, w - 24, small, 600)}px;font-weight:600;fill:var(--sc-ink-soft)">${esc(range)}</text>` : ""}
      ${row}
      <rect class="socbar-bg" x="${barX}" y="${barY}" width="${barW}" height="5" rx="2.5"/>
      <rect x="${barX}" y="${barY}" width="${(barW * level / 100).toFixed(1)}" height="5" rx="2.5" fill="${inkify(accent, LIGHT)}"/>
      ${v.targetSoc != null ? `<rect x="${(barX + barW * clamp(v.targetSoc, 0, 100) / 100 - 1).toFixed(1)}" y="${barY - 3}" width="2" height="11" rx="1" fill="var(--sc-ink-soft)"/>` : ""}
    </g>`;
  }

  // ------------------------------------------------------------------- card
  class GlassEnergyFlowCard extends HTMLElement {
    setConfig(config) {
      this._raw = config || {};
      this._config = normalize(this._raw);
      this._built = false;
      this._sig = null;
      // The cached markup belongs to the old configuration; keeping it would
      // make the next update think nothing changed and leave the card empty.
      this._lastSvg = null;
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
      if (this._built === false && this.shadowRoot.firstChild) { this.shadowRoot.innerHTML = ""; }
    }

    static getConfigElement() { return document.createElement("glass-energy-flow-card-editor"); }

    static getStubConfig(hass) {
      const find = (re) => Object.keys(hass?.states || {}).find((id) => re.test(id)) || "";
      return {
        title: T("Energie"),
        layout: { mode: "auto" },
        solar: [], batteries: [], climate: [], consumers: [],
        grid: { entity: find(/^sensor\..*(grid|netz).*power/i), name: T("Netz"), icon: "mdi:transmission-tower" },
        home: { entity: find(/^sensor\..*(hausverbrauch|home).*(power|gesamt)/i), icon: "mdi:home-lightning-bolt" },
      };
    }

    /**
     * Push the configured colours onto the host as custom properties. Doing it
     * here rather than inside the stylesheet means a colour change never forces
     * the card to be rebuilt.
     */
    _applyTheme() {
      const t = (this._config && this._config.theme) || {};
      const st = this.style;
      const light = t.mode === "hell";
      // Ink first, so the individual overrides below always win.
      const set = INK[light ? "hell" : "dunkel"];
      for (const k in set) st.setProperty(k, set[k]);
      this.toggleAttribute("data-light", light);

      st.setProperty("--sc-bg-center", t.center || (light ? "#fdfdff" : "#1a2655"));
      st.setProperty("--sc-bg-edge", t.edge || (light ? "#b6c4f2" : "#05070f"));
      // `spread` is given as a friendly 0-140 number; it maps to how far the
      // centre colour holds before the fade to the edge colour begins.
      const sp = t.spread == null ? 78 : t.spread;
      st.setProperty("--sc-bg-hold", (sp * 0.42).toFixed(1) + "%");
      const a = (t.tile == null ? (light ? 58 : 5.5) : t.tile) / 100;
      st.setProperty("--sc-tile", `rgba(255,255,255,${a.toFixed(3)})`);
      st.setProperty("--sc-cell-fill", `rgba(255,255,255,${a.toFixed(3)})`);
      st.setProperty("--sc-tile-line", light
        ? `rgba(255,255,255,${Math.min(0.95, a + 0.35).toFixed(3)})`
        : `rgba(150,195,255,${Math.min(0.4, a * 4 + 0.04).toFixed(3)})`);
    }

    getCardSize() { return this._config?.layout?.mode === "narrow" ? 12 : 9; }
    getGridOptions() { return { columns: "full", rows: "auto", min_columns: 6 }; }

    /**
     * Vertical space the card may occupy, or 0 when it should keep its natural
     * height. Panel views give the card the full viewport, so there it has to
     * fit instead of overflowing; scrolling views are left alone.
     */
    _availHeight() {
      const L = (this._config && this._config.layout) || {};
      const want = L.fit_height || "auto";
      if (want === "never") return 0;

      // Walk up through the shadow boundaries looking for the panel wrapper.
      let panel = null;
      let n = this;
      for (let i = 0; i < 26 && n; i++) {
        const t = (n.tagName || "").toLowerCase();
        if (t === "hui-panel-view") { panel = n; break; }
        // A scrolling view means the card is one of many; stop looking.
        if (t === "hui-masonry-view" || t === "hui-sections-view" ||
            t === "hui-view-container") break;
        n = n.parentElement || (n.getRootNode && n.getRootNode().host) || null;
      }
      if (!panel && want !== "always") return 0;

      const vh = window.innerHeight || 0;
      const top = this.getBoundingClientRect().top;
      const bottom = panel ? Math.min(panel.getBoundingClientRect().bottom, vh) : vh;
      return Math.max(0, Math.round(bottom - top - (L.bottom_gap || 0)));
    }

    connectedCallback() {
      if (!this._ro && typeof ResizeObserver !== "undefined") {
        this._ro = new ResizeObserver((entries) => {
          const w = entries[0]?.contentRect?.width || this.clientWidth;
          if (!w) return;
          const mode = pickMode(w, this._config);
          if (mode !== this._mode) {
            this._mode = mode; this._sig = null;
            this.setAttribute("data-mode", mode);
          }
          this._update();
        });
        this._ro.observe(this);
      }
      // Rotating an Echo Show or opening the browser bar changes the room
      // available without resizing the card itself, so watch the window too.
      if (!this._onWinResize) {
        this._onWinResize = () => {
          clearTimeout(this._rzT);
          this._rzT = setTimeout(() => this._update(), 120);
        };
        window.addEventListener("resize", this._onWinResize);
        window.addEventListener("orientationchange", this._onWinResize);
      }
    }
    disconnectedCallback() {
      clearTimeout(this._gridDisplayTimer);
      this._gridDisplayTimer = null;
      if (this._ro) { this._ro.disconnect(); this._ro = null; }
      if (this._onWinResize) {
        window.removeEventListener("resize", this._onWinResize);
        window.removeEventListener("orientationchange", this._onWinResize);
        this._onWinResize = null;
      }
    }

    set hass(hass) {
      this._hass = hass;
      // Static labels are only written by _build, so a language switch rebuilds.
      if (setLang(hass)) { this._built = false; this._lastSvg = null; }
      keepAwake(this._config.keep_awake);
      if (!this._built) this._build();
      this._update();
    }

    _build() {
      const c = this._config;
      const h = c.header || {};
      const chip = (id, ic) => `<div class="status-chip"><ha-icon id="${id}Icon" icon="${ic}"></ha-icon><span id="${id}">–</span></div>`;
      const chips = [
        h.temp ? chip("headerTemp", "mdi:thermometer") : "",
        h.humidity ? chip("headerHumidity", "mdi:water-percent") : "",
        h.weather ? chip("headerWeather", "mdi:weather-cloudy") : "",
        h.uv ? chip("headerUv", "mdi:weather-sunny-alert") : "",
      ].join("");
      const meters = [
        h.real_import ? `<div class="meter">${T("Realer Bezug")}: <strong id="realImport">–</strong></div>` : "",
        h.real_export ? `<div class="meter">${T("Reale Einspeisung")}: <strong id="realExport">–</strong></div>` : "",
      ].join("");
      this.shadowRoot.innerHTML = `<style>${CARD_CSS}</style>
        <div class="wrap">
          <div class="hdr">
            <div class="hdr-left">
              <div class="t">${esc(c.title || T("Energie"))}</div>
              ${meters}
            </div>
            <div class="status-chips">${chips}</div>
          </div>
          <div id="stage"></div>
        </div>`;
      this._applyTheme();
      this._lastSvg = null;   // fresh stage element, nothing cached applies to it
      const stage = this.shadowRoot.getElementById("stage");
      stage.addEventListener("click", (ev) => {
        const g = ev.composedPath().find((n) => n.dataset && n.dataset.entity);
        if (!g) return;
        this.dispatchEvent(new CustomEvent("hass-more-info", {
          detail: { entityId: g.dataset.entity }, bubbles: true, composed: true,
        }));
      });
      this._built = true;
      if (!this._mode) { this._mode = pickMode(this.clientWidth, this._config); this.setAttribute("data-mode", this._mode); }
    }

    _sampleGridDisplay(value) {
      const now = performance.now();
      const due = this._gridDisplayAt == null || now - this._gridDisplayAt >= 5000;
      // Label and signed value share a sample; availability and flow stay live.
      if (value == null) {
        this._gridDisplayValue = null;
        this._gridDisplayAt = null;
      }
      else if (due) {
        this._gridDisplayValue = value;
        this._gridDisplayAt = now;
      }
      if (this.isConnected && !this._gridDisplayTimer) {
        const delay = value == null || this._gridDisplayAt == null ? 5000
          : Math.max(1, 5000 - (now - this._gridDisplayAt));
        this._gridDisplayTimer = setTimeout(() => {
          this._gridDisplayTimer = null;
          this._update();
        }, delay);
      }
      return this._gridDisplayValue ?? null;
    }

    /** Collect all live values once per update. */
    _data() {
      const hass = this._hass, c = this._config;
      const solar = c.solar.map((s) => ({ ...s, value: num(hass, s.entity),
        energyToday: energyKWh(hass, s.energy_today, s.energy_today_unit) }));
      const pvTotal = solar.reduce((a, s) => a + (s.value || 0), 0);
      const pvEnergy = { entity: c.pv.energy_today, value: energyKWh(hass, c.pv.energy_today) };
      const pvForecast = PV_FORECAST.filter(f => c.pv[f.key]).map(f => ({
        ...f, entity: c.pv[f.key], value: energyKWh(hass, c.pv[f.key]),
      }));
      const batteries = c.batteries.map((b) => {
        const p = num(hass, b.power);
        const inv = b.invert ? -1 : 1;
        const pw = p == null ? null : p * inv;
        return { ...b, socValue: num(hass, b.soc), powerValue: pw,
                 active: pw != null && Math.abs(pw) > 5, charging: pw != null && pw < -5 };
      });
      const gRaw = num(hass, c.grid.entity);
      const gridValue = gRaw == null ? null : (c.grid.invert ? -gRaw : gRaw);
      const climate = c.climate.map((cl) => {
        const p = num(hass, cl.entity);
        const st = cl.state_entity ? hass.states[cl.state_entity] : null;
        const on = p != null ? p > (cl.threshold ?? 3)
          : !cl.entity && st ? !["off", "unavailable", "unknown"].includes(st.state) : false;
        return { ...cl, value: p, stateText: st ? hass.formatEntityState(st) : null, active: on,
                 metricValues: (cl.metrics || []).map((m) => ({ ...m, value: num(hass, m.entity) })) };
      });
      const consumers = c.consumers.filter((x) => !x.hidden).map((x) => {
        const v = num(hass, x.entity);
        const unit = x.unit || "W";
        // A 3 W default silently hid real consumption (a dryer on standby draws
        // ~1.3 W, an air fryer ~0.4 W), so the tile showed a value while the
        // wire stayed dark. 0.2 W still filters sensor noise around zero.
        // Standby draw is treated as off. One threshold governs both the wire
        // and the number, so a tile can never show a value while its wire sits
        // dark — that mismatch is what made a running device look broken.
        const tol = x.threshold ?? 5;
        const standby = unit === "W" && v != null && Math.abs(v) <= tol;
        return { ...x, value: standby ? 0 : v, text: fmtBy(unit, standby ? 0 : v),
                 standby,
                 active: unit === "W" && v != null && v > tol,
                 hideZero: x.hide_when_zero && (v == null || Math.abs(v) <= tol),
                 secondaryText: x.secondary?.entity
                   ? `${x.secondary.label || ""} ${fmtBy(x.secondary.unit || "W", num(hass, x.secondary.entity))}`.trim()
                   : null };
      }).filter((x) => !x.hideZero);
      const vehicles = c.vehicles.map((v) => {
        const p = num(hass, v.power);
        const pw = p == null ? null : p * (v.invert ? -1 : 1);
        const charging = pw != null && pw > (v.threshold ?? 50);
        const ps = v.plug ? hass.states[v.plug] : null;
        const s = ps ? String(ps.state).toLowerCase() : "";
        // Integrations disagree on wording ("Connected", "plugged_in", "on",
        // "charging", "EV Disconnected", …), so negatives are ruled out first.
        const plugged = ps
          ? !/(disconnect|unplug|not[_ ]?connected|^off$|^false$|^unavailable$|^unknown$|^none$)/.test(s)
            && /(^on$|^true$|connect|plug|charg|ready|wait|full|complete|finish|paus)/.test(s)
          : charging;
        return { ...v, socValue: num(hass, v.soc), powerValue: pw, charging, active: charging,
                 plugged: plugged || charging, rangeValue: num(hass, v.range),
                 timeToFull: num(hass, v.time_to_full), targetSoc: num(hass, v.target_soc),
                 metricValues: (v.metrics || []).filter((m) => m && m.entity).map((m) => ({
                   entity: m.entity, text: fmtEntity(hass, m),
                   icon: m.icon || hass.states[m.entity]?.attributes.icon || "mdi:information-outline" })) };
      });
      const stackTiles = climate.map((cl) => ({
        kind: "climate", name: cl.name, icon: cl.icon || "mdi:air-conditioner", color: "#7dd3fc",
        text: cl.value == null ? (cl.stateText || "–") : fmtW(cl.value), active: cl.active,
        entity: cl.entity || cl.state_entity,
        secondaryText: cl.metricValues.length ? `${cl.metricValues[0].label} ${fmtBy(cl.metricValues[0].unit || "kWh", cl.metricValues[0].value)}` : null,
      })).concat(consumers.map((x) => ({ kind: "load", ...x })));
      return {
        solar, pvTotal, pvEnergy, pvForecast, batteries, climate, consumers, stackTiles, vehicles,
        grid: c.grid, gridValue, gridDisplayValue: this._sampleGridDisplay(gridValue),
        gridImport: gridValue != null && gridValue > 5,
        gridExport: gridValue != null && gridValue < -5,
        gridImportToday: num(hass, c.grid.import_today), gridExportToday: num(hass, c.grid.export_today),
        home: num(hass, c.home.entity),
      };
    }

    _update() {
      const hass = this._hass;
      if (!hass || !this._built) return;
      // Icon paths resolve asynchronously the first time each one is used;
      // this lets them ask for a single repaint once they arrive.
      REDRAW = () => {
        clearTimeout(this._iconT);
        this._iconT = setTimeout(() => this._update(), 40);
      };
      LIGHT = ((this._config && this._config.theme) || {}).mode === "hell";
      const d = this._data();
      const mode = this._mode || "mid";
      const P = MODES[mode];

      // Work out how tall the drawing may be, then aim the layout at exactly
      // that shape. Fitting the target instead of scaling down afterwards
      // means the space is actually used rather than left empty at the sides.
      const avail = this._availHeight();
      const stage0 = this.shadowRoot.getElementById("stage");
      const cardW = this.clientWidth || 0;
      let room = 0;
      if (avail) {
        // Everything around the drawing: header, wrapper padding, border.
        // Measured from the previous frame so it stays correct no matter how
        // the header wraps; the estimate is only used on the very first pass.
        const hdr = this.shadowRoot.querySelector(".hdr");
        const hdrH = hdr ? hdr.getBoundingClientRect().height : 0;
        let chrome = hdrH + 26;
        const prev = stage0 && stage0.querySelector("svg");
        if (prev) {
          const ch = this.getBoundingClientRect().height;
          const sh = prev.getBoundingClientRect().height;
          if (ch > sh && ch - sh < ch) chrome = ch - sh;
        }
        room = Math.max(160, Math.round(avail - chrome));
      }
      let target = this._config.layout.aspect || (mode === "wide" ? 16 / 9 : 4 / 3);
      if (room && cardW) target = cardW / room;

      // Layout + routing only need to run when the structure or shape changes.
      const sig = [mode, d.solar.length, d.batteries.length, d.climate.length,
                   d.vehicles.map(v => (v.soc || v.power) + "/" + v.metricValues.length).join(","),
                   d.consumers.map(c => c.entity).join(","),
                   d.climate.map(c => c.entity || c.state_entity).join(","),
                   d.grid.entity ? 1 : 0,
                   d.solar.some(s => s.energy_today) ? 1 : 0,
                   d.pvEnergy.entity ? 1 : 0, d.pvForecast.length,
                   target.toFixed(2)].join("|");
      if (sig !== this._sig) {
        const L = mode === "narrow" ? layoutStack(P, d) : layoutRingFitted(P, d, target);
        this._layout = routeLinks(consumerNetwork(L), mode === "narrow" ? 10 : 13);
        this._sig = sig;
      }
      const L = this._layout;
      this._room = room;
      const PS = Object.assign({}, P, { scale: L.scale == null ? 1 : L.scale });
      const stage = this.shadowRoot.getElementById("stage");

      // Wires are built first because a label that sits ON its own wire needs a
      // hole cut into that wire, and the mask has to be declared in <defs>
      // before it is referenced.
      const labels = [];
      const wireStyle = (this._config.theme && this._config.theme.wires) || "puls";
      let wires = "";
      let knock = "";
      L.links.forEach((link, i) => {
        const k = { ...link, ...liveFlow(link, d) };
        if (k.label) k.label = { ...k.label, text: fmtW(d.pvTotal) };
        const w = `<g data-flow="${i}" data-flow-kind="${k.flow.type}"
          data-flow-on="${k.on}" data-flow-reverse="${!!k.rev}">${
          wireSvg(k.d, k.cls, k.on, k.rev, k.distance, wireStyle)}</g>`;
        if (k.label && k.label.knockout) {
          const box = labelBox(k.label);
          knock += `<mask id="sc-pv-knock${i}" maskUnits="userSpaceOnUse"
                      x="0" y="0" width="${L.vbw}" height="${L.vbh}">
                      <rect x="0" y="0" width="${L.vbw}" height="${L.vbh}" fill="#fff"/>
                      <rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}"
                            rx="${(box.h / 2).toFixed(1)}" fill="#000"/>
                    </mask>`;
          wires += `<g mask="url(#sc-pv-knock${i})">${w}</g>`;
        } else {
          wires += w;
        }
        if (k.label) labels.push(k.label);
      });

      let s = `<svg viewBox="0 0 ${L.vbw} ${L.vbh}" preserveAspectRatio="xMidYMid meet">
        <defs><radialGradient id="scPvHouseG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${LIGHT ? "rgba(47,126,230,0.26)" : "rgba(0,190,255,0.35)"}"/>
          <stop offset="100%" stop-color="${LIGHT ? "rgba(47,126,230,0)" : "rgba(0,190,255,0)"}"/>
        </radialGradient>${knock}</defs>`;
      s += wires;
      L.nodes.forEach((n) => { s += this._node(n, d, PS); });
      labels.forEach((l) => {
        // The chip sits on exactly the box that was cut out of the wire, so the
        // cable ends flush against its outline instead of stopping in mid-air.
        if (l.knockout) {
          const b = labelBox(l);
          s += `<rect class="label-chip" x="${b.x}" y="${b.y}" width="${b.w}"
                      height="${b.h}" rx="${(b.h / 2).toFixed(1)}"/>`;
        }
        s += `<text class="${l.cls}" x="${l.x}" y="${l.y}" text-anchor="middle">${esc(l.text === undefined ? fmtW(d.pvTotal) : l.text)}</text>`;
      });
      s += `</svg>`;
      // Home Assistant pushes a state update several times a second. Replacing
      // the drawing each time destroys and recreates every node, which restarts
      // the brightness animation on every tile and re-resolves every icon —
      // visible as a constant flicker. Comparing the whole string did not help
      // because a single changed number makes it differ. So the existing nodes
      // are patched in place instead, and only a real structural change (a
      // different number of tiles, a new layout) rebuilds anything.
      if (s !== this._lastSvg) {
        this._lastSvg = s;
        const live = stage.firstElementChild;
        // Parse the full markup, including the root's viewBox — dropping it and
        // re-wrapping would make the patch strip the viewBox off the live SVG.
        const doc = new DOMParser().parseFromString(
          s.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" '), "image/svg+xml");
        const next = doc.querySelector("parsererror") ? null : doc.documentElement;
        if (live && next && patchSvg(live, next)) {
          // patched in place: animations and icons kept running
        } else {
          stage.innerHTML = s;
          // Safety net: even if the fitted layout is still a touch too tall
          // (very short screens, unusual tile counts), cap the drawing so
          // nothing is cut off. preserveAspectRatio keeps it centred.
          const svgEl = stage.querySelector("svg");
          if (svgEl) svgEl.style.maxHeight = this._room ? this._room + "px" : "";
          this._syncPhases(stage);
        }
      }
      this._header(d);
    }

    /**
     * Place every freshly created wire at the phase it should be at right now.
     * Without this a rebuild restarts each animation from zero, which reads as
     * the surges stuttering backwards a few times a second.
     */
    _syncPhases(stage) {
      const pulseDelay = wireDelay(), dashDelay = wireDelay(.216);
      stage.querySelectorAll("path.run, path.dash, path.wire-core").forEach((el) => {
        el.style.setProperty("--dl", el.classList.contains("dash") ? dashDelay : pulseDelay);
      });
    }

    _node(n, d, P) {
      const c = this._config;
      switch (n.t) {
        case "pvgroup": return this._pvGroup(n, d);
        case "house": {
          const img = step1Image(c.home,LIGHT) || "builtin:home";
          const size = Math.round(n.r * 1.08);
          return `<circle cx="${n.x}" cy="${n.y}" r="${Math.round(n.r * 1.3)}" fill="url(#scPvHouseG)"/>
            <g class="${c.home.entity ? "clickable" : ""}"${c.home.entity ? ` data-entity="${esc(c.home.entity)}"` : ""}>
            <circle class="center" cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${LIGHT ? "rgba(255,255,255,0.82)" : "rgba(16,28,52,0.85)"}" stroke="${LIGHT ? "rgba(255,255,255,0.95)" : "rgba(120,190,255,0.5)"}" stroke-width="1.5"/>
            ${artwork(n.x - size * .6, n.y - size / 2 - 9, size, img, c.home.icon || "mdi:home-lightning-bolt", "#7fd4ff", "rgba(0,190,255,.6)", size * 1.2)}
            <text x="${n.x}" y="${n.y + n.r - 12}" text-anchor="middle" font-size="${Math.round(n.r * (d.home == null ? 0.19 : 0.28))}" font-weight="700">${d.home == null ? T("Unvollständig") : esc(fmtW(d.home))}</text></g>`;
        }
        case "grid": return step1Grid(n,d,c.grid);
        case "storage": {
          const inner = d.batteries.map((b, i) =>
            batterySvg(n.x + 9, n.y + 42 + i * (n.batH + 10), n.w - 18, n.batH, b, false)).join("");
          return `<g class="pulse"><rect class="group-frame" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="18"/>
            ${icon(n.x + 12, n.y + 9, 20, "mdi:battery-sync", "#60a5fa", "rgba(96,165,250,.7)")}
            <text class="group-title" x="${n.x + 39}" y="${n.y + 25}">${T("SPEICHER")}</text></g>${inner}`;
        }
        case "battery": return batterySvg(n.x, n.y, n.w, n.h, d.batteries[n.i], true);
        case "vehicles": {
          const inner = d.vehicles.map((v, i) =>
            vehicleSvg(n.x + 9, n.y + 42 + i * (n.vehH + 10), n.w - 18, n.vehH, v, false)).join("");
          return `<g class="pulse"><rect class="group-frame" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="18"/>
            ${icon(n.x + 12, n.y + 9, 20, "mdi:car-electric", "#60a5fa", "rgba(96,165,250,.7)")}
            <text class="group-title" x="${n.x + 39}" y="${n.y + 25}">${T("E-AUTO")}</text></g>${inner}`;
        }
        case "vehicle": return d.vehicles[n.i] ? vehicleSvg(n.x, n.y, n.w, n.h, d.vehicles[n.i], true) : "";
        case "climate": return this._climateGroup(n, d);
        case "load": {
          const l = d.consumers[n.i];
          if (!l) return "";
          return tileSvg(n, { label: l.name || l.entity, value: l.text, sub: l.secondaryText,
            image: l.image, icon: l.icon, color: l.color || "#7fd4ff",
            glow: (l.color || "#37c8ff") + "88", iconSize: 26, entity: l.entity, scale: P.scale });
        }
        case "stacktile": {
          const t = d.stackTiles[n.i];
          if (!t) return "";
          return tileSvg(n, { label: t.name || t.entity, value: t.text, sub: t.secondaryText,
            image: t.image, icon: t.icon, color: t.color || "#7fd4ff",
            glow: (t.color || "#37c8ff") + "88", iconSize: 24, entity: t.entity, scale: P.scale });
        }
        default: return "";
      }
    }

    _pvGroup(n, d) {
  const light = this._config.theme.mode === "hell";
  const tint = light ? "#176a9e" : "#68dfff";
  const text = light ? "#152b49" : "#edfbff";
  const muted = light ? "#4e6d88" : "#aecbdd";
  const start = n.x + (n.w - (n.perRow * n.cellW + (n.perRow - 1) * n.cellGap)) / 2;
  const top = n.y + n.headH - (n.compact ? 4 : 0);
  const shape = `pv-surface-${light ? "light" : "dark"}`;
  let svg = `<g class="pv-pilot">
    <defs>
      <linearGradient id="${shape}" x1="0" y1="0" x2=".8" y2="1">
        <stop stop-color="${light ? "#ffffff" : "#234265"}" stop-opacity="${light ? ".88" : ".58"}"/>
        <stop offset="1" stop-color="${light ? "#d8e9f5" : "#112240"}" stop-opacity=".75"/>
      </linearGradient>
    </defs>
    <rect class="pv-group" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="18"/>
    <text class="pv-title" x="${n.x + 18}" y="${n.y + 26}">${T("PV-TOTAL")}</text>`;
  if (d.pvEnergy.entity) {
    const label = T("Ertrag heute") + " " + fmtPvEnergy(d.pvEnergy.value);
    const width = n.summaryStacked ? n.w - 36 : n.w - 158;
    const size = Math.min(14, Math.max(12, step1Fit(label, width, 14, 650)));
    svg += `<g class="clickable" data-entity="${esc(d.pvEnergy.entity)}">
      <text class="pv-energy-total" x="${n.summaryStacked ? n.x + 18 : n.x + n.w - 18}"
        y="${n.y + (n.summaryStacked ? 48 : 26)}" text-anchor="${n.summaryStacked ? "start" : "end"}"
        style="font-size:${size}px;font-weight:650;fill:var(--sc-ink-soft)">${esc(label)}</text>
    </g>`;
  }
  if (d.pvForecast.length) {
    const fx = n.x + 14, fy = n.y + (n.compact ? 34 : 38) + (n.summaryStacked ? 22 : 0);
    const fw = n.w - 28, columnW = fw / d.pvForecast.length;
    const values = d.pvForecast.map(f => fmtPvEnergy(f.value));
    const valueSize = Math.min(...values.map(value => step1Fit(value, columnW - 16, 16, 650)));
    svg += `<g class="pv-forecast">
      <rect x="${fx}" y="${fy}" width="${fw}" height="70" rx="10"
        style="fill:var(--sc-chip-bg);stroke:var(--sc-chip-line)"/>
      <text class="pv-forecast-title" x="${fx + 12}" y="${fy + 17}"
        style="font-size:11px;font-weight:650;letter-spacing:1px;fill:var(--sc-ink-soft)">${T("PV-VORHERSAGE")}</text>`;
    d.pvForecast.forEach((f, i) => {
      const cx = fx + columnW * (i + 0.5);
      svg += `<g class="clickable pv-forecast-metric" data-entity="${esc(f.entity)}">
        <text class="pv-forecast-label" x="${cx}" y="${fy + 35}" text-anchor="middle"
          style="font-size:12px;font-weight:500;fill:var(--sc-ink-soft)">${esc(T(f.label))}</text>
        <text class="pv-forecast-value" x="${cx}" y="${fy + 57}" text-anchor="middle"
          style="font-size:${valueSize}px;font-weight:650;fill:var(--sc-ink)">${esc(values[i])}</text>
      </g>`;
    });
    svg += "</g>";
  }
  const ends = [];
  const energyTexts = d.solar.map(p => T("Heute") + " " + fmtPvEnergy(p.energyToday));
  const energySize = Math.min(...d.solar.filter(p => p.energy_today)
    .map(p => step1Fit(T("Heute") + " " + fmtPvEnergy(p.energyToday), n.cellW - 16, n.compact ? 13 : 14, 600)), 14);
  for (let i = 0; i < d.solar.length; i++) {
    const p = d.solar[i];
    const image = resolveImage((light && p.image_light ? p.image_light : p.image) || "builtin:solar-roof");
    const row = Math.floor(i / n.perRow), col = i % n.perRow;
    const x = start + col * (n.cellW + n.cellGap), y = top + row * (n.cellH + 8);
    const cx = x + n.cellW / 2;
    const artH = n.compact ? 62 : 68;
    const nameY = y + (n.compact ? 80 : 86), valueY = y + (n.compact ? 100 : 110);
    const artW = Math.min(n.cellW - 12, artH * 1.5);
    svg += `<g data-entity="${esc(p.entity)}" class="clickable">
      <rect class="pv-cell" x="${x}" y="${y}" width="${n.cellW}" height="${n.cellH}" rx="13"
        style="fill:url(#${shape});stroke:${tint};stroke-opacity:.45;opacity:1"/>
      <path d="M ${x + 14} ${y + 1} H ${x + n.cellW - 14}" stroke="${tint}" stroke-opacity=".45" fill="none"/>
      ${image ? `<image href="${esc(image)}" x="${cx - artW / 2}" y="${y + 3}" width="${artW}" height="${artH}" preserveAspectRatio="xMidYMid meet"/>`
        : icon(cx - 20, y + 14, 40, p.icon || "mdi:solar-panel", tint, undefined, REDRAW)}
      <text class="pv-pilot-name" x="${cx}" y="${nameY}" text-anchor="middle"
        style="font-size:${n.compact ? 12 : 13}px;font-weight:600;fill:${muted}">${esc(p.name)}</text>
      <text class="pv-pilot-value" x="${cx}" y="${valueY}" text-anchor="middle"
        style="font-size:${n.compact ? 17 : 20}px;font-weight:700;fill:${text}">${esc(fmtW(p.value))}</text>
      ${p.energy_today ? `<g class="clickable pv-array-yield" data-entity="${esc(p.energy_today)}">
        <text class="pv-pilot-energy" x="${cx}" y="${valueY + 22}" text-anchor="middle"
          style="font-size:${energySize}px;font-weight:600;fill:${muted}">${esc(energyTexts[i])}</text>
      </g>` : ""}
    </g>`;
    if (row === n.rows - 1) ends.push({ x: cx, y: y + n.cellH });
  }
  const busY = n.y + n.h - 12, center = n.x + n.w / 2;
  if (ends.length) {
    const path = ends.map(p => `M ${p.x} ${p.y} V ${busY}`).join(" ")
      + ` M ${ends[0].x} ${busY} H ${ends[ends.length - 1].x} M ${center} ${busY} V ${n.y + n.h}`;
    svg += `<path class="pv-bus" d="${path}"/><circle cx="${center}" cy="${busY}" r="3.5" fill="var(--sc-prod)"/>`;
  }
  return svg + "</g>";
    }

    _climateGroup(n, d) {
      let s = `<g class="pulse"><rect class="group-frame" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="18"/>
        ${icon(n.x + 12, n.y + 9, 20, "mdi:snowflake-thermometer", "#60a5fa", "rgba(96,165,250,.7)")}
        <text class="group-title" x="${n.x + 39}" y="${n.y + 25}">${T("KLIMA")}</text>`;
      const cx = n.x + 9, cw = n.w - 18;
      d.climate.forEach((c, i) => {
        const y = n.y + 42 + i * (n.cellH + 10);
        const ent = c.entity || c.state_entity;
        s += `<g class="${ent ? "clickable" : ""}"${ent ? ` data-entity="${esc(ent)}"` : ""}>
          <rect class="group-cell" x="${cx}" y="${y}" width="${cw}" height="${n.cellH}" rx="11"/>
          ${artwork(cx + 8, y + 10, 28, c.image, c.icon || "mdi:air-conditioner", "#7dd3fc", "rgba(56,189,248,.55)")}
          <text class="cell-name" x="${cx + 42}" y="${y + 18}">${esc(c.name || "")}</text>
          <text class="cell-state" x="${cx + 42}" y="${y + 36}">${esc(c.value == null ? (c.stateText || "–") : fmtW(c.value))}</text>`;
        c.metricValues.slice(0, 2).forEach((m, j) => {
          s += `<text class="cell-metric" x="${cx + 42}" y="${y + 57 + j * 16}">${esc(m.label || "")} ${esc(fmtBy(m.unit || "kWh", m.value))}</text>`;
        });
        s += `</g>`;
      });
      return s + `</g>`;
    }

    _header(d) {
      const hass = this._hass, h = this._config.header || {};
      const set = (id, txt) => { const el = this.shadowRoot.getElementById(id); if (el) el.textContent = txt; };
      if (h.real_import) set("realImport", fmtMeter(num(hass, h.real_import)));
      if (h.real_export) set("realExport", fmtMeter(num(hass, h.real_export)));
      if (h.temp) set("headerTemp", fmtTemp(num(hass, h.temp)));
      if (h.humidity) { const v = num(hass, h.humidity); set("headerHumidity", v == null ? "–" : Math.round(v) + " %"); }
      if (h.uv) { const v = num(hass, h.uv); set("headerUv", v == null ? "–" : v.toFixed(1).replace(".", DEC)); }
      if (h.weather) {
        const w = hass.states[h.weather];
        set("headerWeather", w ? hass.formatEntityState(w) : "–");
        const el = this.shadowRoot.getElementById("headerWeatherIcon");
        if (el) el.setAttribute("icon", w ? (WEATHER_ICONS[w.state] || "mdi:weather-cloudy") : "mdi:weather-cloudy");
      }
    }
  }

  // ------------------------------------------------------------ keep awake
  // Keeps Fire OS devices (Echo Show, Fire tablets) from dropping into their
  // photo-frame screen while the card is shown: a looping muted video takes a
  // screen wake lock, a silent audio loop holds a media session, and
  // navigator.wakeLock is used where the page is served over HTTPS. Enabled per
  // card with keep_awake: fire_os (those devices only) or always.
  // 20 s of true silence (8 kbit/s mono MP3) and 5 s of black 64x64 H.264
  // baseline video, both inlined: nothing is ever fetched over the network,
  // so no external service can break this and no request can fail.
  var SILENT = "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYyLjEyLjEwMgAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAABGAAAT5gABQgKDRASFBcaHB4hJCYpKy4wMzY4Oj1AQkRHSkxPUVRWWVxeYGNmaGptcHJ1d3p8f4KEhomMjpCTlpibnaCipaiqrK+ytLa5vL7Bw8bIy87Q0tXY2tzf4uTn6ezu8fT2+Pv+AAAAAExhdmM2Mi4yOAAAAAAAAAAAAAAAACQCwAAAAAAAAE+YPQbmMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUU0LjBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxLEAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
  var MOVIE = "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAPsbW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAAE4gAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAxZ0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAE4gAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAEAAAABAAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAABOIAAAAAAABAAAAAAKObWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAAoAAAAyABVxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAACOW1pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAflzdGJsAAAAuXN0c2QAAAAAAAAAAQAAAKlhdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAEAAQABIAAAASAAAAAAAAAABFUxhdmM2Mi4yOC4xMDIgbGlieDI2NAAAAAAAAAAAAAAAGP//AAAAL2F2Y0MBQsAe/+EAF2dCwB7ZBCbARAAAAwAEAAADAFA8WLkgAQAFaMuDyyAAAAAQcGFzcAAAAAEAAAABAAAAFGJ0cnQAAAAAAAAHKAAAAAAAAAAYc3R0cwAAAAAAAAABAAAAMgAABAAAAAAUc3RzcwAAAAAAAAABAAAAAQAAABxzdHNjAAAAAAAAAAEAAAABAAAAMgAAAAEAAADcc3RzegAAAAAAAAAAAAAAMgAAAo8AAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAAFHN0Y28AAAAAAAAAAQAABBwAAABidWR0YQAAAFptZXRhAAAAAAAAACFoZGxyAAAAAAAAAABtZGlyYXBwbAAAAAAAAAAAAAAAAC1pbHN0AAAAJal0b28AAAAdZGF0YQAAAAEAAAAATGF2ZjYyLjEyLjEwMgAAAAhmcmVlAAAEgW1kYXQAAAJxBgX//23cRem95tlIt5Ys2CDZI+7veDI2NCAtIGNvcmUgMTY1IHIzMjIyIGIzNTYwNWEgLSBILjI2NC9NUEVHLTQgQVZDIGNvZGVjIC0gQ29weWxlZnQgMjAwMy0yMDI1IC0gaHR0cDovL3d3dy52aWRlb2xhbi5vcmcveDI2NC5odG1sIC0gb3B0aW9uczogY2FiYWM9MCByZWY9MyBkZWJsb2NrPTE6MDowIGFuYWx5c2U9MHgxOjB4MTExIG1lPWhleCBzdWJtZT03IHBzeT0xIHBzeV9yZD0xLjAwOjAuMDAgbWl4ZWRfcmVmPTEgbWVfcmFuZ2U9MTYgY2hyb21hX21lPTEgdHJlbGxpcz0xIDh4OGRjdD0wIGNxbT0wIGRlYWR6b25lPTIxLDExIGZhc3RfcHNraXA9MSBjaHJvbWFfcXBfb2Zmc2V0PS0yIHRocmVhZHM9MiBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTAgd2VpZ2h0cD0wIGtleWludD0yNTAga2V5aW50X21pbj0xMCBzY2VuZWN1dD00MCBpbnRyYV9yZWZyZXNoPTAgcmNfbG9va2FoZWFkPTQwIHJjPWNyZiBtYnRyZWU9MSBjcmY9MjMuMCBxY29tcD0wLjYwIHFwbWluPTAgcXBtYXg9NjkgcXBzdGVwPTQgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAABZliIQP8mKAAMPsnJyddddddddddddeAAAABkGaOB/hGAAAAAZBmlQH+EYAAAAGQZpgP8IwAAAABkGagD/CMAAAAAZBmqA/wjAAAAAGQZrAP8IwAAAABkGa4D/CMAAAAAZBmwA/wjAAAAAGQZsgP8IwAAAABkGbQD/CMAAAAAZBm2A/wjAAAAAGQZuAP8IwAAAABkGboD/CMAAAAAZBm8A/wjAAAAAGQZvgP8IwAAAABkGaAD/CMAAAAAZBmiA/wjAAAAAGQZpAP8IwAAAABkGaYD/CMAAAAAZBmoA/wjAAAAAGQZqgP8IwAAAABkGawD/CMAAAAAZBmuA/wjAAAAAGQZsAP8IwAAAABkGbID/CMAAAAAZBm0A/wjAAAAAGQZtgP8IwAAAABkGbgD/CMAAAAAZBm6A/wjAAAAAGQZvAP8IwAAAABkGb4D/CMAAAAAZBmgA/wjAAAAAGQZogP8IwAAAABkGaQD/CMAAAAAZBmmA/wjAAAAAGQZqAP8IwAAAABkGaoD/CMAAAAAZBmsA/wjAAAAAGQZrgP8IwAAAABkGbAD/CMAAAAAZBmyA/wjAAAAAGQZtAP8IwAAAABkGbYD/CMAAAAAZBm4A/wjAAAAAGQZugP8IwAAAABkGbwD/CMAAAAAZBm+A/wjAAAAAGQZoAO8IwAAAABkGaIDfCMA==";

  // Size and opacity of the parked video. Overridable with
  // ?keepawake=<px>,<opacity> on the dashboard URL, since an Echo Show offers
  // no developer tools to experiment with.
  var KA_SIZE = 18, KA_OPACITY = 0.04;
  try {
    var kp = /[?&]keepawake=([\d.]+)(?:,([\d.]+))?/.exec(location.search);
    if (kp) {
      KA_SIZE = Math.max(1, Math.min(400, parseFloat(kp[1]) || KA_SIZE));
      if (kp[2] != null) KA_OPACITY = Math.max(0, Math.min(1, parseFloat(kp[2])));
    }
  } catch (e) { /* ignore */ }

  // Fire OS models: AEO** = Echo Show (the 15 reports AEOHY), AFT* = Fire TV,
  // KF* = Fire tablets. Silk/ also matches when desktop mode strips the model.
  var IS_FIRE_OS =
    /\bSilk\/|\bKF[A-Z]{2,}|AmazonWebAppPlatform|\bAEO[A-Z]{2}|\bAFT[A-Z0-9]{1,}/i
      .test(navigator.userAgent || "");
  // ?keepawake=force runs the engine on any device, for testing.
  var FORCE = /[?&]keepawake=force/.test(location.search);

  var engine = window.__glassEnergyKeepAwake;

  if (!engine) {
    engine = window.__glassEnergyKeepAwake = {
      version: CARD_VERSION,
      audio: null,
      video: null,
      host: null,
      lock: null,
      armed: false,          // audio has been audible at least once
      gestured: false,       // a real user interaction has happened
      videoOk: false,        // video is decoding frames
      started: false,
      startedAt: 0,
      gestures: 0,
      recoveries: 0,
      lastFrame: 0,
      listeners: [],
      state: "wait",
      reason: "Startet…",
      note: "",
    };

    engine.notify = function (state, reason) {
      if (engine.state === state && engine.reason === reason) return;
      engine.state = state;
      engine.reason = reason;
      engine.listeners.forEach(function (fn) {
        try { fn(state, reason); } catch (e) { /* ignore */ }
      });
    };

    var playEl = function (el) {
      if (!el) return;
      var p = el.play();
      if (p && p.catch) p.catch(function (e) {
        engine.note = (e && e.name) || "play blocked";
      });
    };

    engine.play = function () { playEl(engine.video); playEl(engine.audio); };

    // Fire OS only treats *audible* playback as a real media session, so the
    // muted start used to satisfy autoplay rules is lifted once a gesture
    // allows it. Unmuting before that just gets the element blocked and left
    // paused, which is worse than staying quietly muted. The video stays muted
    // either way — muted video autoplays everywhere and still takes the lock.
    engine.unmute = function () {
      var a = engine.audio;
      if (!a || !a.muted || !engine.gestured) return;
      a.muted = false;
      playEl(a);
    };

    engine.requestLock = function () {
      if (engine.lock || !navigator.wakeLock || !window.isSecureContext) return;
      navigator.wakeLock.request("screen").then(function (l) {
        engine.lock = l;
        l.addEventListener("release", function () { engine.lock = null; });
      }).catch(function () { /* denied; the media path still works */ });
    };

    engine.start = function () {
      if (engine.started) return;
      engine.started = true;
      engine.startedAt = Date.now();

      // A rendered, on-screen host. Chromium hands out its video wake lock only
      // while the element is genuinely being painted and intersects the
      // viewport, so this must not be display:none, visibility:hidden, zero
      // sized or scrolled away. A small dark square pinned to the bottom-right
      // corner satisfies that while staying invisible against a dark
      // dashboard. Community reports have this working down to 1x1 px, but a
      // slightly larger box is safer against Chromium's minimum-visible-area
      // heuristics.
      var host = document.createElement("div");
      host.id = "glass-energy-keep-awake-host";
      host.style.cssText = [
        "position:fixed", "right:0", "bottom:0",
        "width:" + KA_SIZE + "px", "height:" + KA_SIZE + "px",
        "opacity:" + KA_OPACITY, "pointer-events:none",
        "z-index:0", "overflow:hidden", "background:#000",
      ].join(";");
      engine.host = host;

      var v = document.createElement("video");
      v.src = MOVIE;
      v.loop = true;
      v.muted = true;               // muted video autoplays without a gesture
      v.defaultMuted = true;
      v.autoplay = true;
      v.controls = false;
      v.disablePictureInPicture = true;
      v.setAttribute("playsinline", "");
      v.setAttribute("webkit-playsinline", "");
      v.setAttribute("muted", "");
      v.setAttribute("autoplay", "");
      v.style.cssText = "width:" + KA_SIZE + "px;height:" + KA_SIZE +
                        "px;display:block;object-fit:cover";
      engine.video = v;
      host.appendChild(v);

      var a = document.createElement("audio");
      a.src = SILENT;
      a.loop = true;
      a.preload = "auto";
      a.controls = false;
      a.muted = true;
      a.setAttribute("playsinline", "");
      engine.audio = a;
      host.appendChild(a);

      document.body.appendChild(host);

      // A pause means something took focus (Alexa timer, announcement, a call).
      // Answer immediately and keep re-checking; the original iframe version
      // stopped watching after the first successful start, so one interruption
      // killed it permanently.
      [v, a].forEach(function (el) {
        el.addEventListener("pause", function () {
          engine.recoveries++;
          setTimeout(function () { playEl(el); }, 300);
        });
        el.addEventListener("ended", function () { playEl(el); });
        el.addEventListener("stalled", function () { playEl(el); });
        el.addEventListener("error", function () {
          el.src = el === v ? MOVIE : SILENT;
          el.load();
          playEl(el);
        });
      });

      // Counting decoded frames is the only trustworthy signal that the video
      // is really running — currentTime alone can advance on a stalled element.
      var seen = 0;
      var frameTick = function () {
        seen++;
        engine.lastFrame = Date.now();
        if (seen > 2) engine.videoOk = true;
        if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(frameTick);
      };
      if (v.requestVideoFrameCallback) {
        v.requestVideoFrameCallback(frameTick);
      } else {
        v.addEventListener("timeupdate", function () {
          engine.lastFrame = Date.now();
          engine.videoOk = !v.paused;
        });
      }

      var gesture = function () {
        engine.gestures++;
        engine.gestured = true;
        engine.unmute();
        engine.play();
        engine.requestLock();
      };
      ["pointerdown", "touchstart", "click", "keydown"].forEach(function (ev) {
        document.addEventListener(ev, gesture, { capture: true, passive: true });
      });

      var wake = function () { engine.play(); engine.requestLock(); };
      document.addEventListener("visibilitychange", function () {
        if (!document.hidden) wake();
      });
      window.addEventListener("focus", wake);
      window.addEventListener("pageshow", wake);

      engine.tick = function () {
        var vOn = v && !v.paused && !v.ended;
        var aOn = a && !a.paused && !a.ended;
        var fresh = Date.now() - engine.lastFrame < 4000;

        if (vOn && fresh) {
          engine.videoOk = true;
          engine.armed = engine.armed || !a.muted;
          engine.notify("on", a.muted ? "Bildschirm bleibt an (Video)"
                                      : "Bildschirm bleibt an");
        } else if (vOn || aOn) {
          engine.play();
          engine.unmute();
          engine.notify("wait", "Startet…");
        } else {
          engine.play();
          engine.notify(engine.started && (engine.armed || engine.videoOk) ? "off" : "wait",
            engine.armed || engine.videoOk
              ? "Unterbrochen – tippe irgendwo"
              : "Tippe irgendwo zum Aktivieren");
        }
        if (!engine.lock) engine.requestLock();
      };

      engine.play();
      engine.requestLock();
      engine.tick();
      setInterval(engine.tick, 2000);
    };
  }

  function keepAwake(mode) {
    if (!mode || mode === "off") return;
    if (mode === "always" || IS_FIRE_OS || FORCE) engine.start();
  }

  // ----------------------------------------------------------------- editor
  const loadHaForm = async () => {
    if (customElements.get("ha-form") && customElements.get("ha-entity-picker")) return;
    const btn = customElements.get("hui-button-card");
    if (btn && btn.getConfigElement) { try { await btn.getConfigElement(); } catch (e) { /* ignore */ } }
    const ent = customElements.get("hui-entities-card");
    if (ent && ent.getConfigElement) { try { await ent.getConfigElement(); } catch (e) { /* ignore */ } }
    if (!customElements.get("ha-form") && window.loadCardHelpers) { try { await window.loadCardHelpers(); } catch (e) { /* ignore */ } }
  };

  const SEL = {
    text: { text: {} },
    icon: { icon: {} },
    color: { text: {} },
    bool: { boolean: {} },
    num: (min, max, step) => ({ number: { mode: "box", min, max, step: step || 1 } }),
    power: { entity: { domain: ["sensor", "input_number", "number"] } },
    anyEntity: { entity: {} },
    // native HA upload widget; stores /api/image/serve/<id>/original
    image: { image: {} },
  };

  const SCHEMA = {
    general: [
      { name: "title", label: "Titel", selector: SEL.text },
      { type: "grid", column_min_width: "220px", schema: [
        { name: "mode", label: "Layout", selector: { select: { mode: "dropdown", options: [
          { value: "auto", label: "Automatisch (empfohlen)" },
          { value: "wide", label: "Immer breit (Desktop)" },
          { value: "mid", label: "Immer mittel (Tablet)" },
          { value: "narrow", label: "Immer gestapelt (Handy)" },
        ] } } },
        { name: "wide_min", label: "Breit ab … px", selector: SEL.num(600, 2400, 10) },
        { name: "mid_min", label: "Mittel ab … px", selector: SEL.num(360, 1600, 10) },
        { name: "fit_height", label: "Höhe anpassen", selector: { select: { mode: "dropdown", options: [
          { value: "auto", label: "In Vollbild-Sichten (empfohlen)" },
          { value: "always", label: "Immer an Fensterhöhe anpassen" },
          { value: "never", label: "Nie (natürliche Höhe)" },
        ] } } },
        { name: "bottom_gap", label: "Abstand nach unten (px)", selector: SEL.num(0, 200, 2) },
      ] },
      { name: "keep_awake", label: "Bildschirm wachhalten", selector: { select: { mode: "dropdown", options: [
        { value: "off", label: "Aus" },
        { value: "fire_os", label: "Nur Echo Show / Fire-Tablets (empfohlen)" },
        { value: "always", label: "Auf allen Geräten" },
      ] } } },
    ],
    theme: [
      { name: "mode", label: "Design", selector: { select: { mode: "dropdown", options: [
        { value: "dunkel", label: "Dunkel" },
        { value: "hell", label: "Hell" },
      ] } } },
      { name: "preset", label: "Farbschema", selector: { select: { mode: "dropdown", options: [
        { value: "blau", label: "Dunkel · Blau (Standard)" },
        { value: "dunkel", label: "Dunkel · Nachtblau" },
        { value: "mitternacht", label: "Dunkel · Mitternacht" },
        { value: "petrol", label: "Dunkel · Petrol" },
        { value: "violett", label: "Dunkel · Violett" },
        { value: "grafit", label: "Dunkel · Grafit" },
        { value: "hell", label: "Hell · Fluent" },
        { value: "hell-blau", label: "Hell · Blau" },
        { value: "hell-violett", label: "Hell · Violett" },
      ] } } },
      { name: "wires", label: "Leitungen", selector: { select: { mode: "dropdown", options: [
        { value: "puls", label: "Lichtimpuls (empfohlen)" },
        { value: "strich", label: "Laufende Striche (wie bisher)" },
        { value: "ruhig", label: "Ruhig – ohne Bewegung" },
      ] } } },
      { type: "grid", column_min_width: "220px", schema: [
        { name: "center", label: "Farbe innen", selector: SEL.text },
        { name: "edge", label: "Farbe außen", selector: SEL.text },
        { name: "spread", label: "Ausdehnung innen (%)", selector: SEL.num(20, 140, 1) },
        { name: "tile", label: "Deckkraft der Kacheln (%)", selector: SEL.num(0, 90, 0.5) },
      ] },
    ],
    header: [
      { type: "grid", column_min_width: "240px", schema: [
        { name: "real_import", label: "Realer Bezug (Zähler)", selector: SEL.power },
        { name: "real_export", label: "Reale Einspeisung (Zähler)", selector: SEL.power },
        { name: "temp", label: "Außentemperatur", selector: SEL.power },
        { name: "humidity", label: "Luftfeuchtigkeit", selector: SEL.power },
        { name: "uv", label: "UV-Index", selector: SEL.power },
        { name: "weather", label: "Wetter", selector: { entity: { domain: "weather" } } },
      ] },
    ],
    grid: [
      { name: "entity", label: "Netzleistung", selector: SEL.power },
      { type: "grid", column_min_width: "220px", schema: [
        { name: "name", label: "Name", selector: SEL.text },
        { name: "icon", label: "Symbol", selector: SEL.icon },
        { name: "import_today", label: "Bezug heute", selector: SEL.power },
        { name: "export_today", label: "Einspeisung heute", selector: SEL.power },
      ] },
      { name: "invert", label: "Vorzeichen umkehren (positiv = Bezug)", selector: SEL.bool },
    ],
    home: [
      { name: "entity", label: "Hausverbrauch", selector: SEL.power },
      { type: "grid", column_min_width: "220px", schema: [
        { name: "icon", label: "Symbol", selector: SEL.icon },
      ] },
    ],
    solarItem: [
      { name: "entity", label: "Leistungssensor", selector: SEL.power },
      { name: "energy_today", label: "Ertrag heute (Tageszähler)", selector: { entity: { domain: "sensor" } } },
      { name: "energy_today_unit", label: "Einheit, falls der Sensor noch keine meldet", selector: { select: { options: ["kWh", "Wh", "MWh"], mode: "dropdown" } } },
      { type: "grid", column_min_width: "220px", schema: [
        { name: "name", label: "Name", selector: SEL.text },
        { name: "icon", label: "Symbol", selector: SEL.icon },
      ] },
    ],
    pv: [
      { name: "energy_today", label: "Gesamtertrag heute (gemessen)", selector: { entity: { domain: "sensor", device_class: "energy" } } },
      { name: "forecast_today", label: "PV-Vorhersage heute", selector: { entity: { domain: "sensor", device_class: "energy" } } },
      { name: "forecast_remaining", label: "PV-Vorhersage Resttag", selector: { entity: { domain: "sensor", device_class: "energy" } } },
      { name: "forecast_tomorrow", label: "PV-Vorhersage morgen", selector: { entity: { domain: "sensor", device_class: "energy" } } },
    ],
    batteryItem: [
      { type: "grid", column_min_width: "220px", schema: [
        { name: "soc", label: "Ladestand (%)", selector: SEL.power },
        { name: "power", label: "Leistung (W)", selector: SEL.power },
        { name: "name", label: "Name", selector: SEL.text },
        { name: "icon", label: "Symbol", selector: SEL.icon },
      ] },
      { name: "invert", label: "Vorzeichen umkehren (negativ = lädt)", selector: SEL.bool },
    ],
    vehicleItem: [
      { type: "grid", column_min_width: "220px", schema: [
        { name: "soc", label: "Ladestand (%)", selector: SEL.power },
        { name: "power", label: "Ladeleistung (W)", selector: SEL.power },
        { name: "name", label: "Name", selector: SEL.text },
        { name: "icon", label: "Symbol", selector: SEL.icon },
      ] },
      { name: "plug", label: "Stecker / Verbindung (optional)", selector: SEL.anyEntity },
      { type: "grid", column_min_width: "220px", schema: [
        { name: "range", label: "Reichweite in km (optional)", selector: SEL.power },
        { name: "time_to_full", label: "Restzeit bis voll in Minuten (optional)", selector: SEL.power },
        { name: "target_soc", label: "Ziel-Ladestand (optional)", selector: SEL.anyEntity },
        { name: "threshold", label: "Lädt ab … W (Standard 50)", selector: SEL.num(0, 5000, 1) },
      ] },
      { type: "grid", column_min_width: "220px", schema: [
        { name: "invert", label: "Vorzeichen umkehren (Ladeleistung negativ)", selector: SEL.bool },
        { name: "image_fit", label: "Eigenes Foto", selector: { select: { mode: "dropdown", options: [
          { value: "cover", label: "Fläche füllen" }, { value: "contain", label: "Ganz zeigen" }] } } },
      ] },
    ],
    climateItem: [
      { name: "entity", label: "Leistungssensor", selector: SEL.power },
      { type: "grid", column_min_width: "220px", schema: [
        { name: "name", label: "Name", selector: SEL.text },
        { name: "icon", label: "Symbol", selector: SEL.icon },
        { name: "state_entity", label: "Status-Entität (optional)", selector: SEL.anyEntity },
        { name: "threshold", label: "Standby bis … W ausblenden (Standard 5)", selector: SEL.num(0, 5000, 0.5) },
      ] },
    ],
    _metric: (n) => ({
      title: "Kennzahl " + n, name: "metric_" + n, type: "expandable", schema: [
        { type: "grid", column_min_width: "200px", schema: [
          { name: "entity", label: "Entität", selector: SEL.power },
          { name: "label", label: "Beschriftung", selector: SEL.text },
          { name: "unit", label: "Einheit", selector: { select: { mode: "dropdown", options: ["W", "kWh", "°C", "%"] } } },
        ] },
      ],
    }),
    consumerItem: [
      { name: "entity", label: "Leistungssensor", selector: SEL.power },
      { type: "grid", column_min_width: "220px", schema: [
        { name: "name", label: "Anzeigename", selector: SEL.text },
        { name: "icon", label: "Symbol", selector: SEL.icon },
        { name: "color", label: "Farbe (z. B. #4dd0e1)", selector: SEL.text },
        { name: "unit", label: "Einheit", selector: { select: { mode: "dropdown", options: ["W", "kWh", "°C", "%"] } } },
        { name: "threshold", label: "Standby bis … W ausblenden (Standard 5)", selector: SEL.num(0, 5000, 0.5) },
      ] },
      { type: "grid", column_min_width: "220px", schema: [
        { name: "hidden", label: "Ausblenden", selector: SEL.bool },
        { name: "hide_when_zero", label: "Bei 0 W ausblenden", selector: SEL.bool },
      ] },
      { title: "Zweite Zeile (z. B. Tagesverbrauch)", name: "secondary",
        type: "expandable", icon: "mdi:text-short", schema: [
        { name: "entity", label: "Entität für die zweite Zeile", selector: SEL.anyEntity },
        { type: "grid", column_min_width: "200px", schema: [
          { name: "label", label: "Beschriftung (z. B. Heute)", selector: SEL.text },
          { name: "unit", label: "Einheit", selector: { select: { mode: "dropdown", options: ["W", "kWh", "°C", "%"] } } },
        ] },
      ] },
    ],
  };

  SCHEMA.climateItem = SCHEMA.climateItem.concat([SCHEMA._metric(1), SCHEMA._metric(2)]);
  SCHEMA._vehicleValue = (n) => ({
    title: "Zusatzwert " + n, name: "metric_" + n, type: "expandable", schema: [
      { type: "grid", column_min_width: "200px", schema: [
        { name: "entity", label: "Entität", selector: SEL.anyEntity },
        { name: "icon", label: "Symbol (optional)", selector: SEL.icon },
        { name: "unit", label: "Einheit (optional, sonst vom Sensor)", selector: SEL.text },
      ] },
    ],
  });
  const VEHICLE_VALUES = 6;
  SCHEMA.vehicleItem = SCHEMA.vehicleItem.concat(
    Array.from({ length: VEHICLE_VALUES }, (_, i) => SCHEMA._vehicleValue(i + 1)));

  // Metrics are stored as an array but edited as fixed slots
  // (climate: two labelled figures, vehicles: the icon row).
  const METRIC_SLOTS = { climate: 2, vehicles: VEHICLE_VALUES };
  const metricsToForm = (x, n) => {
    const o = { ...x };
    (x.metrics || []).slice(0, n).forEach((m, i) => { o["metric_" + (i + 1)] = { ...m }; });
    delete o.metrics;
    return o;
  };
  const metricsFromForm = (o, n) => {
    const x = { ...o };
    const ms = [];
    for (let i = 1; i <= n; i++) {
      const m = x["metric_" + i];
      delete x["metric_" + i];
      if (m && m.entity) ms.push(m);
    }
    if (ms.length) x.metrics = ms; else delete x.metrics;
    return x;
  };

  // Every section supports an uploaded picture instead of an mdi icon.
  const PAGES = [
    { id: "solar",     title: "PV-Quellen",  icon: "mdi:solar-power",           list: true, item: "solarItem",    label: (x, h) => x.name || fname(h, x.entity) },
    { id: "pv",        title: "PV-Ertrag & Vorhersage", icon: "mdi:weather-partly-cloudy", schema: "pv" },
    { id: "batteries", title: "Speicher",    icon: "mdi:battery-high",          list: true, item: "batteryItem",  label: (x, h) => x.name || fname(h, x.soc || x.power) },
    { id: "grid",      title: "Netz",        icon: "mdi:transmission-tower",    schema: "grid" },
    { id: "home",      title: "Haus",        icon: "mdi:home-lightning-bolt",   schema: "home" },
    { id: "vehicles",  title: "E-Auto",      icon: "mdi:car-electric",          list: true, item: "vehicleItem",  label: (x, h) => x.name || fname(h, x.soc || x.power) },
    { id: "climate",   title: "Klima",       icon: "mdi:snowflake-thermometer", list: true, item: "climateItem",  label: (x, h) => x.name || fname(h, x.entity), metrics: true },
    { id: "consumers", title: "Verbraucher", icon: "mdi:power-plug",            list: true, item: "consumerItem", label: (x, h) => x.name || fname(h, x.entity) },
    { id: "header",    title: "Kopfzeile",   icon: "mdi:card-text-outline",     schema: "header" },
    { id: "theme",     title: "Farben",      icon: "mdi:palette",               schema: "theme" },
  ];

  const fname = (hass, id) => hass?.states?.[id]?.attributes?.friendly_name || id || T("(ohne Entität)");


  // ha-form takes its labels from the schema, so the schema is translated as a whole.
  const localizeSchema = (schema) => schema.map((s) => {
    const o = { ...s };
    if (o.label) o.label = T(o.label);
    if (o.title) o.title = T(o.title);
    if (o.schema) o.schema = localizeSchema(o.schema);
    const sel = o.selector && o.selector.select;
    if (sel && Array.isArray(sel.options)) {
      o.selector = { ...o.selector, select: { ...sel, options: sel.options.map((x) =>
        (x && typeof x === "object" ? { ...x, label: T(x.label) } : x)) } };
    }
    return o;
  });

  // Bundled artwork offered per section; `fallback` is what the card shows when nothing is set.
  const IMAGE_OPTS = {
    solar: { choices: ["solar-roof", "solar-balcony", "solar-garage", "solar-ground"], fallback: "builtin:solar-roof" },
    batteries: { choices: ["battery", "battery-stack"], fallback: "builtin:battery" },
    grid: { choices: ["grid"], fallback: "builtin:grid" },
    home: { choices: ["home"], fallback: "builtin:home" },
    consumers: { choices: ["washer", "dryer", "dishwasher", "pump", "freezer"] },
    climate: {},
    vehicles: { fallback: "builtin:ev" },
  };

  const MAX_UPLOAD = 4 * 1024 * 1024;   // 4 MB

  /** Upload a file through HA's image integration; returns the servable URL. */
  /**
   * Strip a flat backdrop out of an image before it is uploaded.
   *
   * Plenty of files advertised as "transparent PNG" are actually flattened onto
   * white, and on this card's dark background that shows up as a pale rectangle
   * around the device. Rather than asking for a better source every time, the
   * backdrop is removed here, once, for anything that gets uploaded.
   *
   * A flood fill from the border is used instead of "make every light pixel
   * transparent", because the latter also eats the white parts of a white
   * appliance. Only backdrop connected to the edge is cleared. Pixels that are
   * light but colourless are also cleared when they touch the backdrop, which
   * removes the soft drop shadow such photos usually carry.
   *
   * Returns a Blob, or null when the image already has real transparency or no
   * uniform backdrop was found — in which case the original is uploaded as-is.
   */
  async function stripBackdrop(file) {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = url;
      });
      const w = img.naturalWidth, h = img.naturalHeight;
      if (!w || !h || w * h > 16e6) return null;

      const cv = document.createElement("canvas");
      cv.width = w; cv.height = h;
      const g = cv.getContext("2d", { willReadFrequently: true });
      g.drawImage(img, 0, 0);
      const im = g.getImageData(0, 0, w, h);
      const p = im.data;

      // Already properly cut out? Leave it alone.
      let clear = 0;
      for (let i = 3; i < p.length; i += 4) if (p[i] < 8) clear++;
      if (clear > w * h * 0.02) return null;

      const at = (x, y) => (y * w + x) * 4;
      const light = (i) => p[i] >= 232 && p[i + 1] >= 232 && p[i + 2] >= 232;
      // Colourless and not dark: a drop shadow rather than part of the device.
      const shade = (i) => {
        const mx = Math.max(p[i], p[i + 1], p[i + 2]);
        const mn = Math.min(p[i], p[i + 1], p[i + 2]);
        return mx - mn <= 4 && mx >= 120;
      };

      const seen = new Uint8Array(w * h);
      const stack = [];
      const push = (x, y) => {
        const n = y * w + x;
        if (!seen[n] && light(at(x, y))) { seen[n] = 1; stack.push(n); }
      };
      for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
      for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
      if (!stack.length) return null;                 // no uniform border

      const grow = (test) => {
        while (stack.length) {
          const n = stack.pop();
          const x = n % w, y = (n / w) | 0;
          if (x > 0 && !seen[n - 1] && test(at(x - 1, y))) { seen[n - 1] = 1; stack.push(n - 1); }
          if (x < w - 1 && !seen[n + 1] && test(at(x + 1, y))) { seen[n + 1] = 1; stack.push(n + 1); }
          if (y > 0 && !seen[n - w] && test(at(x, y - 1))) { seen[n - w] = 1; stack.push(n - w); }
          if (y < h - 1 && !seen[n + w] && test(at(x, y + 1))) { seen[n + w] = 1; stack.push(n + w); }
        }
      };
      grow(light);
      const plain = seen.slice();
      let hitPlain = 0;
      for (let n = 0; n < plain.length; n++) if (plain[n]) hitPlain++;

      // Second pass over the shadow, seeded from the backdrop just found.
      for (let n = 0; n < seen.length; n++) if (seen[n]) stack.push(n);
      grow(shade);

      let hit = 0;
      for (let n = 0; n < seen.length; n++) if (seen[n]) hit++;
      // Silver or grey devices are colourless too, so the shadow pass can eat
      // the subject itself. If it grew far beyond the plain backdrop, drop it.
      if (hit > w * h * 0.9 || hit > hitPlain * 1.35) {
        seen.set(plain);
        hit = hitPlain;
      }
      // Too little means there was no backdrop; nearly everything means the
      // picture is mostly background and cutting it would destroy it.
      if (hit < w * h * 0.04 || hit > w * h * 0.97) return null;

      for (let n = 0; n < seen.length; n++) if (seen[n]) p[n * 4 + 3] = 0;

      // Feather the boundary: a hard edge shimmers once the image is scaled
      // down into a tile.
      const a0 = new Uint8Array(w * h);
      for (let n = 0; n < a0.length; n++) a0[n] = p[n * 4 + 3];
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const n = y * w + x;
          if (!a0[n]) continue;
          const around = a0[n - 1] + a0[n + 1] + a0[n - w] + a0[n + w];
          if (around < 4 * 255) p[n * 4 + 3] = Math.round((a0[n] + around / 4) / 2);
        }
      }
      g.putImageData(im, 0, 0);
      return await new Promise((res) => cv.toBlob(res, "image/png"));
    } catch (e) {
      return null;                                    // never block the upload
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function uploadImage(hass, file) {
    if (!file.type.startsWith("image/")) throw new Error(T("Das ist keine Bilddatei."));
    if (file.size > MAX_UPLOAD) throw new Error(T("Bild ist größer als 4 MB."));
    let body = file, name = file.name;
    if (file.type !== "image/svg+xml") {
      const cut = await stripBackdrop(file);
      if (cut) {
        body = cut;
        name = name.replace(/\.[^.]+$/, "") + ".png";
      }
    }
    const fd = new FormData();
    fd.append("file", body, name);
    const res = await hass.fetchWithAuth("/api/image/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error(`${T("Upload fehlgeschlagen")} (HTTP ${res.status})`);
    const data = await res.json();
    return `/api/image/serve/${data.id}/original`;
  }

  /** Remove a previously uploaded picture so it does not linger on disk. */
  async function deleteImage(hass, url) {
    const m = /^\/api\/image\/serve\/([0-9a-f]+)\//.exec(url || "");
    if (!m) return;                                  // external URL: leave alone
    try { await hass.callWS({ type: "image/delete", image_id: m[1] }); } catch (e) { /* ignore */ }
  }

  const EDITOR_CSS = `
    :host { display:block; }
    .col { display:flex; flex-direction:column; gap:12px; }
    .row {
      display:flex; align-items:center; gap:8px; padding:8px 10px;
      border:1px solid var(--divider-color, rgba(127,127,127,.3));
      border-radius:10px; background:var(--card-background-color, transparent);
      cursor:pointer;
    }
    .row:hover { background:var(--secondary-background-color, rgba(127,127,127,.08)); }
    .row .txt { flex:1; min-width:0; }
    .row .txt .h { font-size:15px; font-weight:500; }
    .row .txt .s { font-size:12px; opacity:.7; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .row ha-icon { color:var(--secondary-text-color); flex:0 0 auto; }
    .row .chev { opacity:.55; }
    .item { display:flex; align-items:center; gap:4px; }
    .item .txt { cursor:pointer; }
    .item.off .txt .h { opacity:.45; text-decoration:line-through; }
    .btns { display:flex; align-items:center; gap:2px; flex:0 0 auto; }
    .btns ha-icon-button { --mdc-icon-button-size:34px; --mdc-icon-size:19px; }
    .head { display:flex; align-items:center; gap:8px; margin-bottom:4px; }
    .head .title { font-size:17px; font-weight:500; flex:1; }
    .hint { font-size:12px; opacity:.7; padding:0 2px; }
    .add { margin-top:2px; }
    .empty { padding:14px 10px; text-align:center; opacity:.65; font-size:13px;
             border:1px dashed var(--divider-color, rgba(127,127,127,.35)); border-radius:10px; }
    .sec { font-size:12px; font-weight:500; text-transform:uppercase; letter-spacing:.06em;
           opacity:.65; margin:6px 2px -4px; }
    ha-icon-button.back { --mdc-icon-button-size:38px; }
    .pic {
      display:flex; flex-direction:column; gap:10px; padding:10px;
      border:1px dashed var(--divider-color, rgba(127,127,127,.4));
      border-radius:10px; transition:border-color .15s, background .15s;
    }
    .pic.drag { border-color:var(--primary-color); background:rgba(127,127,127,.08); }
    .pic .thumb {
      width:56px; height:56px; flex:0 0 auto; border-radius:9px; overflow:hidden;
      display:grid; place-items:center;
      background:var(--secondary-background-color, rgba(127,127,127,.12));
    }
    .pic .thumb img { width:100%; height:100%; object-fit:contain; }
    .pic .thumb ha-icon { --mdc-icon-size:26px; color:var(--secondary-text-color); }
    .pic .body { flex:1; min-width:0; }
    .pic .body .h { font-size:14px; font-weight:500; }
    .pic .body .s { font-size:12px; opacity:.7; margin-top:2px; }
    .pic .body .s.err { color:var(--error-color, #db4437); opacity:1; }
    .pic .acts { display:flex; gap:6px; margin-top:7px; flex-wrap:wrap; }
    .pic mwc-button, .pic ha-button { --mdc-typography-button-font-size:13px; }
    .pic input[type=file] { display:none; }
    .pic .main { display:flex; align-items:center; gap:12px; }
    .pic .gal { display:flex; flex-wrap:wrap; gap:6px; }
    .pic .gal button {
      width:48px; height:48px; padding:4px; border-radius:9px; cursor:pointer;
      display:grid; place-items:center;
      border:2px solid transparent; background:var(--secondary-background-color, rgba(127,127,127,.12));
    }
    .pic .gal button:hover { border-color:var(--divider-color, rgba(127,127,127,.4)); }
    .pic .gal button.sel { border-color:var(--primary-color); }
    .pic .gal img { width:100%; height:100%; object-fit:contain; }
    .pic .gal ha-icon { --mdc-icon-size:22px; color:var(--secondary-text-color); }`;

  class GlassEnergyFlowCardEditor extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._page = null;   // null = overview
      this._index = -1;    // -1 = list, >=0 = item detail
      this._ready = false;
    }

    setConfig(config) {
      this._config = normalize(config);
      // keyed render: refresh the existing form in place so typing keeps focus
      this._render();
    }
    set hass(hass) {
      const first = !this._hass;
      const langChanged = setLang(hass);
      this._hass = hass;
      // entity names only resolve once hass is present, so redraw once
      if (first || langChanged) this._render(true); else this._propagate();
    }
    get hass() { return this._hass; }

    connectedCallback() {
      this._render(true);
      loadHaForm().then(() => { this._ready = true; this._render(true); });
    }

    _fire(cfg) {
      this._config = cfg;
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: cfg }, bubbles: true, composed: true }));
    }
    _patch(mut) {
      const c = JSON.parse(JSON.stringify(this._config));
      mut(c);
      this._fire(c);
    }

    _propagate() {
      if (!this.shadowRoot) return;
      this.shadowRoot.querySelectorAll("ha-form, ha-entity-picker").forEach((el) => { el.hass = this._hass; });
    }

    _nav(page, index) { this._page = page; this._index = index === undefined ? -1 : index; this._render(true); }

    // ------------------------------------------------------------- rendering
    _render(force) {
      // setConfig, connectedCallback and the hass setter can fire in any order,
      // so bail out until there is something to draw.
      if (!this.shadowRoot || !this._config) return;
      const key = `${this._page}|${this._index}|${this._ready}|${this._hass ? 1 : 0}`;
      if (!force && key === this._domKey) { this._sync(); return; }
      this._domKey = key;
      this.shadowRoot.innerHTML = `<style>${EDITOR_CSS}</style><div class="col" id="root"></div>`;
      const root = this.shadowRoot.getElementById("root");
      try {
        if (!this._page) this._renderOverview(root);
        else this._renderPage(root);
      } catch (err) {
        console.error("[glass-energy-flow-card] editor render failed", err);
        root.innerHTML = `<div class="empty">${T("Editor konnte nicht geladen werden")}: ${esc(err.message || err)}</div>`;
      }
      this._propagate();
    }

    _sync() {
      this.shadowRoot.querySelectorAll("ha-form").forEach((f) => {
        if (f._dataFn) f.data = f._dataFn();
      });
    }

    _form(schema, dataFn, onChange) {
      const f = document.createElement("ha-form");
      f._dataFn = typeof dataFn === "function" ? dataFn : () => dataFn;
      f.hass = this._hass;
      f.schema = localizeSchema(schema);
      f.data = f._dataFn();
      f.computeLabel = (s) => s.label || s.title || s.name;
      f.addEventListener("value-changed", (ev) => { ev.stopPropagation(); onChange(ev.detail.value); });
      return f;
    }

    _iconBtn(path, title, fn, disabled) {
      const b = document.createElement("ha-icon-button");
      b.title = title;
      if (disabled) b.disabled = true;
      const i = document.createElement("ha-icon");
      i.icon = path;
      b.appendChild(i);
      b.addEventListener("click", (ev) => { ev.stopPropagation(); fn(); });
      return b;
    }

    /**
     * Picture field: bundled artwork to pick from, plus upload with
     * drag-and-drop. Uploads go to HA's image integration, so no manual file
     * copying or URLs are needed. `opts.choices` lists the bundled artwork for
     * this section, `opts.fallback` is what the card shows when nothing is set,
     * and `opts.light` marks the optional light-theme picture.
     */
    _imageField(getUrl, setUrl, fallbackIcon, opts = {}) {
      const choices = opts.choices || [];
      const box = document.createElement("div");
      box.className = "pic";
      const file = document.createElement("input");
      file.type = "file";
      file.accept = "image/png,image/jpeg,image/webp,image/svg+xml,image/gif";
      const el = (tag, cls, text) => {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
      };

      const draw = (msg, isErr) => {
        const url = getUrl();
        const builtin = url && String(url).startsWith("builtin:") ? String(url).slice(8) : null;
        const custom = url && url !== "none" && !builtin;
        const shown = url ? resolveImage(url) : (opts.fallback ? resolveImage(opts.fallback) : null);
        box.innerHTML = "";

        const thumb = el("div", "thumb");
        if (shown) {
          const img = document.createElement("img");
          img.src = shown;
          thumb.appendChild(img);
        } else {
          const ic = document.createElement("ha-icon");
          ic.icon = fallbackIcon || "mdi:image-outline";
          thumb.appendChild(ic);
        }
        const head = url === "none" ? T("Nur Symbol")
          : builtin ? `${T("Mitgelieferte Grafik")}: ${builtin}`
          : custom ? T("Eigenes Bild")
          : opts.light ? T("Automatisch passend zum Bild oben")
          : opts.fallback ? T("Standard-Grafik")
          : T("Kein Bild — Symbol wird verwendet");
        const body = el("div", "body");
        body.append(el("div", "h", head),
          el("div", "s" + (isErr ? " err" : ""), msg || T(custom ? "Ersetzt das Symbol auf der Karte."
            : "Datei hierher ziehen oder auswählen (max. 4 MB).")));
        const acts = el("div", "acts");
        const pick = el("ha-button", null, T(custom ? "Ersetzen" : "Eigenes Bild hochladen"));
        pick.addEventListener("click", () => file.click());
        acts.appendChild(pick);
        if (url) {
          // Only the reference is dropped: other cards may still use the HA image.
          const reset = el("ha-button", null, T("Zurücksetzen"));
          reset.addEventListener("click", () => { setUrl(undefined); draw(); });
          acts.appendChild(reset);
        }
        body.appendChild(acts);
        const main = el("div", "main");
        main.append(thumb, body);
        box.appendChild(main);

        if (choices.length && !opts.light) {
          const gal = el("div", "gal");
          const option = (value, child, title, selected) => {
            const b = el("button", selected ? "sel" : "");
            b.type = "button";
            b.title = title;
            b.appendChild(child);
            b.addEventListener("click", () => { setUrl(value); draw(); });
            gal.appendChild(b);
          };
          choices.forEach((name) => {
            const img = document.createElement("img");
            img.src = resolveImage("builtin:" + name);
            const value = "builtin:" + name;
            option(value, img, name, url === value || (!url && opts.fallback === value));
          });
          const ic = document.createElement("ha-icon");
          ic.icon = fallbackIcon || "mdi:image-outline";
          // Without a default artwork the icon already is the default, so no value is stored.
          option(opts.fallback ? "none" : undefined, ic, T("Nur Symbol"),
            url === "none" || (!url && !opts.fallback));
          box.appendChild(gal);
        }
        box.appendChild(file);
      };

      const accept = async (f) => {
        if (!f) return;
        draw(T("Wird hochgeladen …"));
        try {
          setUrl(await uploadImage(this._hass, f));
          draw();
        } catch (err) {
          draw(err.message || String(err), true);
        }
      };

      file.addEventListener("change", () => accept(file.files && file.files[0]));
      ["dragenter", "dragover"].forEach((ty) => box.addEventListener(ty, (ev) => {
        ev.preventDefault(); box.classList.add("drag");
      }));
      ["dragleave", "drop"].forEach((ty) => box.addEventListener(ty, (ev) => {
        ev.preventDefault(); box.classList.remove("drag");
      }));
      box.addEventListener("drop", (ev) => accept(ev.dataTransfer?.files?.[0]));

      draw();
      return box;
    }

    _rowEl(icon, head, sub, onClick) {
      const d = document.createElement("div");
      d.className = "row";
      d.innerHTML = `<ha-icon icon="${esc(icon)}"></ha-icon>
        <div class="txt"><div class="h">${esc(head)}</div>${sub ? `<div class="s">${esc(sub)}</div>` : ""}</div>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>`;
      if (onClick) d.addEventListener("click", onClick);
      return d;
    }

    _formData() {
      const c = this._config;
      return { title: c.title, mode: c.layout.mode, wide_min: c.layout.wide_min, mid_min: c.layout.mid_min,
               fit_height: c.layout.fit_height, bottom_gap: c.layout.bottom_gap, keep_awake: c.keep_awake || "off" };
    }

    _renderOverview(root) {
      const c = this._config;
      const f = this._form(SCHEMA.general, () => this._formData(), (v) => {
        this._patch((n) => {
          n.title = v.title;
          n.layout = { ...n.layout, mode: v.mode || "auto", wide_min: v.wide_min, mid_min: v.mid_min,
                       fit_height: v.fit_height, bottom_gap: v.bottom_gap };
          if (v.keep_awake && v.keep_awake !== "off") n.keep_awake = v.keep_awake; else delete n.keep_awake;
        });
      });
      f.setAttribute("data-main", "");
      root.appendChild(f);

      const sec = document.createElement("div");
      sec.className = "sec";
      sec.textContent = T("Bereiche");
      root.appendChild(sec);

      PAGES.forEach((p) => {
        let sub;
        if (p.list) {
          const arr = c[p.id] || [];
          const off = p.id === "consumers" ? arr.filter((x) => x.hidden).length : 0;
          sub = arr.length
            ? (LANG === "de" ? `${arr.length} Einträge${off ? `, ${off} ausgeblendet` : ""}`
              : `${arr.length} ${arr.length === 1 ? "entry" : "entries"}${off ? `, ${off} hidden` : ""}`)
            : T("Noch nichts konfiguriert");
        } else {
          const o = c[p.id] || {};
          sub = o.entity ? fname(this._hass, o.entity) : T("Keine Entität");
          if (p.id === "header") {
            const n = ["real_import", "real_export", "temp", "humidity", "uv", "weather"].filter((k) => o[k]).length;
            sub = n ? (LANG === "de" ? `${n} Angaben` : `${n} ${n === 1 ? "item" : "items"}`) : T("Nichts angezeigt");
          }
        }
        root.appendChild(this._rowEl(p.icon, T(p.title), sub, () => this._nav(p.id)));
      });
    }

    _renderPage(root) {
      const page = PAGES.find((p) => p.id === this._page);
      if (!page) { this._nav(null); return; }
      const head = document.createElement("div");
      head.className = "head";
      const back = this._iconBtn("mdi:arrow-left", T("Zurück"), () => {
        if (page.list && this._index >= 0) this._nav(page.id);
        else this._nav(null);
      });
      back.className = "back";
      head.appendChild(back);
      const t = document.createElement("div");
      t.className = "title";
      t.textContent = page.list && this._index >= 0
        ? `${T(page.title)} · ${this._index + 1}/${(this._config[page.id] || []).length}`
        : T(page.title);
      head.appendChild(t);
      root.appendChild(head);

      if (!page.list) {
        root.appendChild(this._form(SCHEMA[page.schema], () => ({ ...(this._config[page.id] || {}) }),
          (v) => this._patch((n) => {
            const prev = n[page.id] || {};
            // Flipping between light and dark has to bring a matching backdrop
            // with it, otherwise the user lands on white text over white paper
            // and has to hand-edit two colours before anything is readable.
            if (page.id === "theme" && v.mode && v.mode !== prev.mode
                && v.preset === prev.preset) {
              const p = v.mode === "hell" ? "hell" : "blau";
              n.theme = { preset: p, ...THEMES[p], wires: prev.wires || "puls" };
              return;
            }
            // Picking a preset should visibly change the colours, so its values
            // replace the current ones instead of losing to the stored overrides.
            if (page.id === "theme" && v.preset && v.preset !== prev.preset && THEMES[v.preset]) {
              // A preset only carries colours; the wire style is a separate
              // choice and must survive switching between schemes.
              n.theme = { preset: v.preset, ...THEMES[v.preset], wires: prev.wires || "puls" };
              return;
            }
            n[page.id] = { ...prev, ...v };
          })));
        if (page.id !== "header" && page.id !== "theme" && page.id !== "pv") {
          root.appendChild(this._imageField(
            () => (this._config[page.id] || {}).image,
            (url) => this._patch((n) => {
              n[page.id] = { ...n[page.id] };
              if (url) n[page.id].image = url; else delete n[page.id].image;
            }),
            (this._config[page.id] || {}).icon || page.icon, IMAGE_OPTS[page.id]));
          if (page.id === "grid" || page.id === "home") {
            const hint = document.createElement("div");
            hint.className = "hint";
            hint.textContent = T("Optionales Bild im hellen Design");
            root.appendChild(hint);
            root.appendChild(this._imageField(
              () => this._config[page.id].image_light,
              url => this._patch(n => { if (url) n[page.id].image_light = url; else delete n[page.id].image_light; }),
              (this._config[page.id] || {}).icon || page.icon, { light: true }));
          }
        }
        return;
      }
      if (this._index >= 0) this._renderItem(root, page);
      else this._renderList(root, page);
    }

    _renderItem(root, page) {
      const arr = this._config[page.id] || [];
      const item = arr[this._index];
      if (!item) { this._nav(page.id); return; }
      const i = this._index;
      const cur = () => this._config[page.id][i] || {};
      const slots = METRIC_SLOTS[page.id];
      root.appendChild(this._form(SCHEMA[page.item],
        () => (slots ? metricsToForm(cur(), slots) : { ...cur() }), (v) => {
        const next = slots ? metricsFromForm(v, slots) : v;
        this._patch((n) => {
          n[page.id][i] = { ...n[page.id][i], ...next };
          if (slots && !next.metrics) delete n[page.id][i].metrics;
        });
      }));
      root.appendChild(this._imageField(
        () => (this._config[page.id][i] || {}).image,
        (url) => this._patch((n) => {
          n[page.id][i] = { ...n[page.id][i] };
          if (url) n[page.id][i].image = url; else delete n[page.id][i].image;
        }),
        item.icon || page.icon, IMAGE_OPTS[page.id]));
      if (page.id === "solar" || page.id === "batteries") {
        const hint = document.createElement("div");
        hint.className = "hint";
        hint.textContent = T("Optionales Bild im hellen Design");
        root.appendChild(hint);
        root.appendChild(this._imageField(
          () => this._config[page.id][i].image_light,
          url => this._patch(n => { if (url) n[page.id][i].image_light = url; else delete n[page.id][i].image_light; }),
          item.icon || page.icon, { light: true }));
      }
      if (page.id === "vehicles") {
        const hint = document.createElement("div");
        hint.className = "hint";
        hint.textContent = T("Optionales eigenes Foto im eingesteckten Zustand (sonst zeigt ein Stecker-Symbol die Verbindung)");
        root.appendChild(hint);
        root.appendChild(this._imageField(
          () => this._config[page.id][i].image_plugged,
          url => this._patch(n => { if (url) n[page.id][i].image_plugged = url; else delete n[page.id][i].image_plugged; }),
          item.icon || page.icon, { light: true }));
      }
    }

    _renderList(root, page) {
      const arr = this._config[page.id] || [];
      const hint = document.createElement("div");
      hint.className = "hint";
      hint.textContent = page.id === "consumers"
        ? T("Reihenfolge bestimmt die Platzierung: die ersten füllen die rechte Spalte, der Rest die Reihen darunter.")
        : T("Mit den Pfeilen sortieren, mit dem Stift bearbeiten.");
      root.appendChild(hint);

      if (!arr.length) {
        const e = document.createElement("div");
        e.className = "empty";
        e.textContent = T("Noch nichts konfiguriert — unten eine Entität auswählen.");
        root.appendChild(e);
      }

      arr.forEach((x, i) => {
        const d = document.createElement("div");
        d.className = "row item" + (x.hidden ? " off" : "");
        const ic = document.createElement("ha-icon");
        ic.icon = x.icon || page.icon;
        d.appendChild(ic);
        const txt = document.createElement("div");
        txt.className = "txt";
        const eid = x.entity || x.soc || x.power || x.state_entity;
        txt.innerHTML = `<div class="h">${esc(page.label(x, this._hass))}</div><div class="s">${esc(eid || "")}</div>`;
        txt.addEventListener("click", () => this._nav(page.id, i));
        d.appendChild(txt);
        const btns = document.createElement("div");
        btns.className = "btns";
        if (page.id === "consumers") {
          btns.appendChild(this._iconBtn(x.hidden ? "mdi:eye-off" : "mdi:eye",
            T(x.hidden ? "Einblenden" : "Ausblenden"),
            () => this._patch((n) => { n[page.id][i].hidden = !n[page.id][i].hidden; })));
        }
        btns.appendChild(this._iconBtn("mdi:arrow-up", T("Nach oben"), () => this._move(page.id, i, -1), i === 0));
        btns.appendChild(this._iconBtn("mdi:arrow-down", T("Nach unten"), () => this._move(page.id, i, 1), i === arr.length - 1));
        btns.appendChild(this._iconBtn("mdi:pencil", T("Bearbeiten"), () => this._nav(page.id, i)));
        btns.appendChild(this._iconBtn("mdi:close", T("Entfernen"),
          () => this._patch((n) => { n[page.id].splice(i, 1); })));
        d.appendChild(btns);
        root.appendChild(d);
      });

      const picker = document.createElement("ha-entity-picker");
      picker.className = "add";
      picker.hass = this._hass;
      picker.label = T("Hinzufügen");
      picker.allowCustomEntity = true;
      picker.includeDomains = ["sensor", "input_number", "number"];
      picker.addEventListener("value-changed", (ev) => {
        const id = ev.detail.value;
        if (!id) return;
        ev.target.value = "";
        this._patch((n) => {
          n[page.id] = n[page.id] || [];
          n[page.id].push(this._newItem(page, id));
        });
        this._render(true);
      });
      root.appendChild(picker);

      if (page.id === "consumers") {
        const bulk = document.createElement("div");
        bulk.className = "hint";
        bulk.style.marginTop = "6px";
        bulk.textContent = T("Tipp: Steckdosen-Sensoren heißen meist „sensor.steckdose_…_power“.");
        root.appendChild(bulk);
      }
    }

    _newItem(page, entity) {
      const nm = this._hass?.states?.[entity]?.attributes?.friendly_name || "";
      const clean = nm.replace(/^Steckdose\s+/i, "").replace(/\s*(Leistung|Power)$/i, "").trim();
      switch (page.id) {
        case "solar": return { entity, name: clean || "PV", icon: "mdi:solar-panel" };
        case "batteries": return { soc: entity, name: clean || T("Speicher"), icon: "mdi:battery-high" };
        case "climate": return { entity, name: clean || T("Klima"), icon: "mdi:air-conditioner" };
        case "vehicles": return { soc: entity, name: clean || T("Auto"), icon: "mdi:car-electric" };
        default: return { entity, name: clean || entity, icon: "mdi:power-plug", color: "#7fd4ff", unit: "W" };
      }
    }

    _move(pageId, i, dir) {
      const j = i + dir;
      this._patch((n) => {
        const a = n[pageId];
        if (j < 0 || j >= a.length) return;
        [a[i], a[j]] = [a[j], a[i]];
      });
      this._render(true);
    }
  }


  class GlassEnergyBatteryCard extends HTMLElement {
    static getConfigElement() { return document.createElement("glass-energy-battery-card-editor"); }

    static getStubConfig(hass) {
      setLang(hass);
      const ids = Object.keys(hass?.states || {}).filter((id) => id.startsWith("sensor."));
      const attr = (id) => hass.states[id].attributes || {};
      const store = /(batter|speicher|akku)/i;
      // Prefer a storage sensor by name, then anything HA calls a battery level,
      // so the preview has a charge level to show straight away.
      const soc = ids.find((id) => store.test(id) && /(soc|level|ladestand|state_of_charge|charge)/i.test(id))
        || ids.find((id) => attr(id).device_class === "battery")
        || ids.find((id) => attr(id).unit_of_measurement === "%") || "";
      const power = ids.find((id) => store.test(id) && /(power|leistung)/i.test(id)) || "";
      const cfg = { name: T("Batterie"), entity: soc, icon: "mdi:battery-high" };
      if (power) cfg.power = power;
      return cfg;
    }

    setConfig(config) {
      if (!config.entity) throw new Error("entity is required");
      this._config = config;
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    }
    set hass(hass) { this._hass = hass; setLang(hass); this._render(); }
    getCardSize() { return 4; }

    _render() {
      if (!this._hass || !this._config) return;
      const c = this._config;
      const soc = num(this._hass, c.entity);
      const power = num(this._hass, c.power);
      const level = soc == null ? 0 : clamp(soc, 0, 100);
      const accent = c.accent || "#33d6ff";
      const accent2 = c.accent2 || "#32e2ad";
      const state = T(power == null ? "Keine Daten" : power < -5 ? "Lädt" : power > 5 ? "Entlädt" : "Bereit");
      const details = (c.details || []).map((d) => {
        const entity = this._hass.states[d.entity];
        const value = entity ? entity.state : "–";
        const unit = entity?.attributes?.unit_of_measurement || "";
        return `<div class="metric">
          <div class="metric-head"><ha-icon icon="${esc(d.icon || "mdi:circle-small")}"></ha-icon>
            <span>${esc(d.name || entity?.attributes?.friendly_name || "")}</span></div>
          <div class="metric-value">${esc(value)}${unit ? ` <small>${esc(unit)}</small>` : ""}</div>
        </div>`;
      }).join("");

      this.shadowRoot.innerHTML = `<style>
        :host { display:block; min-width:0; }
        ha-card {
          box-sizing:border-box; overflow:hidden; border-radius:20px; padding:18px; color:#fff;
          background:
            radial-gradient(500px 180px at 0% 0%, ${accent}22, transparent 65%),
            linear-gradient(145deg, rgba(11,25,49,.98), rgba(5,11,24,.98));
          border:1px solid ${accent}55;
          box-shadow:0 8px 28px rgba(0,0,0,.35), 0 0 28px ${accent}18;
        }
        .top { display:grid; grid-template-columns:auto 1fr auto; gap:14px; align-items:center; }
        .icon { width:52px; height:52px; display:grid; place-items:center; border-radius:16px;
                background:${accent}20; border:1px solid ${accent}55; }
        .icon ha-icon { --mdc-icon-size:34px; color:#fff; filter:drop-shadow(0 0 7px ${accent}); }
        .name { color:#fff; font-size:18px; line-height:1.25; font-weight:700; }
        .state { margin-top:3px; color:rgba(255,255,255,.82); font-size:14px; line-height:1.3; }
        .soc { color:#fff; font-size:32px; line-height:1; font-weight:750; white-space:nowrap; }
        .soc small { font-size:16px; font-weight:600; }
        .bar { height:11px; margin:16px 0; overflow:hidden; border-radius:999px; background:rgba(255,255,255,.09); }
        .bar > div { width:${level}%; height:100%; border-radius:inherit;
          background:linear-gradient(90deg, ${accent}, ${accent2}); box-shadow:0 0 14px ${accent}; transition:width .5s ease; }
        .metrics { display:grid; grid-template-columns:repeat(auto-fit,minmax(120px,1fr)); gap:10px; }
        .metric { min-width:0; padding:10px; border-radius:12px;
          background:rgba(255,255,255,.055); border:1px solid rgba(255,255,255,.10); }
        .metric-head { display:flex; gap:6px; align-items:center; min-width:0;
          color:#fff; font-size:14px; line-height:1.25; font-weight:600; }
        .metric-head ha-icon { flex:0 0 auto; --mdc-icon-size:17px; color:#fff; }
        .metric-head span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .metric-value { margin-top:7px; color:#fff; font-size:17px; line-height:1.25;
          font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .metric-value small { color:#fff; font-size:13px; }
        @media (max-width:650px) { .name { font-size:17px; } .soc { font-size:28px; } }
      </style>
      <ha-card>
        <div class="top">
          <div class="icon"><ha-icon icon="${esc(c.icon || "mdi:battery-high")}"></ha-icon></div>
          <div><div class="name">${esc(c.name || T("Batterie"))}</div><div class="state">${esc(state)} · ${esc(fmtW(power))}</div></div>
          <div class="soc">${soc == null ? "–" : Math.round(soc)}<small>%</small></div>
        </div>
        <div class="bar"><div></div></div>
        <div class="metrics">${details}</div>
      </ha-card>`;
    }
  }

  const BATTERY_SCHEMA = {
    main: [
      { name: "entity", label: "Ladestand (%)", selector: SEL.power },
      { name: "power", label: "Leistung (W, negativ = lädt)", selector: SEL.power },
      { type: "grid", column_min_width: "220px", schema: [
        { name: "name", label: "Name", selector: SEL.text },
        { name: "icon", label: "Symbol", selector: SEL.icon },
        { name: "accent", label: "Akzentfarbe (z. B. #33d6ff)", selector: SEL.color },
        { name: "accent2", label: "Zweite Akzentfarbe für den Verlauf (z. B. #32e2ad)", selector: SEL.color },
      ] },
    ],
    detail: [
      { name: "entity", label: "Entität", selector: SEL.anyEntity },
      { type: "grid", column_min_width: "220px", schema: [
        { name: "name", label: "Name (optional, sonst vom Sensor)", selector: SEL.text },
        { name: "icon", label: "Symbol (optional)", selector: SEL.icon },
      ] },
    ],
  };

  // Empty form fields come back as "" or undefined; leaving them out keeps the YAML tidy.
  const compact = (o) => {
    const x = { ...o };
    Object.keys(x).forEach((k) => { if (x[k] === "" || x[k] == null) delete x[k]; });
    return x;
  };

  /**
   * Editor for the battery card. It borrows the plumbing of the main editor
   * (forms, rows, buttons, styles) and only swaps in its own pages: the card
   * settings with the metric list, and one page per metric.
   */
  class GlassEnergyBatteryCardEditor extends GlassEnergyFlowCardEditor {
    setConfig(config) {
      this._config = { ...(config || {}) };
      this._render();
    }

    _renderOverview(root) {
      root.appendChild(this._form(BATTERY_SCHEMA.main, () => ({ ...this._config }), (v) => {
        this._patch((n) => {
          ["entity", "power", "name", "icon", "accent", "accent2"].forEach((k) => {
            if (v[k] === "" || v[k] == null) delete n[k]; else n[k] = v[k];
          });
        });
      }));

      const sec = document.createElement("div");
      sec.className = "sec";
      sec.textContent = T("Kennzahlen");
      root.appendChild(sec);

      const hint = document.createElement("div");
      hint.className = "hint";
      hint.textContent = T("Kennzahlen erscheinen als Kacheln unter dem Balken. Mit den Pfeilen sortieren, mit dem Stift bearbeiten.");
      root.appendChild(hint);

      const arr = this._config.details || [];
      if (!arr.length) {
        const e = document.createElement("div");
        e.className = "empty";
        e.textContent = T("Noch keine Kennzahlen — unten eine Entität auswählen.");
        root.appendChild(e);
      }
      arr.forEach((x, i) => {
        const d = document.createElement("div");
        d.className = "row item";
        const ic = document.createElement("ha-icon");
        ic.icon = x.icon || "mdi:circle-small";
        d.appendChild(ic);
        const txt = document.createElement("div");
        txt.className = "txt";
        txt.innerHTML = `<div class="h">${esc(x.name || fname(this._hass, x.entity))}</div><div class="s">${esc(x.entity || "")}</div>`;
        txt.addEventListener("click", () => this._nav("details", i));
        d.appendChild(txt);
        const btns = document.createElement("div");
        btns.className = "btns";
        btns.appendChild(this._iconBtn("mdi:arrow-up", T("Nach oben"), () => this._move("details", i, -1), i === 0));
        btns.appendChild(this._iconBtn("mdi:arrow-down", T("Nach unten"), () => this._move("details", i, 1), i === arr.length - 1));
        btns.appendChild(this._iconBtn("mdi:pencil", T("Bearbeiten"), () => this._nav("details", i)));
        btns.appendChild(this._iconBtn("mdi:close", T("Entfernen"), () => {
          this._patch((n) => {
            n.details.splice(i, 1);
            if (!n.details.length) delete n.details;
          });
          this._render(true);
        }));
        d.appendChild(btns);
        root.appendChild(d);
      });

      const picker = document.createElement("ha-entity-picker");
      picker.className = "add";
      picker.hass = this._hass;
      picker.label = T("Hinzufügen");
      picker.allowCustomEntity = true;
      picker.addEventListener("value-changed", (ev) => {
        const id = ev.detail.value;
        if (!id) return;
        ev.target.value = "";
        this._patch((n) => { n.details = (n.details || []).concat([{ entity: id }]); });
        this._render(true);
      });
      root.appendChild(picker);
    }

    _renderPage(root) {
      const arr = this._config.details || [];
      const i = this._index;
      if (this._page !== "details" || !arr[i]) { this._nav(null); return; }
      const head = document.createElement("div");
      head.className = "head";
      const back = this._iconBtn("mdi:arrow-left", T("Zurück"), () => this._nav(null));
      back.className = "back";
      head.appendChild(back);
      const t = document.createElement("div");
      t.className = "title";
      t.textContent = `${T("Kennzahl")} · ${i + 1}/${arr.length}`;
      head.appendChild(t);
      root.appendChild(head);
      root.appendChild(this._form(BATTERY_SCHEMA.detail, () => ({ ...(this._config.details[i] || {}) }),
        (v) => this._patch((n) => { n.details[i] = compact({ ...n.details[i], ...v }); })));
    }
  }

  if (!customElements.get("glass-energy-flow-card")) customElements.define("glass-energy-flow-card", GlassEnergyFlowCard);
  if (!customElements.get("glass-energy-flow-card-editor")) customElements.define("glass-energy-flow-card-editor", GlassEnergyFlowCardEditor);
  window.customCards = window.customCards || [];
  if (!window.customCards.some(c => c.type === "glass-energy-flow-card")) window.customCards.push({
    type: "glass-energy-flow-card", name: "Glass Energy Flow Card",
    description: T("Energiefluss mit PV, Speicher, Netz, Klima, Verbrauchern und PV-Prognose."), preview: false, documentationURL: "https://github.com/bh4it/glass-energy-flow-card"
  });
  if (!customElements.get("glass-energy-battery-card")) customElements.define("glass-energy-battery-card", GlassEnergyBatteryCard);
  if (!customElements.get("glass-energy-battery-card-editor")) customElements.define("glass-energy-battery-card-editor", GlassEnergyBatteryCardEditor);
  if (!window.customCards.some(c => c.type === "glass-energy-battery-card")) window.customCards.push({
    type: "glass-energy-battery-card", name: "Glass Energy Battery Card",
    description: T("Akku mit Ladestand, Leistung und Kennzahlen im selben Glas-Look."), preview: false, documentationURL: "https://github.com/bh4it/glass-energy-flow-card"
  });
  console.info(`%c GLASS-ENERGY-FLOW-CARD %c v${CARD_VERSION} `,
    "background:#0a1122;color:#7fd4ff;padding:2px 6px;border-radius:4px 0 0 4px",
    "background:#37c8ff;color:#05070f;padding:2px 6px;border-radius:0 4px 4px 0");
})();
