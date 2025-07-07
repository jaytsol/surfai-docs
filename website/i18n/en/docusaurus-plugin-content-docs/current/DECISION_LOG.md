# Decision Log
✍️ Major Decision Log (Architecture Decision Record)
Last Updated: June 29, 2025

This document records the background, considered alternatives, and reasons for the final choices of major technical decisions made during the SurfAI project.

---

### 1. Authentication System: Adoption of `JWT` + `HttpOnly` Cookie Method

-   **Date:** 2025-06-21
-   **Discussion:**
    -   Initially, traditional session-cookie methods were considered.
    -   Later, storing `JWT` tokens in `LocalStorage` was discussed for scalability and client (mobile, etc.) compatibility.
    -   Finally, considering both security and convenience, it was decided to pass `JWT`s within `HttpOnly` cookies.
-   **Decision:** Generate `JWT` (Access/Refresh Token) and communicate with the client via `HttpOnly` `Secure` cookies.
-   **Reason:**
    -   **Enhanced Security (XSS Defense):** By using the `HttpOnly` attribute, direct access to tokens by browser JavaScript code is prevented, significantly reducing the risk of token theft due due to XSS (Cross-Site Scripting) attacks.
    -   **Maintain Server Statelessness:** Using `JWT` eliminates the need for the server to store user session states, providing a highly advantageous structure for horizontally scaling the server in the future.
    -   **Automatic Authentication:** The frontend only needs to set the `credentials: 'include'` option in `apiClient`, and the browser automatically includes authentication cookies with all requests, simplifying code management.

---

### 2. Deployment Platform: Adoption of `Docker` + `Google Cloud Run`

-   **Date:** 2025-06-22
-   **Discussion:**
    -   Considered using simple `Cloudflare Pages`/`Vercel` for frontend deployment.
    -   Reviewed GCP `App Engine` (PaaS) and `Compute Engine` (IaaS) for backend deployment.
    -   Finally, decided to containerize both frontend and backend with `Docker` and deploy them to `Google Cloud Run`.
-   **Decision:** Build both frontend (`Next.js`) and backend (`NestJS`) as separate `Docker` containers and deploy them to `Google Cloud Run`.
-   **Reason:**
    -   **Environmental Consistency:** `Docker` ensures 100% identical local development and cloud production environments. This fundamentally prevents issues like "It worked on my machine...".
    -   **Deployment Flexibility:** `Docker` containers are like the "standard specification for web deployment." If migration to other cloud platforms (`AWS`, `Azure`, etc.) or self-hosted servers is needed later, it can be done with minimal changes, avoiding vendor lock-in.
    -   **Integrated CI/CD:** Both projects can configure the same type of CI/CD pipeline ("Docker image build -> Cloud Run deployment") in `GitHub Actions`, making management easier.

---

### 3. Domain Architecture: Adoption of Subdomain Separation

-   **Date:** 2025-06-20
-   **Discussion:**
    -   **Path-based Routing (`surfai.org/` vs `surfai.org/api/`):** Had the advantage of fundamentally resolving `CORS` and cookie issues by using a single domain. However, it required additional load balancer configuration to distribute traffic upfront.
    -   **Subdomain Separation (`app.surfai.org` vs `api.surfai.org`):** A standard approach that clearly separates the roles of each service and facilitates independent management.
-   **Decision:** Operate the frontend on `surfai.org` and the backend on `api.surfai.org` by separating subdomains.
-   **Reason:**
    -   Initial setup is more intuitive and simpler than load balancer configuration. (Utilizing `Cloud Run`'s custom domain mapping feature)
    -   The roles of frontend and backend are clearly clearly separated at the domain level, making it easier to apply independent security policies (firewall, caching, etc.) to each service.
    -   Complex cross-domain cookie issues were resolved by setting correct cookie options in the backend, such as `sameSite: 'none'` and `domain: 'surfai.org'`.

---

### 4. Data Retention Policy: Automatic File Deletion, Permanent Metadata Retention

-   **Date:** 2025-06-23
-   **Discussion:**
    -   Considered deleting all data (files + DB records) older than 2 days to reduce storage costs.
    -   However, this raised concerns about negative user experience, as users would permanently lose their past work history (prompts, parameters, etc.).
-   **Decision:** Actual image/video files are automatically deleted from `Cloudflare R2` after 2 days, but generation record metadata (DB records) are permanently retained until explicitly deleted by the user.
-   **Reason:**
    -   Effectively reduces storage costs by deleting only the largest files.
    -   Users can continue to view detailed information about their past work (e.g., what prompts were used) on their "History" page, preserving the user experience.
    -   The frontend provides clear feedback to the user by displaying an "Expired" UI for expired files.
