import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableContainer,
  Button,
  Heading,
  Tile,
  Tag,
} from '@carbon/react'
import { TrashCan } from '@carbon/icons-react'
import { calcEntry, formatGold, formatNumber } from '../utils/calculations'

const HEADERS = [
  { key: 'date', header: 'Date' },
  { key: 'time', header: 'Time' },
  { key: 'mosLow', header: 'MoS Low' },
  { key: 'mosHigh', header: 'MoS High' },
  { key: 'mosAvg', header: 'MoS Avg' },
  { key: 'felArmLow', header: 'Fel Arm Low' },
  { key: 'felArmHigh', header: 'Fel Arm High' },
  { key: 'felArmAvg', header: 'Fel Arm Avg' },
  { key: 'bestDeal', header: 'Best Deal' },
  { key: 'qtyNeeded', header: 'Qty Needed' },
  { key: 'totalCostLow', header: 'Total Low' },
  { key: 'totalCostHigh', header: 'Total High' },
  { key: 'actions', header: '' },
]

export default function PriceLogTable({ entries, settings, onDelete }) {
  const sorted = [...entries].sort((a, b) => b.timestamp.localeCompare(a.timestamp))

  const rows = sorted.map((entry) => {
    const calc = calcEntry(entry, settings)
    const [datePart, timePart] = entry.timestamp.split('T')
    const isMos = calc.bestDeal === 'mos'

    return {
      id: entry.id,
      date: datePart,
      time: timePart.slice(0, 5),
      mosLow: formatGold(entry.mos.low),
      mosHigh: formatGold(entry.mos.high),
      mosAvg: formatGold(calc.mosAvg),
      felArmLow: formatGold(entry.felArm.low),
      felArmHigh: formatGold(entry.felArm.high),
      felArmAvg: formatGold(calc.felArmAvg),
      bestDeal: isMos ? 'Mark of Sargeras' : 'Fel Armament',
      qtyNeeded: formatNumber(isMos ? calc.qtyMos : calc.qtyFelArm),
      totalCostLow: formatGold(isMos ? calc.totalMosLow : calc.totalFelArmLow),
      totalCostHigh: formatGold(isMos ? calc.totalMosHigh : calc.totalFelArmHigh),
    }
  })

  if (entries.length === 0) {
    return (
      <Tile>
        <Heading className="cds--type-productive-heading-03" style={{ marginBottom: '1rem' }}>
          Price Log
        </Heading>
        <p style={{ color: 'var(--cds-text-secondary)' }}>No entries yet. Add your first price entry above.</p>
      </Tile>
    )
  }

  return (
    <DataTable rows={rows} headers={HEADERS}>
      {({ rows: tableRows, headers, getTableProps, getHeaderProps, getRowProps }) => (
        <TableContainer title="Price Log" description="All recorded AH price snapshots">
          <Table {...getTableProps()} size="sm">
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader key={header.key} {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map((row) => (
                <TableRow key={row.id} {...getRowProps({ row })}>
                  {row.cells.map((cell) => {
                    if (cell.info.header === 'actions') {
                      return (
                        <TableCell key={cell.id}>
                          <Button
                            kind="ghost"
                            size="sm"
                            iconDescription="Delete entry"
                            renderIcon={TrashCan}
                            hasIconOnly
                            onClick={() => onDelete(row.id)}
                          />
                        </TableCell>
                      )
                    }
                    const avgStyle =
                      cell.info.header === 'mosAvg'
                        ? { color: 'var(--cds-link-primary)', fontWeight: 600 }
                        : cell.info.header === 'felArmAvg'
                        ? { color: 'var(--cds-support-success)', fontWeight: 600 }
                        : undefined
                    return (
                      <TableCell key={cell.id} style={avgStyle}>
                        {cell.value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  )
}
