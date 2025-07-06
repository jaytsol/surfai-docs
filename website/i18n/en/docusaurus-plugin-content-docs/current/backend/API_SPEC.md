# 📡 Backend API Specification

> **Last Updated:** June 29, 2025
>
> This document details all endpoints, request/response formats, and authentication requirements for the SurfAI backend API.

---

## 1. General Information

-   **API Base URL (Production):** `https://api.surfai.org`
-   **API Base URL (Development):** `http://localhost:3000`
-   **Authentication Method:** All protected APIs are authenticated via JWT (Access Token) contained in **HttpOnly cookies**. When testing with Swagger, tokens must be entered in `Bearer <token>` format in the "Authorize" button.

---

## 2. Authentication API

> **Controller:** `AuthController`
> **Base Path:** `/auth`

### 2.1 Standard User Registration
-   **Endpoint:** `POST /register`
-   **Description:** Creates a new user using email, password, and display name.
-   **Authentication:** Not required (Public)
-   **Request Body:** `CreateUserDTO`
-   **Successful Response (`201 Created`):** `UserResponseDTO`
-   **Error Responses:** `400 Bad Request`, `409 Conflict`

### 2.2 Standard Login
-   **Endpoint:** `POST /login`
-   **Description:** Authenticates a user with email and password, and sets Access Token and Refresh Token as HttpOnly cookies.
-   **Authentication:** Not required (Public)
-   **Request Body:** `LoginDTO`
-   **Successful Response (`200 OK`):** `LoginResponseDTO`
-   **Error Responses:** `401 Unauthorized`

### 2.3 Initiate Google Login
-   **Endpoint:** `GET /google`
-   **Description:** Redirects the user to Google's OAuth 2.0 authentication page.
-   **Successful Response (`302 Found`):** Redirects to Google login page.

### 2.4 Google Login Callback
-   **Endpoint:** `GET /google/callback`
-   **Description:** Callback URL invoked after successful Google authentication. Redirects to the frontend after login processing.
-   **Successful Response (`302 Found`):** Redirects to frontend page.

### 2.5 Reissue Access Token
-   **Endpoint:** `POST /refresh`
-   **Description:** Reissues an expired Access Token using a valid Refresh Token.
-   **Authentication:** Refresh Token required
-   **Successful Response (`200 OK`):** `{ "message": "Tokens refreshed successfully" }`

### 2.6 View My Profile
-   **Endpoint:** `GET /profile`
-   **Description:** Views detailed profile information of the currently logged-in user.
-   **Authentication:** Access Token required
-   **Successful Response (`200 OK`):** `UserResponseDTO`

### 2.7 Logout
-   **Endpoint:** `POST /logout`
-   **Description:** Invalidates the user's Refresh Token and deletes cookies.
-   **Authentication:** Access Token required
-   **Successful Response (`204 No Content`):** No response body.

---

## 3. Generated Output (History) API

> **Controller:** `GeneratedOutputController`
> **Base Path:** `/my-outputs`
> **Authentication:** All APIs require an **Access Token**.

### 3.1 Retrieve List of My Generation Records
-   **Endpoint:** `GET /`
-   **Query Parameters:** `page: number`, `limit: number`
-   **Successful Response (`200 OK`):** `PaginatedHistoryResponse`

### 3.2 Request URL for Display
-   **Endpoint:** `GET /:id/view-url`
-   **Description:** Requests a short-term valid URL to display a specific generated output.
-   **Successful Response (`200 OK`):** `{ "viewUrl": "https://..." }`

### 3.3 Request URL for Download
-   **Endpoint:** `GET /:id/download-url`
-   **Description:** Requests a short-term valid URL to download a specific generated output.
-   **Successful Response (`200 OK`):** `{ "downloadUrl": "https://..." }`

### 3.4 Delete Generation Record
-   **Endpoint:** `DELETE /:id`
-   **Description:** Deletes a specific generation record and its associated files.
-   **Successful Response (`204 No Content`):** No response body.

---

## 4. Admin - Workflow Template API

> **Controller:** `AdminWorkflowController`
> **Base Path:** `/workflow-templates`
> **Authentication:** All APIs require an **Access Token** and **Admin role**.

### 4.1 Retrieve Workflow Category List
-   **Endpoint:** `GET /categories`
-   **Description:** Retrieves a list of all workflow categories available for template creation.
-   **Successful Response (`200 OK`):** `string[]`

### 4.2 Retrieve Parameter Preset List
-   **Endpoint:** `GET /parameter-presets`
-   **Query Parameters:** `category: string` (optional)
-   **Successful Response (`200 OK`):** `ParameterPreset[]`

### 4.3 [Step 1] Create New Workflow Template (Skeleton)
-   **Endpoint:** `POST /`
-   **Description:** Saves basic template information excluding `parameter_map` to create a skeleton.
-   **Request Body:** `CreateWorkflowTemplateDTO`
-   **Successful Response (`201 Created`):** `WorkflowTemplateResponseDTO`

### 4.4 [Step 2] Set Parameter Map
-   **Endpoint:** `PUT /:id/parameter-map`
-   **Description:** Sets (replaces entirely) the parameter map information for the created template.
-   **Request Body:** `Record<string, WorkflowParameterMappingItemDTO>`
-   **Successful Response (`200 OK`):** `WorkflowTemplateResponseDTO`

### 4.5 Modify Full Workflow Template Information
-   **Endpoint:** `PATCH /:id`
-   **Description:** Modifies all information of a specific template at once.
-   **Request Body:** `Partial<CreateWorkflowTemplateDTO & { parameter_map: ... }>`
-   **Successful Response (`200 OK`):** `WorkflowTemplateResponseDTO`

### 4.6 Retrieve Workflow Template List
-   **Endpoint:** `GET /`
-   **Successful Response (`200 OK`):** `WorkflowTemplateResponseDTO[]`

### 4.7 Retrieve Specific Workflow Template Details
-   **Endpoint:** `GET /:id`
-   **Successful Response (`200 OK`):** `WorkflowTemplateResponseDTO`

### 4.8 Delete Workflow Template
-   **Endpoint:** `DELETE /:id`
-   **Successful Response (`204 No Content`):** No response body.