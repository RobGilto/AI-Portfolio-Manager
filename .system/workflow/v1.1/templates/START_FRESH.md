# Project Reset Protocol: START_FRESH

## When to Use This Protocol

### Critical Triggers
- 🚨 File sizes exceeding 350+ lines
- 🚨 Lost track of project purpose/scope
- 🚨 Debugging taking longer than original implementation
- 🚨 More than 5 TODO/FIXME/HACK comments per file
- 🚨 Cannot explain codebase to someone in 5 minutes

### Warning Signs
- ⚠️ Multiple failed attempts to add "simple" features
- ⚠️ Fear of changing existing code
- ⚠️ Spending more time reading than writing
- ⚠️ Copy-pasting code between files
- ⚠️ Utils folder with more than 10 files

## Pre-Reset Documentation

### 1. Capture Current State (5 minutes)
```bash
# Create emergency backup
cp -r project-name project-name-backup-$(date +%Y%m%d)

# Document current feature list
echo "## Working Features" > RESET_NOTES.md
echo "## Broken/Incomplete Features" >> RESET_NOTES.md
echo "## Key Learnings" >> RESET_NOTES.md
```

### 2. Extract Working Code (10 minutes)
- Identify 2-3 core functions that actually work
- Copy these to `preserved/` folder
- Document their APIs and test cases
- Note their dependencies

### 3. Define Reset Scope (5 minutes)
- What is the ONE core feature that must work?
- What are the 2-3 essential user workflows?
- What can be completely eliminated?

## Reset Execution

### Phase 1: Clean Slate (15 minutes)
```bash
# Create fresh project structure
mkdir fresh-start
cd fresh-start

# Copy ONLY essential preserved code
cp ../preserved/*.js ./src/
cp ../package.json ./ # Edit to remove unnecessary deps

# Initialize with minimal structure
npm install --production
```

### Phase 2: Implement Core (2 hours max)
- Build ONLY the single core feature
- Follow 300-line file limit religiously
- Use 3-2-1 development rhythm
- No utilities, no abstractions
- Working > Beautiful

### Phase 3: Minimal Extension (1 hour max)
- Add only the most critical second feature
- Maintain all discipline constraints
- Stop at first sign of complexity creep

## Success Criteria

### Must Achieve
- ✅ Core feature working end-to-end
- ✅ All files under 200 lines
- ✅ No TODO/FIXME/HACK comments
- ✅ Can demo in 3 minutes
- ✅ Less than 10 total files

### Quality Gates
- ✅ Each file has clear PURPOSE
- ✅ No more than 3 imports per file
- ✅ Can explain entire codebase in 5 minutes
- ✅ Zero debugging sessions over 30 minutes

## Failure Prevention

### Rules During Reset
1. **No "improving" preserved code** - use as-is or don't use
2. **No "while we're here" additions** - strict scope only
3. **No premature optimization** - working first, always
4. **No external inspiration** - no browsing examples/tutorials
5. **No future-proofing** - solve today's problem only

### Emergency Stops
If during reset you experience:
- File approaching 250 lines → STOP, split or simplify
- Need for 4th import → STOP, reconsider approach
- Debugging session > 30 min → STOP, try different approach
- Scope creep thoughts → STOP, review reset objectives

## Post-Reset Protocol

### Immediate Actions (First 24 hours)
- Document what was eliminated and why
- Note what approach worked this time
- Set up daily file size checks
- Schedule weekly scope reviews

### Ongoing Discipline
- Daily: Check file sizes
- Weekly: Review scope boundaries
- Monthly: Evaluate for next reset

## Template Checklist

```markdown
## Reset Decision Log
- **Date**: [Current Date]
- **Trigger**: [What caused the reset]
- **Core Feature**: [Single most important capability]
- **Success Metric**: [How you'll know it worked]
- **Time Limit**: [Maximum time to invest]

## Preserved Assets
- **Working Code**: [List of functions/components kept]
- **Key Learnings**: [Technical insights to retain]
- **User Feedback**: [What users actually needed]

## Reset Boundaries
- **In Scope**: [Minimal feature set]
- **Out of Scope**: [Everything else, be specific]
- **Success Definition**: [Concrete, testable criteria]
```

---

*Remember: Fresh starts are features, not failures. Every reset makes you faster at building the essential.*