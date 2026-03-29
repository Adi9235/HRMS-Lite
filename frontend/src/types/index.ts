export type Employee = {
  id: string
  employee_id: string
  full_name: string
  email: string
  department: string
  created_at: string
  updated_at: string
}

export type AttendanceStatus = 'Present' | 'Absent'

export type Attendance = {
  id: string
  employee_id: string
  date: string
  status: AttendanceStatus
  created_at: string
  updated_at: string
}

export type AttendanceSummary = {
  employee_id: string
  full_name: string
  department: string
  total_present_days: number
  total_absent_days: number
}

export type ApiSuccess<T> = {
  message: string
  data: T
}
