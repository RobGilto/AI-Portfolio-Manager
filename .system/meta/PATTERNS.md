# Cross-Project Patterns

## Recurring Issues
*Problems that appear across multiple projects*

### Pattern: Scope Creep During Implementation
**Frequency**: High (80% of projects)
**Symptoms**:
- "While we're here" additions
- Feature requirements expanding mid-development
- Files growing beyond 300 lines
- Multiple TODO comments accumulating

**Root Causes**:
- Unclear initial scope definition
- Lack of explicit "out of scope" boundaries
- No regular scope review checkpoints
- Enthusiasm for related improvements

**Successful Interventions**:
- Written scope boundaries at project start
- Daily scope review in session notes
- "Parking lot" for good but out-of-scope ideas
- Emergency stop protocols when triggers hit

### Pattern: Utils/Helpers Sprawl
**Frequency**: Medium (60% of projects)
**Symptoms**:
- Utils folder with 10+ files
- Functions used only once but "abstracted"
- Circular dependencies between utils
- Difficulty finding specific functionality

**Root Causes**:
- Premature abstraction
- "DRY" principle misapplied
- Creating utilities for imaginary future needs
- Lack of clear utility criteria

**Successful Interventions**:
- "Three uses" rule before creating utils
- Regular utils folder audits
- Inline simple functions rather than abstract
- Maximum 5 utility files per project

### Pattern: File Size Explosion
**Frequency**: High (70% of projects)
**Symptoms**:
- Single files exceeding 500+ lines
- Components handling multiple responsibilities
- Mixed UI and business logic
- Difficult to navigate and modify

**Root Causes**:
- No enforcement of size limits
- Adding features to existing files
- Avoiding file creation overhead
- Unclear component boundaries

**Successful Interventions**:
- Automated size checking in package.json
- Split files at 250 lines (before 300 limit)
- Clear single responsibility per file
- PURPOSE comments enforcing focus

## Working Solutions
*Approaches that consistently succeed*

### Solution: 3-2-1 Development Rhythm
**Success Rate**: 85% of sessions
**Implementation**:
- 3 minutes: Define single objective + PURPOSE comment
- 2 minutes: Implement minimal working solution
- 1 minute: Test and verify scope maintained

**Why It Works**:
- Forces clear objective definition
- Prevents over-engineering
- Creates natural break points
- Maintains focus on essential functionality

### Solution: Emergency Stop Protocols
**Success Rate**: 90% when actually used
**Implementation**:
- File size triggers at 250/300 lines
- Scope violation alerts (TODO/FIXME count)
- Time-based debugging limits (30 minutes)
- Automated health checks

**Why It Works**:
- Catches problems before they become critical
- Provides clear decision points
- Removes emotion from stopping decisions
- Preserves working state for recovery

### Solution: Session Documentation
**Success Rate**: 70% of projects maintain this
**Implementation**:
- Clear session objectives in ACTIVE.md
- Progress tracking with checkboxes
- Decision documentation
- Next session preparation

**Why It Works**:
- Maintains context between sessions
- Prevents scope drift
- Documents decision rationale
- Enables project handoffs

## Anti-Patterns
*Approaches that consistently fail*

### Anti-Pattern: "Perfect Architecture" First
**Failure Rate**: 95% of attempts
**Symptoms**:
- Extensive planning before any working code
- Complex folder structures with no content
- Over-engineered abstractions
- Analysis paralysis

**Why It Fails**:
- Requirements always change during implementation
- Perfect is the enemy of working
- Abstractions are best discovered, not designed
- Users can't provide feedback on plans

### Anti-Pattern: "Best Practices" Compliance
**Failure Rate**: 80% in small projects
**Symptoms**:
- Following enterprise patterns for simple projects
- Adding complexity for "future scalability"
- Tool/framework choices based on popularity
- Over-testing simple functionality

**Why It Fails**:
- Best practices are context-dependent
- Small projects need different approaches
- Premature optimization wastes time
- Complexity without clear benefit

## Success Metrics

### Project-Level Metrics
- **File Count**: < 25 files total
- **Average File Size**: < 200 lines
- **Utils Files**: < 5 total
- **TODO/FIXME Count**: 0 in production
- **Session Scope Adherence**: > 80%

### Cross-Project Trends
- **Reset Frequency**: Healthy projects reset every 3-6 months
- **Feature Completion Rate**: Simple approach = 90%, complex = 30%
- **Maintenance Burden**: Files <300 lines = minimal, >300 = high
- **Team Handoff Success**: Well-documented projects = 95%

---
*Update this document monthly with new patterns and solutions.*