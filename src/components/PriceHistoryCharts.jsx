import { LineChart } from '@carbon/charts-react'
import { InlineNotification, Tile } from '@carbon/react'
import { calcEntry, formatGold } from '../utils/calculations'

const tileStyle = { marginBottom: '1rem' }

const priceTrendOptions = {
  title: 'Price Trend Over Time',
  axes: {
    left: {
      mapsTo: 'value',
      title: 'MoS (g)',
    },
    bottom: {
      mapsTo: 'key',
      scaleType: 'time',
      ticks: {
        formatter: (t) => {
          const d = new Date(t)
          return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
        },
      },
    },
    right: {
      mapsTo: 'value',
      title: 'Fel Arm (g)',
      correspondingDatasets: ['Fel Arm Avg'],
    },
  },
  color: {
    scale: {
      'MoS Avg': '#4589ff',
      'Fel Arm Avg': '#42be65',
    },
  },
  tooltip: {
    valueFormatter: (v) => formatGold(v),
  },
  points: { radius: 5 },
  height: '300px',
  theme: 'g100',
}

const totalCostOptions = {
  title: 'Total Cost Estimate Over Time (mid-point of low/high)',
  axes: {
    left: {
      mapsTo: 'value',
      title: 'Total (g)',
    },
    bottom: {
      mapsTo: 'key',
      scaleType: 'time',
      ticks: {
        formatter: (t) => {
          const d = new Date(t)
          return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
        },
      },
    },
  },
  color: {
    scale: {
      'MoS Total': '#4589ff',
      'Fel Arm Total': '#42be65',
    },
  },
  tooltip: {
    valueFormatter: (v) => formatGold(v),
  },
  points: { radius: 5 },
  height: '300px',
  theme: 'g100',
}

export default function PriceHistoryCharts({ entries, settings }) {
  if (entries.length < 2) {
    return (
      <InlineNotification
        kind="info"
        title="Not enough data"
        subtitle="Add at least 2 entries to see price trends."
        hideCloseButton
        lowContrast
      />
    )
  }

  const sorted = [...entries].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

  const priceTrendData = sorted.flatMap((e) => {
    const c = calcEntry(e, settings)
    return [
      { group: 'MoS Avg', key: new Date(e.timestamp), value: +c.mosAvg.toFixed(4) },
      { group: 'Fel Arm Avg', key: new Date(e.timestamp), value: +c.felArmAvg.toFixed(4) },
    ]
  })

  const totalCostData = sorted.flatMap((e) => {
    const c = calcEntry(e, settings)
    return [
      { group: 'MoS Total', key: new Date(e.timestamp), value: +((c.totalMosLow + c.totalMosHigh) / 2).toFixed(2) },
      { group: 'Fel Arm Total', key: new Date(e.timestamp), value: +((c.totalFelArmLow + c.totalFelArmHigh) / 2).toFixed(2) },
    ]
  })

  return (
    <div>
      <Tile style={tileStyle}>
        <LineChart data={priceTrendData} options={priceTrendOptions} />
      </Tile>
      <Tile style={tileStyle}>
        <LineChart data={totalCostData} options={totalCostOptions} />
      </Tile>
    </div>
  )
}
