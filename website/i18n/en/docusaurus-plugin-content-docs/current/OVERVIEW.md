# Project Overview
💎 Project Overview: SurfAI
Last Updated: June 29, 2025

This document details the vision, core concepts, key features, and goals of the SurfAI project.

---

## 1. Project Vision

SurfAI's core vision is to eliminate the complexity of AI image and video generation technology, making it **easy for anyone to create professional-level results.**

Existing AI generation tools often have a high barrier to entry, requiring users to understand and configure complex node structures or numerous parameter values directly. To solve this problem, SurfAI aims to provide an innovative user experience where technical experts (administrators) register well-crafted `ComfyUI` workflows as "templates." General users can then obtain consistent, high-quality results by adjusting only a few intuitive parameters, much like choosing a filter in a well-designed camera app.

---

## 2. Core Concepts

The SurfAI service is built around the following two core concepts.

### a. Workflow Template

-   **Definition:** A "blueprint" of a `ComfyUI` workflow optimized for a specific purpose (e.g., 'generating high-quality portrait photos', 'creating short animated videos').
-   **Components:** A template consists of the original `ComfyUI` `definition` JSON and a `parameter_map` that users can control.
-   **Role:** **Administrators** alone create and manage these templates, defining and expanding the core generation capabilities of the service.

### b. Dynamic Parameters

-   **Definition:** Key variables within a workflow template designated by the administrator for direct modification by users.
-   **Examples:** `positive_prompt`, `negative_prompt`, `seed`, `cfg`, `steps`, video `length`, and `fps`, etc.
-   **Role:** Users can generate their own unique results by simply modifying these parameter values through a user-friendly UI on the frontend, without needing to understand complex node structures.

---

## 3. Key Features

### a. Administrator (`Admin`) Features

-   **Workflow Template Management (CRUD):** Administrators can create, view, modify, and delete workflow templates on a dedicated admin page.
-   **Role-Based Access Control (RBAC):** Administrator privileges are granted only to users with specific email addresses, ensuring secure system management.
-   **(Future) User and Service Statistics Management:** Ability to expand dashboard features to view overall user lists and service usage statistics.

### b. General User (`User`) Features

-   **Easy Login:** Supports email/password registration or convenient login via Google accounts.
-   **Template-Based Generation:** Users select a desired style from a list of public workflow templates and request image/video generation through a simple form input.
-   **Real-time Progress Monitoring:** Users can monitor the progress of generation tasks, queue status, and preview results in real-time via `WebSocket`.
-   **Personal Gallery (History):** Users can view and manage all their generated results on a "History" page.
-   **Result Management:** From the gallery, users can zoom in on each result to view detailed generation information (e.g., parameters used), download high-quality original files, or delete them.

---

## 4. Technical Goals

-   **Stability and Scalability:** All services are containerized with `Docker` and deployed on `Google Cloud Run` to build a stable, serverless architecture that automatically scales with traffic.
-   **Security:** Implements a multi-layered security system including secure authentication using `JWT` and `HttpOnly` cookies, protection against web attacks via `CSRF` and `WAF`, and role-based access control.
-   **Automated Workflow:** Establishes a CI/CD pipeline using `GitHub Actions` to automatically test and deploy code changes.
-   **Maintainability:** Aims for a clean architecture by clearly separating frontend and backend, and defining clear responsibilities for modules and components within each.
