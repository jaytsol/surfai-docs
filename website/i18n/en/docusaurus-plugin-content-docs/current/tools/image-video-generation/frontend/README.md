# Frontend

> Last Updated: June 29, 2025

This document describes the technology stack, architectural principles, key folder structure, and execution methods of the `comfy-surfai-frontend-next` repository.

---

## 1. Tech Stack

-   **Framework:** Next.js (App Router)
-   **UI Library:** React, TypeScript
-   **Styling:** Tailwind CSS
-   **UI Components:** shadcn/ui (based on Radix UI)
-   **Icons:** `lucide-react`
-   **API Communication:** Custom `apiClient` based on `fetch` API
-   **Code Quality:** ESLint, Prettier

## 2. Architectural Principles

The frontend aims for clear separation of roles and responsibilities, centered around a **Component-Based Architecture**.

-   **Component Layering:**
    -   **Page:** `page.tsx` files within the `app/` folder. Acts as a container responsible for "smart" logic such as data loading and state management.
    -   **Compound Component:** Located in `components/common/` or `components/feature/`, combining multiple UI elements to perform specific functions. (e.g., `SessionGallery`)
    -   **Atomic Component:** Located in `components/ui/`, these are the most basic and reusable UI units like `Button`, `Input`. (Mainly created with `shadcn/ui`)

-   **State Management:**
    -   **Global State:** States that need to be shared across multiple pages, such as user authentication information and coin balance, are managed via React Context API (`AuthContext`).
    -   **Local State:** States used only within a specific page or component are managed using the `useState` hook.

-   **Data Communication:**
    -   All backend API requests are made through `lib/apiClient.ts`. This file handles common logic such as request header settings, error handling, and **automatic reissuance of Access Tokens upon expiration** centrally.

## 3. Key Folder Structure

/src
├── 📁 app/                 # Folder for routing (App Router)
│   ├── 📁 (auth)/            # Authentication-related page group (no layout impact)
│   │   ├── 📁 callback/
│   │   └── 📁 login/
│   ├── 📁 admin/              # Admin-only pages
│   │   └── 📁 workflows/
│   └── 📁 history/            # Generation history page
│   └── 📄 layout.tsx         # Common layout applied to all pages
│   └── 📄 page.tsx           # Homepage (landing page)
│
├── 📁 components/           # Reusable UI components
│   ├── 📁 common/             # Compound components combining multiple functions (e.g., GeneratedItem)
│   └── 📁 ui/               # Atomic UI components like Button, Card
│
├── 📁 contexts/             # React Context for global state management
│   └── 📄 AuthContext.tsx
│
├── 📁 hooks/               # Reusable complex logic (Custom Hooks)
│   └── 📄 useComfyWebSocket.ts
│
├── 📁 interfaces/           # TypeScript type definitions
│   ├── 📄 history.interface.ts
│   └── 📄 user.interface.ts
│
└── 📁 lib/                  # Common utilities and library settings
└── 📄 apiClient.ts


## 4. How to Run

### Run Development Environment
1.  Create a `.env.local` file in the project root.
2.  Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WEBSOCKET_URL` environment variables. (e.g., `http://localhost:3000`)
3.  Install all dependencies with `npm install`.
4.  Run the development server with `npm run dev`. The server will run on `http://localhost:4000`.

## 5. Key Environment Variables

-   **`NEXT_PUBLIC_API_URL`**: Base URL of the backend server to send API requests to.
-   **`NEXT_PUBLIC_WEBSOCKET_URL`**: URL of the backend server for WebSocket connection.
