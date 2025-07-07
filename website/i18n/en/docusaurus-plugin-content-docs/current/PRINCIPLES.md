# Development Principles

> **Last Updated:** June 29, 2025
>
> This document defines the core principles and collaboration methods consistently applied throughout the SurfAI project development process.

---

## 1. Technical Principles

Our code must be written based on the following principles to ensure long-term maintainability and scalability.

### A. SOLID Principles

-   **Single Responsibility Principle (SRP):** Every class, module, and component should have only one reason to change.
    -   *Example:* `AuthService` is only responsible for authentication logic, `WorkflowService` for workflow logic, and `CloudflareR2Service` for file storage communication.
-   **Open/Closed Principle (OCP):** Software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification.
    -   *Example:* When adding a new login method (e.g., Kakao), extend by adding a new `KakaoStrategy` instead of modifying the existing `AuthService`.
-   **Liskov Substitution Principle (LSP):** Subtypes must be substitutable for their base types.
-   **Interface Segregation Principle (ISP):** Clients should not be forced to depend on interfaces they do not use.
    -   *Example:* By using interfaces like `IStorageService`, `ComfyUIService` does not need to know the concrete implementation of storage.
-   **Dependency Inversion Principle (DIP):** High-level modules should not depend on low-level modules. Both should depend on abstractions (interfaces).
    -   *Example:* Actively utilize NestJS's Dependency Injection (DI) system to reduce coupling between modules.

### B. Clean Architecture

-   **Layer Separation:** Clearly separate code roles into layers such as Controller, Service, and Repository (Entity) to ensure business logic is not tied to specific technologies.
-   **Dependency Rule:** All dependencies must point inwards. That is, changes to outer elements like UI or databases should not affect core business logic.

### C. Simplicity First (KISS Principle)

-   Always prioritize the simplest, clearest, and most intuitive solution.
-   Avoid over-engineering or unnecessary complexity.

### D. Don't Repeat Yourself (DRY)

-   Ensure that the same logic or code does not appear repeatedly in multiple places.
-   Duplicate code should be managed in one place by creating helper functions, common services, or reusable components.

## 2. Collaboration Principles

Our collaboration follows these methods:

-   **Plan-Agree-Execute:** Before implementing complex features or refactoring existing code, first explain the plan and get agreement before proceeding with actual coding.
-   **Cause-Solution Explanation:** When resolving bugs or errors, go beyond simply presenting modified code; explain the root cause of the problem and why the proposed solution is the correct approach.
-   **Living Documentation:**
    -   All documents in this repository are considered **"living organisms"** that continuously change with the project's evolution.
    -   We use **Docusaurus** to manage all documents with Git alongside the code, and automatically deploy them to the website via a CI/CD pipeline. This ensures all team members can always access the latest version of the documentation through a browser.
    -   If Gemini (I) finds a clear discrepancy between the provided context document and the actual code, I will not proceed arbitrarily. Instead, I will ask the user, **"The current document states A, but the code states B. Which should I follow?"** to clarify the context before proceeding to the next step.
-   **✨ Document Readability, Structure, and Integrity:**
    -   When writing all `.md` documents in the `surfai-docs` repository, use a **structured format** so that both humans and AI can easily and clearly understand the content.
    -   Actively use Markdown syntax such as headings (`#`, `##`), lists (`-`, `1.`), emphasis (`**`), and code blocks (```) to clearly distinguish information hierarchy and importance.
    -   Always check that documents do not contain broken characters () and immediately correct them if found to maintain **content integrity**.
