import { api } from './client'
import type { ApiSuccess, Employee } from '../types'

export type CreateEmployeePayload = {
  full_name: string
  email: string
  department: string
}

export const getEmployees = async () => {
  const response = await api.get<ApiSuccess<Employee[]>>('/employees/')
  return response.data
}

export const createEmployee = async (payload: CreateEmployeePayload) => {
  const response = await api.post<ApiSuccess<Employee>>('/employees/', payload)
  return response.data
}

export const deleteEmployee = async (employeeId: string) => {
  const response = await api.delete<ApiSuccess<{ employee_id: string }>>(`/employees/${employeeId}`)
  return response.data
}
