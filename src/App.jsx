import { Theme, Grid, Column, Stack } from '@carbon/react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { DEFAULTS, SEED_DATA } from './utils/calculations'
import SettingsPanel from './components/SettingsPanel'
import AddEntryForm from './components/AddEntryForm'
import PriceLogTable from './components/PriceLogTable'
import BudgetCalculator from './components/BudgetCalculator'

export default function App() {
  const [entries, setEntries] = useLocalStorage('aldor_price_log', SEED_DATA)
  const [settings, setSettings] = useLocalStorage('aldor_settings', DEFAULTS)
  const [budget, setBudget] = useLocalStorage('aldor_budget', null)

  function handleAdd(entry) {
    setEntries((prev) => [entry, ...prev])
  }

  function handleDelete(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <Theme theme="g100">
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--cds-background)', padding: '0 0 4rem' }}>
        {/* Header */}
        <div
          style={{
            backgroundColor: 'var(--cds-layer)',
            borderBottom: '1px solid var(--cds-border-subtle)',
            padding: '1.5rem 2rem',
            marginBottom: '2rem',
          }}
        >
          <h1 className="cds--type-productive-heading-05" style={{ margin: 0 }}>
            ⚔️ Aldor Rep Cost Calculator
          </h1>
          <p className="cds--type-body-short-01" style={{ marginTop: '0.25rem', color: 'var(--cds-text-secondary)' }}>
            TBC Classic — Track AH prices &amp; find the cheapest path to Exalted
          </p>
        </div>

        <Grid fullWidth style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
          {/* Settings + Budget side-by-side */}
          <Column lg={8} md={4} sm={4} style={{ marginTop: '1.5rem' }}>
            <SettingsPanel settings={settings} onChange={setSettings} />
          </Column>
          <Column lg={8} md={4} sm={4} style={{ marginTop: '1.5rem' }}>
            <BudgetCalculator
              budget={budget}
              onBudgetChange={setBudget}
              entries={entries}
              settings={settings}
            />
          </Column>

          {/* Add Entry Form */}
          <Column lg={16} md={8} sm={4} style={{ marginTop: '1.5rem' }}>
            <AddEntryForm onAdd={handleAdd} />
          </Column>

          {/* Price Log Table */}
          <Column lg={16} md={8} sm={4} style={{ marginTop: '1.5rem' }}>
            <PriceLogTable entries={entries} settings={settings} onDelete={handleDelete} />
          </Column>
        </Grid>
      </div>
    </Theme>
  )
}
