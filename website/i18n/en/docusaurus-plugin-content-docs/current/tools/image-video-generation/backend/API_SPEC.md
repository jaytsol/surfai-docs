# API Specification

> **Last Updated:** June 29, 2025
>
> This document details all endpoints, request/response formats, and authentication requirements of the SurfAI backend API.

---

## 1. Basic Information

-   **API Base URL (Production):** `https://api.surfai.org`
-   **API Base URL (Development):** `http://localhost:3000`
-   **Authentication Method:** All protected APIs are authenticated via JWT (Access Token) stored in **HttpOnly cookies**. For Swagger testing, you must enter the token in `Bearer <token>` format in the "Authorize" button.

---

## 2. Authentication (Authentication) API

> **Controller:** `AuthController`
> **Base Path:** `/auth`

### 2.1 General Registration
-   **Endpoint:** `POST /register`
-   **Description:** Creates a new user using email, password, and display name.
-   **Authentication:** Not required (Public)
-   **Request Body:** `CreateUserDTO`
-   **Successful Response (`201 Created`):** `UserResponseDTO`
-   **Error Responses:** `400 Bad Request`, `409 Conflict`

### 2.2 General Login
-   **Endpoint:** `POST /login`
-   **Description:** Authenticates a user with email and password, and sets Access Token and Refresh Token as HttpOnly cookies.
-   **Authentication:** Not required (Public)
-   **Request Body:** `LoginDTO`
-   **Successful Response (`200 OK`):** `LoginResponseDTO`
-   **Error Responses:** `401 Unauthorized`

### 2.3 Start Google Login
-   **Endpoint:** `GET /google`
-   **Description:** Redirects the user to Google's OAuth 2.0 authentication page.
-   **Successful Response (`302 Found`):** Redirects to Google login page.

### 2.4 Google Login Callback
-   **Endpoint:** `GET /google/callback`
-   **Description:** Callback URL called after successful Google authentication. Redirects to the frontend after login processing.
-   **Successful Response (`302 Found`):** Redirects to frontend page.

### 2.5 Access Token Reissue
-   **Endpoint:** `POST /refresh`
-   **Description:** Reissues an expired Access Token using a valid Refresh Token.
-   **Authentication:** Refresh Token required
-   **Successful Response (`200 OK`):** `{ "message": "Tokens refreshed successfully" }`

### 2.6 Retrieve My Information
-   **Endpoint:** `GET /profile`
-   **Description:** Retrieves detailed profile information of the currently logged-in user.
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
> **Authentication:** All APIs require **Access Token**.

### 3.1 Retrieve My Generation History List
-   **Endpoint:** `GET /`
-   **Query Parameters:** `page: number`, `limit: number`
-   **Successful Response (`200 OK`):** `PaginatedHistoryResponse`

### 3.2 Request View URL
-   **Endpoint:** `GET /:id/view-url`
-   **Description:** Requests a short-lived URL to display a specific output.
-   **Successful Response (`200 OK`):** `{ "viewUrl": "https://..." }`

### 3.3 Request Download URL
-   **Endpoint:** `GET /:id/download-url`
-   **Description:** Requests a short-lived URL to download a specific output.
-   **Successful Response (`200 OK`):** `{ "downloadUrl": "https://..." }`

### 3.4 Delete Generation History
-   **Endpoint:** `DELETE /:id`
-   **Description:** Deletes a specific generation record and its associated files.
-   **Successful Response (`204 No Content`):** No response body.

---

## 4. Admin - Workflow Template API

> **Controller:** `AdminWorkflowController`
> **Base Path:** `/workflow-templates`
> **Authentication:** All APIs require **Access Token** and **Admin Role**.

### 4.1 Retrieve Workflow Category List
-   **Endpoint:** `GET /categories`
-   **Description:** Retrieves a list of all available workflow categories for template creation.
-   **Successful Response (`200 OK`):** `string[]`

### 4.2 Retrieve Parameter Preset List
-   **Endpoint:** `GET /parameter-presets`
-   **Query Parameters:** `category: string` (optional)
-   **Successful Response (`200 OK`):** `ParameterPreset[]`

### 4.3 [Step 1] Create New Workflow Template (Skeleton)
-   **Endpoint:** `POST /`
-   **Description:** Creates a skeleton by saving the basic information of the template, excluding `parameter_map`.
-   **Request Body:** `CreateWorkflowTemplateDTO`
-   **Successful Response (`201 Created`):** `WorkflowTemplateResponseDTO`

### 4.4 [Step 2] Set Parameter Map
-   **Endpoint:** `PUT /:id/parameter-map`
-   **Description:** Sets (replaces entirely) the parameter map information for the created template.
-   **Request Body:** `Record<string, WorkflowParameterMappingItemDTO>`
-   **Successful Response (`200 OK`):** `WorkflowTemplateResponseDTO`

### 4.5 Update Full Workflow Template Information
-   **Endpoint:** `PATCH /:id`
-   **Description:** Updates all information of a specific template at once.
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

---

## 5. Coin (Coin) API

### 5.1 General User - Coin Deduction

> **Controller:** `CoinController`
> **Base Path:** `/coin`
> **Authentication:** Access Token required

-   **Endpoint:** `POST /deduct`
-   **Description:** Deducts coins from the logged-in user. Used when consuming services like image generation.
-   **Request Body:** `DeductCoinDto`
    ```json
    {
      "amount": 100, // Amount of coins to deduct
      "reason": "image_generation", // Reason for deduction (one of CoinTransactionReason enum values)
      "relatedEntityId": "uuid-of-generation-request" // (Optional) ID of related entity
    }
    ```
-   **Successful Response (`200 OK`):** `User` (updated user information)
-   **Error Responses:** `400 Bad Request` (validation failed), `402 Payment Required` (insufficient coin balance)

### 5.2 Admin - User Coin Management

> **Controller:** `AdminCoinController`
> **Base Path:** `/admin/coin`
> **Authentication:** Access Token and Admin role required

#### 5.2.1 Add User Coins
-   **Endpoint:** `POST /add/:userId`
-   **Description:** Adds coins to a specific user.
-   **Request Body:** `UpdateUserCoinDto`
    ```json
    {
      "amount": 100, // Amount of coins to add
      "reason": "admin_adjustment" // Reason for addition (one of CoinTransactionReason enum values)
    }
    ```
-   **Successful Response (`200 OK`):** `User` (updated user information)
-   **Error Responses:** `400 Bad Request` (validation failed), `404 Not Found` (user not found)

#### 5.2.2 Deduct User Coins
-   **Endpoint:** `POST /deduct/:userId`
-   **Description:** Deducts coins from a specific user.
-   **Request Body:** `UpdateUserCoinDto`
    ```json
    {
      "amount": 50, // Amount of coins to deduct
      "reason": "admin_adjustment" // Reason for deduction (one of CoinTransactionReason enum values)
    }
    ```
-   **Successful Response (`200 OK`):** `User` (updated user information)
-   **Error Responses:** `400 Bad Request` (validation failed), `402 Payment Required` (insufficient coin balance), `404 Not Found` (user not found)

---

## 6. LangChain (LLM) API

> **Controller:** `LangchainController`
> **Base Path:** `/langchain`
> **Authentication:** All APIs require **Access Token**.

### 6.1 AI Chat
-   **Endpoint:** `POST /chat`
-   **Description:** Forwards the prompt received from the user to the FastAPI server to get a response from the LLM.
-   **Authentication:** Access Token required (JwtAuthGuard)
-   **Request Body:** `CreateChatDto`
    ```json
    {
      "prompt": "Write a sentence about the future of AI poetry."
    }
    ```
-   **Successful Response (`200 OK`):** 
    ```json
    {
      "response": "AI poetry will evolve into a new art form, combining human creativity with the infinite possibilities of machines."
    }
    ```
-   **Error Responses:** `401 Unauthorized`
