# Components
🧩 Frontend Key Components Specification
Last Updated: June 29, 2025

This document describes the roles and structures of key `React` components, `Contexts`, and custom `Hooks` in the `comfy-surfai-frontend-next` project.

---

## 1. Global Contexts & Hooks

These are core elements that manage application-wide state and logic.

### a. `AuthContext.tsx`

-   **Location:** `src/contexts/AuthContext.tsx`
-   **Role:** An **"Authentication State Manager"** that globally manages the user's authentication status (login status, user information) and provides related functions (login, logout).
-   **Key Provided Values (`value`):**
    -   `user: User | null`: User information object for the currently logged-in user. `null` if not logged in.
    -   `isLoading: boolean`: Becomes `true` while checking authentication status during app startup or login/logout.
    -   `login(credentials)`: Function to handle standard email/password login.
    -   `logout()`: Function to log out the user and delete related cookies.
    -   `fetchUserProfile()`: Function to request profile information from the server and update the `user` state.

### b. `useComfyWebSocket.ts`

-   **Location:** `src/hooks/useComfyWebSocket.ts`
-   **Role:** A **"Real-time Communication Manager"** that communicates in real-time with the backend's `WebSocket` server, receives all events occurring during AI generation, and manages related states.
-   **Key Return Values:**
    -   `isWsConnected: boolean`: `WebSocket` connection status.
    -   `executionStatus: string | null`: Current task status text, such as "Generating...", "Final result received!".
    -   `progressValue: { value, max } | null`: Progress of nodes like `KSampler`.
    -   `sessionOutputs: HistoryItemData[]`: List of generated results during the current session on the `Generate` page. (Maintains up to 20 items)

### c. `apiClient.ts`

-   **Location:** `src/lib/apiClient.ts`
-   **Role:** A **"Central Communication Gateway"** responsible for all `HTTP` communication with the backend API.
-   **Key Features:**
    -   **Automatic Token Re-issuance:** If an Access Token expires and a `401` error is received during an API request, it automatically reissues a new token using the Refresh Token and retries the original failed request.
    -   **Automatic CSRF Header Addition:** When making state-changing requests (e.g., `POST`, `PUT`, `DELETE`), it reads the `XSRF-TOKEN` cookie value and automatically adds the `X-XSRF-TOKEN` header to defend against CSRF attacks.
    -   **Automatic Cookie Sending:** The `credentials: 'include'` option ensures that the browser automatically includes authentication-related `HttpOnly` cookies with all requests.

---

## 2. Page Components

Located within the `src/app/` directory, these are "smart" components that serve as entry points for each route.

### a. `generate/page.tsx`

-   **Role:** Main page for AI image/video generation.
-   **Key Logic:**
    -   Manages real-time status using the `useComfyWebSocket` hook.
    -   Fetches workflow template list via API and passes it to `TemplateForm`.
    -   Calls the generation API (`POST /api/generate`) with parameters received from `TemplateForm`.
    -   Displays generated results for the current session via `SessionGallery`.
    -   Manages the open/closed state of `ImageLightbox`.

### b. `history/page.tsx`

-   **Role:** "My Album" page that permanently displays all generated results by the user.
-   **Key Logic:**
    -   Fetches a list of user's generation records by calling the backend's `/my-outputs` API.
    -   Implements pagination (infinite scroll) functionality via a "Load More" button.
    -   Reuses `HistoryGallery` and `GeneratedItem` components to display results.
    -   Manages the open/closed state of `ImageLightbox`.

### c. `admin/workflows/new/page.tsx` and `admin/workflows/[id]/edit/page.tsx`

-   **Role:** Admin page for creating and modifying workflow templates.
-   **Key Logic:**
    -   Includes access control logic that checks the user's `role` via `useAuth` upon page access and redirects immediately if not `admin`.
    -   **Reuses the `ParameterMappingForm` component** to render the parameter settings UI.
    -   **Creation Page:** Manages a two-step flow (basic information input -> parameter mapping) and calls appropriate APIs (`POST /workflow-templates`, `PUT /.../parameter-map`) for each step.
    -   **Edit Page:** Upon page load, fetches existing template data to populate all forms, and calls `PATCH /workflow-templates/:id` API to update all changes at once when 'Save' is clicked.

---

## 3. Reusable Components

Located in the `src/components/` directory, these are "dumb" components responsible for specific UI fragments or functionalities.

### a. `ParameterMappingForm.tsx`

-   **Location:** `src/components/admin/ParameterMappingForm.tsx`
-   **Role:** A **"Parameter Mapping Specialist Component"** responsible for the entire complex and dynamic form UI used to create and modify the `parameter_map` of workflow templates.
-   **Reusability:**
    -   **Creation Page (`new/page.tsx`):** Used in the second step. Receives `onSave` and `onBack` functions to perform its own save/cancel logic via internal buttons.
    -   **Edit Page (`edit/page.tsx`):** Included as part of the page. Renders without `onSave` and `onBack`, only responsible for displaying and modifying data. Final saving is handled by the main 'Save' button on the edit page.
-   **Key Features:**
    -   **Category-based Logic:** Calls API based on the `category` prop to fetch relevant parameter preset lists.
    -   **Automatic Required Parameter Addition:** In `new` page mode, automatically adds required parameters corresponding to the category to the list.
    -   **Intelligent UI:**
        -   Displays detailed information (`inputs`, `class_type`) of a node when selected.
        -   Allows auto-completion of `input_name` with a single click.
        -   Parameters added from presets have their `key` and `type` locked to prevent errors.
        -   Required parameters are disabled to prevent deletion.
        -   Already added presets are disabled in the 'Add Parameter' dropdown.
    -   **State Management:** Directly receives `parameterMap` state and `setParameterMap` function as props, directly controlling the parent component's (page's) state.

### b. `GeneratedItem.tsx`

-   **Role:** Renders a single generated output card displayed in the gallery. Reused in both `SessionGallery` and `HistoryGallery`.
-   **Key Features:**
    -   Draws UI based on `item` data (`HistoryItemData`) received as a prop.
    -   Conditionally renders an image (`<img>`) or video (`<video>`) based on `item.mimeType`.
    -   Analyzes `item.usedParameters` to calculate and display video playback duration.
    -   Determines file expiration based on `item.createdAt` and displays an alternative UI if expired.
    -   Includes zoom/download/delete buttons, and calls handler functions (`onImageClick`, `onDelete`) received from the parent when clicked.

### c. `ImageLightbox.tsx`

-   **Role:** A modal that covers the entire screen, displaying a zoomed-in image and detailed metadata when a user clicks an image in the gallery.
-   **Key Features:**
    -   Renders based on the `item` object (`HistoryItemData | null`) received as a prop. Hidden if `item` is `null`.
    -   Displays media (image/video) largely on the left using `item.viewUrl`.
    -   Displays detailed metadata such as `item.usedParameters`, `item.createdAt` in a scrollable area on the right.
    -   Calls the `onClose` handler when the outer background or 'X' button is clicked to close it.