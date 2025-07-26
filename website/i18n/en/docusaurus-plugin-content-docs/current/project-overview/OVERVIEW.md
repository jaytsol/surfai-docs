# Overview
💎 Project Overview: SurfAI
Last Updated: June 29, 2025

This document details the vision, core concepts, key features, and goals of the SurfAI project.

---

## 1. Project Vision

SurfAI's core vision is to eliminate the complexity of AI image and video generation technology, enabling **anyone to easily create professional-level results.**

Existing AI generation tools have a high barrier to entry, requiring users to understand and configure complex node structures or numerous parameters directly. To solve this problem, SurfAI aims to provide an innovative user experience where technical experts (administrators) register well-crafted `ComfyUI` workflows as "templates." General users can then adjust a few intuitive parameters, much like choosing a filter in a well-designed camera app, to obtain consistent and high-quality results.

---

## 2. Core Concepts

The SurfAI service is built around two core concepts.

### A. Workflow Template

-   **Definition:** A "blueprint" of an optimized `ComfyUI` workflow for a specific purpose (e.g., 'generating high-quality portraits', 'creating short animated videos').
-   **Components:** A template consists of the original `ComfyUI` `definition` JSON and a `parameter_map` that users can control.
-   **Role:** Only **administrators** can create and manage these templates, defining and expanding the core generation capabilities of the service.

### B. Dynamic Parameters

-   **Definition:** Key variables within a workflow template that administrators designate for direct modification by users.
-   **Examples:** `positive_prompt`, `negative_prompt`, `seed`, `cfg`, `steps`, video `length`, and `fps`, etc.
-   **Role:** Users can generate unique results by simply adjusting these parameter values through a user-friendly frontend UI, without needing to understand the complex node structure.

---

## 3. Key Features

### A. Administrator (`Admin`) Features

-   **Workflow Template Management (CRUD):** Administrators can create, read, update, and delete workflow templates on a dedicated admin page.
-   **Role-Based Access Control (RBAC):** Access to admin pages and specific features is controlled by role, ensuring secure system management.
-   **User Coin Management:** Administrators can manually add or deduct coins for specific users on a dedicated admin page. (Includes improved input forms and sorting functionality)
-   **(Future) User and Service Statistics Management:** Expandable dashboard features to view overall user lists, service usage statistics, etc.

### B. General User (`User`) Features

-   **Easy Login:** Supports easy login via email/password registration or `Google` accounts.
-   **Template-Based Generation:** Users select a desired style from a list of public workflow templates and request image/video generation through a simple form input.
-   **Coin Consumption and Balance Management:** Coins are deducted according to the cost defined in the workflow template when generating images/videos. Coin balance is optimistically updated in real-time on the frontend, and the backend blocks generation if coins are insufficient. (Coins are rolled back on failure)
-   **Real-time Progress Monitoring:** Users can monitor the progress of generation tasks, queue status, and real-time preview results via `WebSocket`.
-   **Personal Gallery (History):** Users can view and manage all their generated results on the "History" page.
-   **Result Management:** In the gallery, users can enlarge each result to view detailed generation information (e.g., parameters used), download high-quality original files, or delete them.

### C. Coin System

-   **Definition:** Virtual resources required for using services like AI image and video generation. Users consume coins to use the service, and administrators can manually adjust coins.
-   **Acquisition:** Can be acquired through promotions, manual additions by administrators, etc.
-   **Consumption:** Consumed according to the cost defined in the workflow template when generating images/videos. Generation requests are blocked if the coin balance is 0.
-   **Transparency:** All coin transaction history is recorded and managed transparently.
-   **Database Field:** The `coinBalance` field is added to the `users` table to manage user coin balances.

---

## 4. Tech Stack

-   **Frontend:** Next.js, React, TypeScript, Tailwind CSS
-   **Backend:** NestJS, TypeScript, TypeORM, PostgreSQL
-   **Infrastructure:** Docker, Google Cloud Run, Cloudflare R2, Nginx
-   **Documentation:** Docusaurus, Gemini CLI, Mermaid

---

## 5. Technical Goals

-   **Stability and Scalability:** Containerize all services with `Docker` and deploy them to `Google Cloud Run` to build a stable, serverless architecture that scales automatically with traffic.
-   **Security:** Implement a multi-layered security system including secure authentication using `JWT` and `HttpOnly` cookies, web attack defense via `CSRF` and `WAF`, and role-based access control.
-   **Automated Workflow:** Establish a CI/CD pipeline using `GitHub Actions` to automate the testing and deployment of code changes.
-   **Maintainability:** Aim for a clean architecture that clearly separates frontend and backend, and within each, clearly defines the responsibilities of modules and components.
-   **Living Documentation:** Manage all documents with code in `Git` via `Docusaurus`. This creates an environment where all team members can easily access up-to-date and accurate documentation.
