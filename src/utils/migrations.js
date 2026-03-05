import { DEFAULTS, SEED_DATA, STORAGE_VERSION } from './calculations'

const VERSION_KEY = 'aldor_schema_version'

// v0 → v1: establish baseline (no structural changes needed)
function v0_to_v1(data) {
  return data
}

const MIGRATIONS = [v0_to_v1] // index = from-version

export function runMigrations() {
  const stored = {
    version: parseInt(localStorage.getItem(VERSION_KEY) ?? '0', 10),
    entries: safeGet('aldor_price_log', SEED_DATA),
    settings: safeGet('aldor_settings', DEFAULTS),
    budget: safeGet('aldor_budget', null),
  }

  let { version, entries, settings, budget } = stored

  while (version < STORAGE_VERSION) {
    ;({ entries, settings, budget } = MIGRATIONS[version]({ entries, settings, budget }))
    version++
  }

  // ensure settings always has all current DEFAULTS fields
  settings = deepMergeDefaults(DEFAULTS, settings)

  localStorage.setItem('aldor_price_log', JSON.stringify(entries))
  localStorage.setItem('aldor_settings', JSON.stringify(settings))
  localStorage.setItem('aldor_budget', JSON.stringify(budget))
  localStorage.setItem(VERSION_KEY, String(STORAGE_VERSION))
}

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function deepMergeDefaults(defaults, stored) {
  if (typeof defaults !== 'object' || defaults === null) return stored ?? defaults
  const result = { ...stored }
  for (const key of Object.keys(defaults)) {
    if (result[key] === undefined) result[key] = defaults[key]
    else if (typeof defaults[key] === 'object' && !Array.isArray(defaults[key])) {
      result[key] = deepMergeDefaults(defaults[key], result[key])
    }
  }
  return result
}
