# Development Principles

> **Last Updated:** June 29, 2025
>
> This document defines the core principles and collaboration methods consistently applied throughout the SurfAI project's development process.

---

## 1. Technical Principles

Our code should be written based on the following principles to ensure long-term maintainability and scalability.

### a. SOLID Principles

-   **Single Responsibility Principle (SRP):** Every class, module, and component should have only one reason to change.
    -   *Example Application:* `AuthService` is responsible only for authentication logic, `WorkflowService` only for workflow logic, and `CloudflareR2Service` only for file storage communication.
-   **Open/Closed Principle (OCP):** Software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification.
    -   *Example Application:* When adding a new login method (e.g., Kakao), instead of modifying the existing `AuthService`, we extend it by adding a new `KakaoStrategy`.
-   **Liskov Substitution Principle (LSP):** Subtypes must be substitutable for their base types.
-   **Interface Segregation Principle (ISP):** Clients should not be forced to depend on interfaces they do not use.
    -   *Example Application:* By using interfaces like `IStorageService`, `ComfyUIService` is designed not to need to know the concrete implementation of storage.
-   **Dependency Inversion Principle (DIP):** High-level modules should not depend on low-level modules. Both should depend on abstractions (interfaces).
    -   *Example Application:* Actively utilize NestJS's Dependency Injection (DI) system to reduce coupling between modules.

### b. Clean Architecture

-   **Layer Separation:** Clearly separate code roles into layers such as Controller, Service, and Repository (Entity) to ensure business logic is not tied to specific technologies.
-   **Dependency Rule:** All dependencies always point inwards. This means changes to external elements like UI or databases should not affect core business logic.

### c. Simplicity First (KISS Principle)

-   Always prioritize the simplest, clearest, and most intuitive solution.
-   Avoid over-engineering or unnecessary complexity.

### d. Don't Repeat Yourself (DRY)

-   Avoid repeating the same logic or code in multiple places.
-   Duplicate code should be managed in one place by creating helper functions, common services, or reusable components.

## 2. Collaboration Principles

Our collaboration follows these methods:

-   **Plan-Agree-Execute:** Before implementing complex features or refactoring existing code, we first explain the plan, gain agreement, and then proceed with actual code writing.
-   **Explain Cause and Solution:** When resolving bugs or errors, we go beyond simply presenting modified code; we also explain the root cause of the problem and why the proposed solution is the correct approach.
-   **Centralization of Context:** All important decisions and architectural information are recorded in this `surfai-docs` repository, ensuring that all discussions and development proceed within the same context.
-   **Living Documentation and Discrepancy Handling:**
    -   All documents in this repository are considered **"living organisms"** that continuously change as the project evolves.
    -   If Gemini (I) finds a clear discrepancy between the provided context document and the actual code, I will not proceed arbitrarily. Instead, I will clarify the context by asking the user, **"The current document states A, but the code states B. Which should I prioritize?"** before proceeding to the next step.
-   **✨ Document Readability, Structure, and Integrity:**
    -   When writing any `.md` document in the `surfai-docs` repository, use a **structured format** to ensure both humans and AI can easily and clearly understand the content.
    -   Actively utilize Markdown syntax such as headings (`#`, `##`), lists (`-`, `1.`), emphasis (`**`), and code blocks(```) to clearly distinguish information hierarchy and importance.
    -   Always check that documents do not contain broken characters like `` and immediately correct them if found to maintain **content integrity**.