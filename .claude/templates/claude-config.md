# Claude Configuration Template

> **Purpose**: Template for Claude.md configuration file with architecture-specific content

## Template Structure

```markdown
# Project Context for Claude Code

## Architecture Style: {{ARCHITECTURE_STYLE}}
## Technology Stack: {{TECHNOLOGY_STACK}}

## Instructions for Claude
Please read and understand ALL files in the `/context` directory before making suggestions or generating code. Each file contains specific guidance for different aspects of the project.

This project follows {{ARCHITECTURE_STYLE}} principles:
{{ARCHITECTURE_GUIDELINES}}

When working on this project:
1. Reference the relevant context files for the area you're working on
2. Follow the established {{ARCHITECTURE_STYLE}} patterns
3. Use the selected technology stack: {{TECHNOLOGY_LIST}}
4. Ask clarifying questions if context seems outdated or contradictory
5. Maintain consistency across all project aspects

## Technology-Specific Guidelines
{{TECH_SPECIFIC_GUIDELINES}}

## Project Structure
{{PROJECT_STRUCTURE}}
```

## Architecture-Specific Guidelines

### For Layered Architecture
```
**Layered Architecture Principles:**
- Separation of concerns across horizontal layers
- Dependencies flow downward (Presentation → Application → Domain → Infrastructure)
- Business logic concentrated in Domain layer
- UI concerns isolated in Presentation layer
- Data access isolated in Infrastructure layer

**Layer Responsibilities:**
- **Presentation**: Controllers, UI components, API endpoints
- **Application**: Use cases, application services, orchestration
- **Domain**: Business entities, business rules, domain services
- **Infrastructure**: Database access, external services, technical concerns
```

### For Hexagonal Architecture
```
**Hexagonal Architecture (Ports & Adapters) Principles:**
- Core domain isolated from external concerns
- All external communication through ports (interfaces)
- Adapters implement ports for specific technologies
- Domain has no dependencies on external systems
- High testability through adapter mocking

**Component Responsibilities:**
- **Core/Domain**: Pure business logic, entities, value objects
- **Ports**: Interfaces defining contracts (in/out ports)
- **Adapters/In**: Controllers, CLI, message consumers
- **Adapters/Out**: Repositories, external API clients, message producers
```

### For Clean Architecture
```
**Clean Architecture Principles:**
- Dependencies point inward toward higher-level policies
- Inner layers define interfaces, outer layers implement them
- Business rules isolated from frameworks and tools
- Testable, framework-independent architecture

**Layer Responsibilities:**
- **Entities**: Enterprise business rules, core business objects
- **Use Cases**: Application business rules, orchestrate entities
- **Interface Adapters**: Convert data between use cases and external
- **Frameworks & Drivers**: Web, database, external interfaces
```

### For Vertical Slice Architecture
```
**Vertical Slice Architecture Principles:**
- Organize by features rather than technical layers
- Each slice contains all layers needed for a feature
- Minimize coupling between slices
- Maximize cohesion within slices

**Slice Structure:**
- Each feature folder contains: API, Business Logic, Data Access
- Shared infrastructure for common technical concerns
- Feature-specific models and interfaces
```

### For Event-Driven Architecture
```
**Event-Driven Architecture Principles:**
- Asynchronous communication through events
- Loose coupling between components
- Event sourcing for audit trail
- CQRS for read/write separation

**Component Responsibilities:**
- **Command Side**: Handle writes, generate events
- **Event Store**: Persist events immutably  
- **Read Side**: Project events into read models
- **Event Bus**: Route events to interested handlers
```

## Technology Stack Templates

### Node.js + TypeScript
```
**Technology Guidelines:**
- Use TypeScript for type safety
- Follow Node.js best practices (async/await, error handling)
- Use ESLint + Prettier for code formatting
- Jest for testing
- Environment-based configuration

**Recommended Libraries:**
- Web Framework: Express.js (simple) or NestJS (enterprise)
- ORM: Prisma or TypeORM
- Validation: Joi or class-validator
- Testing: Jest + Supertest
```

### Java + Spring Boot
```
**Technology Guidelines:**
- Use Spring Boot 3.x with Java 17+
- Follow Spring conventions and annotations
- Maven for dependency management
- JUnit 5 for testing

**Recommended Libraries:**
- Data Access: Spring Data JPA
- Security: Spring Security
- Testing: TestContainers
- Documentation: SpringDoc OpenAPI
```

### Python
```
**Technology Guidelines:**
- Use Python 3.11+ with type hints
- Follow PEP 8 style guidelines
- Virtual environment management
- Poetry for dependency management

**Recommended Libraries:**
- Web Framework: FastAPI (API) or Django (full-stack)
- ORM: SQLAlchemy or Django ORM
- Testing: pytest
- Validation: Pydantic
```

## Project Structure Templates

### Layered Structure
```
src/
├── presentation/           # Controllers, UI, API endpoints
├── application/           # Use cases, application services
├── domain/               # Business entities, domain services
├── infrastructure/       # Database, external services
└── shared/              # Cross-cutting concerns
```

### Hexagonal Structure
```
src/
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

### Clean Architecture Structure
```
src/
├── entities/           # Enterprise business rules
├── use-cases/          # Application business rules
├── interface-adapters/ # Controllers, gateways, presenters
├── frameworks/         # Web, DB, external interfaces
└── main/              # Composition root, DI container
```