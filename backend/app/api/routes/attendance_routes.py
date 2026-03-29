from typing import Optional
from datetime import date

from fastapi import APIRouter, Query

from app.controllers.attendance_controller import AttendanceController
from app.schemas.attendance import AttendanceCreate

router = APIRouter(prefix="/attendance", tags=["Attendance"])

controller = AttendanceController()


@router.post("/")
async def mark_attendance(payload: AttendanceCreate):
    return await controller.mark_attendance(payload)


@router.get("/{employee_id}")
async def get_employee_attendance(
    employee_id: str,
    attendance_date: Optional[date] = Query(default=None)
):
    return await controller.get_employee_attendance(
        employee_id,
        attendance_date
    )