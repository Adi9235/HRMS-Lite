from datetime import date, datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, field_validator

AttendanceStatus = Literal["Present", "Absent"]


class AttendanceCreate(BaseModel):
    employee_id: str = Field(..., min_length=1, max_length=50)
    date: date
    status: AttendanceStatus

    @field_validator("employee_id")
    @classmethod
    def strip_employee_id(cls, value: str) -> str:
        return value.strip()


class AttendanceResponse(AttendanceCreate):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AttendanceWithEmployee(AttendanceResponse):
    full_name: str
    department: str
