# News Portal – Backend (Spring Boot)

A RESTful API backend for the News Portal application built with **Spring Boot 3**, **PostgreSQL**, **Flyway** migrations, and **JWT** authentication.

---

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | Spring Boot 3.4 |
| Language | Java 21 |
| Database | PostgreSQL |
| ORM | Spring Data JPA / Hibernate |
| Migrations | Flyway |
| Auth | JWT (JJWT 0.12) |
| Validation | Jakarta Bean Validation |
| Build | Gradle |
| .env support | spring-dotenv |

---

## Prerequisites

- Java 21+
- Gradle 8+
- PostgreSQL (running locally or remote)

---

## Environment Setup

1. Copy `.env.example` to `.env` in the `backend/` directory:

```bash
cp .env.example .env
```

2. Edit `.env` with your PostgreSQL credentials:

```properties
DB_URL=jdbc:postgresql://localhost:5432/newsportal
DB_USERNAME=postgres
DB_PASSWORD=your_password

JWT_SECRET=a-very-long-random-string-at-least-64-characters-long
JWT_EXPIRATION_MS=86400000
```

3. Create the PostgreSQL database:

```sql
CREATE DATABASE newsportal;
```

> **Note:** `.env` is git-ignored. Never commit it with real credentials.

---

## Running the Application

```bash
cd backend
./gradlew bootRun
```

The server starts on **http://localhost:8080**.

On first startup, Flyway automatically runs all migrations (`V1` → `V4`) and the `DataSeeder` populates sample data:

| Username | Password | Role |
|---|---|---|
| admin | admin123 | Author |
| alice | alice123 | Author |
| bob | bob123 | Author |

---

## API Reference

### Authentication (public)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register new account → returns JWT |
| `POST` | `/auth/login` | Login → returns JWT |

**Request body for `/auth/login`:**
```json
{ "username": "alice", "password": "alice123" }
```
**Response:**
```json
{ "token": "<JWT>", "user": { "id": 2, "name": "Alice Smith", "username": "alice", "email": "alice@example.com" } }
```

### Users (public reads)

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/users` | No | List all users (no passwords) |
| `GET` | `/users/{id}` | No | Get user by ID |

### News (reads public, writes protected)

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/news` | No | List all news (newest first, with comments) |
| `GET` | `/news/{id}` | No | Get news by ID (with comments) |
| `POST` | `/news` | Yes | Create news article |
| `PATCH` | `/news/{id}` | Yes (owner) | Update title/body |
| `DELETE` | `/news/{id}` | Yes (owner) | Delete article + comments |
| `POST` | `/news/{id}/comments` | Yes | Add comment to article |

**Authorization header for protected routes:**
```
Authorization: Bearer <token>
```

---

## Project Structure

```
src/main/java/com/newsApp/
├── NewsAppApplication.java       ← Entry point
├── configuration/
│   └── DataSeeder.java           ← Seeds sample data on startup
├── controller/
│   ├── AuthController.java       ← POST /auth/register, /auth/login
│   ├── NewsController.java       ← /news CRUD + comments
│   └── UserController.java       ← GET /users
├── dto/                          ← Request/Response data objects
├── entity/
│   ├── User.java
│   ├── News.java
│   └── Comment.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── ForbiddenException.java
├── repository/                   ← Spring Data JPA interfaces
├── security/
│   ├── JwtUtil.java              ← Token generation & validation
│   ├── JwtAuthFilter.java        ← Per-request JWT validation filter
│   ├── SecurityConfig.java       ← Spring Security configuration
│   └── UserDetailsServiceImpl.java
└── service/
    ├── AuthService.java
    ├── NewsService.java
    └── UserService.java

src/main/resources/
├── application.properties        ← App config (references .env variables)
└── db/migration/
    ├── V1__create_users_table.sql
    ├── V2__create_news_table.sql
    ├── V3__create_comments_table.sql
    └── V4__seed_initial_data.sql  ← Schema seeding comment (data via DataSeeder)
```

---

## Key Design Decisions

- **Token-based auth**: JWT tokens are issued on login/register. Every protected request must include `Authorization: Bearer <token>`.
- **Migrations**: Flyway runs on startup, versioned SQL files ensure consistent schema.
- **ORM**: JPA entities with `@PrePersist`/`@PreUpdate` lifecycle hooks manage timestamps automatically.
- **.env usage**: All secrets (DB credentials, JWT secret) are in `.env`, referenced via `${VARIABLE}` in `application.properties`.
- **Seeders**: `DataSeeder.java` (ApplicationRunner) creates sample users, news, and comments on first run.
- **RESTful design**: Proper HTTP verbs, meaningful status codes (201 Created, 204 No Content, 404, 403, 422).
- **Request validation**: Jakarta `@Valid` annotations on all request bodies with descriptive error messages.
- **Separation of concerns**: Controller → Service → Repository layers. DTOs separate API shapes from entities.
