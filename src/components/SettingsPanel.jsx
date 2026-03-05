import { Tile, NumberInput, Heading, Stack, Select, SelectItem } from '@carbon/react'
import { TIER_CAPS, totalRepNeeded } from '../utils/calculations'

export default function SettingsPanel({ settings, onChange }) {
  function handleChange(path, value) {
    const [section, key] = path.split('.')
    if (section === 'startingRep') {
      const parsed = key === 'progress' ? Number(value) : value
      onChange({
        ...settings,
        startingRep: { ...settings.startingRep, [key]: parsed },
      })
    }
  }

  return (
    <Tile className="settings-panel">
      <Heading className="cds--type-productive-heading-03" style={{ marginBottom: '1rem' }}>
        Settings
      </Heading>
      <Stack gap={5}>
        <div>
          <p className="cds--label" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
            Current Reputation
          </p>
          <Stack gap={4} orientation="horizontal">
            <Select
              id="sr-tier"
              labelText="Standing"
              value={settings.startingRep?.tier ?? 'friendly'}
              onChange={(e) =>
                onChange({
                  ...settings,
                  startingRep: { tier: e.target.value, progress: 0 },
                })
              }
            >
              {['neutral', 'friendly', 'honored', 'revered'].map((tier) => (
                <SelectItem
                  key={tier}
                  value={tier}
                  text={`${tier.charAt(0).toUpperCase() + tier.slice(1)} (0 – ${TIER_CAPS[tier].toLocaleString()})`}
                />
              ))}
            </Select>
            <NumberInput
              id="sr-progress"
              label="Progress in tier"
              helperText={`Rep earned so far in ${settings.startingRep?.tier ?? 'friendly'}`}
              value={settings.startingRep?.progress ?? 0}
              min={0}
              max={TIER_CAPS[settings.startingRep?.tier ?? 'friendly']}
              step={100}
              onChange={(e, { value }) => handleChange('startingRep.progress', Number(value))}
            />
          </Stack>
        </div>
        <div>
          <p className="cds--label" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
            Target Reputation
          </p>
          <Stack gap={4} orientation="horizontal" style={{ alignItems: 'flex-end' }}>
            <Select
              id="target-rep"
              labelText="Target standing"
              value={settings.targetRep ?? 'exalted'}
              onChange={(e) => onChange({ ...settings, targetRep: e.target.value })}
            >
              {['friendly', 'honored', 'revered', 'exalted'].map((tier) => (
                <SelectItem
                  key={tier}
                  value={tier}
                  text={tier.charAt(0).toUpperCase() + tier.slice(1)}
                />
              ))}
            </Select>
            <p style={{ paddingBottom: '0.75rem' }}>
              <span className="cds--label">Total rep needed: </span>
              <strong>{totalRepNeeded(settings).toLocaleString()}</strong>
            </p>
          </Stack>
        </div>
      </Stack>
    </Tile>
  )
}
