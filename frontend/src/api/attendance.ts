import { api } from './client'
import type { ApiSuccess, Attendance, AttendanceSummary, AttendanceStatus } from '../types'

export type MarkAttendancePayload = {
  employee_id: string
  date: string
  status: AttendanceStatus
}

export const markAttendance = async (payload: MarkAttendancePayload) => {
  const response = await api.post<ApiSuccess<Attendance>>('/attendance', payload)
  return response.data
}

export const getAttendanceByEmployee = async (employeeId: string, date?: string) => {
  const response = await api.get<ApiSuccess<Attendance[]>>(`/attendance/${employeeId}`, {
    params: date ? { date } : {},
  })
  return response.data
}

