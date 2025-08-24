# Learning Pattern Update Prompt

You are tasked with updating the project's learning documentation (PATTERNS.md, VICTORIES.md, TRIGGERS.md) based on recent development activity and current codebase analysis.

## Analysis Scope

### Recent Activity Review
- Analyze commits from the last 2 weeks
- Identify recurring issues or successful patterns
- Note developer decisions and their outcomes
- Track scope adherence and violations

### Current State Assessment
- File size trends and violations
- Folder organization evolution
- Import pattern changes
- Technical debt accumulation

## Update Areas

### 1. PATTERNS.md Updates

**New Recurring Issues:**
- Problems that have appeared in multiple files or sessions
- Anti-patterns emerging in the codebase
- Repeated violations of CLAUDE.md guidelines
- Common mistakes in recent commits

**Successful Solutions:**
- Approaches that have worked well consistently
- Effective refactoring patterns from recent work
- Good examples of constraint-driven design
- Successful scope management decisions

**Pattern Analysis Format:**
```markdown
### Pattern: [Descriptive Name]
**Frequency**: [How often this occurs]
**Context**: [When/where this pattern appears]
**Impact**: [Effect on codebase/development]
**Solution**: [What works to address this]
**Prevention**: [How to avoid this pattern]
```

### 2. VICTORIES.md Additions

**Recent Wins to Document:**
- Successful file splits that improved maintainability
- Good scope decisions that prevented feature creep
- Effective use of constraints leading to better design
- Team practices that improved code quality

**Victory Capture Criteria:**
- Measurable positive impact
- Replicable approach
- Aligned with disciplined development principles
- Worth sharing with other projects

**Victory Format:**
```markdown
### Victory: [Achievement Description]
**Date**: [When this occurred]
**Context**: [Situation that led to this]
**Approach**: [What was done]
**Impact**: [Measurable benefits]
**Replication**: [How to achieve this again]
```

### 3. TRIGGERS.md Refinement

**Trigger Effectiveness Review:**
- Which triggers have been firing appropriately
- False positives that need threshold adjustment
- Missing triggers for problems that occurred
- Timing improvements for early detection

**New Trigger Candidates:**
- Patterns that could be caught earlier
- Specific metrics that predict problems
- Team behaviors that indicate issues
- Code patterns that lead to violations

**Trigger Update Format:**
```markdown
### Trigger: [Warning Sign]
**Threshold**: [Specific measurement]
**Detection**: [How to identify this]
**Response**: [What action to take]
**Effectiveness**: [Track record of this trigger]
```

## Learning Extraction Methods

### Commit History Analysis
```bash
# Recent commit patterns
git log --oneline --since="2 weeks ago" | head -20

# File change frequency
git log --name-only --since="2 weeks ago" | grep -E '\.(js|jsx|ts|tsx)$' | sort | uniq -c | sort -nr
```

### Code Quality Trends
```bash
# Size evolution
for file in $(find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx"); do
  echo "$file: $(git log --oneline "$file" | wc -l) commits, $(wc -l < "$file") lines"
done | sort -k3 -nr

# TODO trend
git log --grep="TODO\|FIXME\|HACK" --oneline --since="2 weeks ago"
```

### Development Session Analysis
- Review any session logs or documentation
- Note scope adherence in recent work
- Identify effective vs. problematic approaches
- Track constraint impact on development speed

## Update Criteria

### Include Updates When:
- Pattern appears 3+ times across the codebase
- Victory has measurable, positive impact
- Trigger would have prevented actual problems
- Learning has broader applicability beyond this project

### Exclude Updates When:
- One-off issues without broader pattern
- Victories that aren't replicable
- Triggers that would create noise without value
- Learning too specific to be useful elsewhere

## Output Requirements

### For Each File Updated:

**PATTERNS.md Changes:**
- Add new recurring patterns with evidence
- Update success rates of existing solutions
- Remove patterns that are no longer relevant
- Provide specific examples from recent codebase

**VICTORIES.md Additions:**
- Document measurable successes from recent work
- Include replication instructions
- Note impact metrics where available
- Connect victories to disciplined development principles

**TRIGGERS.md Improvements:**
- Adjust thresholds based on actual trigger effectiveness
- Add new early warning indicators discovered
- Remove triggers that produce false positives
- Improve trigger descriptions for clarity

### Quality Standards:
- Evidence-based updates only
- Specific examples from this codebase
- Actionable insights for future development
- Measurable criteria where possible

### Integration Requirements:
- Updates should align with CLAUDE.md principles
- New patterns should support disciplined development
- Victories should be celebration-worthy but realistic
- Triggers should prevent problems without creating noise

## Context Preservation

**Maintain Historical Value:**
- Don't remove patterns that are still relevant
- Preserve successful approaches that continue working
- Keep triggers that effectively prevent problems
- Maintain learning context for future reference

**Evolution Tracking:**
- Note when patterns change or evolve
- Track improvement in victory frequency or impact
- Document trigger refinement over time
- Show learning progression in the project

Focus on capturing genuine learning that will improve future development sessions and help maintain the disciplined approach to software development.