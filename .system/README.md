# AI Portfolio - Disciplined Development System

## Directory Structure

### Active Development
- **active/** - Projects currently being developed
- **exploration/** - Proof of concepts and experiments
- **paused/** - Projects temporarily on hold

### Completed & Archived
- **shipped/** - Production-ready projects
- **archive/failed/** - Projects that didn't work out
- **archive/deprecated/** - Obsolete projects

### Development Workflow
- **workflow/v1.0/** - Current templates and standards
- **workflow/v0.1/** - Legacy workflow version
- **workflow/archive/** - Historical workflow versions

### Meta-Analysis
- **meta/reports/** - Project postmortems and analysis
- **meta/** - Cross-project patterns and learnings

## Quick Start

### Starting a New Project
1. Copy templates from `workflow/v1.0/templates/`
2. Create project in `exploration/` for initial development
3. Move to `active/` when scope is defined
4. Ship to `shipped/` when production-ready

### Daily Workflow
```bash
# Morning health check
for project in active/*; do
  cd "$project" && npm run check:health
done

# Start development session
cd active/your-project
npm run session:start

# End development session
npm run session:end
```

## Core Principles

1. **300-line file limit** - Split files before they become unwieldy
2. **Single responsibility** - Each file has one clear purpose
3. **3-import maximum** - Forces intentional dependencies
4. **Session discipline** - Clear objectives and time limits
5. **Health monitoring** - Proactive problem detection

## Templates Available

- `CLAUDE.md` - AI coding constitution and rules
- `START_FRESH.md` - Project reset protocol
- `package.json` - Health check scripts and standards
- `project-structure/` - Complete project template

For detailed documentation, see `workflow/v1.0/docs/`