from typing import Optional
from datetime import date

from app.schemas.common import ApiResponse
from app.schemas.attendance import AttendanceCreate, AttendanceResponse
from app.services.attendance_service import AttendanceService


class AttendanceController:

    async def mark_attendance(self, payload: AttendanceCreate) -> ApiResponse:
        service = AttendanceService()  
        attendance = await service.mark_attendance(payload)

        return ApiResponse(
            message="Attendance marked successfully.",
            data=AttendanceResponse(**attendance)
        )

    async def get_employee_attendance(
        self,
        employee_id: str,
        attendance_date: Optional[date] = None
    ) -> ApiResponse:

        service = AttendanceService()  
        records = await service.get_employee_attendance(
            employee_id,
            attendance_date
        )

        return ApiResponse(
            message="Attendance fetched successfully.",
            data=[AttendanceResponse(**rec) for rec in records]
        )