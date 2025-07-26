# Coin Consumption Workflow

💰 Coin Consumption Workflow: Using Workflows
Last Updated: July 22, 2025

This document describes the detailed flow of how coins are consumed when a user generates an image or video using a workflow.

---

## 1. Overview

When a user generates content through a workflow in SurfAI, coins are deducted according to the cost set for that workflow. This process includes checking the coin balance, deducting coins, and a coin refund logic for errors that may occur during the generation process.

---

## 2. Coin Consumption Sequence Diagram

```mermaid
sequenceDiagram
    participant User as User
    participant Frontend as Frontend
    participant GeneratedOutputService as GeneratedOutputService
    participant WorkflowService as WorkflowService
    participant CoinService as CoinService
    participant DB as PostgreSQL

    User->>Frontend: Image/Video Generation Request
    Frontend->>GeneratedOutputService: Call create(createDTO)
    
    activate GeneratedOutputService
    note right of GeneratedOutputService: 1. Retrieve Workflow Cost
    GeneratedOutputService->>WorkflowService: getWorkflowCost(sourceWorkflowId)
    activate WorkflowService
    WorkflowService->>DB: Query Workflow Entity (including cost)
    activate DB
    DB-->>WorkflowService: Return Workflow Entity
    deactivate DB
    WorkflowService-->>GeneratedOutputService: Return cost
    deactivate WorkflowService

    note right of GeneratedOutputService: 2. Attempt Coin Deduction
    GeneratedOutputService->>CoinService: deductCoins(userId, cost, IMAGE_GENERATION)
    activate CoinService
    CoinService->>DB: Check and Deduct User Coin Balance, Record CoinTransaction (DEDUCT)
    activate DB
    DB-->>CoinService: Return Transaction Result
    deactivate DB
    CoinService-->>GeneratedOutputService: Return Coin Deduction Success/Failure
    deactivate CoinService

    alt Coin Deduction Success
        note right of GeneratedOutputService: 3. Attempt to Save Generated Output to DB
        GeneratedOutputService->>DB: Save GeneratedOutput Entity
        activate DB
        DB-->>GeneratedOutputService: Save Success (return savedOutput)
        deactivate DB
        GeneratedOutputService-->>Frontend: Generation Success Response
    else Coin Deduction Failed (e.g., Insufficient Balance)
        GeneratedOutputService-->>Frontend: Error Response (e.g., BadRequestException)
    end

    alt Generated Output DB Save Failed (try-catch block)
        GeneratedOutputService->>CoinService: addCoins(userId, cost, ADMIN_ADJUSTMENT)
        activate CoinService
        CoinService->>DB: Restore User Coin Balance, Record CoinTransaction (GAIN)
        activate DB
        DB-->>CoinService: Return Transaction Result
        deactivate DB
        CoinService-->>GeneratedOutputService: Return Coin Refund Success/Failure
        deactivate CoinService
        GeneratedOutputService-->>Frontend: Error Response (InternalServerErrorException)
    end
```

---

## 3. Role by Key Component

*   **Frontend:** Receives generation requests from the user and sends them to the backend.
*   **`GeneratedOutputService`:** The core service that processes generation requests. It retrieves workflow costs via `WorkflowService` and deducts coins via `CoinService`. It handles coin refund logic if saving the generation record fails.
*   **`WorkflowService`:** Responsible for retrieving the cost (`cost`) of a specific workflow template.
*   **`CoinService`:** Manages user coin balances and processes coin deduction (`deductCoins`) and addition (`addCoins`) transactions.
*   **`PostgreSQL` (DB):** Stores user coin balances, coin transaction history (`CoinTransaction`), workflow templates (`Workflow`), and generated output information (`GeneratedOutput`).

---

## 4. Exception Handling and Refund Logic

*   **Insufficient Coin Balance:** If the user's coin balance is insufficient when `deductCoins` is called, a `BadRequestException` is thrown, and the generation request fails.
*   **Generated Output Save Failure:** If coin deduction succeeds but an error occurs during the process of saving the `GeneratedOutput` entity to the database, the `catch` block in `GeneratedOutputService` calls `CoinService.addCoins` to refund the deducted coins to the user. In this case, it is recorded with the `CoinTransactionReason.ADMIN_ADJUSTMENT` reason.
