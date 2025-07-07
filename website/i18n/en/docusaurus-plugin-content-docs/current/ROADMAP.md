# Roadmap
🗺️ Project Roadmap: SurfAI
Last Updated: June 29, 2025

This document defines the short-term and long-term development plans for the SurfAI project. The roadmap may be flexibly changed based on market conditions and user feedback.

---

### ✅ Phase 1: MVP and Core Feature Development (Completed)

**Goal:** Complete the core generation-authentication-deployment pipeline of the service and establish a stable cloud foundation.

-   **[Completed] Authentication System Development:**
    -   Implemented `JWT` (Access/Refresh Token) based authentication system.
    -   Secure token delivery using `HttpOnly`, `Secure` cookies.
    -   Simultaneous support for `Google Sign-In` and general email/password login.
    -   Implemented `RolesGuard` for Role-Based Access Control (`RBAC`).
-   **[Completed] Core Generation Pipeline:**
    -   Functionality to request generation by selecting a template and entering parameters on the `Generate` page.
    -   Real-time progress status and result reception using `WebSocket`.
    -   Functionality to temporarily check results of the current session via `SessionGallery`.
-   **[Completed] Result Management System:**
    -   Uploaded generated results (images/videos) to `Cloudflare R2`.
    -   Stored generation record metadata in the `PostgreSQL` database.
    -   Secure file viewing and download functionality via pre-signed URLs.
    -   Established data retention policy (files automatically deleted after 2 days, DB records retained).
-   **[Completed] Infrastructure and Deployment Automation:**
    -   Created Frontend/Backend `Dockerfile`.
    -   Deployed services using `Google Cloud Run` and connected custom domains (`surfai.org`, `api.surfai.org`).
    -   Completed `GitHub Actions` based CI/CD pipeline setup.

---

### 🚀 Phase 2: Service Stabilization and Administrator Feature Completion (Short-term Goal)

**Goal:** Complete features that allow administrators to fully control the service and enable users to manage their past records, enhancing service completeness.

-   **[Completed] Admin Page - Workflow CRUD:**
    -   Completed full functionality for administrators to Create, Read, Update, and Delete workflow templates.
-   **[Completed] User History Page:**
    -   Completed functionality for users to view all their generation records on the `app/history` page and load additional records via a 'Load More' button.
-   **Security Enhancement:**
    -   **[Planned]** Implement Refresh Token Rotation and theft detection logic.
    -   **[Planned]** Apply API request rate limiting using `@nestjs/throttler` in `NestJS`.

---

### 🌟 Phase 3: User Experience Improvement and Expansion (Mid-term Goal)

**Goal:** Maximize user convenience and migrate the compute server to the cloud to build a fully cloud-native service.

-   **Compute Server Cloud Migration:**
    -   **[Planned]** Migrate `ComfyUI` server from local PC to GPU virtual machine on `Google Compute Engine (GCE)`.
    -   **[Planned]** Establish a strategy to use `On-demand` instances and `Spot VM` as appropriate for cost optimization.
-   **User Convenience Features:**
    -   **[Planned]** "My Workflow" feature: Users can save frequently used parameter combinations to their account and recall them at any time.
    -   **[Planned]** Implement tag-based template filtering and search UI.
    -   **[Planned]** Generation result sharing feature (generate shareable links).

---

### 💰 Phase 4: Monetization and Ecosystem Expansion (Long-term Vision)

**Goal:** Secure service sustainability by providing API services and introducing subscription models, and expand the ecosystem through community features.

-   **API Service Provision:**
    -   **[Planned]** Provide public API and related documentation for external developers to integrate SurfAI's generation capabilities into their services.
    -   **[Planned]** Establish API key issuance and usage management system.
-   **Monetization Model Introduction:**
    -   **[Planned]** Introduce subscription-based pricing plans (`Free`, `Pro`, `Enterprise`, etc.).
    -   **[Planned]** Limit generation counts, concurrent tasks, and advanced feature usage based on pricing plans.
-   **Community Features:**
    -   **[Planned]** Community feature allowing users to share their generated results, "like" them, and communicate.
    -   **[Planned]** Ranking system displaying popular templates, popular generated items, etc.
