import { Tile, NumberInput, Heading, Stack } from '@carbon/react'

export default function SettingsPanel({ settings, onChange }) {
  function handleChange(path, value) {
    const [section, key] = path.split('.')
    if (section === 'repNeeded') {
      onChange({
        ...settings,
        repNeeded: { ...settings.repNeeded, [key]: value },
      })
    } else if (section === 'items') {
      const [item, field] = key.split('_')
      onChange({
        ...settings,
        items: {
          ...settings.items,
          [item]: { ...settings.items[item], [field]: value },
        },
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
            Rep Targets
          </p>
          <Stack gap={4} orientation="horizontal">
            <NumberInput
              id="phase1-rep"
              label="Phase 1 Rep Needed"
              value={settings.repNeeded.phase1}
              min={0}
              step={1}
              onChange={(e, { value }) => handleChange('repNeeded.phase1', Number(value))}
            />
            <NumberInput
              id="phase2-rep"
              label="Phase 2 Rep Needed"
              value={settings.repNeeded.phase2}
              min={0}
              step={1}
              onChange={(e, { value }) => handleChange('repNeeded.phase2', Number(value))}
            />
          </Stack>
        </div>
        <div>
          <p className="cds--label" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
            Rep Per Item
          </p>
          <Stack gap={4} orientation="horizontal">
            <NumberInput
              id="mos-rep"
              label="Mark of Sargeras"
              value={settings.items.mos.repEach}
              min={1}
              step={1}
              onChange={(e, { value }) => handleChange('items.mos_repEach', Number(value))}
            />
            <NumberInput
              id="felarm-rep"
              label="Fel Armament"
              value={settings.items.felArm.repEach}
              min={1}
              step={1}
              onChange={(e, { value }) => handleChange('items.felArm_repEach', Number(value))}
            />
          </Stack>
        </div>
      </Stack>
    </Tile>
  )
}
