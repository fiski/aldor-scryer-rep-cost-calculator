# Aldor Reputation Tracker — Claude Code Project Brief

## Project Overview

A web-based World of Warcraft TBC Classic reputation tracker for the **Aldor faction**.
The user logs AH (Auction House) prices for reputation items multiple times per day
and the app calculates cheapest route to exalted.

Hosted on **GitHub Pages** (static site, no backend).

---

## Design System

Use **IBM Carbon Design System** via the Carbon MCP server.

- Install and configure Carbon MCP per: https://carbondesignsystem.com/developing/carbon-mcp/onboarding-and-setup/
- Use Carbon React components throughout (`@carbon/react`)
- Follow Carbon's dark theme (`g100`) — fits the WoW fantasy aesthetic
- Use Carbon's data table, number inputs, inline notifications, and tile components
- Typography: IBM Plex Sans (comes with Carbon)
- Icons: `@carbon/icons-react`

---

## Tech Stack

- **React** (Vite)
- **@carbon/react** + **@carbon/styles**
- **localStorage** for data persistence (no backend)
- **GitHub Pages** deployment via `gh-pages` npm package or GitHub Actions

### Recommended project init
```bash
npm create vite@latest aldor-rep-tracker -- --template react
cd aldor-rep-tracker
npm install @carbon/react @carbon/styles @carbon/icons-react
```

---

## Data Model

### Settings (editable by user, persisted in localStorage)
```js
{
  repNeeded: {
    phase1: 9305,
    phase2: 21000,
  },
  items: {
    markOfSargeras: { repEach: 25 },
    felArmament:    { repEach: 350 },
    markOfKiljaeden: { repEach: 25 },
  }
}
```

### Price Log Entry
```js
{
  id: uuid,
  timestamp: ISO8601 string,  // date + time
  mos: { low: float, high: float },     // Mark of Sargeras prices in gold
  felArm: { low: float, high: float },  // Fel Armament prices in gold
}
```

All entries stored as array in `localStorage` key `aldor_price_log`.

---

## Calculated Fields (derived, never stored)

For each entry row, compute:

| Field | Formula |
|---|---|
| MoS avg | `(low + high) / 2` |
| Fel Arm avg | `(low + high) / 2` |
| MoS cost per rep | `avg / repEach` |
| Fel Arm cost per rep | `avg / repEach` |
| Cheapest item | whichever has lower cost-per-rep |
| Qty needed (MoS) | `ceil(totalRepNeeded / 25)` |
| Qty needed (Fel Arm) | `ceil(totalRepNeeded / 350)` |
| Total cost MoS low | `qty * low price` |
| Total cost MoS high | `qty * high price` |
| Total cost Fel Arm low | `qty * low price` |
| Total cost Fel Arm high | `qty * high price` |

Where `totalRepNeeded = phase1 + phase2 = 30,305`

---

## Features

### 1. Settings Panel
- Editable rep targets (Phase 1, Phase 2)
- Editable rep-per-item values
- Shown as Carbon `Tile` with `NumberInput` fields

### 2. Add Price Entry
- Form with: Date, Time, MoS Low, MoS High, Fel Arm Low, Fel Arm High
- Date/time defaults to current datetime
- Carbon `DatePicker`, `TimePicker`, `NumberInput`
- Submit with Carbon `Button` (primary)

### 3. Price Log Table
- Carbon `DataTable` with all entries
- Columns: Date, Time, MoS Low, MoS High, MoS Avg, Fel Arm Low, Fel Arm High, Fel Arm Avg, Best Deal, Qty Needed, Total Cost Low, Total Cost High
- Sortable by date/time
- Delete row action per entry
- Most recent entry at top

### 4. Summary / Best Deal Banner
- Carbon `InlineNotification` or prominent `Tile`
- Shows: based on latest entry, which item to buy, how many, estimated total cost range (low–high)
- Example: "✔ Buy 1,213 × Mark of Sargeras — ~812g to 862g"

### 5. Export
- Export all entries as `.csv` download (optional stretch goal)

---

## GitHub Pages Deployment

### Option A — gh-pages package
```json
// package.json
"homepage": "https://<username>.github.io/aldor-rep-tracker",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

### Option B — GitHub Actions (preferred)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Also set in `vite.config.js`:
```js
export default defineConfig({
  base: '/aldor-rep-tracker/',
  plugins: [react()],
})
```

---

## Notes & Conventions

- All gold values entered and displayed as decimal gold (e.g. `0.67` = 67 silver)
- Display format: `0.67g`, `12.44g` — always 2 decimal places + "g" suffix
- Quantities always rounded **up** (ceiling)
- "Best Deal" logic: compare `avgPrice / repEach` — lower is better
- No authentication, no backend — purely client-side
- Mobile-friendly layout is a bonus but desktop-first is fine
- Use Carbon's `g100` (dark) theme globally

---

## Seed Data (pre-populate for testing)

```js
[
  {
    id: "1",
    timestamp: "2026-03-04T08:00:00",
    mos: { low: 0.67, high: 0.71 },
    felArm: { low: 12.44, high: 12.48 }
  },
  {
    id: "2",
    timestamp: "2026-03-04T14:00:00",
    mos: { low: 0.68, high: 0.69 },
    felArm: { low: 13.00, high: 13.80 }
  }
]
```
