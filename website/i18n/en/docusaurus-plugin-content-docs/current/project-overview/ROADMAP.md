# Project Roadmap

🗺️ Project Roadmap: SurfAI
Last Updated: June 29, 2025

This document defines the short-term and long-term development plans for the SurfAI project. The roadmap may be flexibly changed based on market conditions and user feedback.

---

### ✅ Phase 1: MVP and Core Feature Development (Completed)

**Goal:** Complete the core generation-authentication-deployment pipeline of the service and establish a stable cloud-based infrastructure.

-   **[Completed] Authentication System Development:**
    -   Implemented JWT (Access/Refresh Token) based authentication system.
    -   Secure token delivery using `HttpOnly`, `Secure` cookies.
    -   Simultaneous support for `Google Sign-In` and general email/password login.
    -   Implemented `RolesGuard` for Role-Based Access Control (`RBAC`).
-   **[Completed] Core Generation Pipeline:**
    -   Functionality to request generation by selecting templates and entering parameters on the `Generate` page.
    -   Real-time progress and result reception using `WebSocket`.
    -   Functionality to temporarily check current session results via `SessionGallery`.
    -   **[Completed] Real-time Coin Balance Update:** Optimistically update coin balance on the frontend during image generation, and roll back to actual value via `fetchUserProfile` if backend fails.
    -   **[Completed] Prevent 0-Coin Generation:** Implemented logic on both frontend and backend to block image generation if coin balance is insufficient.
-   **[Completed] Result Management System:**
    -   Uploaded generated results (images/videos) to `Cloudflare R2`.
    -   Stored generation history metadata in a `PostgreSQL` database.
    -   Secure file viewing and downloading functionality via pre-signed URLs.
    -   Established data retention policy (files automatically deleted after 2 days, DB records retained).
-   **[Completed] Infrastructure and Deployment Automation:**
    -   Authored frontend/backend `Dockerfile`.
    -   Deployed service using `Google Cloud Run` and connected custom domains (`surfai.org`, `api.surfai.org`).
    -   Completed CI/CD pipeline setup using `GitHub Actions`.

---

### 🚀 Phase 2: Service Stabilization and Admin Feature Completion (Short-term Goal)

**Goal:** Complete features that allow administrators to fully control the service and enable users to manage their past records, enhancing service completeness.

-   **[Completed] Admin Page - Workflow CRUD:**
    -   Completed full functionality for administrators to Create, Read, Update, and Delete workflow templates.
-   **[Completed] User History Page:**
    -   Completed functionality for users to view all their generation history on the `app/history` page and load additional records via a 'Load More' button.
-   **[Completed] Admin Page - User Management:**
    -   Implemented functionality for administrators to view a list of all users on a dedicated admin page and add or deduct coins for each user.
    -   Sorted user list by ID in descending order.
    -   Improved coin adjustment input form: set initial values, reset after input, and allow only numeric input.
-   **Security Enhancement:**
    -   **[Planned]** Implement Refresh Token Rotation and theft detection logic.
    -   **[Planned]** Apply API request rate limiting using `NestJS`'s `@nestjs/throttler`.

---

### 🌟 Phase 3: User Experience Improvement and Expansion (Mid-term Goal)

**Goal:** Maximize user convenience and migrate the computation server to the cloud to build a fully cloud-native service.

-   **[Completed] Build Python server for LLM feature integration:**
    -   Build a separate Python server using `FastAPI` and `LangChain` to provide LLM functionalities.
    -   Implement an architecture where the existing NestJS backend acts as an API gateway, communicating internally with the FastAPI server while maintaining centralized authentication.
-   **Computation Server Cloud Migration:**
    -   **[Planned]** Migrate local PC's `ComfyUI` server to a GPU virtual machine on `Google Compute Engine (GCE)`.
    -   **[Planned]** Cost Optimization: Establish a strategy to use `On-demand` instances and `Spot VM` as appropriate.
-   **User Convenience Features:**
    -   **[Planned]** "My Workflow" feature: Allows users to save frequently used parameter combinations to their account and recall them anytime.
    -   **[Planned]** Implement tag-based template filtering and search UI.
    -   **[Planned]** Generation result sharing feature (generate shareable links).

---

### 💰 Phase 4: Monetization and Ecosystem Expansion (Long-term Vision)

**Goal:** Provide API services and introduce subscription models to ensure service sustainability, and expand the ecosystem through community features.

-   **API Service Provision:**
    -   **[Planned]** Provide public APIs and related documentation for external developers to integrate SurfAI's generation capabilities into their own services.
    -   **[Planned]** Establish an API key issuance and usage management system.
-   **Monetization Model Introduction:**
    -   **[Planned]** Introduce subscription-based pricing plans (`Free`, `Pro`, `Enterprise`, etc.).
    -   **[Planned]** Limit generation counts, concurrent tasks, and advanced feature usage per plan.
-   **Community Features:**
    -   **[Planned]** Gallery/Community feature allowing users to share their generated results and interact with "likes".
    -   **[Planned]** Ranking system displaying popular templates, popular generated items, etc.
