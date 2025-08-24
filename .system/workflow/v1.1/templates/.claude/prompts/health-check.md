# Weekly Project Health Check Analysis

You are conducting a comprehensive health analysis of this project following the CLAUDE.md discipline methodology. Your goal is to provide actionable insights that maintain project health and prevent technical debt accumulation.

## Health Check Framework

### 1. File Size Compliance Audit

**Critical Violations (Immediate Action Required):**
- List ALL files over 300 lines with exact line counts
- Categorize by severity: 300-400 (high), 400-500 (critical), 500+ (emergency)
- Suggest specific refactoring strategies for each oversized file

**Warning Indicators (Address Soon):**
- Files between 250-299 lines (approaching limit)
- Files that have grown significantly since last check
- Components with multiple responsibilities that could be split

**Assessment Criteria:**
```bash
# Find files by size category
find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -exec wc -l {} + | sort -nr
```

### 2. Folder Organization Analysis

**Structure Compliance:**
- Verify files are in correct folders per CLAUDE.md guidelines
- Identify misplaced files (UI in services/, business logic in components/)
- Check for excessive nesting (more than 3 levels deep)
- Note folder sprawl (too many top-level folders)

**Anti-Pattern Detection:**
- Mixed concerns within folders
- Unclear folder naming conventions
- Duplicate functionality across folders
- Orphaned or single-file folders

### 3. Scope Discipline Assessment

**Documentation Alignment:**
- Compare current features with docs/CORE.md stated purpose
- Check if development has drifted from original scope
- Review docs/PARKED.md vs actual development priorities
- Assess if new features align with project goals

**Scope Creep Indicators:**
- Features not documented in core requirements
- Files addressing problems outside project scope
- Complex solutions for simple requirements
- Mission creep in component responsibilities

### 4. Technical Debt Analysis

**Code Quality Metrics:**
```bash
# Count scope violations
grep -r "TODO\|FIXME\|HACK" src/ | wc -l

# Check import sprawl
grep -r "^import" src/ | cut -d: -f1 | sort | uniq -c | sort -nr | head -10

# Find utility file sprawl
find src -path "*util*" -name "*.js" -o -path "*util*" -name "*.jsx" -o -path "*util*" -name "*.ts" -o -path "*util*" -name "*.tsx"
```

**Debt Categories:**
- **Critical**: TODO/FIXME comments in production code
- **High**: Circular dependencies or complex import chains
- **Medium**: Duplicate code patterns across files
- **Low**: Naming inconsistencies or minor style issues

### 5. Import and Dependency Health

**Import Violations:**
- Files exceeding 3-import limit
- Circular import dependencies
- Unused imports cluttering files
- Deep import chains indicating tight coupling

**Dependency Analysis:**
- External package usage patterns
- Heavy dependencies that could be replaced
- Version consistency across the project
- Security vulnerabilities in dependencies

### 6. Learning and Pattern Capture

**Success Patterns to Document:**
- Well-structured files following guidelines perfectly
- Effective refactoring examples from recent commits
- Good examples of single responsibility principle
- Successful scope management decisions

**Anti-Patterns to Avoid:**
- Common mistakes appearing in multiple files
- Recurring technical debt patterns
- Scope creep examples from recent development
- Performance or maintainability issues

## Analysis Output Format

### 🔴 Critical Issues (Fix Immediately)
- **File Size Violations**: [List files over 300 lines with refactoring suggestions]
- **Scope Violations**: [Major departures from documented purpose]
- **Architecture Issues**: [Circular dependencies, major technical debt]

### 🟡 Warning Items (Address This Sprint)
- **Approaching Limits**: [Files 250-299 lines, utilities approaching 5-file limit]
- **Scope Drift**: [Minor feature creep or documentation lag]
- **Code Quality**: [High TODO count, import violations]

### 🟢 Things Working Well (Continue)
- **Size Discipline**: [Files maintaining good size discipline]
- **Clear Structure**: [Well-organized folders and files]
- **Good Patterns**: [Examples worth replicating]

### 📈 Trends and Patterns
- **Growth Patterns**: [How the codebase is evolving]
- **Common Issues**: [Recurring problems to address systematically]
- **Success Indicators**: [What's working well and why]

### 🎯 Recommended Actions

**This Week:**
- Immediate fixes for critical violations
- File splits for oversized components
- Scope realignment discussions

**This Sprint:**
- Refactoring for warning-level issues
- Documentation updates
- Pattern standardization

**Ongoing:**
- Regular size monitoring
- Scope review sessions
- Learning documentation updates

## Health Score Calculation

Rate overall project health:

- **🟢 Healthy (85-100%)**: Few violations, good trends, maintainable
- **🟡 Needs Attention (70-84%)**: Some issues, manageable debt
- **🔴 Critical (Below 70%)**: Major violations, significant debt, action required

### Scoring Criteria:
- File size compliance: 30%
- Scope adherence: 25% 
- Technical debt level: 25%
- Organization quality: 20%

## Actionable Insights Focus

Every recommendation should be:
- **Specific**: Which files, what changes
- **Measurable**: Clear success criteria
- **Achievable**: Realistic within time constraints
- **Relevant**: Aligned with project goals
- **Time-bound**: Clear deadlines for action

Remember: The goal is maintaining development velocity while preventing technical debt accumulation. Focus on practical, immediate actions that developers can take to improve project health.