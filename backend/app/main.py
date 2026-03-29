from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes.employee_routes import router as employee_router
from app.api.routes.attendance_routes import router as attendance_router
from app.core.config import get_settings
from app.db.mongodb import close_mongo_connection, connect_to_mongo

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting HRMS Lite API...")

    try:
        await connect_to_mongo()
        print(" MongoDB Connected Successfully")
    except Exception as e:
        print(" MongoDB Connection Failed:", str(e))
        raise e

    yield

    print("🛑 Shutting down HRMS Lite API...")
    await close_mongo_connection()
    print(" MongoDB Connection Closed")


app = FastAPI(
    title=settings.app_name,
    lifespan=lifespan
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "https://hrmslite123.netlify.app"    
        ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail}
    )


@app.exception_handler(Exception)
async def unexpected_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "message": "Something went wrong. Please try again.",
            "detail": str(exc)
        },
    )


@app.get("/health")
async def health_check():
    return {"message": "HRMS Lite API is running."}


app.include_router(employee_router, prefix="/api/v1")
app.include_router(attendance_router, prefix="/api/v1")