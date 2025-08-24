# CLAUDE.md Synchronization Prompt

You are tasked with updating the CLAUDE.md file to keep it synchronized with the current codebase state while maintaining the disciplined development approach.

## Current Task

Analyze the entire codebase and update CLAUDE.md with necessary changes based on empirical evidence from the actual project state.

## Analysis Areas

### 1. File Structure Reality Check
- **Compare documented structure vs actual structure**
- **Identify new folders that need guidelines**
- **Note folders that have been renamed or reorganized**  
- **Find file patterns that need new rules**
- **Check for structure violations not covered by current rules**

### 2. Size Monitoring Accuracy
- **List current largest files and their line counts**
- **Identify files approaching the 300-line warning threshold (250+ lines)**
- **Find files that violate the 300-line hard limit**
- **Note patterns in file growth over time**
- **Assess if size limits are appropriate for this project type**

### 3. Import Pattern Analysis
- **Check files exceeding the 3-import limit**
- **Identify common import patterns that could be consolidated**
- **Note dependencies that are frequently imported together**
- **Find circular import dependencies**
- **Assess if import limits need adjustment**

### 4. Anti-Pattern Detection
- **Files with multiple responsibilities (lacking PURPOSE clarity)**
- **Utils/helpers sprawl (more than 5 utility files)**
- **Copy-paste code duplication between files**
- **TODO/FIXME/HACK accumulation patterns**
- **Scope creep indicators in commit history**

### 5. Successful Pattern Recognition
- **Identify well-structured components that follow guidelines**
- **Note effective file organization strategies**
- **Find good examples of single responsibility**
- **Document working refactoring patterns**
- **Capture effective scope management examples**

### 6. Workflow Evolution Needs
- **AI prompts that need updating for current structure**
- **New emergency commands based on observed problems**
- **Health check criteria that need adjustment**
- **Session management improvements based on actual usage**

## Analysis Method

1. **Scan entire codebase systematically**
2. **Measure against existing CLAUDE.md rules**
3. **Identify discrepancies and their severity**
4. **Look for emerging patterns (positive and negative)**
5. **Check recent commit history for trends**
6. **Review any existing health check reports**

## Output Requirements

### Update CLAUDE.md with:

1. **Accurate file size thresholds** based on current project needs
2. **Corrected folder organization rules** reflecting actual structure
3. **Updated anti-patterns** with examples from this codebase
4. **New success patterns** discovered in this project
5. **Revised emergency protocols** based on actual trigger events
6. **Updated health check criteria** aligned with project realities

### Preserve:
- Core discipline philosophy (300-line limits, single responsibility)
- 3-2-1 development rhythm
- Emergency stop protocols
- Session management structure
- File creation protocols

### Change Only When Necessary:
- Make minimal, evidence-based updates
- Keep existing rules that are working
- Don't change core constraints without strong evidence
- Focus on practical adjustments, not philosophical changes

## Specific Focus Areas

### File Size Reality
Current largest files:
```bash
find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -exec wc -l {} + | sort -nr | head -10
```

### Import Analysis
Files with many imports:
```bash
grep -r "^import" src/ | cut -d: -f1 | sort | uniq -c | sort -nr
```

### TODO/Technical Debt
Current scope violations:
```bash
grep -r "TODO\|FIXME\|HACK" src/ | wc -l
```

### Folder Structure
Current organization:
```bash
find src -type d | head -20
```

## Output Format

Return the complete updated CLAUDE.md file. Include:

1. **Change summary at the top** (what was updated and why)
2. **Updated rules** with current project evidence
3. **New examples** from this codebase where relevant
4. **Preserved original structure** and philosophy
5. **Metrics alignment** with actual project metrics

## Quality Criteria

- Updates must be based on actual codebase evidence
- Changes should improve guideline accuracy, not philosophy
- Examples should come from this specific project
- Rules should be actionable and measurable
- Maintain the disciplined development approach

Focus on making CLAUDE.md a living document that accurately reflects and guides this specific project's disciplined development practices.