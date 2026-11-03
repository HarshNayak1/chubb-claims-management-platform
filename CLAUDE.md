# CLAUDE.md
# Chubb APAC Claims Management System

## 1. Project Overview

This project is a Chubb APAC Claims Management System MVP.

The application provides a centralized platform for managing insurance claims.

There are three user roles:

- USER
- EMPLOYEE
- MANAGER

### Business Workflows

**USER**
- Login to the application.
- Submit MOTOR and PROPERTY insurance claims.
- View their submitted claims.
- View claim details and current status.
- Logout.

**EMPLOYEE**
- View all submitted claims.
- Search and filter claims.
- View claim and claimant details.
- Update claim status.
- Add comments during status updates.
- View employee dashboard metrics.

**MANAGER**
- View all claims.
- View users and employees.
- View dashboard metrics.
- Manager role is read-only.

## 2. Technology Stack

### Backend
- Java 17
- Spring Boot 4.1.2
- Maven
- Spring Web
- Spring Data JPA
- Spring Security
- H2 Database
- BCrypt Password Encryption
- JWT Authentication
- Hibernate

### Frontend
- Angular 22
- TypeScript
- Angular Router
- Reactive Forms
- HttpClient
- HTML
- CSS

### Development Environment
- macOS
- IntelliJ IDEA
- Java 17
- Maven 3.x
- Node.js and npm
- Angular CLI

## 3. Project Structure

The application uses a single Git repository containing both backend and frontend applications.

```text
chubb-apac-claims-platform/
│
├── CLAUDE.md
├── README.md
│
├── backend/
│   ├── pom.xml
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── target/
│
└── frontend/
    ├── package.json
    ├── angular.json
    ├── src/
    └── node_modules/
```

Follow the existing package and folder structure. Do not rename existing packages or classes without a valid reason.

## 4. Backend Architecture

Follow a layered architecture:

- Controller: Handles HTTP requests and responses.
- Service: Contains business logic.
- Repository: Handles database operations.
- Entity: Represents database tables.
- DTO: Handles API request and response objects.
- Config: Contains application configurations.
- Security: Handles JWT authentication and authorization.
- Exception: Contains global exception handling.

Keep business logic inside service classes.

Use DTOs instead of exposing JPA entities directly through APIs.

Use proper validation and exception handling.

## 5. Database Configuration

Use H2 in-memory database for this MVP.

Database configuration:

```properties
spring.datasource.url=jdbc:h2:mem:chubb_claims_db
spring.datasource.username=sa
spring.datasource.password=
```

Connection pool: HikariCP.

Database tables:
- users
- claims
- claim_history

Use Spring Data JPA and Hibernate for database operations.

### Seed Data

The application should initialize sample data only when required.

Users:
- 10 users: user01@chubb.com to user10@chubb.com
- Password: User@123

Employees:
- 10 employees: employee01@chubb.com to employee10@chubb.com
- Password: Employee@123

Managers:
- 2 managers: manager01@chubb.com and manager02@chubb.com
- Password: Manager@123

Use BCrypt for password encryption.

Create at least 15 sample claims.

Avoid duplicate seed records when the application restarts.

IMPORTANT:
H2 is an in-memory database. Data is stored only while the Spring Boot application is running. Restarting the application resets the database and its sample data unless persistence is configured separately.

## 6. Database Entities

### User
- id
- fullName
- email
- password
- role
- active
- createdAt

### Claim
- id
- claimNumber
- user
- claimType
- incidentDate
- incidentLocation
- description
- estimatedLoss
- contactNumber
- status
- createdAt
- updatedAt

### ClaimHistory
- id
- claim
- previousStatus
- newStatus
- comment
- updatedBy
- createdAt

Use appropriate entity relationships and database constraints.

### Enums

Roles:
- USER
- EMPLOYEE
- MANAGER

Claim Types:
- MOTOR
- PROPERTY

Claim Statuses:
- SUBMITTED
- UNDER_REVIEW
- INFORMATION_REQUIRED
- APPROVED
- REJECTED
- SETTLED

## 7. REST API Requirements

### Authentication

POST /api/auth/login

### User APIs

POST /api/user/claims

GET /api/user/claims

GET /api/user/claims/{id}

### Employee APIs

GET /api/employee/claims

GET /api/employee/claims/{id}

PUT /api/employee/claims/{id}/status

GET /api/employee/dashboard

### Manager APIs

GET /api/manager/dashboard

GET /api/manager/claims

GET /api/manager/users

GET /api/manager/employees

Apply appropriate role-based authorization to every protected API.

## 8. Security Requirements

- Use Spring Security.
- Implement JWT-based authentication.
- Use BCrypt for password hashing.
- Protect APIs based on USER, EMPLOYEE and MANAGER roles.
- Do not expose passwords in API responses.
- Validate JWT tokens on protected requests.
- Prevent users from accessing claims belonging to other users.
- Managers should have read-only access.

All three roles should use the same login page.

After login, redirect users according to their roles.

## 9. Angular Development Guidelines

Use Angular 22 and follow the existing application structure.

Important: This project uses Angular 22 Zoneless change detection.

- Do not assume Zone.js is available.
- Use Angular signals for component state that changes asynchronously.
- Use signals for loading indicators, success messages, error messages and returned API data where appropriate.
- Ensure UI updates correctly after HTTP responses.
- Use ChangeDetectorRef.markForCheck() only where necessary; prefer Angular's native reactive mechanisms.
- Do not introduce Zone.js unless explicitly required and properly configured.

### Frontend Requirements

- Use reusable components.
- Keep API calls inside Angular services.
- Use Angular Router for navigation.
- Use Reactive Forms for form handling.
- Implement proper form validation.
- Display meaningful API error messages.
- Show loading indicators during API requests.
- Prevent duplicate form submissions.
- Maintain responsive layouts.
- Follow the existing navy, white and red UI theme.

## 10. Claim Submission: Important Troubleshooting Rules

Claim submission must be tested end to end.

Expected flow:

1. User fills in the claim form.
2. Angular validates the form.
3. Angular sends POST /api/user/claims.
4. Spring Boot validates the request.
5. Spring Security verifies the JWT and USER role.
6. ClaimService processes the request.
7. ClaimRepository saves the claim.
8. ClaimHistory is updated if required by the existing business logic.
9. Backend returns the created claim.
10. Angular displays the success message and generated claim number.

### Angular Loading State

The claim form must never remain stuck on "Submitting Claim...".

Implement loading state carefully:

- Set isSubmitting to true before the HTTP request.
- Set it to false when the request completes, whether successful or unsuccessful.
- Use RxJS finalize() where appropriate to reset the loading state.
- Use Angular signals for zoneless UI reactivity.
- Display success and error messages based on the actual API response.

Do not assume that a successful backend operation automatically means the Angular UI has updated.

### Backend Validation

Validate incidentDate correctly.

The application supports APAC users across different time zones.

- Use LocalDate for date-only fields.
- Avoid comparing date-only values against UTC timestamps.
- Ensure the validation does not incorrectly reject a valid incident date selected as today in an APAC time zone.
- Do not allow genuinely future incident dates.
- Keep validation consistent between frontend and backend.

Do not weaken validation unnecessarily to hide timezone-related issues.

### Error Handling

Display meaningful error messages for:

- Backend unavailable.
- HTTP 400 validation errors.
- HTTP 401 unauthorized requests.
- HTTP 403 forbidden requests.
- HTTP 404 claim not found.
- HTTP 500 server errors.

If Angular receives HTTP status 0, display a backend connectivity message, such as:

"Cannot connect to backend at http://localhost:8080. Please ensure the Spring Boot server is running."

Never display a success message unless the backend confirms successful claim creation.

## 11. Backend and Frontend Connectivity

Backend base URL:

http://localhost:8080

Frontend URL:

http://localhost:4200

Claim submission endpoint:

POST http://localhost:8080/api/user/claims

Authentication endpoint:

POST http://localhost:8080/api/auth/login

Ensure Angular HttpClient sends the JWT token in the Authorization header for protected requests.

Check CORS configuration if the frontend cannot communicate with the backend.

Do not assume database connectivity just because the Spring Boot application starts. Verify database initialization, repository operations and actual API responses.

## 12. Running the Application

### Backend - Option 1: Maven

```bash
cd backend
mvn clean spring-boot:run
```

### Backend - Option 2: Executable JAR

```bash
cd backend
mvn clean install
java -jar target/claimsmanagementapplication-0.0.1-SNAPSHOT.jar
```

### Frontend - Option 1: npm

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm start
```

### Frontend - Option 2: Angular CLI

Open a second terminal from the project root:

```bash
cd frontend
npm install
ng serve
```

Frontend URL:

http://localhost:4200

Backend URL:

http://localhost:8080

Keep both servers running while testing the application.

## 13. Testing Requirements

Before considering any feature complete, verify:

### Backend
- Maven build succeeds.
- Application starts successfully.
- H2 database connection is successful.
- Tables are created.
- Seed data is initialized.
- Login API returns the expected response.
- JWT authentication works.
- Role-based authorization works.
- Claim creation saves data successfully.
- Claim status updates are saved correctly.

### Frontend
- Angular build succeeds.
- Login works for all three roles.
- Correct role-based redirection works.
- Claim submission succeeds.
- Loading indicator disappears after API completion.
- Success and error messages display correctly.
- User can view submitted claims.
- Employee can update claim status.
- Manager dashboard displays correct metrics.

### End-to-End
Test the complete workflow:

USER LOGIN → SUBMIT CLAIM → DATABASE SAVE → EMPLOYEE REVIEW → STATUS UPDATE → MANAGER DASHBOARD

## 14. Development Rules for Claude

When modifying this project:

1. First inspect the existing implementation before making changes.
2. Understand the existing backend and frontend architecture.
3. Do not recreate files or classes that already exist.
4. Do not make assumptions about database connectivity without checking logs and API responses.
5. Do not claim that a bug is fixed without verifying the actual code and test results.
6. Prefer small, targeted changes over large refactoring.
7. Maintain compatibility with Java 17 and the existing Angular version.
8. Do not introduce unnecessary dependencies.
9. Do not introduce microservices, Kafka, Redis or Docker for this MVP.
10. Do not hardcode credentials, JWT secrets or sensitive configuration in production code.
11. Do not remove existing functionality while fixing another feature.
12. Update README.md whenever application setup or functionality changes.
13. Run relevant backend tests and frontend builds after modifications.
14. Clearly explain the root cause of bugs and the files changed.
15. Report which tests passed and which tests could not be executed.

IMPORTANT:
Never claim that the H2 database, backend API or frontend integration is working unless it has actually been verified.

The goal is to maintain a simple, functional and reliable Version 1 Claims Management System.