from app.schemas.common import ApiResponse
from app.schemas.employee import EmployeeCreate, EmployeeResponse
from app.services.employee_service import EmployeeService


class EmployeeController:

    async def create_employee(self, payload: EmployeeCreate) -> ApiResponse:
        service = EmployeeService()  
        employee = await service.create_employee(payload)

        return ApiResponse(
            message="Employee created successfully.",
            data=EmployeeResponse(**employee)
        )

    async def list_employees(self) -> ApiResponse:
        service = EmployeeService()  
        employees = await service.list_employees()

        return ApiResponse(
            message="Employees fetched successfully.",
            data=[EmployeeResponse(**emp) for emp in employees]
        )

    async def delete_employee(self, employee_id: str) -> ApiResponse:
        service = EmployeeService()  
        await service.delete_employee(employee_id)

        return ApiResponse(
            message="Employee deleted successfully.",
            data={"employee_id": employee_id}
        )