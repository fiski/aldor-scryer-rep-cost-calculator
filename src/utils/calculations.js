export const DEFAULTS = {
  items: {
    mos: { repEach: 25, label: 'Mark of Sargeras' },
    felArm: { repEach: 350, label: 'Fel Armament' },
  },
  startingRep: {
    tier: 'friendly',
    progress: 0,
  },
  targetRep: 'exalted',
}

export const TIER_CAPS = {
  neutral: 3000,
  friendly: 6000,
  honored: 12000,
  revered: 21000,
}
const ALL_TIERS = ['neutral', 'friendly', 'honored', 'revered', 'exalted']

export const SEED_DATA = [
  {
    id: '1',
    timestamp: '2026-03-04T08:00:00',
    mos: { low: 0.67, high: 0.71 },
    felArm: { low: 12.44, high: 12.48 },
  },
  {
    id: '2',
    timestamp: '2026-03-04T14:00:00',
    mos: { low: 0.68, high: 0.69 },
    felArm: { low: 13.0, high: 13.8 },
  },
]

export function totalRepNeeded(settings) {
  const sr = settings.startingRep
  const target = settings.targetRep ?? 'exalted'
  if (!sr?.tier) return 0
  const currentIdx = ALL_TIERS.indexOf(sr.tier)
  const targetIdx = ALL_TIERS.indexOf(target)
  if (currentIdx === -1 || targetIdx === -1 || targetIdx <= currentIdx) return 0
  let total = TIER_CAPS[sr.tier] - (sr.progress || 0)
  for (let i = currentIdx + 1; i < targetIdx; i++) {
    total += TIER_CAPS[ALL_TIERS[i]]
  }
  return Math.max(0, total)
}

export function qtyNeeded(settings) {
  const total = totalRepNeeded(settings)
  return {
    mos: Math.ceil(total / settings.items.mos.repEach),
    felArm: Math.ceil(total / settings.items.felArm.repEach),
  }
}

export function calcEntry(entry, settings) {
  const mosAvg = (entry.mos.low + entry.mos.high) / 2
  const felArmAvg = (entry.felArm.low + entry.felArm.high) / 2
  const mosCostPerRep = mosAvg / settings.items.mos.repEach
  const felArmCostPerRep = felArmAvg / settings.items.felArm.repEach
  const qty = qtyNeeded(settings)

  return {
    mosAvg,
    felArmAvg,
    mosCostPerRep,
    felArmCostPerRep,
    bestDeal: mosCostPerRep <= felArmCostPerRep ? 'mos' : 'felArm',
    qtyMos: qty.mos,
    qtyFelArm: qty.felArm,
    totalMosLow: qty.mos * entry.mos.low,
    totalMosHigh: qty.mos * entry.mos.high,
    totalFelArmLow: qty.felArm * entry.felArm.low,
    totalFelArmHigh: qty.felArm * entry.felArm.high,
  }
}

export function budgetBreakdown(budgetGold, settings) {
  const qty = qtyNeeded(settings)
  return {
    maxMosPrice: budgetGold / qty.mos,
    maxFelArmPrice: budgetGold / qty.felArm,
    qtyMos: qty.mos,
    qtyFelArm: qty.felArm,
  }
}

export function formatGold(value) {
  return `${Number(value).toFixed(2)}g`
}

export function formatNumber(value) {
  return Number(value).toLocaleString()
}
