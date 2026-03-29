from pydantic import BaseModel, EmailStr, field_validator, ConfigDict
from datetime import datetime


ALLOWED_DEPARTMENTS = [
    "Engineering",
    "HR",
    "Finance",
    "Sales",
    "Marketing",
    "Operations"
]


# 🔹 CREATE SCHEMA (NO employee_id)
class EmployeeCreate(BaseModel):
    full_name: str
    email: EmailStr
    department: str

    @field_validator("full_name")
    def validate_full_name(cls, v: str):
        if not v.replace(" ", "").isalpha():
            raise ValueError("Full name must contain only alphabets")
        return v

    @field_validator("department")
    def validate_department(cls, v: str):
        if v not in ALLOWED_DEPARTMENTS:
            raise ValueError(
                f"Department must be one of: {', '.join(ALLOWED_DEPARTMENTS)}"
            )
        return v


# 🔹 RESPONSE SCHEMA
class EmployeeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    employee_id: str
    full_name: str
    email: EmailStr
    department: str
    created_at: datetime
    updated_at: datetime