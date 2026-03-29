import Card from '../common/Card'
import type { Employee } from '../../types'

type SummaryType = {
  present: number
  absent: number
}

export default function SummaryCards({
  employees,
  summary,
}: {
  employees: Employee[]
  summary: SummaryType
}) {
  const totalEmployees = employees.length
  const totalPresent = summary.present
  const totalAbsent = summary.absent

  const cards = [
    { label: 'Total Employees', value: totalEmployees },
    { label: 'Present Entries', value: totalPresent },
    { label: 'Absent Entries', value: totalAbsent },
  ]

  return (
    <div className="summary-grid">
      {cards.map((item) => (
        <Card key={item.label}>
          <p className="muted">{item.label}</p>
          <h3>{item.value}</h3>
        </Card>
      ))}
    </div>
  )
}