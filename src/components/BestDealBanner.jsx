import { InlineNotification } from '@carbon/react'
import { calcEntry, formatGold, formatNumber } from '../utils/calculations'

export default function BestDealBanner({ entries, settings }) {
  if (!entries || entries.length === 0) return null

  const latest = [...entries].sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0]
  const calc = calcEntry(latest, settings)

  const isMos = calc.bestDeal === 'mos'
  const itemLabel = isMos ? 'Mark of Sargeras' : 'Fel Armament'
  const qty = isMos ? calc.qtyMos : calc.qtyFelArm
  const low = isMos ? calc.totalMosLow : calc.totalFelArmLow
  const high = isMos ? calc.totalMosHigh : calc.totalFelArmHigh

  return (
    <InlineNotification
      kind="success"
      title="Best Deal:"
      subtitle={`Buy ${formatNumber(qty)} × ${itemLabel} — ~${formatGold(low)} to ${formatGold(high)}`}
      hideCloseButton
      lowContrast={false}
    />
  )
}
