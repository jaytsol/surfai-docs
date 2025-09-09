# Architecture and Folder Structure
Last Updated: June 29, 2025

This document explains the technology stack, architectural principles, main folder structure, and execution methods of the `comfy-surfai-backend` repository.

---

## 1. Tech Stack

-   **Framework:** `NestJS` (`@nestjs/core`)
-   **Database:** `PostgreSQL`
-   **ORM:** `TypeORM` (`@nestjs/typeorm`, `typeorm`, `pg`)
-   **Authentication:**
    -   **Strategy:** `Passport.js` (`@nestjs/passport`, `passport`)
    -   **JWT:** `JSON Web Token` (`@nestjs/jwt`, `passport-jwt`)
    -   **Google OAuth 2.0:** `passport-google-oauth20`
    -   **Local (Email/Password):** `passport-local`
-   **Real-time Communication:** `WebSocket` (`@nestjs/platform-ws`, `ws`)
-   **Security:**
    -   **Password Hashing:** `bcrypt`
    -   **CSRF Defense:** `csurf`
    -   **Cookie Parsing:** `cookie-parser`
-   **Validation:** `class-validator`, `class-transformer`
-   **API Documentation:** `Swagger` (`@nestjs/swagger`)

---

## 2. Architectural Principles

The backend follows a **module-based Layered Architecture**.

-   **Modularity:** Composed of independent modules like `AuthModule`, `WorkflowModule`, etc., to clearly separate responsibilities by function. Each module has its own `Controller`, `Service`, and `Provider`.
-   **Layer Separation:**
    -   **Controller:** Only receives `HTTP` requests, validates them, and calls appropriate service methods. Does not contain business logic.
    -   **Service:** Handles core business logic. Actual operations such as communicating with the database or calling other services occur here.
    -   **Repository/Entity:** Abstracts interaction with the database. `TypeORM` handles this role.
-   **Dependency Injection (DI):** All dependencies are managed through constructor injection, reducing coupling between components and improving testability.

---

## 3. Main Folder Structure

```
/src
├── 📁 admin/              # Admin-specific feature modules
│   └── 📁 workflow/
├── 📁 auth/               # Authentication/Authorization (login, guards, strategies) related modules
│   ├── 📁 guards/
│   └── 📁 strategies/
├── 📁 comfyui/            # Module responsible for communication with ComfyUI compute server
├── 📁 langchain/           # Module responsible for communication with LangChain server
├── 📁 common/             # Elements commonly used across multiple modules
│   ├── 📁 decorators/
│   ├── 📁 dto/            # Data Transfer Objects
│   ├── 📁 entities/       # TypeORM entities mapped to database tables
│   ├── 📁 enums/
│   ├── 📁 events/         # WebSocket Gateway
│   └── 📁 interfaces/     # Interfaces for type definitions
├── 📁 generated-output/   # Module for managing generated results (history)
├── 📁 storage/            # Module for integrating with file storage (Cloudflare R2)
├── 📁 workflow/           # Module for managing workflow templates
│
└── 📄 main.ts             # Application entry point (middleware, pipes, etc. configuration)
```

---

## 4. How to Run and Test

### Running in Development Environment

1.  Install and run `PostgreSQL` database locally.
2.  Create a `.env.development` file in the project root and configure necessary environment variables (DB info, JWT secrets, etc.).
3.  Install all dependencies with `npm install`.
4.  Run the development server with `npm run start:dev`. The server will run on `http://localhost:3000`.

### Running Unit/Integration Tests

-   Run all tests written in the project.
    ```bash
    npm test
    ```

---

## 5. Key Environment Variables

The following variables are required in the `.env` file or production environment to run the application.

-   **`NODE_ENV`**: `development` or `production`
-   **`PORT`**: Server port (default: `3000`)
-   **Database:** `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` or `DATABASE_URL`
-   **Authentication:** `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRATION_TIME`
-   **Google OAuth:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
-   **Service URLs:** `API_BASE_URL` (backend's own address), `FRONTEND_URL` (frontend address), `ROOT_DOMAIN` (common domain for production)
-   **Compute Server:** `COMFYUI_HOST`, `NGINX_USERNAME`, `NGINX_PASSWORD`
-   **File Storage:** `R2_ACCOUNT_ID`, `R2_BUCKET_NAME`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
-   **Admin:** `ADMIN_EMAILS`
