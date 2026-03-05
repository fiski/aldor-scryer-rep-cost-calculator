import { useState } from 'react'
import {
  Tile,
  NumberInput,
  Button,
  Heading,
  Stack,
  TextInput,
} from '@carbon/react'
import { Add } from '@carbon/icons-react'
import { v4 as uuidv4 } from 'uuid'

function nowDateStr() {
  const d = new Date()
  return d.toISOString().slice(0, 10) // YYYY-MM-DD
}

function nowTimeStr() {
  const d = new Date()
  return d.toTimeString().slice(0, 5) // HH:MM
}

export default function AddEntryForm({ onAdd }) {
  const [date, setDate] = useState(nowDateStr)
  const [time, setTime] = useState(nowTimeStr)
  const [mosLow, setMosLow] = useState('')
  const [mosHigh, setMosHigh] = useState('')
  const [felArmLow, setFelArmLow] = useState('')
  const [felArmHigh, setFelArmHigh] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!mosLow || !mosHigh || !felArmLow || !felArmHigh) return

    const entry = {
      id: uuidv4(),
      timestamp: `${date}T${time}:00`,
      mos: { low: parseFloat(mosLow), high: parseFloat(mosHigh) },
      felArm: { low: parseFloat(felArmLow), high: parseFloat(felArmHigh) },
    }
    onAdd(entry)
    setMosLow('')
    setMosHigh('')
    setFelArmLow('')
    setFelArmHigh('')
    setDate(nowDateStr())
    setTime(nowTimeStr())
  }

  return (
    <Tile>
      <Heading className="cds--type-productive-heading-03" style={{ marginBottom: '1rem' }}>
        Add Price Entry
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack gap={5}>
          <Stack gap={4} orientation="horizontal">
            <TextInput
              id="entry-date"
              labelText="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <TextInput
              id="entry-time"
              labelText="Time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </Stack>
          <div>
            <p className="cds--label" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
              Mark of Sargeras (gold)
            </p>
            <Stack gap={4} orientation="horizontal">
              <NumberInput
                id="mos-low"
                label="Low"
                value={mosLow}
                min={0}
                step={0.01}
                allowEmpty
                onChange={(e, { value }) => setMosLow(value)}
              />
              <NumberInput
                id="mos-high"
                label="High"
                value={mosHigh}
                min={0}
                step={0.01}
                allowEmpty
                onChange={(e, { value }) => setMosHigh(value)}
              />
            </Stack>
          </div>
          <div>
            <p className="cds--label" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
              Fel Armament (gold)
            </p>
            <Stack gap={4} orientation="horizontal">
              <NumberInput
                id="felarm-low"
                label="Low"
                value={felArmLow}
                min={0}
                step={0.01}
                allowEmpty
                onChange={(e, { value }) => setFelArmLow(value)}
              />
              <NumberInput
                id="felarm-high"
                label="High"
                value={felArmHigh}
                min={0}
                step={0.01}
                allowEmpty
                onChange={(e, { value }) => setFelArmHigh(value)}
              />
            </Stack>
          </div>
          <div>
            <Button type="submit" renderIcon={Add}>
              Add Entry
            </Button>
          </div>
        </Stack>
      </form>
    </Tile>
  )
}
