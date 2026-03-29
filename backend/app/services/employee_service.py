from typing import List, Dict
from pymongo.errors import DuplicateKeyError
from fastapi import HTTPException, status

from app.db.mongodb import get_database
from app.models.base import mongo_doc, utc_now
from app.schemas.employee import EmployeeCreate


class EmployeeService:
    def __init__(self) -> None:
        self.db = get_database()
        self.collection = self.db.employees
        self.attendance_collection = self.db.attendance

    async def create_employee(self, payload: EmployeeCreate) -> Dict:
        now = utc_now()

        count = await self.collection.count_documents({})
        employee_id = f"EMP-{str(count + 1).zfill(3)}"

        employee_doc = {
            "employee_id": employee_id,
            "full_name": payload.full_name,
            "email": payload.email,
            "department": payload.department,
            "created_at": now,
            "updated_at": now,
        }

        try:
            result = await self.collection.insert_one(employee_doc)
        except DuplicateKeyError as exc:
            message = "Employee with same email already exists."
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=message
            ) from exc

        created = await self.collection.find_one({"_id": result.inserted_id})
        return mongo_doc(created)

    async def list_employees(self) -> List[Dict]:
        employees = await (
            self.collection
            .find()
            .sort("created_at", -1)
            .to_list(length=None)
        )
        return [mongo_doc(employee) for employee in employees]

    async def delete_employee(self, employee_id: str) -> None:
        result = await self.collection.delete_one({"employee_id": employee_id})

        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found."
            )

        await self.attendance_collection.delete_many({"employee_id": employee_id})