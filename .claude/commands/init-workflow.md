# Init Workflow Command

**Command:** `/init-workflow`

**Purpose:** Interactive project initialization that determines architecture style, technology stack, and creates appropriate project structure based on user preferences and project requirements.

## Command Prompt

When the user types `/init-workflow`, execute the following interactive workflow:

## Phase 1: Project Discovery & Architecture Selection

Use the questionnaire from `.claude/templates/project-questionnaire.md` to ask the user the 10 key questions that determine the best architecture and technology choices.

The questionnaire covers:
- **Architecture Style Questions (1-5)**: Project type, DDD experience, domain complexity, audit requirements, integration points
- **Technology Stack Questions (6-10)**: Backend technology, frontend approach, database type, real-time features, deployment preference

After collecting answers, use the decision matrix in the questionnaire template to determine:
- **Architecture Style**: Layered, Hexagonal, Clean, Vertical Slice, or Event-Driven
- **Technology Stack**: Backend framework, frontend framework, database, etc.
- **Project Structure**: Folder organization based on chosen architecture

## Phase 2: Architecture-Based Project Setup

Based on the user's responses, proceed with architecture-specific setup:

### Step 1: Basic Project Setup
- Check if the project is under git control
    - If not, initialize with `git init`
    - Create initial .gitignore based on technology stack

### Step 2: Create Claude Configuration
- Check if Claude.md file exists
    - If not, create using template from `.claude/templates/claude-config.md`
    - Replace template variables with selected architecture and technology stack:
      - `{{ARCHITECTURE_STYLE}}` → Selected architecture (e.g., "Hexagonal Architecture")
      - `{{TECHNOLOGY_STACK}}` → Selected technologies (e.g., "Node.js + React + PostgreSQL")
      - `{{ARCHITECTURE_GUIDELINES}}` → Architecture-specific principles from template
      - `{{TECHNOLOGY_LIST}}` → Comma-separated technology list
      - `{{TECH_SPECIFIC_GUIDELINES}}` → Technology-specific guidelines
      - `{{PROJECT_STRUCTURE}}` → Folder structure for selected architecture

### Step 3: Create Context Structure
- Check if './context' folder exists, if not create it
- Create architecture-specific context files:

### Step 4: Technology-Specific Prerequisites
Create `./context/prerequisites.md` using the appropriate template from `.claude/templates/prerequisites.md`:
- For **Node.js/TypeScript**: Use Node.js template section
- For **Java**: Use Java + Spring Boot template section  
- For **Python**: Use Python template section
- For **C#**: Use C# + .NET template section
- For **Go**: Use Go template section

Replace template variables:
- `{{FRONTEND_FRAMEWORK}}` → Selected frontend (React, Angular, Vue, etc.)
- `{{FRAMEWORK_VERSION}}` → Specific version
- `{{DATABASE}}` → Selected database 
- `{{DB_VERSION}}` → Database version
- `{{DATABASE_CLIENT}}` → Database driver/client library

### Step 5: Architecture-Specific Guidelines
Create `./context/architecture-guidelines.md` using the appropriate template from `.claude/templates/architecture-guidelines.md`:
- For **Layered Architecture**: Use Layered Architecture template section
- For **Hexagonal Architecture**: Use Hexagonal Architecture template section
- For **Clean Architecture**: Use Clean Architecture template section  
- For **Vertical Slice Architecture**: Use Vertical Slice Architecture template section
- For **Event-Driven Architecture**: Use Event-Driven Architecture template section

Replace template variables:
- `{{PROJECT_NAME}}` → Actual project name
- Include appropriate folder structure for selected architecture

### Step 6: Create Frontend Guidelines
Create `./context/ui-guidelines.md` using the appropriate template from `.claude/templates/ui-guidelines.md`:
- For **React + TypeScript**: Use React + TypeScript template section
- For **Angular**: Use Angular template section
- For **Vue.js**: Use Vue.js 3 + TypeScript template section
- For **Svelte**: Use Svelte + TypeScript template section
- For **No frontend (API only)**: Skip this step

The template includes complete component architecture, project structure, state management patterns, and testing strategies for each frontend framework.

### Step 7: Create Project Structure
Create folders based on selected architecture and technology using the folder structures defined in:
- `.claude/templates/architecture-guidelines.md` for architecture-specific folder layouts
- `.claude/templates/ui-guidelines.md` for frontend-specific folder structures (if applicable)

Examples:
- **Hexagonal + Node.js**: `src/core/`, `src/adapters/`, `src/config/`, `src/shared/`
- **Layered + Java**: `src/main/java/presentation/`, `src/main/java/application/`, `src/main/java/domain/`, `src/main/java/infrastructure/`
- **Clean + Python**: `src/entities/`, `src/use-cases/`, `src/interface-adapters/`, `src/frameworks/`

### Step 8: Create Development Files
- Create appropriate package.json, pom.xml, requirements.txt, etc.
- Create Docker files if needed
- Set up testing configuration
- Create README.md with setup instructions

### Step 9: Final Setup Tasks
- Create `./docs/tasks` folder for task management
- Initialize appropriate configuration files
- Set up basic project structure based on architecture choice
- Create first commit with initial project structure

## Decision Logic

Use the decision matrix and scoring algorithm from `.claude/templates/project-questionnaire.md` to recommend the optimal architecture and technology stack based on user responses.

The scoring system evaluates:
- Project complexity and type
- Team experience with DDD patterns  
- Integration requirements
- Audit and compliance needs
- Real-time feature requirements

## Example Usage

When user runs `/init-workflow`, the workflow will:

1. Ask all 10 questions interactively
2. Analyze responses and recommend architecture + tech stack
3. Present recommendation: "Based on your answers, I recommend Hexagonal Architecture with Node.js + React + PostgreSQL"
4. Ask for confirmation or modifications
5. Create complete project structure with appropriate files
6. Generate architecture-specific documentation
7. Set up development environment files
8. Create initial commit

The user gets a fully configured project ready for development with their chosen architecture and technology stack! 