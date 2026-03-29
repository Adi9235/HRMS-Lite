import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import { createEmployee, deleteEmployee, getEmployees } from '../api/employees'
import { getAttendanceByEmployee, markAttendance } from '../api/attendance'

import type { Attendance, Employee } from '../types'
import { getErrorMessage } from '../utils/http'

import type { NavKey } from '../components/layout/Sidebar'

import Card from '../components/common/Card'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import Loader from '../components/common/Loader'
import SectionHeader from '../components/common/SectionHeader'

import EmployeeForm from '../components/employee/EmployeeForm'
import EmployeeTable from '../components/employee/EmployeeTable'
import AttendanceForm from '../components/attendance/AttendanceForm'
import AttendanceTable from '../components/attendance/AttendanceTable'
import SummaryCards from '../components/attendance/SummaryCards'

interface Props {
  activePage: NavKey
}

export default function DashboardPage({ activePage }: Props) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([])
  const [allAttendanceRecords, setAllAttendanceRecords] = useState<Attendance[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')

  const [loadingEmployees, setLoadingEmployees] = useState(true)
  const [loadingAttendance, setLoadingAttendance] = useState(false)
  const [creatingEmployee, setCreatingEmployee] = useState(false)
  const [markingAttendance, setMarkingAttendance] = useState(false)
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<string | null>(null)
  const [pageError, setPageError] = useState('')

  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee.employee_id === selectedEmployeeId) || null,
    [employees, selectedEmployeeId],
  )

  const summary = useMemo(() => {
    let present = 0
    let absent = 0
    allAttendanceRecords.forEach((rec) => {
      if (rec.status === 'Present') present++
      if (rec.status === 'Absent') absent++
    })
    return { present, absent }
  }, [allAttendanceRecords])

  const fetchAttendance = async (employeeId: string) => {
    setLoadingAttendance(true)
    try {
      const response = await getAttendanceByEmployee(employeeId)
      setAttendanceRecords(response.data)
    } catch (error) {
      toast.error(getErrorMessage(error))
      setAttendanceRecords([])
    } finally {
      setLoadingAttendance(false)
    }
  }

  const fetchAllAttendance = async (employeeList: Employee[]) => {
    try {
      const responses = await Promise.allSettled(
        employeeList.map((emp) => getAttendanceByEmployee(emp.employee_id))
      )
      const combined = responses
        .filter((res) => res.status === 'fulfilled')
        .flatMap((res: any) => res.value.data)
      setAllAttendanceRecords(combined)
    } catch (error) {
      console.error('fetchAllAttendance error:', error)
    }
  }

  const fetchEmployees = async () => {
    setLoadingEmployees(true)
    setPageError('')
    try {
      const employeeResponse = await getEmployees()
      const employeeList = employeeResponse?.data ?? []
      setEmployees(employeeList)
      fetchAllAttendance(employeeList)
      if (employeeList.length > 0) {
        setSelectedEmployeeId((prev) => prev || employeeList[0].employee_id)
      } else {
        setSelectedEmployeeId('')
        setAttendanceRecords([])
      }
    } catch (error) {
      setPageError(getErrorMessage(error))
    } finally {
      setLoadingEmployees(false)
    }
  }

  useEffect(() => { fetchEmployees() }, [])

  useEffect(() => {
    if (selectedEmployeeId) fetchAttendance(selectedEmployeeId)
  }, [selectedEmployeeId])

  const handleCreateEmployee = async (payload: any) => {
    setCreatingEmployee(true)
    try {
      const response = await createEmployee(payload)
      toast.success(response.message)
      await fetchEmployees()
      setSelectedEmployeeId(payload.employee_id)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setCreatingEmployee(false)
    }
  }

  const handleDeleteEmployee = async (employeeId: string) => {
    setDeletingEmployeeId(employeeId)
    try {
      const response = await deleteEmployee(employeeId)
      toast.success(response.message)
      await fetchEmployees()
      if (selectedEmployeeId === employeeId) {
        const next = employees.find((emp) => emp.employee_id !== employeeId)
        setSelectedEmployeeId(next?.employee_id || '')
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setDeletingEmployeeId(null)
    }
  }

  const handleMarkAttendance = async (payload: any) => {
    setMarkingAttendance(true)
    try {
      const response = await markAttendance(payload)
      toast.success(response.message)
      setSelectedEmployeeId(payload.employee_id)
      await Promise.all([fetchAttendance(payload.employee_id), fetchEmployees()])
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setMarkingAttendance(false)
    }
  }

  if (loadingEmployees) return <Loader label="Loading dashboard..." />
  if (pageError) return <ErrorState message={pageError} onRetry={fetchEmployees} />

  // ─── Dashboard Page ────────────────────────────────────────────────────────
  if (activePage === 'dashboard') {
    return (
      <div className="page-stack">
        <SectionHeader
          title="Dashboard"
          subtitle="Overview of your workforce and attendance metrics."
        />
        <SummaryCards employees={employees} summary={summary} />

        <div className="two-column-grid">
          <Card>
            <SectionHeader title="Quick: Add Employee" subtitle="Capture employee details." />
            <EmployeeForm onSubmit={handleCreateEmployee} loading={creatingEmployee} employees={employees || []} />
          </Card>
          <Card>
            <SectionHeader title="Quick: Mark Attendance" subtitle="Record daily attendance." />
            {employees.length === 0 ? (
              <EmptyState title="No employees yet" description="Add an employee first." />
            ) : (
              <AttendanceForm
                key={selectedEmployeeId}
                employees={employees}
                defaultEmployeeId={selectedEmployeeId}
                onSubmit={handleMarkAttendance}
                loading={markingAttendance}
              />
            )}
          </Card>
        </div>
      </div>
    )
  }

  // ─── Employees Page ────────────────────────────────────────────────────────
  if (activePage === 'employees') {
    return (
      <div className="page-stack">
        <SectionHeader
          title="Employees"
          subtitle="Manage your team members and employee records."
        />
        <Card>
          <SectionHeader title="Add New Employee" subtitle="Fill in the details to add a team member." />
          <EmployeeForm onSubmit={handleCreateEmployee} loading={creatingEmployee} employees={employees || []} />
        </Card>
        <Card>
          <SectionHeader
            title="All Employees"
            subtitle={`${employees.length} employee${employees.length !== 1 ? 's' : ''} on record.`}
          />
          {employees.length === 0 ? (
            <EmptyState title="No employees found" description="Create your first employee above." />
          ) : (
            <EmployeeTable
              employees={employees}
              selectedEmployeeId={selectedEmployeeId}
              onSelect={setSelectedEmployeeId}
              onDelete={handleDeleteEmployee}
              deletingEmployeeId={deletingEmployeeId}
            />
          )}
        </Card>
      </div>
    )
  }

  // ─── Attendance Page ───────────────────────────────────────────────────────
  return (
    <div className="page-stack">
      <SectionHeader
        title="Attendance"
        subtitle="Record and review employee attendance."
      />
      <Card>
        <SectionHeader title="Mark Attendance" subtitle="Log today's attendance for an employee." />
        {employees.length === 0 ? (
          <EmptyState title="No employees yet" description="Add employees first." />
        ) : (
          <AttendanceForm
            key={selectedEmployeeId}
            employees={employees}
            defaultEmployeeId={selectedEmployeeId}
            onSubmit={handleMarkAttendance}
            loading={markingAttendance}
          />
        )}
      </Card>
      <Card>
        <SectionHeader
          title={selectedEmployee ? `${selectedEmployee.full_name} — Attendance` : 'Attendance Records'}
          subtitle={selectedEmployee ? `Employee ID: ${selectedEmployee.employee_id}` : 'Select an employee to view records.'}
        />
        {!selectedEmployee ? (
          <EmptyState title="No employee selected" description="Choose an employee from the Employees page." />
        ) : loadingAttendance ? (
          <Loader label="Loading attendance..." />
        ) : attendanceRecords.length === 0 ? (
          <EmptyState title="No attendance found" description="No records available for this employee." />
        ) : (
          <AttendanceTable records={attendanceRecords} />
        )}
      </Card>
    </div>
  )
}
