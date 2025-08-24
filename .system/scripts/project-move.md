# Project Lifecycle Manager

Moves projects between different lifecycle stages in the AI portfolio with readiness assessment and health verification.

## Usage

```bash
/project-move [from-stage] [project-name] [to-stage]
```

**Parameters (all interactive if not provided):**
- `from-stage` - Source stage (exploration/active/paused/shipped)
- `project-name` - Name of project to move
- `to-stage` - Destination stage (exploration/active/paused/shipped)

## Lifecycle Stages

### exploration/
**Purpose:** Proof of concepts and experiments
- **Moving FROM:** When concept is validated and ready for active development
- **Moving TO:** When active projects need to be simplified or reconsidered

### active/
**Purpose:** Projects currently being developed
- **Moving FROM:** When development is complete (shipped) or needs to be paused
- **Moving TO:** When exploration projects are ready for serious development

### paused/
**Purpose:** Projects temporarily on hold
- **Moving FROM:** When ready to resume active development or archive permanently
- **Moving TO:** When active projects need temporary suspension

### shipped/
**Purpose:** Production-ready projects
- **Moving FROM:** Rarely - only for major updates or maintenance
- **Moving TO:** When active projects reach production readiness

## Interactive Flow

1. **Current Portfolio Overview**
   ```
   📁 Project Lifecycle Manager
   ==============================
   Current project structure:

   EXPLORATION (proof of concepts):
   neutron-ai-pkm
   runequest-solo-cli

   ACTIVE (current development):
   claude-operation-take2
   domo-cli-harcourts-dataset-alerts

   PAUSED (temporarily on hold):
   claude-clone

   SHIPPED (production ready):
   (no projects)
   ```

2. **Source Selection**
   ```
   From which stage? (exploration/active/paused/shipped): active
   Project name: domo-cli-harcourts-dataset-alerts
   ```

3. **Readiness Assessment**
   ```
   🔍 Assessing project readiness...
   ✅ package.json found
   ✅ README.md found
   ✅ Health check script configured
   ```

4. **Destination Selection**
   ```
   To which stage? (exploration/active/paused/shipped): shipped
   ```

5. **Confirmation**
   ```
   About to move:
     FROM: active/domo-cli-harcourts-dataset-alerts
     TO:   shipped/domo-cli-harcourts-dataset-alerts

   Proceed? (y/N): y
   ```

6. **Execution & Verification**
   ```
   🚀 Moving project...
   ✅ Project moved successfully!

   🏥 Running health check...
   ✅ Basic health check passed

   📁 Project location: shipped/domo-cli-harcourts-dataset-alerts
   💡 Consider updating the project documentation to reflect its new stage
   ```

## Readiness Assessment

Before moving, the tool evaluates:

### Required Elements
- ✅ **package.json** - Project configuration and dependencies
- ✅ **README.md** - Documentation and usage instructions
- ✅ **Health check script** - Automated quality monitoring

### Optional Elements (warnings)
- ⚠️ Missing elements are flagged but don't prevent moves
- Provides guidance on what needs attention

## Safety Features

1. **Validation Checks**
   - Verifies source stage exists
   - Confirms project exists in source
   - Ensures destination stage is valid
   - Prevents overwriting existing projects

2. **Confirmation Required**
   - Shows exact move operation
   - Requires explicit user confirmation
   - Cancellable at any point

3. **Post-Move Verification**
   - Automatically runs health check
   - Confirms successful file system move
   - Provides new location reference

## Common Movement Patterns

### exploration → active
**When:** Concept proven, ready for serious development
```bash
/project-move exploration my-concept active
```

### active → shipped
**When:** Development complete, production ready
```bash
/project-move active my-project shipped
```

### active → paused
**When:** Need to temporarily suspend development
```bash
/project-move active my-project paused
```

### paused → active
**When:** Ready to resume development
```bash
/project-move paused my-project active
```

### shipped → active
**When:** Major updates needed (rare)
```bash
/project-move shipped my-project active
```

## Error Handling

Common errors and solutions:

- **Invalid stage**: Check spelling of stage names
- **Project not found**: Verify project name and current location
- **Destination exists**: Project already in target stage
- **Same source/destination**: Cannot move to same stage

## Post-Move Recommendations

After moving projects:

1. **Update Documentation**
   - Review README.md for stage-appropriate content
   - Update CLAUDE.md if development approach changes
   - Modify docs/ACTIVE.md for new stage requirements

2. **Dependency Management**
   - Run `npm install` or `uv sync` to ensure dependencies
   - Update any stage-specific configurations
   - Verify health checks pass in new location

3. **Version Control**
   - Commit the project in its new location
   - Update any CI/CD pipelines that reference old paths
   - Tag releases when moving to shipped/

## Related Commands

- **Health Monitoring**: `/daily-health` - Check all projects across stages
- **New Projects**: `/new-project` - Create new projects in appropriate stages
- **Individual Health**: `npm run check:health` (from project directory)