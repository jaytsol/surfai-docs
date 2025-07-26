# Development Principles

> **Last Updated:** June 29, 2025
>
> This document defines the core principles and collaboration methods consistently applied throughout the SurfAI project's development process.

---

## 1. Technical Principles

Our code should be written based on the following principles to ensure long-term maintainability and scalability.

### A. SOLID Principles

-   **Single Responsibility Principle (SRP):** Every class, module, and component should have only one reason to change.
    -   *Application Example:* `AuthService` is only responsible for authentication logic, `WorkflowService` for workflow logic, and `CloudflareR2Service` for file storage communication.
-   **Open/Closed Principle (OCP):** Software entities should be open for extension, but closed for modification.
    -   *Application Example:* When adding a new login method (e.g., Kakao), we extend by adding a new `KakaoStrategy` instead of modifying the existing `AuthService`.
-   **Liskov Substitution Principle (LSP):** Subtypes must be substitutable for their base types.
-   **Interface Segregation Principle (ISP):** Clients should not be forced to depend on interfaces they do not use.
    -   *Application Example:* Using interfaces like `IStorageService`, `ComfyUIService` is designed not to know the specific implementation of storage.
-   **Dependency Inversion Principle (DIP):** High-level modules should not depend on low-level modules. Both should depend on abstractions.
    -   *Application Example:* Actively utilizing NestJS's Dependency Injection (DI) system to reduce coupling between modules.

### B. Clean Architecture

-   **Layer Separation:** Clearly separate code roles into layers such as Controller, Service, and Repository (Entity) to ensure business logic is not tied to specific technologies.
-   **Dependency Rule:** All dependencies always point inwards. This means changes in external elements like UI or databases should not affect core business logic.

### C. Simplicity First (KISS Principle)

-   Always prioritize the simplest, clearest, and most intuitive solution.
-   Avoid over-engineering or unnecessary complexity.

### D. Don't Repeat Yourself (DRY)

-   Ensure that the same logic or code does not appear repeatedly in multiple places.
-   Duplicate code should be managed in one place by creating helper functions, common services, or reusable components.

### E. Automated Documentation & Management

-   **Gemini CLI-based Automation:** Utilize Gemini CLI to automatically reflect relevant technical documentation in `surfai-docs` when code changes (adding new modules, modifying existing ones, etc.) are merged into the main branch.
-   **Deployment via Docusaurus:** Generated technical documentation is deployed as a website using Docusaurus, a Static Site Generator. This leverages its advantages such as developer-friendly features, Markdown support, and multilingual support to improve document accessibility.
-   **Automated Diagram Generation with Mermaid:** Diagrams explaining complex content such as software architecture, technology stacks, and database schemas are automatically generated based on Mermaid text. Gemini CLI generates the necessary Mermaid text and includes it in the documentation.
-   **Multilingual and Non-Developer Friendly Document Support:**
    -   After writing technical documentation, Gemini CLI performs translation into other languages like English as needed to support multilingual documents.
    -   Additionally, Gemini CLI generates a version of existing technical documents written in simpler language so that non-developer team members can easily understand them.
-   **Context File Utilization:** Context files like `GEMINI.md` or `PRINCIPLES.md` are created to ensure Gemini CLI follows consistent standards when generating, translating, and simplifying documents.

## 2. Collaboration Principles

Our collaboration adheres to the following methods.

-   **Plan-Agree-Execute:** Before implementing complex features or refactoring existing code, we first explain the plan and gain agreement before proceeding with actual code writing.
-   **Cause-Solution Explanation:** When resolving bugs or errors, we go beyond simply presenting modified code; we also explain the root cause of the problem and why the proposed solution is the correct approach.
-   **Living Documentation:**
    -   All documents in this repository are considered **"living organisms"** that continuously change with the project's evolution.
    -   We use **Docusaurus** to manage all documents with code in Git and automatically deploy them to the website via a CI/CD pipeline. This ensures all team members always have access to the latest version of the documents through a browser.
    -   If Gemini (I) finds a clear discrepancy between the provided context document and the actual code, it will not proceed with arbitrary judgment but will ask the user, **"The document states A, but the code states B. Which should I follow?"** to clarify the context before proceeding to the next step.
-   **✨ Document Readability, Structure, and Integrity:**
    -   When writing all `.md` documents in the `surfai-docs` repository, we use a **structured format** to ensure both humans and AI can easily and clearly understand the content.
    -   We actively utilize Markdown syntax such as headings (`#`, `##`), lists (`-`, `1.`), emphasis (`**`), and code blocks (```) to clearly distinguish the hierarchy and importance of information.
    -   We always check that documents do not contain broken characters like `` and immediately correct them if found to maintain **content integrity**.
