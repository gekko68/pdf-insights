# Project Initialization Questionnaire Template

> **Purpose**: Interactive questionnaire to determine architecture style and technology stack for new projects

## Architecture Style Questions

### 1. What type of project are you building?
```
a) Simple CRUD application
b) Business logic heavy system  
c) Microservices/API platform
d) Event-driven system
e) Enterprise application with complex domains
```

### 2. What is your team's experience with Domain-Driven Design (DDD)?
```
a) No experience - prefer simple approaches
b) Some experience - comfortable with basic patterns
c) Experienced - ready for advanced patterns
```

### 3. How complex is your business domain?
```
a) Simple - mostly CRUD operations
b) Medium - some business rules and workflows
c) Complex - many business rules, regulations, compliance needs
```

### 4. Do you need audit trails and event tracking?
```
a) No - basic logging is sufficient
b) Yes - need some audit capabilities
c) Critical - full audit trail required for compliance
```

### 5. How many external integrations do you expect?
```
a) Few (1-5)
b) Moderate (5-15)
c) Many (15+ systems, APIs, services)
```

## Technology Stack Questions

### 6. What is your preferred backend technology?
```
a) Node.js (TypeScript/JavaScript)
b) Java (Spring Boot)
c) Python (FastAPI/Django)
d) C# (.NET)
e) Go
f) Other (please specify)
```

### 7. What frontend approach do you prefer?
```
a) React (with TypeScript)
b) Angular
c) Vue.js
d) Svelte
e) Server-side rendered (Next.js, Nuxt, etc.)
f) No frontend (API only)
```

### 8. What database type fits your needs?
```
a) Relational (PostgreSQL, MySQL)
b) Document (MongoDB, CouchDB)
c) Graph (Neo4j, ArangoDB)
d) Multi-model (mix of above)
e) Not sure - need recommendation
```

### 9. Do you need real-time features?
```
a) No - standard request/response is fine
b) Some - basic real-time updates
c) Extensive - real-time collaboration, live updates
```

### 10. What's your deployment preference?
```
a) Cloud (AWS, Azure, GCP)
b) On-premises
c) Hybrid
d) Not decided yet
```

## Decision Matrix Scoring

Based on answers, use this logic to recommend architecture:

| Question | Answer | Architecture Scores |
|----------|--------|-------------------|
| **Q1: Project Type** | | |
| | a) Simple CRUD | Layered +3 |
| | b) Business logic | Hexagonal +2, Clean +2 |
| | c) Microservices | Hexagonal +3 |
| | d) Event-driven | Event-Driven +3 |
| | e) Enterprise | Clean +3 |
| **Q2: DDD Experience** | | |
| | a) No experience | Layered +3 |
| | b) Some experience | Hexagonal +2 |
| | c) Experienced | Clean +2, Event-Driven +2 |
| **Q3: Domain Complexity** | | |
| | a) Simple | Layered +2 |
| | b) Medium | Hexagonal +2 |
| | c) Complex | Clean +3, Event-Driven +2 |
| **Q4: Audit Requirements** | | |
| | a) No | All architectures +0 |
| | b) Yes | Event-Driven +1 |
| | c) Critical | Event-Driven +3 |
| **Q5: Integrations** | | |
| | a) Few | Layered +1 |
| | b) Moderate | Hexagonal +2 |
| | c) Many | Hexagonal +3 |

## Technology Stack Recommendations

Based on answers, recommend specific technologies:

### Backend Recommendations
- **Node.js**: TypeScript + NestJS (enterprise) or Express (simple)
- **Java**: Spring Boot + Maven
- **Python**: FastAPI (API-focused) or Django (full-stack)
- **C#**: ASP.NET Core
- **Go**: Gin or Echo framework

### Frontend Recommendations
- **React**: Create React App or Next.js + TypeScript
- **Angular**: Angular CLI with standalone components
- **Vue.js**: Vue 3 + Composition API + TypeScript
- **Svelte**: SvelteKit for full-stack

### Database Recommendations
- **Relational**: PostgreSQL (preferred) or MySQL
- **Document**: MongoDB with Mongoose
- **Graph**: Neo4j for relationship-heavy domains
- **Multi-model**: PostgreSQL + JSONB + extensions

### Additional Technology Suggestions
Based on other answers:

**Real-time Features**:
- **Some**: Server-Sent Events (SSE)
- **Extensive**: WebSocket (Socket.io, WS)

**Deployment**:
- **Cloud**: Docker + Kubernetes manifests
- **On-premises**: Docker Compose
- **Hybrid**: Helm charts for flexibility