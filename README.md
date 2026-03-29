# HRMS Lite

A lightweight full-stack Human Resource Management System built using
**React (Frontend)**, **FastAPI (Backend)**, and **MongoDB
(Database)**.\
The application enables a single admin to manage employees and track
daily attendance through a clean, responsive interface.

------------------------------------------------------------------------

## Project Overview

HRMS Lite focuses on two primary workflows:

### Employee Management

-   Add new employees with auto-generated IDs
-   View a list of all employees
-   Delete employees

### Attendance Management

-   Mark attendance (Present / Absent) per employee and date
-   View attendance records per employee
-   Get summarized attendance insights

The project is intentionally scoped to meet assignment requirements
while maintaining a **production-ready structure and clean
architecture**.

------------------------------------------------------------------------

## Tech Stack

### Frontend

-   React + TypeScript
-   Vite
-   Axios
-   React Hook Form
-   React Hot Toast

### Backend

-   FastAPI
-   Motor (Async MongoDB Driver)
-   Pydantic & Pydantic Settings
-   Uvicorn

### Database

-   MongoDB

------------------------------------------------------------------------


## Features Implemented

### Core Features

-   Employee creation with unique ID and email validation
-   Employee listing and deletion
-   Attendance marking (Present / Absent)
-   Attendance records per employee
-   Server-side validation (required fields, duplicates, email format)
-   Structured API responses with proper HTTP status codes
-   UI states handling:
    -   Loading
    -   Empty state
    -   Error state

### Additional Enhancements

-   Attendance summary cards
-   Backend summary endpoint (present/absent counts)
-   Optional attendance filtering using `date` query parameter

------------------------------------------------------------------------

## Running the Project Locally

### 1. Clone Repository

``` bash
git clone https://github.com/Adi9235/HRMS-Lite.git
cd hrms-lite
```

------------------------------------------------------------------------

### 2. Start Backend

#### Python Version used is Python 3.8.8

``` bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # Windows: copy .env.example .env
uvicorn app.main:app --reload
```

Backend URL: http://localhost:8000

------------------------------------------------------------------------

### 3. Start Frontend

``` bash
cd frontend
npm install
cp .env.example .env        # Windows: copy .env.example .env
npm run dev
```

Frontend URL: http://localhost:5173

------------------------------------------------------------------------

## Environment Configuration

### Backend `.env`

``` env
APP_NAME=HRMS Lite API
APP_ENV=development
APP_HOST=0.0.0.0
APP_PORT=8000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=hrms_lite
```

### Frontend `.env`

``` env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

------------------------------------------------------------------------

## API Endpoints

### Employee APIs

-   POST /api/v1/employees → Create employee
-   GET /api/v1/employees → List employees
-   DELETE /api/v1/employees/{employee_id} → Delete employee

### Attendance APIs

-   POST /api/v1/attendance → Mark attendance
-   GET /api/v1/attendance/{employee_id} → Get attendance records
-   GET /api/v1/attendance/{employee_id}?date=YYYY-MM-DD → Filter by
    date
-   GET /api/v1/attendance/summary/overview → Attendance summary

------------------------------------------------------------------------

## Assumptions & Limitations

-   No authentication (single admin use case)
-   One attendance record per employee per day
-   Deleting an employee removes related attendance data
-   Department field is free-text
-   MongoDB connection must be configured before deployment

------------------------------------------------------------------------

## Deployment 

### Frontend

-   Vercel

### Backend

-   Render

### Database

-   MongoDB Atlas

------------------------------------------------------------------------

## Why This is Production-Oriented

-   Clean layered architecture:
    -   Routes → Controllers → Services → DB
-   Scalable backend structure
-   Strong validation using Pydantic
-   Consistent API response patterns
-   Modular frontend with reusable components
-   Proper handling of UI states and API errors

------------------------------------------------------------------------

## License

MIT License
