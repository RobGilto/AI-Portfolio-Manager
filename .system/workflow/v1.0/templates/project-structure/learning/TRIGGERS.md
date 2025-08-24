# Early Warning System

## Current Triggers
*Monitor these indicators for signs of project drift*

### File Size Triggers
- [ ] Any file approaching 250 lines
- [ ] More than 15 total files in project
- [ ] Utils folder has more than 3 files
- [ ] Import statements exceed 3 per file

### Scope Triggers
- [ ] More than 3 TODO/FIXME comments per file
- [ ] Features being discussed that aren't in core requirements
- [ ] "While we're here" thoughts occurring
- [ ] Debugging sessions lasting more than 30 minutes

### Process Triggers
- [ ] Session objectives unclear or changing
- [ ] Working on multiple files simultaneously
- [ ] Copy-pasting code between files
- [ ] Fear of changing existing working code

### Quality Triggers
- [ ] Tests breaking unexpectedly
- [ ] Performance noticeably degrading
- [ ] UI becoming cluttered or confusing
- [ ] Code that's hard to explain simply

## Trigger Response Protocols

### Yellow Alert (Warning Signs)
**When**: 1-2 triggers detected
**Actions**:
1. Pause current work
2. Run health check: `npm run check:health`
3. Review session objectives
4. Consider splitting current task
5. Update documentation

### Orange Alert (Multiple Warnings)
**When**: 3-4 triggers detected
**Actions**:
1. Stop all new development
2. Run full health check: `npm run check:all`
3. Review and refactor largest files
4. Clear all TODO/FIXME comments
5. Reassess project scope

### Red Alert (Critical)
**When**: 5+ triggers or any file >300 lines
**Actions**:
1. **EMERGENCY STOP**
2. Create backup: `npm run emergency:backup`
3. Document current state
4. Consider project reset protocol
5. Review fundamental approach

## Monitoring Dashboard

### Daily Checks
```bash
# Run this every morning
npm run discipline:daily
```

### Weekly Reviews
```bash
# Run this every Friday
npm run discipline:weekly
```

### Session Start Checklist
- [ ] Previous session completed cleanly
- [ ] No red trigger conditions
- [ ] Clear single objective defined
- [ ] Time limit set
- [ ] Success criteria established

### Session End Checklist
- [ ] Objective achieved or properly parked
- [ ] No new trigger conditions introduced
- [ ] Documentation updated
- [ ] Next session objective identified
- [ ] Health check passed

## Trigger History

### Date: [Date]
**Triggers Detected**: [List]
**Response Action**: [What was done]
**Outcome**: [Result of intervention]
**Prevention**: [How to avoid in future]

### Date: [Date]
**Triggers Detected**: [List]
**Response Action**: [Action taken]
**Outcome**: [Result]
**Prevention**: [Future avoidance]

## Custom Project Triggers
*Add project-specific warning signs here*

### [Project-Specific Trigger]
**Description**: [What to watch for]
**Threshold**: [When to act]
**Response**: [What to do]

---
*Early detection prevents major problems. Check triggers daily.*