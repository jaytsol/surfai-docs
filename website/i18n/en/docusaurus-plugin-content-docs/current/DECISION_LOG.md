# Decision Log

✍️ Key Decision Log (Architecture Decision Record)
Last Updated: June 29, 2025

This document records the background, considered alternatives, and reasons for the final choices of key technical decisions made during the SurfAI project.

---

### 1. Authentication System: Adoption of `JWT` + `HttpOnly` Cookie Method

-   **Date:** 2025-06-21
-   **Discussion:**
    -   Initially, traditional session-cookie methods were considered.
    -   Later, `JWT` token storage in `LocalStorage` was discussed for scalability and client (mobile, etc.) compatibility.
    -   Finally, it was decided to use `JWT` delivered in `HttpOnly` cookies, considering both security and convenience.
-   **Decision:** Generate `JWT` (Access/Refresh Token) and communicate with the client via `HttpOnly` `Secure` cookies.
-   **Reason:**
    -   **Enhanced Security (XSS Defense):** The `HttpOnly` attribute prevents browser JavaScript code from directly accessing tokens, significantly reducing the risk of token theft due to XSS (Cross-Site Scripting) attacks.
    -   **Maintain Server Statelessness:** By using `JWT`, the server does not need to store user session states, which is highly advantageous for horizontally scaling the server in the future.
    -   **Automatic Authentication:** The frontend only needs to set `credentials: 'include'` option in `apiClient`, and the browser automatically includes authentication cookies in all requests, simplifying code management.

---

### 2. Deployment Platform: Adoption of `Docker` + `Google Cloud Run`

-   **Date:** 2025-06-22
-   **Discussion:**
    -   For frontend deployment, easy `Cloudflare Pages`/`Vercel` usage was considered.
    -   For backend deployment, GCP `App Engine` (PaaS) and `Compute Engine` (IaaS) were reviewed.
    -   Finally, it was decided to containerize both frontend and backend with `Docker` and deploy them to `Google Cloud Run`.
-   **Decision:** Both frontend (`Next.js`) and backend (`NestJS`) are built as separate `Docker` containers and deployed to `Google Cloud Run`.
-   **Reason:**
    -   **Environmental Consistency:** Using `Docker` allows maintaining 100% identical local development and cloud operating environments. This fundamentally prevents "it worked on my machine..." issues.
    -   **Deployment Flexibility:** `Docker` containers are like the "standard specification for web deployment." If migration to other cloud platforms (`AWS`, `Azure`, etc.) or self-hosted servers is needed later, it can be done with minimal changes, avoiding vendor lock-in.
    -   **Integrated CI/CD:** Both projects can configure the same form of CI/CD pipeline ("Docker image build -> Cloud Run deployment") in `GitHub Actions`, making management easy.

---

### 3. Domain Architecture: Adoption of Subdomain Separation Method

-   **Date:** 2025-06-20
-   **Discussion:**
    -   **Path-based Routing (`surfai.org/` vs `surfai.org/api/`):** Had the advantage of fundamentally resolving `CORS` and cookie issues by using a single domain. However, it required additional load balancer configuration to distribute traffic upfront.
    -   **Subdomain Separation (`app.surfai.org` vs `api.surfai.org`):** Clearly separates the roles of each service and is a standard method easy to manage independently.
-   **Decision:** Frontend operates on `surfai.org`, and backend on `api.surfai.org`, separating them by subdomains.
-   **Reason:**
    -   Initial setup is more intuitive and simpler than load balancer configuration (utilizing `Cloud Run`'s custom domain mapping feature).
    -   The roles of frontend and backend are clearly separated at the domain level, making it easy to apply independent security policies (firewall, caching, etc.) to each service.
    -   Complex cross-domain cookie issues were resolved by setting correct cookie options in the backend, such as `sameSite: 'none'`, `domain: 'surfai.org'`.

---

### 4. Data Retention Policy: Automatic File Deletion, Permanent Metadata Retention

-   **Date:** 2025-06-23
-   **Discussion:**
    -   Considered deleting all data (files + DB records) older than 2 days to reduce storage costs.
    -   However, this would lead to a negative user experience where users permanently lose their past work history (prompts, parameters, etc.).
-   **Decision:** Actual image/video files are automatically deleted from `Cloudflare R2` after 2 days, but generation record metadata (DB records) are permanently retained until explicitly deleted by the user.
-   **Reason:**
    -   Effectively reduces storage costs by deleting only the largest files.
    -   Users can continue to view detailed information about their past work (e.g., what prompts were used) on their "History" page, preserving user experience.
    -   The frontend displays an "Expired" UI for expired files, providing clear feedback to the user.

---

### 5. Documentation System: Adoption of `Docusaurus`

-   **Date:** 2025-07-07
-   **Discussion:**
    -   Initially, managing documentation using `GitHub Wiki` or simple `README.md` files was considered.
    -   For more systematic management, external SaaS solutions like `GitBook` were also reviewed.
    -   Finally, `Docusaurus` was chosen for its ability to manage code and documentation in the same repository and its easy customization based on React.
-   **Decision:** Use `Docusaurus` as the official documentation tool for the project and manage it as a separate module named `surfai-docs`.
-   **Reason:**
    -   **Living Documentation:** All documents are managed as Markdown (`.md`, `.mdx`) files, allowing version control with Git alongside code. This facilitates synchronization of code changes and documentation updates, helping to maintain an always up-to-date state.
    -   **Developer-Friendly:** Developers can write documents using familiar Markdown syntax and, if necessary, embed React components directly within documents (`MDX`) to create interactive documentation.
    -   **Easy Accessibility:** Since the built output is a static website, all team members, including non-developers, can easily access and search the latest documentation through a web browser without any special tools.
    -   **Powerful Extensibility:** Complex requirements such as multi-language support, document versioning, and search functionality (Algolia) can be easily addressed through plugins and customization.