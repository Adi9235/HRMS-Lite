from typing import List, Dict, Optional
from datetime import datetime, date

from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError

from app.db.mongodb import get_database
from app.models.base import mongo_doc, utc_now
from app.schemas.attendance import AttendanceCreate


class AttendanceService:
    def __init__(self) -> None:
        self.db = get_database()
        self.collection = self.db.attendance
        self.employee_collection = self.db.employees

    async def mark_attendance(self, payload: AttendanceCreate) -> Dict:
        employee = await self.employee_collection.find_one(
            {"employee_id": payload.employee_id}
        )
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found."
            )

        now = utc_now()

        attendance_date = datetime.combine(payload.date, datetime.min.time())

        attendance_doc = {
            "employee_id": payload.employee_id,
            "date": attendance_date,
            "status": payload.status,
            "created_at": now,
            "updated_at": now,
        }

        try:
            result = await self.collection.insert_one(attendance_doc)
        except DuplicateKeyError as exc:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Attendance already marked for this date."
            ) from exc

        created = await self.collection.find_one({"_id": result.inserted_id})
        return mongo_doc(created)

    async def get_employee_attendance(
        self,
        employee_id: str,
        attendance_date: Optional[date] = None
    ) -> List[Dict]:

        query: Dict = {"employee_id": employee_id}

        if attendance_date:
            query["date"] = datetime.combine(attendance_date, datetime.min.time())

        records = await (
            self.collection
            .find(query)
            .sort("date", -1)
            .to_list(length=None)
        )

        return [mongo_doc(record) for record in records]