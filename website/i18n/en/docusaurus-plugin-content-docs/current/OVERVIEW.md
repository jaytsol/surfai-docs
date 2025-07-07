# Overview
💎 Project Overview: SurfAI
Last Updated: June 29, 2025

This document details the vision, core concepts, key features, and goals of the SurfAI project.

---

## 1. Project Vision

SurfAI's core vision is to remove the complexity of AI image and video generation technology, enabling **anyone to easily create professional-level results**.

Existing AI generation tools have a high barrier to entry, requiring users to understand and set complex node structures or numerous parameter values directly. To solve this problem, SurfAI aims to provide an innovative user experience where technical experts (administrators) register well-crafted `ComfyUI` workflows as "templates," and general users can obtain consistent, high-quality results by adjusting only a few intuitive parameters, much like choosing a filter in a well-designed camera app.

---

## 2. Core Concepts

The SurfAI service is built around the following two core concepts:

### A. Workflow Template

-   **Definition:** A "blueprint" of an optimized `ComfyUI` workflow for a specific purpose (e.g., 'generating high-quality portraits', 'creating short animated videos').
-   **Components:** A template consists of the original `ComfyUI` `definition` JSON and `parameter_map` that users can control.
-   **Role:** Only **administrators** can create and manage these templates, defining and expanding the core generation capabilities of the service.

### B. Dynamic Parameters

-   **Definition:** Key variables designated by administrators within a workflow template that users can directly modify.
-   **Examples:** `positive_prompt`, `negative_prompt`, `seed`, `cfg`, `steps`, video `length` and `fps`, etc.
-   **Role:** Users can create their own unique results by modifying only these parameter values through a user-friendly UI on the frontend, without needing to understand complex node structures.

---

## 3. Key Features

### A. Administrator (`Admin`) Features

-   **Workflow Template Management (CRUD):** Administrators can create, view, modify, and delete workflow templates on a dedicated page.
-   **Role-Based Access Control (RBAC):** Grants administrator privileges only to users with specific email addresses to securely manage the system.
-   **(Future) User and Service Statistics Management:** Can extend with dashboard features to view overall user lists and service usage statistics.

### B. General User (`User`) Features

-   **Easy Login:** Supports email/password registration or convenient login via `Google` accounts.
-   **Template-Based Generation:** Users select a desired style from a list of public workflow templates and request image/video generation through simple form input.
-   **Real-time Progress Monitoring:** Users can monitor the progress of generation tasks, queue status, and preview results in real-time via `WebSocket`.
-   **Personal Gallery (History):** Users can view and manage all their generated results on a "History" page.
-   **Result Management:** From the gallery, users can zoom in on each result to check detailed generation information (e.g., parameters used), and download or delete high-quality original files.

---

## 4. Tech Stack

-   **Frontend:** Next.js, React, TypeScript, Tailwind CSS
-   **Backend:** NestJS, TypeScript, TypeORM, PostgreSQL
-   **Infrastructure:** Docker, Google Cloud Run, Cloudflare R2, Nginx
-   **Documentation:** Docusaurus

---

## 5. Technical Goals

-   **Stability and Scalability:** All services are containerized with `Docker` and deployed to `Google Cloud Run`, building a stable serverless architecture that automatically scales with traffic.
-   **Security:** Applies a multi-layered security system including secure authentication using `JWT` and `HttpOnly` cookies, web attack defense via `CSRF` and `WAF`, and Role-Based Access Control.
-   **Automated Workflow:** Establishes a CI/CD pipeline using `GitHub Actions` to automatically test and deploy code changes.
-   **Maintainability:** Clearly separates frontend and backend, and within each, clearly defines the responsibilities of modules and components, aiming for a clean architecture.
-   **Living Documentation:** All documents are managed with `Git` alongside code through `Docusaurus`. This establishes an environment where all team members can easily access the latest and accurate documentation.