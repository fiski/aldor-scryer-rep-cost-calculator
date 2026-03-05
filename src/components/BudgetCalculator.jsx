import { useState } from 'react'
import { Tile, NumberInput, Heading, Stack, Tag } from '@carbon/react'
import { budgetBreakdown, formatGold, formatNumber, calcEntry } from '../utils/calculations'

export default function BudgetCalculator({ budget, onBudgetChange, entries, settings }) {
  const breakdown = budget ? budgetBreakdown(Number(budget), settings) : null

  const latest =
    entries && entries.length > 0
      ? [...entries].sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0]
      : null
  const latestCalc = latest ? calcEntry(latest, settings) : null

  return (
    <Tile>
      <Heading className="cds--type-productive-heading-03" style={{ marginBottom: '1rem' }}>
        Budget Calculator
      </Heading>
      <Stack gap={5}>
        <NumberInput
          id="budget-input"
          label="Your gold budget"
          value={budget ?? ''}
          min={0}
          step={1}
          allowEmpty
          helperText="Enter your total gold to see max prices per item"
          onChange={(e, { value }) => onBudgetChange(value === '' ? null : Number(value))}
        />

        {breakdown && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--cds-border-subtle)' }}>
                  {['Item', 'Qty Needed', 'Max Price Each', 'Current Avg', 'Status'].map((h) => (
                    <th
                      key={h}
                      style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--cds-text-secondary)', fontWeight: 600 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <BudgetRow
                  label="Mark of Sargeras"
                  qty={breakdown.qtyMos}
                  maxPrice={breakdown.maxMosPrice}
                  currentAvg={latestCalc ? latestCalc.mosAvg : null}
                />
                <BudgetRow
                  label="Fel Armament"
                  qty={breakdown.qtyFelArm}
                  maxPrice={breakdown.maxFelArmPrice}
                  currentAvg={latestCalc ? latestCalc.felArmAvg : null}
                />
              </tbody>
            </table>
          </div>
        )}
      </Stack>
    </Tile>
  )
}

function BudgetRow({ label, qty, maxPrice, currentAvg }) {
  const withinBudget = currentAvg !== null && currentAvg <= maxPrice

  return (
    <tr style={{ borderBottom: '1px solid var(--cds-border-subtle-01)' }}>
      <td style={{ padding: '0.5rem 0.75rem' }}>{label}</td>
      <td style={{ padding: '0.5rem 0.75rem' }}>{formatNumber(qty)}</td>
      <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'monospace' }}>{formatGold(maxPrice)}</td>
      <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'monospace' }}>
        {currentAvg !== null ? formatGold(currentAvg) : <span style={{ color: 'var(--cds-text-secondary)' }}>No data</span>}
      </td>
      <td style={{ padding: '0.5rem 0.75rem' }}>
        {currentAvg !== null ? (
          withinBudget ? (
            <Tag type="green">✅ Within budget</Tag>
          ) : (
            <Tag type="red">❌ Over budget</Tag>
          )
        ) : (
          <Tag type="gray">—</Tag>
        )}
      </td>
    </tr>
  )
}
