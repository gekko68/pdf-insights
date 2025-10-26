# Architecture Guidelines Templates

> **Purpose**: Architecture-specific guidelines and patterns for different architectural styles

## Layered Architecture Template
```markdown
# Architecture Guidelines - Layered Architecture
> **Purpose**: Defines project structure and layer responsibilities

## Architecture Overview
Layered Architecture organizes code into horizontal layers where each layer can only depend on the layers below it. This creates a clear separation of concerns and makes the application easier to understand and maintain.

## Layer Structure
```
{{PROJECT_NAME}}/
├── presentation/          # Controllers, UI, API endpoints
├── application/          # Use cases, application services
├── domain/              # Business entities, domain services
└── infrastructure/      # Database, external services
```

## Layer Responsibilities

### Presentation Layer
- **Purpose**: Handle user interface and external API concerns
- **Components**: Controllers, API endpoints, CLI handlers, UI components
- **Rules**: 
  - Can depend on Application layer
  - Should not contain business logic
  - Handles input validation and response formatting
  - Maps between DTOs and domain models

### Application Layer
- **Purpose**: Orchestrate business operations and use cases
- **Components**: Application services, use case handlers, DTOs
- **Rules**:
  - Can depend on Domain layer
  - Coordinates domain objects to fulfill use cases
  - Handles transaction boundaries
  - Contains workflow logic

### Domain Layer
- **Purpose**: Contains core business logic and rules
- **Components**: Entities, value objects, domain services, business rules
- **Rules**:
  - Should have no dependencies on external layers
  - Contains rich business logic
  - Defines business invariants
  - Pure business concepts

### Infrastructure Layer
- **Purpose**: Handle technical concerns and external systems
- **Components**: Repositories, external API clients, database contexts
- **Rules**:
  - Implements interfaces defined in other layers
  - Contains framework-specific code
  - Handles data persistence
  - Manages external service integration

## Dependencies
- Presentation → Application → Domain
- Infrastructure implements interfaces from Domain/Application
- Domain layer has no outward dependencies

## Best Practices
- Keep business logic in Domain layer
- Use interfaces to define contracts between layers
- Avoid circular dependencies
- Use dependency injection for loose coupling
```

## Hexagonal Architecture Template
```markdown
# Architecture Guidelines - Hexagonal Architecture
> **Purpose**: Defines ports, adapters, and core domain structure

## Architecture Overview
Hexagonal Architecture (Ports & Adapters) isolates the core business logic from external concerns. The core domain communicates with the outside world through ports (interfaces) and adapters (implementations).

## Core Structure
```
{{PROJECT_NAME}}/
├── core/
│   ├── domain/          # Pure business logic
│   ├── ports/           # Interface definitions
│   └── application/     # Use case implementations
├── adapters/
│   ├── in/             # Controllers, CLI, consumers
│   └── out/            # Repositories, API clients
├── config/             # Dependency injection setup
└── shared/             # Common utilities
```

## Component Responsibilities

### Core/Domain
- **Purpose**: Contains pure business logic
- **Components**: Entities, value objects, domain services
- **Rules**:
  - No dependencies on external systems
  - Contains business invariants and rules
  - Framework-agnostic code

### Core/Application
- **Purpose**: Implements use cases using domain objects
- **Components**: Use case handlers, application services
- **Rules**:
  - Orchestrates domain objects
  - Defines application workflows
  - Uses ports for external communication

### Ports
- **Purpose**: Define contracts for external communication
- **Components**: Input ports (use case interfaces), Output ports (repository/service interfaces)
- **Types**:
  - **Input Ports**: Commands, queries, event handlers
  - **Output Ports**: Repositories, external services, notification services

### Adapters/In (Primary/Driving)
- **Purpose**: Trigger application use cases
- **Components**: REST controllers, GraphQL resolvers, CLI commands, event listeners
- **Rules**:
  - Implement or use input ports
  - Handle external protocols (HTTP, messaging, etc.)
  - Convert external requests to domain concepts

### Adapters/Out (Secondary/Driven)
- **Purpose**: Implement external service contracts
- **Components**: Database repositories, external API clients, file systems
- **Rules**:
  - Implement output ports
  - Handle external system protocols
  - Convert domain concepts to external formats

## Architectural Rules
- Core domain has no dependencies on adapters
- All external communication goes through ports
- Adapters implement port interfaces
- Configuration wires adapters to ports

## Testing Strategy
- Unit tests for domain logic (no external dependencies)
- Integration tests using test adapters
- Easy mocking of external dependencies
```

## Clean Architecture Template
```markdown
# Architecture Guidelines - Clean Architecture
> **Purpose**: Defines dependency rules and layer organization

## Architecture Overview
Clean Architecture enforces a strict dependency rule where dependencies point inward toward higher-level policies. This creates a highly maintainable, testable, and framework-independent architecture.

## Layer Structure
```
{{PROJECT_NAME}}/
├── entities/           # Enterprise business rules
├── use-cases/          # Application business rules
├── interface-adapters/ # Controllers, gateways, presenters
├── frameworks/         # Web, DB, external interfaces
└── main/              # Composition root
```

## Layer Responsibilities

### Entities (Enterprise Business Rules)
- **Purpose**: Encapsulate enterprise-wide business rules
- **Components**: Core business objects, critical business rules
- **Rules**:
  - Most stable layer (least likely to change)
  - No dependencies on any other layer
  - Contains enterprise-wide business logic

### Use Cases (Application Business Rules)
- **Purpose**: Contain application-specific business rules
- **Components**: Use case interactors, application-specific business logic
- **Rules**:
  - Orchestrate entities to fulfill specific use cases
  - Define input/output ports (interfaces)
  - Independent of frameworks and external concerns

### Interface Adapters
- **Purpose**: Convert data between use cases and external world
- **Components**: Controllers, presenters, gateways
- **Rules**:
  - Convert data formats (web to use case, database to entity)
  - Implement interfaces defined by use cases
  - No business rules (pure data conversion)

### Frameworks & Drivers
- **Purpose**: Contain frameworks, tools, and external interfaces
- **Components**: Web frameworks, databases, external APIs
- **Rules**:
  - Most volatile layer (most likely to change)
  - Contains glue code connecting adapters to external systems
  - No business logic

## Dependency Rule
- **Inward Only**: Dependencies always point inward
- **Interface Inversion**: Inner layers define interfaces, outer layers implement them
- **No Direct References**: Outer layers cannot be referenced by inner layers

## Data Flow
1. External request → Framework → Controller → Use Case → Entity
2. Entity → Use Case → Presenter → Framework → External response

## Benefits
- Framework independence
- Testability (inner layers easily testable)
- UI independence
- Database independence
- External service independence
```

## Vertical Slice Architecture Template
```markdown
# Architecture Guidelines - Vertical Slice Architecture
> **Purpose**: Organize code by features rather than technical layers

## Architecture Overview
Vertical Slice Architecture organizes code around features or use cases rather than technical layers. Each slice contains all the code needed to implement a specific feature, minimizing coupling between features.

## Feature Structure
```
{{PROJECT_NAME}}/
├── features/
│   ├── user-registration/
│   │   ├── api/              # API endpoints for this feature
│   │   ├── domain/           # Feature-specific business logic
│   │   ├── data/             # Data access for this feature
│   │   ├── models/           # Feature-specific models
│   │   └── tests/            # Feature-specific tests
│   ├── user-authentication/
│   │   └── [same structure]
│   └── user-profile/
│       └── [same structure]
├── shared/
│   ├── kernel/               # Shared domain concepts
│   ├── infrastructure/       # Common technical concerns
│   └── utilities/            # Shared utility functions
└── composition/              # Dependency injection, startup
```

## Slice Responsibilities

### Feature Slice
- **Contains**: All code needed for a specific business capability
- **Components**: Controllers, business logic, data access, models
- **Benefits**:
  - High cohesion within feature
  - Low coupling between features
  - Easy to understand feature scope
  - Parallel development friendly

### Shared Kernel
- **Purpose**: Common domain concepts used across features
- **Components**: Core business entities, shared value objects
- **Rules**:
  - Keep minimal - only truly shared concepts
  - Changes require coordination across teams
  - Well-documented and stable

### Shared Infrastructure
- **Purpose**: Common technical capabilities
- **Components**: Database connections, logging, messaging, authentication
- **Rules**:
  - Technical concerns only (no business logic)
  - Service-oriented design
  - Backward compatibility important

## Design Principles
- **Feature Complete**: Each slice contains everything needed for the feature
- **Minimize Sharing**: Avoid sharing unless truly necessary
- **Explicit Dependencies**: Make feature dependencies explicit
- **Independent Deployment**: Features should be deployable independently

## Trade-offs
- **Pros**: High feature cohesion, parallel development, easy feature removal
- **Cons**: Potential code duplication, harder cross-feature refactoring
```

## Event-Driven Architecture Template
```markdown
# Architecture Guidelines - Event-Driven Architecture with CQRS
> **Purpose**: Defines event-driven patterns and CQRS implementation

## Architecture Overview
Event-Driven Architecture uses events as the primary means of communication between components. Combined with CQRS (Command Query Responsibility Segregation), it separates read and write operations for optimal performance and auditability.

## System Structure
```
{{PROJECT_NAME}}/
├── command-side/              # Write operations
│   ├── commands/             # Command handlers
│   ├── domain/               # Domain entities and events
│   ├── aggregates/           # Aggregate roots
│   └── events/               # Domain events
├── query-side/               # Read operations
│   ├── queries/              # Query handlers
│   ├── projections/          # Read models
│   ├── views/                # Materialized views
│   └── handlers/             # Event handlers for projections
├── infrastructure/
│   ├── event-store/          # Event persistence
│   ├── message-bus/          # Event routing
│   └── projectors/           # Event projection services
└── shared/
    ├── events/               # Event definitions
    └── kernel/               # Shared concepts
```

## Component Responsibilities

### Command Side (Write)
- **Purpose**: Handle state changes and business operations
- **Components**: Command handlers, aggregates, domain events
- **Rules**:
  - Process commands and generate events
  - Validate business rules
  - Maintain consistency within aggregates
  - Emit events for all state changes

### Query Side (Read)
- **Purpose**: Handle read operations and reporting
- **Components**: Query handlers, read models, projections
- **Rules**:
  - Optimized for read scenarios
  - Eventually consistent with command side
  - Denormalized for performance
  - Built from event streams

### Event Store
- **Purpose**: Persist events as single source of truth
- **Characteristics**:
  - Append-only storage
  - Complete audit trail
  - Time-travel debugging
  - Event replay capability

### Event Bus/Message Bus
- **Purpose**: Route events to interested handlers
- **Responsibilities**:
  - Publish events to subscribers
  - Handle event ordering
  - Manage subscriptions
  - Provide delivery guarantees

## Event Design Principles
- **Events are immutable**: Never change published events
- **Events represent facts**: Past tense naming (UserRegistered, OrderPlaced)
- **Events contain all necessary data**: Avoid external dependencies in handlers
- **Idempotent handlers**: Handle duplicate events gracefully

## Benefits
- **Auditability**: Complete history of all changes
- **Scalability**: Separate read and write scaling
- **Flexibility**: Easy to add new projections
- **Temporal Queries**: Query state at any point in time

## Challenges
- **Complexity**: More complex than traditional approaches
- **Eventual Consistency**: Reads may lag behind writes
- **Event Schema Evolution**: Careful event versioning required
```

## Microservices Architecture Guidelines
```markdown
# Architecture Guidelines - Microservices
> **Purpose**: Guidelines for microservices architecture implementation

## Service Design Principles
- **Single Responsibility**: Each service owns a specific business capability
- **Autonomous**: Services can be developed, deployed, and scaled independently
- **Business-Focused**: Organized around business capabilities, not technical functions
- **Decentralized**: Governance and data management distributed across services

## Service Structure Template
```
service-name/
├── src/
│   ├── api/                  # REST/GraphQL endpoints
│   ├── domain/               # Business logic
│   ├── data/                 # Data access layer
│   └── integration/          # External service communication
├── tests/                    # Service-specific tests
├── docs/                     # Service documentation
├── deployment/               # Kubernetes/Docker configs
└── contracts/                # API contracts and schemas
```

## Inter-Service Communication
- **Synchronous**: REST APIs, GraphQL for real-time needs
- **Asynchronous**: Message queues, event streams for loose coupling
- **Service Mesh**: For cross-cutting concerns (security, monitoring, routing)

## Data Management
- **Database per Service**: Each service owns its data
- **Eventual Consistency**: Accept consistency trade-offs
- **Saga Pattern**: Manage distributed transactions
- **Event Sourcing**: For audit and temporal queries

## Deployment Considerations
- **Containerization**: Docker containers for consistency
- **Orchestration**: Kubernetes for container management
- **CI/CD**: Independent pipelines per service
- **Monitoring**: Distributed tracing and centralized logging
```