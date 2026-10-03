# Glass Energy Flow Card

A glassmorphism energy flow card for Home Assistant: PV (several arrays, with daily yield and
forecast), storage, grid, house, climate and freely configurable consumers in one animated
card. Comes with a matching battery card and isometric artwork.

Vanilla Web Components, no build step. The card's labels are German.

## Cards

| Card | Type |
|---|---|
| Glass Energy Flow Card | `custom:glass-energy-flow-card` |
| Glass Energy Battery Card | `custom:glass-energy-battery-card` |

Both have a visual editor: **Edit dashboard → Add card → "Glass Energy"**.

## Installation

### HACS

1. **HACS → ⋮ → Custom repositories**
2. Repository `https://github.com/bh4it/glass-energy-flow-card`, type **Dashboard**
   (HACS' category for dashboard cards).
3. Download **Glass Energy Flow Card** and reload the browser.

### Manual

Copy everything in `dist/` to `<config>/www/glass-energy-flow-card/` and add the resource
`/local/glass-energy-flow-card/glass-energy-flow-card.js` as **JavaScript module**.

## Configuration

```yaml
type: custom:glass-energy-flow-card
title: Energie
header:
  real_import: sensor.grid_import_today      # kWh
  real_export: sensor.grid_export_today      # kWh
  temp: sensor.outdoor_temperature
  humidity: sensor.outdoor_humidity
  weather: weather.home
  uv: sensor.uv_index
pv:
  energy_today: sensor.pv_energy_today
  forecast_today: sensor.pv_forecast_today
  forecast_remaining: sensor.pv_forecast_remaining_today
  forecast_tomorrow: sensor.pv_forecast_tomorrow
solar:
  - name: Dach
    entity: sensor.pv_roof_power
    energy_today: sensor.pv_roof_energy_today
    image: builtin:solar-roof
  - name: Balkon
    entity: sensor.pv_balcony_power
    energy_today: sensor.pv_balcony_energy_today
    image: builtin:solar-balcony
batteries:
  - name: Speicher
    soc: sensor.battery_soc
    power: sensor.battery_power
grid:
  entity: sensor.grid_power                  # positive = import
  import_today: sensor.grid_import_today
  export_today: sensor.grid_export_today
home:
  entity: sensor.house_consumption
climate:
  - name: Klima
    entity: sensor.ac_power
consumers:
  - name: Waschm.
    entity: sensor.washer_power
    image: builtin:washer
  - name: Wallbox
    entity: sensor.wallbox_power
    icon: mdi:ev-station
    secondary:
      entity: sensor.car_battery_level
      unit: "%"
theme:
  preset: blau
grid_options:
  columns: full
```

Only configure what you want to see; the visual editor covers most options.

### Built-in artwork

`image: builtin:<name>` uses the bundled artwork; light variants are picked automatically in
the light themes. `image: none` shows the icon instead. Any other value is used as an image URL
(for example images uploaded through the editor).

| Name | Default for |
|---|---|
| `home` | house |
| `grid` | grid |
| `battery`, `battery-stack` | batteries (`battery`) |
| `solar-roof`, `solar-balcony`, `solar-garage`, `solar-ground` | PV arrays (`solar-roof`) |
| `washer`, `dryer`, `dishwasher`, `pump`, `freezer` | – |

### Themes

`theme.preset`: `blau` (default), `dunkel`, `mitternacht`, `petrol`, `violett`, `grafit`,
`hell`, `hell-blau`, `hell-violett`. Colours can be fine-tuned with `center`, `edge`, `spread`
and `tile`.

### Layout

`layout.mode: auto` switches between wide, medium and narrow layouts at `wide_min` (1100 px) and
`mid_min` (680 px).

## Battery card

```yaml
type: custom:glass-energy-battery-card
name: Speicher
entity: sensor.battery_soc
power: sensor.battery_power
accent: "#00a8ff"
accent2: "#33e6c7"
details:
  - entity: sensor.battery_health
    name: Akkuzustand
```
