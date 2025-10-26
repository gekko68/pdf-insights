# Techical Research Workflow Command

**Command:** `/technical-research`

**Purpose:** Orchestrates a technical research  workflow for technical requests.
## Workflow Overview

```
graph LR
    C[Technical request] --> D(Architect Agent);
    D --> E{Create Tech Design & Task Breakdown};
    F --> G(Reviewer Agent);
    G -- "QA Passes" --> I[Done];
    I -- "Trigger developer for next task" --> F
```

## Command Prompt

When the user types `/technical-research [technical request description]`, execute the following orchestrated workflow:

### Phase 1: Technical Design & Task Breakdown
Launch the **Technical Researcher** agent with the task:
```
Analyze and create a comprehensive technical design for: [technical request description]

Requirements:
- Understand the technical requirements and constraints
- Design system architecture considering the bigger picture
- Identify integration points with existing system
- Consider performance, security, and scalability implications
- Break down the implementation into small, junior-developer-friendly tasks

Each task should be:
- Clearly defined and independent
- Completable in 1-2 hours
- Include specific acceptance criteria
- Ordered by dependency requirements
- Focus on technical implementation details

Return the technical design document and ordered task list.
```

## Usage Examples

### Database Optimization Request
```
/tech-request Optimize database queries for user analytics dashboard to reduce load time from 5s to under 1s
```

### API Enhancement Request
```
/tech-request Add rate limiting and caching layer to user authentication API to handle 10x current traffic
```

### Infrastructure Request
```
/tech-request Implement automated backup system for production database with point-in-time recovery capability
```

### Security Enhancement Request
```
/tech-request Add OAuth2 integration with multi-factor authentication support for admin panel access
```

## Workflow Execution

This will:
1. Generate technical design and implementation plan for the request
2. Break down into specific technical tasks like:
   - Database schema optimizations
   - Query refactoring and indexing
   - Caching layer implementation
   - Performance monitoring setup
   - Load testing configuration
3. Implement each task through dev → review → QA cycle
4. Complete when all technical tasks are done and tested

## Success Criteria
- Technical design provides comprehensive implementation plan
- All technical tasks are completed a
- Technical documentation is complete and accurate