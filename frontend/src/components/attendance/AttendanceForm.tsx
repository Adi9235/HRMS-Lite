import { useForm } from 'react-hook-form'
import type { Employee } from '../../types'
import type { MarkAttendancePayload } from '../../api/attendance'

export default function AttendanceForm({
  employees,
  defaultEmployeeId,
  onSubmit,
  loading,
}: {
  employees: Employee[]
  defaultEmployeeId: string
  onSubmit: (payload: MarkAttendancePayload) => Promise<void>
  loading: boolean
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MarkAttendancePayload>({
    defaultValues: {
      employee_id: defaultEmployeeId,
      date: new Date().toISOString().slice(0, 10),
      status: 'Present',
    },
  })

  return (
    <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Employee</label>
        <select {...register('employee_id', { required: 'Select an employee' })} defaultValue={defaultEmployeeId}>
          <option value="">Select employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.employee_id}>
              {employee.full_name} ({employee.employee_id})
            </option>
          ))}
        </select>
        {errors.employee_id ? <span className="field-error">{errors.employee_id.message}</span> : null}
      </div>

      <div>
        <label>Date</label>
        <input type="date" {...register('date', { required: 'Date is required' })} />
        {errors.date ? <span className="field-error">{errors.date.message}</span> : null}
      </div>

      <div>
        <label>Status</label>
        <select {...register('status', { required: 'Select a status' })}>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
      </div>

      <div className="form-actions full-width">
        <button className="button primary" type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Mark Attendance'}
        </button>
      </div>
    </form>
  )
}
