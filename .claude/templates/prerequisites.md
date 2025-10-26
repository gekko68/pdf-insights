# Prerequisites Template

> **Purpose**: Technology-specific prerequisites and setup requirements

## Node.js + TypeScript Template
```markdown
# Prerequisites & Tech Stack
> **Purpose**: Defines required versions, dependencies, and setup requirements

## Required Versions
- Node.js: 20.x LTS
- TypeScript: 5.x
- {{FRONTEND_FRAMEWORK}}: {{FRAMEWORK_VERSION}}

## Package Manager
- npm (recommended) or yarn

## Development Tools
- ESLint + Prettier for code formatting
- Jest for testing
- Docker (optional for containerization)
- {{DATABASE_CLIENT}} for database connectivity

## IDE Recommendations
- Visual Studio Code with extensions:
  - TypeScript Hero
  - ESLint
  - Prettier
  - Jest Runner

## Environment Setup
1. Install Node.js 20.x LTS
2. Install TypeScript globally: `npm install -g typescript`
3. Install project dependencies: `npm install`
4. Set up environment variables (see .env.example)
5. Run database migrations (if applicable)

## Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run linter
```

## Java + Spring Boot Template
```markdown
# Prerequisites & Tech Stack
> **Purpose**: Defines required versions, dependencies, and setup requirements

## Required Versions
- Java: 17+ LTS (Oracle JDK or OpenJDK)
- Spring Boot: 3.x
- Maven: 3.9+
- {{DATABASE}}: {{DB_VERSION}}

## Development Tools
- IntelliJ IDEA (recommended) or Eclipse
- Maven for dependency management
- Docker for containerization
- {{DATABASE_CLIENT}} for database connectivity

## IDE Setup
- Install IntelliJ IDEA with Spring Boot plugin
- Configure Maven settings
- Set up code formatting (Google Java Style)
- Install database plugin for data source management

## Environment Setup
1. Install Java 17+ LTS
2. Install Maven 3.9+
3. Clone repository
4. Configure application.properties
5. Run `mvn clean install`
6. Set up database connection

## Maven Commands
- `mvn spring-boot:run` - Start development server
- `mvn clean package` - Build JAR file
- `mvn test` - Run tests
- `mvn clean install` - Clean, compile, test, package
```

## Python Template
```markdown
# Prerequisites & Tech Stack
> **Purpose**: Defines required versions, dependencies, and setup requirements

## Required Versions
- Python: 3.11+
- {{WEB_FRAMEWORK}}: {{FRAMEWORK_VERSION}}
- Poetry: 1.6+ (or pip for dependency management)

## Development Tools
- Virtual environment (venv, conda, or poetry)
- Black + isort for code formatting
- pytest for testing
- {{DATABASE_CLIENT}} for database connectivity

## IDE Recommendations
- PyCharm (Professional for Django, Community for FastAPI)
- Visual Studio Code with Python extensions
- Jupyter Notebook (for data analysis if needed)

## Environment Setup
1. Install Python 3.11+
2. Install Poetry: `pip install poetry`
3. Create virtual environment: `poetry install`
4. Activate environment: `poetry shell`
5. Set up environment variables (.env file)
6. Run database migrations (if applicable)

## Commands
- `poetry run uvicorn main:app --reload` (FastAPI)
- `poetry run python manage.py runserver` (Django)
- `poetry run pytest` - Run tests
- `poetry run black .` - Format code
```

## C# + .NET Template
```markdown
# Prerequisites & Tech Stack
> **Purpose**: Defines required versions, dependencies, and setup requirements

## Required Versions
- .NET: 8.0 LTS
- C#: 12.0
- {{DATABASE}}: {{DB_VERSION}}

## Development Tools
- Visual Studio 2022 (recommended) or VS Code
- .NET CLI for command-line operations
- Docker for containerization
- {{DATABASE_CLIENT}} for database connectivity

## IDE Setup
- Install Visual Studio 2022 with ASP.NET workload
- Configure code analysis rules
- Install Entity Framework tools
- Set up debugging configuration

## Environment Setup
1. Install .NET 8.0 SDK
2. Clone repository
3. Restore packages: `dotnet restore`
4. Set up appsettings.json
5. Run Entity Framework migrations
6. Build solution: `dotnet build`

## CLI Commands
- `dotnet run` - Start development server
- `dotnet build` - Build solution
- `dotnet test` - Run tests
- `dotnet publish` - Publish for deployment
```

## Go Template
```markdown
# Prerequisites & Tech Stack
> **Purpose**: Defines required versions, dependencies, and setup requirements

## Required Versions
- Go: 1.21+
- {{WEB_FRAMEWORK}}: {{FRAMEWORK_VERSION}}
- {{DATABASE_DRIVER}}: Latest

## Development Tools
- Go modules for dependency management
- gofmt for code formatting
- golint for linting
- go test for testing
- Docker for containerization

## IDE Recommendations
- GoLand (JetBrains)
- Visual Studio Code with Go extension
- Vim/Neovim with go plugins

## Environment Setup
1. Install Go 1.21+
2. Set GOPATH and GOROOT
3. Initialize module: `go mod init project-name`
4. Install dependencies: `go mod tidy`
5. Set up environment variables
6. Configure database connection

## Go Commands
- `go run main.go` - Run development server
- `go build` - Build executable
- `go test ./...` - Run all tests
- `go mod tidy` - Clean up dependencies
```

## Database-Specific Additions

### PostgreSQL
```markdown
## Database Setup - PostgreSQL
- PostgreSQL: 15+
- Connection: `postgresql://user:password@localhost:5432/dbname`
- Tools: pgAdmin, DBeaver, or psql CLI
- Extensions: uuid-ossp, citext (if needed)

### Setup Steps
1. Install PostgreSQL 15+
2. Create database and user
3. Run migrations/schema setup
4. Configure connection pooling (if needed)
```

### MongoDB
```markdown
## Database Setup - MongoDB
- MongoDB: 7.0+
- Connection: `mongodb://localhost:27017/dbname`
- Tools: MongoDB Compass, Studio 3T
- Features: Transactions, Change Streams (if needed)

### Setup Steps
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Create database and collections
4. Set up indexes for performance
```

### MySQL
```markdown
## Database Setup - MySQL
- MySQL: 8.0+
- Connection: `mysql://user:password@localhost:3306/dbname`
- Tools: MySQL Workbench, phpMyAdmin, DBeaver
- Engine: InnoDB (default)

### Setup Steps
1. Install MySQL 8.0+
2. Secure installation
3. Create database and user with privileges
4. Configure character set (utf8mb4)
```

## Docker Configuration Template
```markdown
## Docker Setup (Optional)
- Docker: Latest stable version
- Docker Compose: v2+

### Development with Docker
1. Build image: `docker build -t project-name .`
2. Run container: `docker run -p 3000:3000 project-name`
3. Use Docker Compose: `docker-compose up -d`

### Production Deployment
- Multi-stage builds for optimization
- Health checks configured
- Environment variables for configuration
- Volume mounts for data persistence
```