# Architecture

## Core Principles

For all contributors to the Enterprise AI Security Platform, adhere to the following principles:

* **Event-driven**: Systems communicate through events to maintain loose coupling.
* **Domain-first**: Structure code around business domains, not infrastructure.
* **UI never owns business logic**: The frontend is purely for presentation and interaction. All evaluation and decision-making logic lives in the backend or pure engines.
* **Services own transport**: Services define how they communicate over the wire (e.g., HTTP, gRPC); the underlying engines do not know about transport.
* **Pure engines are reusable**: Core components (like the Session Viewer, evaluation engines, parsers) are built in isolation to be reused across different tools (e.g., Replay Center, Sessions, Benchmarks).
