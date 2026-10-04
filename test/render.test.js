// Headless render test: mounts the card from dist/ in Chromium with a fake
// hass object and checks the wide, medium and phone layouts draw cleanly.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(ROOT, "test", "output");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".png": "image/png" };

// ------------------------------------------------------------- fake hass
const st = (state, unit, name) => ({
  state: String(state),
  attributes: { ...(unit ? { unit_of_measurement: unit } : {}), ...(name ? { friendly_name: name } : {}) },
});
const STATES = {
  "sensor.pv_roof_power": st(3200, "W", "Roof"),
  "sensor.pv_balcony_power": st(540, "W", "Balcony"),
  "sensor.pv_roof_yield_today": st(14.2, "kWh"),
  "sensor.pv_balcony_yield_today": st(2.1, "kWh"),
  "sensor.pv_yield_today": st(16.3, "kWh"),
  "sensor.pv_forecast_today": st(21.4, "kWh"),
  "sensor.pv_forecast_remaining": st(5.1, "kWh"),
  "sensor.pv_forecast_tomorrow": st(18.7, "kWh"),
  "sensor.battery_soc": st(64, "%"),
  "sensor.battery_power": st(-1200, "W"),
  "sensor.grid_power": st(-850, "W"),
  "sensor.grid_import_today": st(3.4, "kWh"),
  "sensor.grid_export_today": st(9.8, "kWh"),
  "sensor.house_consumption": st(1690, "W"),
  "sensor.ac_power": st(420, "W"),
  "sensor.ac_energy_today": st(2.6, "kWh"),
  "sensor.car_battery_level": st(48, "%"),
  "sensor.wallbox_power": st(0, "W"),
  "sensor.car_charger_connection": st("connected"),
  "sensor.car_range": st(212, "km"),
  "sensor.washer_power": st(130, "W", "Washer"),
  "sensor.dishwasher_power": st(0, "W", "Dishwasher"),
  "sensor.outdoor_temperature": st(18.5, "°C"),
  "sensor.outdoor_humidity": st(61, "%"),
  "weather.home": st("partlycloudy"),
  "sensor.uv_index": st(3.2),
};
for (const [id, s] of Object.entries(STATES)) s.entity_id = id;
// Functions don't cross into the page, so the hass object is assembled there.
const HASS = { states: STATES, language: "en", locale: { language: "en" } };

// The README's full example, so every section of the card is drawn.
const CONFIG = {
  type: "custom:glass-energy-flow-card",
  title: "Energy",
  header: {
    real_import: "sensor.grid_import_today", real_export: "sensor.grid_export_today",
    temp: "sensor.outdoor_temperature", humidity: "sensor.outdoor_humidity",
    weather: "weather.home", uv: "sensor.uv_index",
  },
  pv: {
    energy_today: "sensor.pv_yield_today", forecast_today: "sensor.pv_forecast_today",
    forecast_remaining: "sensor.pv_forecast_remaining", forecast_tomorrow: "sensor.pv_forecast_tomorrow",
  },
  solar: [
    { name: "Roof", entity: "sensor.pv_roof_power", energy_today: "sensor.pv_roof_yield_today", image: "builtin:solar-roof" },
    { name: "Balcony", entity: "sensor.pv_balcony_power", energy_today: "sensor.pv_balcony_yield_today", image: "builtin:solar-balcony" },
  ],
  batteries: [{ name: "Battery", soc: "sensor.battery_soc", power: "sensor.battery_power" }],
  grid: { entity: "sensor.grid_power", import_today: "sensor.grid_import_today", export_today: "sensor.grid_export_today" },
  home: { entity: "sensor.house_consumption" },
  climate: [{ name: "Air conditioning", entity: "sensor.ac_power",
              metrics: [{ label: "Today", entity: "sensor.ac_energy_today", unit: "kWh" }] }],
  vehicles: [{ name: "My EV", soc: "sensor.car_battery_level", power: "sensor.wallbox_power",
               plug: "sensor.car_charger_connection", range: "sensor.car_range" }],
  consumers: [
    { name: "Washer", entity: "sensor.washer_power", image: "builtin:washer" },
    { name: "Dishwasher", entity: "sensor.dishwasher_power", image: "builtin:dishwasher" },
  ],
  theme: { preset: "blau" },
};

// ------------------------------------------------------------ plumbing
let server, browser, base;

before(async () => {
  await mkdir(OUT, { recursive: true });
  server = createServer(async (req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname));
    try {
      const body = await readFile(join(ROOT, path === "/" ? "test/harness.html" : path));
      res.writeHead(200, { "content-type": TYPES[extname(path)] || "text/html" });
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  base = `http://127.0.0.1:${server.address().port}/`;
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  server?.close();
});

/**
 * Open the harness at the given viewport, mount the card at that width and
 * wait until it has drawn. Returns the page and every error it raised.
 */
async function mount({ width, height, config = CONFIG, hass = HASS, tag = "glass-energy-flow-card" }) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("requestfailed", (r) => errors.push(`request failed: ${r.url()}`));
  page.on("response", (r) => { if (r.status() >= 400) errors.push(`HTTP ${r.status()}: ${r.url()}`); });

  await page.goto(base);
  await page.waitForFunction((t) => customElements.get(t), tag);
  await page.evaluate(({ tag, config, hass }) => {
    // Home Assistant's own formatter, close enough for a smoke test.
    hass.formatEntityState = (s) =>
      s.attributes.unit_of_measurement ? `${s.state} ${s.attributes.unit_of_measurement}` : s.state;
    const el = document.createElement(tag);
    el.setConfig(config);
    document.getElementById("host").appendChild(el);
    el.hass = hass;
  }, { tag, config, hass });
  return { page, errors };
}

const card = "glass-energy-flow-card";

async function waitForDrawing(page) {
  // The first frame waits on ResizeObserver; then icons resolve and redraw.
  await page.waitForFunction((t) => {
    const el = document.querySelector(t);
    return el && el.dataset.mode && el.shadowRoot.querySelector("#stage svg [data-flow]");
  }, card, { timeout: 10_000 });
  await page.waitForTimeout(400);
}

// -------------------------------------------------------------- tests
const LAYOUTS = [
  { name: "wide", width: 1440, height: 900, mode: "wide" },
  { name: "medium", width: 900, height: 1100, mode: "mid" },
  { name: "phone", width: 390, height: 844, mode: "narrow" },
];

for (const L of LAYOUTS) {
  test(`renders the ${L.name} layout at ${L.width}px`, async () => {
    const { page, errors } = await mount(L);
    try {
      await waitForDrawing(page);
      const info = await page.evaluate((t) => {
        const el = document.querySelector(t);
        const root = el.shadowRoot;
        const svg = root.querySelector("#stage svg");
        const box = svg.getBoundingClientRect();
        const text = root.textContent + " " + [...svg.querySelectorAll("text")].map((n) => n.textContent).join(" ");
        const bad = [...svg.querySelectorAll("*")].flatMap((n) =>
          [...n.attributes].filter((a) => /NaN|undefined|Infinity/.test(a.value)).map((a) => `<${n.tagName} ${a.name}="${a.value.slice(0, 60)}">`));
        const images = [...svg.querySelectorAll("image")].map((i) => i.getAttribute("href"));
        return {
          mode: el.dataset.mode,
          flows: svg.querySelectorAll("[data-flow]").length,
          paths: svg.querySelectorAll("path").length,
          box: { w: box.width, h: box.height },
          hostW: el.getBoundingClientRect().width,
          text, bad, images,
        };
      }, card);

      await page.screenshot({ path: join(OUT, `${L.name}.png`), fullPage: true });

      assert.equal(info.mode, L.mode, "layout mode for this width");
      assert.ok(info.flows >= 5, `expected several energy flows, got ${info.flows}`);
      assert.ok(info.box.w > 0 && info.box.h > 0, "drawing has a size");
      assert.ok(info.box.w <= info.hostW + 1, `drawing (${info.box.w}px) overflows the card (${info.hostW}px)`);
      assert.deepEqual(info.bad, [], "no NaN/undefined leaks into the SVG");
      for (const s of ["Energy", "Roof", "Balcony", "Battery", "Washer", "My EV"]) {
        assert.ok(info.text.includes(s), `"${s}" is shown`);
      }
      assert.ok(info.images.some((h) => /solar-roof\.png$/.test(h)), "builtin artwork is referenced");
      assert.deepEqual(errors, [], "no page errors");
    } finally {
      await page.close();
    }
  });
}

test("survives entities that are unavailable or missing", async () => {
  const states = Object.fromEntries(Object.entries(STATES).map(([id, s]) =>
    [id, { ...s, state: "unavailable" }]));
  delete states["sensor.house_consumption"];
  const { page, errors } = await mount({ width: 1440, height: 900, hass: { ...HASS, states } });
  try {
    await waitForDrawing(page);
    const bad = await page.evaluate((t) => [...document.querySelector(t).shadowRoot.querySelectorAll("svg *")]
      .flatMap((n) => [...n.attributes].filter((a) => /NaN|Infinity/.test(a.value)).map((a) => a.name)), card);
    assert.deepEqual(bad, []);
    assert.deepEqual(errors, []);
  } finally {
    await page.close();
  }
});

test("the battery card renders", async () => {
  const { page, errors } = await mount({
    width: 500, height: 400, tag: "glass-energy-battery-card",
    config: { entity: "sensor.battery_soc", power: "sensor.battery_power", name: "Battery" },
  });
  try {
    const text = await page.evaluate(() => document.querySelector("glass-energy-battery-card").shadowRoot.textContent);
    assert.match(text, /Battery/);
    assert.match(text, /64/);
    assert.match(text, /Charging/);
    assert.deepEqual(errors, []);
  } finally {
    await page.close();
  }
});

test("idle consumers are hidden unless pinned", async () => {
  const shown = async (config) => {
    const { page, errors } = await mount({ width: 1440, height: 900, config });
    try {
      await waitForDrawing(page);
      const names = await page.evaluate((t) => [...document.querySelector(t).shadowRoot
        .querySelectorAll("#stage svg .tileLabel")].map((n) => n.textContent), card);
      assert.deepEqual(errors, []);
      return names;
    } finally {
      await page.close();
    }
  };
  // The dishwasher draws 0 W, the washer 130 W.
  assert.deepEqual(await shown(CONFIG), ["Washer"]);
  const pinned = { ...CONFIG, consumers: CONFIG.consumers.map((c) =>
    c.name === "Dishwasher" ? { ...c, always_show: true } : c) };
  assert.deepEqual(await shown(pinned), ["Washer", "Dishwasher"]);
  assert.deepEqual(await shown({ ...CONFIG, consumers_auto_hide: false }), ["Washer", "Dishwasher"]);
});

test("climate sits right of the house in the wide layout, unless moved left", async () => {
  const side = async (config) => {
    const { page, errors } = await mount({ width: 1440, height: 900, config });
    try {
      await waitForDrawing(page);
      const pos = await page.evaluate((t) => {
        const svg = document.querySelector(t).shadowRoot.querySelector("#stage svg");
        return { climate: +svg.querySelector(".cell-name").getAttribute("x"),
                 house: +svg.querySelector("circle.center").getAttribute("cx") };
      }, card);
      assert.deepEqual(errors, []);
      return pos.climate < pos.house ? "left" : "right";
    } finally {
      await page.close();
    }
  };
  assert.equal(await side(CONFIG), "right");
  assert.equal(await side({ ...CONFIG, layout: { climate: "left" } }), "left");
});
