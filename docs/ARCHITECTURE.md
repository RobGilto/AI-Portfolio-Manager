# AI Portfolio Management System - Architecture Document

## System Overview

The AI Portfolio Management System is a command-line interface (CLI) tool designed to manage project lifecycles in an ADHD-friendly manner. The system transforms a chaotic directory structure into a disciplined, hidden-folder architecture with centralized state management.

## Project Brief

**Primary Objective**: Create an ADHD-friendly portfolio management system that reduces visual clutter by hiding all project directories while providing a simple CLI interface for project lifecycle management.

**Key Requirements**:
- Hide all project folders (using dot-prefixed directories) to reduce visual overwhelm
- Single CLI interface for all project operations
- Prevent project name collisions across categories
- Support failure analysis workflow with funeral/graveyard stages
- Maintain global project state consistency

## Architecture Principles

### 1. Visual Simplicity
- All project directories are hidden (prefixed with `.`) to reduce ADHD overwhelm
- Clean workspace with only CLI tool visible
- Prevents accidental manual manipulation of project structure

### 2. Single Source of Truth
- Centralized project index (`project-index.json`) prevents name collisions
- Unified state management across all project categories
- Self-healing sync mechanism for consistency

### 3. Lifecycle Management
- Clear project flow: CREATE → NEXT → NOW → DONE
- Failure workflow: FAIL → FUNERAL → GRAVEYARD
- State transitions enforced through CLI commands only

## System Architecture

### Core Components

```
AIPortfolio/
├── cli                           # Main executable (Node.js CLI application)
├── .system/                      # System state and configuration
│   ├── state.json               # Legacy state tracking
│   └── project-index.json       # Centralized project registry
├── .now/                        # Active projects (🔥)
├── .next/                       # Ready to start (📋)
├── .maybe/                      # Ideas/paused projects (💭)
├── .done/                       # Completed projects (✅)
├── .vault/                      # Archived projects (📦)
├── .lab/funeral/                # Failed projects under analysis (⚰️)
└── .graveyard/                  # Analyzed failures (🪦)
```

### Class Architecture

```javascript
class PortfolioManager {
  // Core properties
  - root: string                 # Working directory
  - statePath: string           # Legacy state.json path
  - indexPath: string           # project-index.json path
  - state: Object              # Legacy state object
  - index: Object              # Project index object
  
  // State management
  + loadState()
  + saveState()
  + loadProjectIndex()
  + saveProjectIndex()
  
  // Project operations
  + registerProject(name, category, metadata)
  + updateProjectCategory(name, newCategory)
  + removeFromIndex(name)
  + moveProject(name, from, to)
  
  // Query operations
  + projectExists(name): boolean
  + findProjectLocation(name): string
  + listProjectsByCategory(category): string[]
  
  // System operations
  + syncProjectIndex()
  + ensureDirectories()
  
  // CLI interface
  + run()
  + showStatus()
  + showHelp()
}
```

## Data Architecture

### Project Index Schema

```json
{
  "projects": {
    "project-name": {
      "category": "next|now|maybe|done|vault|funeral|graveyard",
      "createdAt": "2025-08-24T12:31:02.706Z",
      "lastModified": "2025-08-24T12:31:02.706Z", 
      "path": "/full/path/to/project",
      "note": "Optional metadata"
    }
  },
  "lastUpdated": "2025-08-24T12:31:52.518Z",
  "version": "1.0"
}
```

### Legacy State Schema (Backward Compatibility)

```json
{
  "now": ["project1", "project2"],
  "next": ["project3"],
  "maybe": ["project4"],
  "done": ["project5"],
  "funeral": [],
  "graveyard": [],
  "focus": "project1",
  "completionHistory": [
    {
      "project": "project5",
      "completedAt": "2025-08-24T12:31:02.706Z"
    }
  ],
  "updated": "2025-08-24T12:31:52.518Z"
}
```

## Project Lifecycle States

### Active Development Flow
```
CREATE → NEXT → NOW → DONE
   ↓       ↓     ↓
 MAYBE ←── ┴ ── ┴ (pause/deprioritize)
```

### Failure Analysis Flow
```
[NOW|NEXT|MAYBE|DONE] → FUNERAL → GRAVEYARD
                           ↓           ↓
                       (analysis)  (resurrection)
                           ↓           ↓
                        BURY        START
```

### Resurrection Flow
```
GRAVEYARD → START → NOW
DONE → START → NOW
```

### State Descriptions

| State | Emoji | Purpose | Max Display |
|-------|-------|---------|-------------|
| `now` | 🔥 | Active work | All projects |
| `next` | 📋 | Ready to start | All projects |
| `maybe` | 💭 | Ideas/paused | All projects |
| `done` | ✅ | Completed | 3 most recent |
| `vault` | 📦 | Archived | Hidden from status |
| `funeral` | ⚰️ | Analyzing failures | All projects |
| `graveyard` | 🪦 | Failed projects | Hidden from status |

## Command Architecture

### Command Categories

#### Focus Commands
- `./cli` - Show help + status
- `./cli status` (`s`) - Show all projects  
- `./cli focus [project]` - Set/show current focus
- `./cli today` - Today's priorities
- `./cli remind` - "What am I working on?"

#### Project Flow
- `./cli create <name>` - Create new project in NEXT
- `./cli onboard <name>` - Move from visible dirs to system
- `./cli start <name>` - Move to NOW (from NEXT/MAYBE/DONE/GRAVEYARD)
- `./cli ship <name>` - Move NOW → DONE
- `./cli pause <name>` - Move to MAYBE

#### Organization
- `./cli ls [category]` - List projects by category
- `./cli done` - Show all completed projects with resurrection options
- `./cli graveyard` - Show all buried projects with resurrection options
- `./cli cd <name>` - Show CD path for project
- `./cli archive <name>` - Move to vault
- `./cli rename <old> <new>` - Rename project
- `./cli delete <name> [--confirm]` - Permanently delete project

#### Failure Workflow
- `./cli fail <name>` - Move to funeral
- `./cli analyze <name>` - Start post-mortem
- `./cli bury <name>` - Move to graveyard (works on any category including DONE)

#### System Maintenance
- `./cli sync` - Repair index inconsistencies
- `./cli help` (`-h`) - Show help
- `./cli cheat` - Quick command reference
- `./cli examples` - Usage examples

## Key Design Patterns

### 1. Command Pattern
Each CLI command is handled through a switch statement with dedicated methods for complex operations.

### 2. State Synchronization
Dual state management ensures backward compatibility while providing modern index-based operations.

### 3. Collision Prevention
Global project name uniqueness enforced through centralized index checking.

### 4. Self-Healing Architecture
Sync command repairs inconsistencies between filesystem and index state.

### 5. ADHD-Optimized UX
- Limited information display (3 recent DONE projects in status)
- Hidden graveyard from main status
- Dedicated commands for viewing all DONE and buried projects
- Two-column help layout
- Emoji-based visual indicators
- Color-coded output
- Two-step confirmation for destructive operations

## Security Considerations

### Safe Operations
- Read-only filesystem scanning
- Controlled directory creation
- Move operations instead of copy/delete
- Path validation and sanitization

### Risk Mitigation
- Two-step confirmation for destructive operations (delete command)
- Archive functionality preferred over permanent deletion
- Resurrection capability for buried and completed projects
- Metadata preservation during operations
- Rollback capability through sync

## Integration Points

### External Dependencies
- Node.js filesystem (`fs`)
- Path utilities (`path`) 
- Child process execution (`child_process.execSync`)
- Command line argument parsing (`process.argv`)

### File System Integration
- Hidden directory structure management
- JSON state persistence
- Cross-platform path handling
- Directory creation with recursive option

## Error Handling Strategy

### Validation Layers
1. Command syntax validation
2. Project existence checks
3. Filesystem permission validation  
4. State consistency verification

### Recovery Mechanisms
- Sync command for index repair
- Legacy state fallback
- Directory auto-creation
- Graceful degradation for missing data

## Performance Considerations

### Optimization Techniques
- Lazy state loading
- In-memory index caching  
- Minimal filesystem operations
- Efficient project lookups

### Scalability Limits
- Memory-based index (suitable for hundreds of projects)
- Synchronous filesystem operations
- Single-user design
- Local filesystem dependency

## Future Architecture Considerations

### Potential Enhancements
- Database backend for large portfolios
- Multi-user support
- Remote synchronization
- Plugin architecture for custom workflows
- Web interface integration
- Backup/restore functionality

### Migration Strategy
- Version field in project index
- Backward compatibility layer
- State migration scripts
- Gradual feature rollout

## Deployment Architecture

### System Requirements
- Node.js runtime
- Unix-like filesystem (Linux/macOS)
- Terminal with ANSI color support
- Write permissions to working directory

### Installation
1. Place `cli` executable in portfolio root
2. Make executable: `chmod +x cli`
3. Run initialization: `./cli status`
4. System creates required directories and state files

### Configuration
- No external configuration required
- Self-configuring on first run
- State persisted in `.system/` directory
- Portable within filesystem boundaries

This architecture successfully addresses the original requirements of creating an ADHD-friendly project management system while maintaining robustness, consistency, and ease of use.

## Code Cleanup Plan

### High Priority Cleanups (Immediate)

#### 1. Remove Legacy State Duplication
**Problem**: Code maintains both project index (modern) and legacy state arrays, creating synchronization complexity and potential inconsistencies.

**Affected Areas**:
- `moveProject()` method (cli:261-266) - Redundant state array updates
- `create` command (cli:758-761) - Duplicate state management  
- `rename` command (cli:805-807) - Legacy state updates

**Solution**: Remove all legacy state array synchronization since project index is the single source of truth per architecture.

#### 2. Add Error Handling to Filesystem Operations
**Problem**: Critical operations can fail silently, causing data corruption or user confusion.

**Affected Areas**:
- `moveProject()` execSync calls (cli:247, 254, 792) - No try/catch blocks
- JSON parsing in `loadState()` and `loadProjectIndex()` (cli:56, 78) - No error handling

**Solution**: Wrap all filesystem operations in try/catch blocks with user-friendly error messages.

### Medium Priority Cleanups

#### 3. Split Oversized Functions
**Problem**: `syncProjectIndex()` method (cli:142-206) is 65 lines doing multiple responsibilities.

**Solution**: Extract into focused methods:
- `discoverFilesystemProjects()` - Scan directories for projects
- `validateProjectIndex()` - Check index consistency  
- `reportSyncResults()` - Display sync statistics

#### 4. Create Helper Methods for Repeated Patterns
**Problem**: Project category lookup logic repeated across multiple commands.

**Solution**: Create `findProjectCategory(name)` helper method to eliminate duplication in commands.

#### 5. Remove Redundant Code
**Problem**: `listProjects()` method (cli:228-230) is unnecessary wrapper around `listProjectsByCategory()`.

**Solution**: Remove wrapper and use `listProjectsByCategory()` directly.

### Low Priority Cleanups

#### 6. Standardize Naming Conventions
**Problem**: Inconsistent variable naming (`nowProjects` vs `nowList` vs `todayNow`).

**Solution**: Adopt consistent naming pattern: `{category}Projects` throughout codebase.

#### 7. Address Incomplete Features
**Status**: ✅ **COMPLETED** - Delete command implemented with two-step confirmation UI.

### Implementation Order

1. **Phase 1**: ✅ **COMPLETED** - Legacy state removal + error handling (critical for stability)
2. **Phase 2**: ✅ **COMPLETED** - Function splitting + helper methods (improves maintainability)
3. **Phase 3**: ✅ **COMPLETED** - Naming standardization + cleanup incomplete features (polish)

### Success Metrics

- ✅ Zero legacy state synchronization code remaining
- ✅ All filesystem operations have error handling
- ✅ Functions under 50 lines each
- ✅ No code duplication in project lookup logic
- ✅ Consistent naming patterns throughout

**Cleanup Status**: ✅ **COMPLETED** - All cleanup objectives achieved. Implementation now fully aligns with documented architecture.

## Recent Feature Additions

### Enhanced Project Visibility and Management

#### New Commands Added
- `./cli done` - Shows all completed projects with creation dates and resurrection options
- `./cli graveyard` - Shows all buried projects with resurrection instructions
- `./cli delete <name> [--confirm]` - Permanently deletes projects with two-step confirmation
- `./cli remind` - Quick reminder of current focus and active projects
- `./cli cheat` - Quick reference of common commands

#### Enhanced Existing Commands
- `./cli bury` - Now works on projects in any category (including DONE)
- `./cli start` - Now supports resurrection from both DONE and GRAVEYARD categories
- `./cli onboard` - Migration command for bringing visible directories into the system

### Project Resurrection Workflow
The system now supports full project resurrection capabilities:

1. **From DONE**: `./cli start <name>` moves completed projects back to NOW
2. **From GRAVEYARD**: `./cli start <name>` resurrects buried projects to NOW
3. **Visibility**: Dedicated commands show all projects in terminal states
4. **Safety**: Two-step confirmation prevents accidental permanent deletion

### ADHD-Friendly Enhancements
- **Cognitive Load Management**: Status view still shows limited info (3 recent DONE)
- **On-Demand Detail**: Separate commands for viewing complete project lists
- **Visual Clarity**: Consistent emoji and color coding across all commands
- **Safety Rails**: Multiple confirmation steps for destructive operations
- **Quick Reference**: Cheat command for command recall without overwhelming help text

This architecture successfully balances information access with cognitive load management, maintaining the ADHD-friendly design principles while providing comprehensive project lifecycle management.