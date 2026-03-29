import { useForm } from 'react-hook-form'
import type { CreateEmployeePayload } from '../../api/employees'
import { DEPARTMENTS } from '../../constants/departments'
import { useMemo } from 'react'
import type { Employee } from '../../types'

export default function EmployeeForm({
  onSubmit,
  loading,
  employees,
}: {
  onSubmit: (payload: CreateEmployeePayload) => Promise<void>
  loading: boolean
  employees?: Employee[]
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEmployeePayload>()

  // ✅ CORRECT NEXT EMPLOYEE ID (MAX BASED)
  const previewId = useMemo(() => {
    if (!Array.isArray(employees) || employees.length === 0) {
      return 'EMP-001'
    }

    const maxId = employees.reduce((max, emp) => {
      if (!emp?.employee_id) return max

      const parts = emp.employee_id.split('-')
      const num = parseInt(parts[1] || '0')

      return num > max ? num : max
    }, 0)

    const nextNumber = maxId + 1

    return `EMP-${String(nextNumber).padStart(3, '0')}`
  }, [employees])

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(values)
    reset()
  })

  return (
    <form className="form-grid" onSubmit={submitHandler}>
      
      {/* 🔒 Employee ID (READ ONLY) */}
      <div>
        <label>Employee ID</label>
        <input value={previewId} disabled />
      </div>

      {/* Full Name */}
      <div>
        <label>Full Name</label>
        <input
          {...register('full_name', {
            required: 'Full name is required',
            pattern: {
              value: /^[A-Za-z ]+$/,
              message: 'Only alphabets allowed',
            },
          })}
          placeholder="Harry Will"
        />
        {errors.full_name && (
          <span className="field-error">{errors.full_name.message}</span>
        )}
      </div>

      {/* Email */}
      <div>
        <label>Email Address</label>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          })}
          placeholder="john@company.com"
        />
        {errors.email && (
          <span className="field-error">{errors.email.message}</span>
        )}
      </div>

      {/* Department */}
      <div>
        <label>Department</label>
        <select
          {...register('department', { required: 'Department is required' })}
          defaultValue=""
        >
          <option value="" disabled>
            Select Department
          </option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        {errors.department && (
          <span className="field-error">{errors.department.message}</span>
        )}
      </div>

      {/* Submit */}
      <div className="form-actions full-width">
        <button className="button primary" disabled={loading} type="submit">
          {loading ? 'Saving...' : 'Add Employee'}
        </button>
      </div>
    </form>
  )
}