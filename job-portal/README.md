# HireLane – Job Portal (React + Spring Boot + MySQL)

Two workflows in one app:
- **Job seekers**: register, upload resume, search jobs (skill / location / salary / type), apply, track status.
- **Employers**: register, company profile, post / edit / close / delete jobs, dashboard to review applications, download resumes, update status.

```
job-portal/
├── backend/   Spring Boot 3 (Java 17) REST API  -> http://localhost:8080
│   └── src/main/java/com/jobportal/{entity,repository,security,service,controller}
└── frontend/  React 18 + Vite                  -> http://localhost:5173
```

## Prerequisites
Java 17+, Maven 3.8+, Node.js 18+, MySQL 8 (running on port 3306).

## 1. Database
Nothing to create manually: the `jobportal` database and all tables are created on first start.
Set your MySQL credentials in `backend/src/main/resources/application.properties`
(`spring.datasource.username` / `spring.datasource.password`, default root/root).

## 2. Run the backend
```
cd backend
mvn spring-boot:run
```
Wait for "Started JobPortalApplication". Uploaded resumes are stored in `backend/uploads/`.

## 3. Run the frontend (new terminal)
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173 (Vite proxies `/api` to the backend).

## Try it
1. Sign up as **I'm hiring** -> fill Company page -> Post a job.
2. Log out, sign up as **I'm looking for a job** -> upload resume in My applications -> search and apply.
3. Log back in as the employer -> Dashboard -> change the applicant's status; the seeker sees it update.

## API summary
| Method | Endpoint | Who |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | public |
| GET | /api/jobs?q&skill&location&type&minSalary, /api/jobs/{id} | public |
| GET/PUT | /api/company/me | employer |
| POST/PUT/DELETE | /api/jobs, /api/jobs/{id} ; GET /api/jobs/mine | employer |
| PUT/POST | /api/profile, /api/profile/resume | job seeker |
| POST | /api/jobs/{id}/apply ; GET /api/applications/mine | job seeker |
| GET | /api/applications/recruiter ; PUT /api/applications/{id}/status | employer |
| GET | /api/applications/{id}/resume | applicant or job owner |

Notes: passwords are BCrypt-hashed; sessions use a random bearer token stored per user; salaries are annual in ₹ (change the symbol in `frontend/src/util.js`).
