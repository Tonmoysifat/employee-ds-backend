📅 Employee Daily Scheduler – Backend

Backend service for managing employees, shifts, and schedules.
Built with Node.js (Express + TypeScript) and MongoDB (Mongoose).

🚀 Features

1) Employees with roles, skills, availability.

2) Shifts with role/skill/location requirements.

3) Time-off requests & approvals.

4) JWT authentication + role-based authorization.

5) Input validation with zod + typed errors.

6) Aggregation pipelines for analytics:

7) Daily schedule per location

8) Coverage gaps vs. assignments

9) Employee workload

10) Conflicts (double bookings, overlaps, time-off clashes)

11) Seed script with realistic + edge case data.

📦 Setup
1. Clone & install
git clone https://github.com/Tonmoysifat/employee-ds-backend
cd employee-ds-backend
npm install

2. Environment

add a .env at the root folder and configure:

i) DATABASE_URL=""

ii) JWT_SECRET=""
iii) EXPIRES_IN="
iv) PORT =

3. Run database seeding

Populate MongoDB with sample employees, shifts, and time-off requests:

  npm run seed

4. Start server
npm run dev    # development with hot reload
npm run build  # compile TypeScript
npm start      # run compiled code


Server will be running at:

http://localhost:PORT

📚 API Overview
Auth

POST baseUrl/api/v1/auth/register → Register employee

POST baseUrl/api/v1/auth/login → Login (get JWT)

Employees

POST  baseUrl/api/v1/employee/create-employee → Create employee
PUT    baseUrl/api/v1/employee/update-employee/:employeeId   → Update employee
GET    baseUrl/api/v1/employee/get-employees-list            → Get list of employees
GET    baseUrl/api/v1/employee/get-single-employee/:employeeId → Get single employee
DELETE baseUrl/api/v1/employee/delete-employee/:employeeId → Delete employee

Shifts

POST    baseUrl/api/v1/shift/create-shift      → Create shift
PUT     baseUrl/api/v1/shift/update-shift      → Update shift
POST    baseUrl/api/v1/shift/assign-shift/:id → Assign shift
GET     baseUrl/api/v1/shift/list-shift        → List all shifts
GET     baseUrl/api/v1/shift/get-shift/:id     → Get single shift
DELETE  baseUrl/api/v1/shift/delete-shift/:id → Delete shift

Time-off

POST    baseUrl/api/v1/timeOffRequest/create-time-off-request           → Create time off request
PUT     baseUrl/api/v1/timeOffRequest/approve-or-reject-time-off-request/:id → Approve or reject time off request
GET     baseUrl/api/v1/timeOffRequest/get-list-of-time-off-requests      → Get list of time off requests
GET     baseUrl/api/v1/timeOffRequest/get-of-time-off-request-by-id/:id  → Get single time off request by ID


Schedule
GET     baseUrl/api/v1/schedule/get-daily-schedule

Analytics
GET     baseUrl/api/v1/analytic/get-coverage               → Get coverage
GET     baseUrl/api/v1/analytic/get-workload               → Get workload
GET     baseUrl/api/v1/analytic/get-conflicts-coverage     → Get conflicts and hourly coverage


📊 Data Model
Employee
{
  name: string
  email: string (unique)
  password: string (hashed)
  role: "NURSE" | "DOCTOR" | "MANAGER" | "CASHIER" | "SECURITY"
  skills: string[]
  location: string
  availability: [{ dayOfWeek: number, start: string, end: string }]
  isActive: boolean
}

Shift
{
  date: Date
  start: "HH:mm"
  end: "HH:mm"
  roleRequired: string
  skillRequired?: string
  location: string
  assignedEmployee?: ObjectId | null
}

TimeOffRequest
{
  employee: ObjectId
  startDate: Date
  endDate: Date
  reason?: string
  status: "PENDING" | "APPROVED" | "REJECTED"
}

ShiftTemplate (optional)

Recurring shift pattern (weekly/biweekly/monthly).

📌 Index Strategy

Employee.email → unique index (fast login lookup).

Employee.role + location → compound index (for filtering teams).

Shift.date + location → compound index (fetch daily schedules).

Shift.assignedEmployee → index (analytics queries).

TimeOffRequest.employeeId + startDate + endDate → compound (detect conflicts).

⚠️ Conflict Rules

Double booking: Same employee assigned to overlapping shifts.

Overlap: Shifts that share time range for same role/location.

Time-off clash: Employee assigned during approved leave.

Availability violation: Employee shift outside declared availability.

Overnight shift: Shifts crossing midnight need special handling.

📈 Coverage Logic

Required count: Number of shifts for a role/location/date.

Assigned count: Shifts that have employees assigned.

Gap: requiredCount - assignedCount.

Per-hour rollups: Bucket shifts into hour blocks → compute coverage/utilization.

✅ With this, anyone can clone, seed, run, and test the backend.