import type { Attendance } from '../../types'

export default function AttendanceTable({ records }: { records: Attendance[] }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.date}</td>
              <td>
                <span className={`badge ${record.status === 'Present' ? 'success' : 'danger'}`}>{record.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
