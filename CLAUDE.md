# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Architecture

This is a **disciplined AI portfolio system** organized around lifecycle stages and development discipline:

### Directory Structure
- **active/** - Projects currently being developed
- **exploration/** - Proof of concepts and experiments  
- **paused/** - Projects temporarily on hold
- **shipped/** - Production-ready projects
- **dev/archived/** - Historical development projects
- **workflow/v1.0/** - Current templates and development standards
- **meta/** - Cross-project patterns and learnings

### Development Philosophy
1. **300-line file limit** - Split files before they become unwieldy
2. **Single responsibility** - Each file has one clear purpose
3. **3-import maximum** - Forces intentional dependencies
4. **Session discipline** - Clear objectives and time limits
5. **Health monitoring** - Proactive problem detection

## Common Commands

### Project Health Monitoring
```bash
# Health check for active projects
for project in active/*; do
  cd "$project" && npm run check:health
done

# Session management
npm run session:start
npm run session:end

# File size monitoring
npm run check:size
npm run check:all
```

### Development Workflows
```bash
# Start new project in exploration
cd exploration/
cp -r ../workflow/v1.0/templates/project-structure ./new-project

# Daily health check across portfolio
cd /path/to/AIPortfolio
find active -name "package.json" -exec dirname {} \; | while read dir; do
  cd "$dir" && npm run check:health
done
```

### Technology-Specific Commands

**JavaScript/Node.js Projects:**
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run test` - Run tests
- `npm run lint` - Code linting

**Python Projects:**
- Most use `uv` for dependency management
- `uv run main.py` - Run main application
- `uv sync` - Install dependencies
- Common structure: `pyproject.toml` with `uv.lock`

**React/Next.js Projects:**
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server

## Project Categories

### Active Development
- **consensus/** - Consensus building system with database, tests, and docs
- **domo-kb-mcp-server/** - MCP server for Domo knowledge base
- **essayAI/** - AI-powered essay creation system
- **operationsClaude/** - Operations management tools
- **soloRuneQuestV2/** - RPG character system (version 2)

### Core Technologies Across Portfolio
- **Frontend:** React, Next.js, Vite, Tailwind CSS
- **Backend:** Node.js/Express, Python/FastAPI, Firebase
- **AI/ML:** OpenAI API, LangChain, GraphRAG
- **Database:** Firebase, SQLite, Neo4j
- **Package Management:** npm, uv (Python), pnpm

### Development Standards
- Each project should have its own CLAUDE.md when reaching sufficient complexity
- Use health check scripts to monitor file size and dependency constraints
- Follow the 3-2-1 development rhythm (3 min planning, 2 min implementation, 1 min verification)
- Emergency reset protocols available for scope creep

### File Organization Guidelines
- Split files when approaching 250-300 lines
- Maximum 3 imports per file to force intentional dependencies
- PURPOSE comment required at top of every new file
- Prefer composition over inheritance

## Project-Specific Notes

### Solo RuneQuest System (soloRunequest/)
- Uses Tailwind CSS: `npm run build:css` after CSS changes
- Express server on port 8087: `npm start`
- Character system is complete Epic 1 - avoid modifications

### Consensus System (consensus/)
- Full development environment with Jest, Playwright
- Package management and validation scripts
- Story assignments and sprint planning documentation

## Session Management
- Define single session objective before starting
- Use session:start and session:end scripts when available
- Monitor file sizes every 10 minutes during development
- Document scope changes with justification

## Emergency Protocols
- **File > 250 lines:** STOP, split immediately
- **More than 3 imports:** STOP, reconsider approach
- **Lost track of objective:** STOP, review PURPOSE
- **Multiple files being edited:** STOP, focus on one

This portfolio prioritizes disciplined development over rapid iteration, with automated health monitoring and clear lifecycle management.
<!-- TEMPLATE:coding-standards -->
## Coding Standards
This project follows strict coding standards:
- Use TypeScript
- Follow ESLint rules
<!-- /TEMPLATE:coding-standards -->
