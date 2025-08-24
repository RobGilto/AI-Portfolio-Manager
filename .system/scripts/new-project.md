# New Project Creator

Interactive project creation tool that sets up new projects with proper structure, dependencies, and health monitoring.

## Usage

```bash
/new-project [name] [stage]
```

**Parameters:**
- `name` - Project name (interactive prompt if not provided)
- `stage` - Target stage: `exploration`, `active`, or `dev` (interactive prompt if not provided)

## Project Types Available

1. **Frontend (React/Vite/TypeScript)**
   - React 18 with TypeScript
   - Vite build system
   - Health monitoring scripts

2. **Backend API (Node.js/Express)**
   - Express server with TypeScript
   - CORS enabled
   - Development with nodemon

3. **Full-Stack (Next.js/TypeScript)**
   - Next.js 14 with App Router
   - TypeScript configuration
   - Optimized for full-stack development

4. **AI/ML Application (Python/FastAPI)**
   - FastAPI with Pydantic
   - OpenAI integration ready
   - UV package management

5. **CLI Tool (Node.js/Ink)**
   - React-based terminal interfaces
   - Commander.js for CLI parsing
   - TypeScript support

6. **MCP Server (Claude Integration)**
   - Claude Code MCP server template
   - Express-based server
   - Tool and handler structure

7. **Python AI/LangChain**
   - LangChain framework
   - Streamlit interface
   - OpenAI integration

## What Gets Created

Every project includes:

### Core Structure
```
project-name/
├── README.md              # Project overview and quick start
├── CLAUDE.md             # Development constitution and rules
├── package.json          # Dependencies and scripts
├── docs/
│   ├── CORE.md          # Single responsibility definition
│   └── ACTIVE.md        # Current sprint (max 3 features)
├── scripts/
│   └── health-check.js  # Project-specific health monitoring
└── src/                 # Source code (structure varies by type)
```

### Standard Scripts
All projects include these npm scripts:
```json
{
  "dev": "...",                    // Development server
  "build": "...",                  // Production build
  "check:health": "...",           // Health monitoring
  "check:size": "...",             // File size checking
  "session:start": "...",          // Begin development session
  "session:end": "..."             // End development session
}
```

### Health Monitoring
- **300-line file limit** enforcement
- **3-import maximum** dependency tracking
- Session management with automated logging
- Emergency reset protocols

## Development Standards

Each project enforces:

1. **File Size Discipline**
   - 300-line hard limit
   - Automatic size checking
   - Split recommendations at 250 lines

2. **Dependency Constraints**
   - Maximum 3 imports per file
   - Intentional dependency management
   - Framework consistency checking

3. **Documentation Requirements**
   - PURPOSE comment in every file
   - CLAUDE.md development constitution
   - Active feature tracking in docs/ACTIVE.md

## Interactive Flow

1. **Project Type Selection**
   ```
   📋 Select Project Type:
   1) Frontend (React/Vite/TypeScript)
   2) Backend API (Node.js/Express)
   [...]
   Choose project type (1-7):
   ```

2. **Project Name Input**
   ```
   Enter project name: my-awesome-app
   ```

3. **Automatic Setup**
   - Creates directory structure
   - Installs dependencies (npm/uv)
   - Generates starter files
   - Sets up health monitoring

## Example Output

```
🚀 AI Portfolio Project Creator
================================

✅ Selected: frontend
🏗️  Creating frontend project structure...
📦 Installing dependencies...
🎉 Project 'my-react-app' created successfully!
📁 Location: exploration/my-react-app
🏷️  Type: frontend

🚀 Frontend Project Next Steps:
  npm run dev                    # Start Vite development server
  # Edit src/App.tsx to build your React application

📋 Essential Commands:
  npm run check:health           # Check project health
  npm run session:start         # Begin development session
  npm run session:end           # End development session

📚 Documentation:
  docs/CORE.md                   # Define project purpose
  docs/ACTIVE.md                 # Plan current features
  CLAUDE.md                      # Development constitution

💡 Remember: Follow the 300-line file limit and health monitoring!
   Run 'npm run check:size' every 10 minutes during development.
```

## Technology-Specific Details

### Python Projects (AI/ML, LangChain)
- Use `uv` for dependency management
- Include `pyproject.toml` configuration
- FastAPI or Streamlit as interface
- Health checks adapted for Python

### Node.js Projects (Frontend, Backend, CLI, MCP)
- TypeScript by default
- ESM modules
- Consistent build tooling
- Health checks via Node.js

## Related Commands

- **Health Monitoring**: `/daily-health` - Check all projects
- **Project Movement**: `/project-move` - Move between stages
- **Individual Health**: `npm run check:health` (from project directory)