import TrashButton from './TrashButton'
import type { Employee } from '../../types'

export default function EmployeeTable({
  employees,
  selectedEmployeeId,
  onSelect,
  onDelete,
  deletingEmployeeId,
}: {
  employees: Employee[]
  selectedEmployeeId: string
  onSelect: (employeeId: string) => void
  onDelete: (employeeId: string) => void
  deletingEmployeeId: string | null
}) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr
              key={employee.id}
              className={selectedEmployeeId === employee.employee_id ? 'active-row' : ''}
              onClick={() => onSelect(employee.employee_id)}
            >
              <td>{employee.employee_id}</td>
              <td>{employee.full_name}</td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td>
                <TrashButton
                  loading={deletingEmployeeId === employee.employee_id}
                  onClick={(event) => {
                    event.stopPropagation()
                    onDelete(employee.employee_id)
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
