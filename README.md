# Chubb Claims Management System – Version 1.0 MVP

An enterprise insurance claims management application inspired by **Chubb APAC**. Built with **Java 17 / Spring Boot** and **Angular (TypeScript)**, featuring role-based access control, reactive claim filing, assessor adjudication workflows, and executive portfolio dashboards.

---

## 1. System Architecture & Tech Stack

### Backend
- **Language / Runtime:** Java 17
- **Framework:** Spring Boot 4.1.2 (Spring Web, Spring Data JPA, Spring Security)
- **Database:** H2 In-Memory Relational Database (`jdbc:h2:mem:chubb_claims_db`)
- **Authentication & Security:** JWT (JSON Web Tokens) with BCrypt password hashing & stateless session management
- **Architecture:** Layered (`controller`, `service`, `repository`, `entity`, `dto`, `security`, `exception`, `config`, `enums`)
- **Build Tool:** Apache Maven

### Frontend
- **Framework:** Angular 22 (Standalone Components architecture)
- **Routing & State:** Angular Router with Role-Based Route Guards (`authGuard`)
- **Forms:** Reactive Forms (`FormBuilder`, `FormGroup`, robust client-side validation)
- **HTTP Client:** Angular `HttpClient` with functional HTTP Interceptor (`authInterceptor`)
- **Design System:** Chubb Enterprise theme (Deep Navy `#002B49`, crisp white, restrained red accents `#c8102e`, accessible status badges)

---

## 2. Default Seeded Development Accounts

All accounts are automatically seeded into the database on application startup if they do not already exist (no duplicate records on restarts).

### User / Policyholder Accounts (10 Users)
| Email |  Role | Permissions |
|---|---|---|
| `user01@chubb.com` |  `USER` | File claims, view personal claims, track claim audit history |
| `user02@chubb.com` |  `USER` | File claims, view personal claims, track claim audit history |
| `user03@chubb.com` |  `USER` | File claims, view personal claims, track claim audit history |
| `user04@chubb.com` |  `USER` | File claims, view personal claims, track claim audit history |
| `user05@chubb.com` |  `USER` | File claims, view personal claims, track claim audit history |
| `user06@chubb.com` |  `USER` | File claims, view personal claims, track claim audit history |
| `user07@chubb.com` |  `USER` | File claims, view personal claims, track claim audit history |
| `user08@chubb.com` |  `USER` | File claims, view personal claims, track claim audit history |
| `user09@chubb.com` |  `USER` | File claims, view personal claims, track claim audit history |
| `user10@chubb.com` |  `USER` | File claims, view personal claims, track claim audit history |

### Claims Assessor / Employee Accounts (10 Employees)
| Email |  Role | Permissions |
|---|---|---|
| `employee01@chubb.com` |  `EMPLOYEE` | View claims queue, search, filter, update status with audit log |
| `employee02@chubb.com` |  `EMPLOYEE` | View claims queue, search, filter, update status with audit log |
| `employee03@chubb.com` |  `EMPLOYEE` | View claims queue, search, filter, update status with audit log |
| `employee04@chubb.com` |  `EMPLOYEE` | View claims queue, search, filter, update status with audit log |
| `employee05@chubb.com` |  `EMPLOYEE` | View claims queue, search, filter, update status with audit log |
| `employee06@chubb.com` |  `EMPLOYEE` | View claims queue, search, filter, update status with audit log |
| `employee07@chubb.com` |  `EMPLOYEE` | View claims queue, search, filter, update status with audit log |
| `employee08@chubb.com` |  `EMPLOYEE` | View claims queue, search, filter, update status with audit log |
| `employee09@chubb.com` |  `EMPLOYEE` | View claims queue, search, filter, update status with audit log |
| `employee10@chubb.com` |  `EMPLOYEE` | View claims queue, search, filter, update status with audit log |

### Executive / Manager Accounts (2 Managers)
| Email | Role | Permissions |
|---|---|---|
| `manager01@chubb.com` |  `MANAGER` | Real database metrics dashboard, view all claims, view users & employees (read-only) |
| `manager02@chubb.com` |  `MANAGER` | Real database metrics dashboard, view all claims, view users & employees (read-only) |

> **Convenience Feature:** The login screen contains 1-click **Fast Test Credentials** buttons to instantly fill User, Employee, or Manager credentials.

---

## 3. Project Setup & Startup Commands

### Prerequisites
- **JDK 17** installed (`java -version`)
- **Node.js** (v18+) and npm (`npm -v`)

## How to Run the Application

### Step 1: Start Backend (Spring Boot)

Open a terminal in the project root directory.

**Option 1: Run directly using Maven**

```bash
cd backend
mvn clean spring-boot:run
```

**Option 2: Build and run using the executable JAR**

```bash
cd backend
mvn clean install
java -jar target/claimsmanagementapplication-0.0.1-SNAPSHOT.jar
```

The Spring Boot server will start at **http://localhost:8080** and initialize the H2 in-memory database.

### Step 2: Start Frontend (Angular)

Open a **second terminal** in the project root directory.

**Option 1: Run using npm**

```bash
cd frontend
npm install
npm start
```

**Option 2: Run using Angular CLI**

```bash
cd frontend
npm install
ng serve
```

The Angular development server will start at **http://localhost:4200**.

### Step 3: Access the Application

Open your browser and navigate to:

**http://localhost:4200**

**Note:**
- Keep both backend and frontend terminals running while using the application.
- If you are already inside the `backend` directory and want to start the frontend in the same terminal, run `cd ..` first, followed by `cd frontend`.
- Run `npm install` only the first time or whenever dependencies change.

### Accessing the Web Application
Open your browser and navigate to:
```
http://localhost:4200
```

---

## 4. Database Console & Management

### H2 Database Web Console
- **URL:** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- **JDBC URL:** `jdbc:h2:mem:chubb_claims_db`
- **Driver Class:** `org.h2.Driver`
- **Username:** `sa`
- **Password:** *(empty)*

---

## 5. REST API Endpoints Specification

### Authentication API
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user and return JWT token with profile details | Public |

### Policyholder / User APIs (`ROLE_USER`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/user/claims` | File a new claim (generates `CHB-YYYY-NNNNNN`) | `ROLE_USER` |
| `GET` | `/api/user/claims` | View all claims filed by the authenticated user only | `ROLE_USER` |
| `GET` | `/api/user/claims/{id}` | View claim details and complete audit timeline | `ROLE_USER` |
| `GET` | `/api/user/dashboard` | Get personal claim metrics (total, pending, approved, settled) | `ROLE_USER` |

### Claims Assessor / Employee APIs (`ROLE_EMPLOYEE`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/employee/dashboard` | Get assessor queue statistics (submitted, under review, etc.) | `ROLE_EMPLOYEE` |
| `GET` | `/api/employee/claims` | View all claims with query (`query=...`) and status (`status=...`) | `ROLE_EMPLOYEE` |
| `GET` | `/api/employee/claims/{id}` | View claim and claimant information | `ROLE_EMPLOYEE` |
| `PUT` | `/api/employee/claims/{id}/status` | Adjudicate claim status with comment, recording Employee ID & date | `ROLE_EMPLOYEE` |

### Executive / Manager APIs (`ROLE_MANAGER`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/manager/dashboard` | Real database metrics (total claims, pending, approved, rejected, settled, loss sum) | `ROLE_MANAGER` |
| `GET` | `/api/manager/claims` | View complete portfolio of claims | `ROLE_MANAGER` |
| `GET` | `/api/manager/claims/{id}` | View claim breakdown and historical audit records | `ROLE_MANAGER` |
| `GET` | `/api/manager/users` | Read-only list of all registered policyholders (passwords excluded) | `ROLE_MANAGER` |
| `GET` | `/api/manager/employees` | Read-only list of all claims assessors (passwords excluded) | `ROLE_MANAGER` |

---

## 6. Seeded Sample Data (16 Claims)

On initial startup, 16 realistic Chubb APAC insurance claims are seeded across APAC geographies (Singapore, Sydney, Hong Kong, Auckland, Melbourne, Tokyo, Brisbane, Perth):
- **Motor Insurance Claims:** Collisions, windshield hail damage, parked vandalism, rear-end panel impact.
- **Property Insurance Claims:** Water pipe bursts, roof storm ingress, sprinkler water damage, seismic tremors.
- **Statuses Represented:**
  - `SUBMITTED`
  - `UNDER_REVIEW`
  - `INFORMATION_REQUIRED`
  - `APPROVED`
  - `REJECTED`
  - `SETTLED`
- **Audit Histories:** Every claim has historical audit entries with timestamps, previous status, new status, employee assessor ID, and audit justifications.

---

## 7. Security & Compliance Highlights
1. **Never Expose Passwords:** User DTOs strictly exclude password hashes.
2. **Double-Layer Authorization:** Protected by both Angular Route Guards (`authGuard`) and Spring Security Method / URL Authorization (`@PreAuthorize` & `SecurityFilterChain`).
3. **Data Isolation:** Users are strictly forbidden from viewing claims belonging to other policyholders.
4. **Permanent Audit Trail:** Status changes create immutable `ClaimHistory` entries tracking reviewer name, employee ID, previous status, and mandatory review notes.
