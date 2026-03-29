from fastapi import APIRouter
from app.controllers.employee_controller import EmployeeController
from app.schemas.employee import EmployeeCreate

router = APIRouter(prefix="/employees", tags=["Employees"])

controller = EmployeeController()


@router.post("/")
async def create_employee(payload: EmployeeCreate):
    return await controller.create_employee(payload)


@router.get("/")
async def list_employees():
    return await controller.list_employees()


@router.delete("/{employee_id}")
async def delete_employee(employee_id: str):
    return await controller.delete_employee(employee_id)