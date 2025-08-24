# Portfolio-Wide Trigger System

## Critical Triggers
*Indicators that require immediate attention across all projects*

### Red Alert Triggers
**When ANY project shows these signs, stop all work and address immediately**

#### Technical Red Flags
- [ ] Any file exceeds 400 lines
- [ ] Project has more than 30 total files
- [ ] Utils folder contains more than 8 files
- [ ] More than 5 TODO/FIXME per file
- [ ] Circular dependencies detected
- [ ] Build time exceeds 2 minutes
- [ ] Memory usage spikes during development

#### Process Red Flags
- [ ] No commits for more than 1 week
- [ ] Session objectives unclear for 3+ sessions
- [ ] Same bug being worked on for more than 2 days
- [ ] Team member can't explain project in 5 minutes
- [ ] Documentation last updated more than 1 month ago
- [ ] More than 3 active projects per developer

#### Quality Red Flags
- [ ] User testing reveals major workflow issues
- [ ] Performance degradation noticed by users
- [ ] More than 3 production bugs in 1 week
- [ ] Code reviews taking more than 1 hour
- [ ] New features breaking existing functionality

### Yellow Alert Triggers
**Warning signs that need attention within 48 hours**

#### Technical Warnings
- [ ] Files approaching 250 lines
- [ ] Import statements exceeding 4 per file
- [ ] Duplicate code patterns across files
- [ ] Dependencies not used in 2+ weeks
- [ ] Test coverage below 70%

#### Process Warnings
- [ ] Session duration exceeding 3 hours
- [ ] Scope changes made without documentation
- [ ] Features parked for more than 2 weeks
- [ ] Health checks not run in 1 week
- [ ] No user feedback in 2+ weeks

## Portfolio Health Dashboard

### Daily Monitoring
**Run every morning across all active projects**
```bash
# Automated portfolio health check
for project in active/*; do
  cd "$project"
  npm run check:health
  cd ../..
done
```

### Weekly Review Checklist
- [ ] All projects under file size limits
- [ ] No scope violations across portfolio
- [ ] Documentation up to date
- [ ] User feedback collected and addressed
- [ ] Performance metrics stable
- [ ] Team velocity sustainable

### Monthly Assessment
- [ ] Project portfolio size manageable
- [ ] Success patterns being replicated
- [ ] Failure patterns being avoided
- [ ] Team skills and tools adequate
- [ ] User satisfaction improving

## Trigger Response Protocols

### Individual Project Response

#### Yellow Alert Response
1. **Pause current work**
2. **Run comprehensive health check**
3. **Document specific trigger conditions**
4. **Create action plan with timeline**
5. **Resume work only after addressing triggers**

#### Red Alert Response
1. **EMERGENCY STOP all development**
2. **Create backup of current state**
3. **Convene team meeting within 24 hours**
4. **Assess if project reset is needed**
5. **Implement emergency protocols**
6. **Document lessons learned**

### Portfolio-Level Response

#### Multiple Project Triggers
**When 2+ projects show yellow alerts simultaneously:**
- Review portfolio capacity and resource allocation
- Assess if team is overcommitted
- Consider pausing lowest-priority projects
- Examine common failure patterns
- Adjust development processes

#### Systemic Issues
**When similar triggers appear across projects:**
- Identify root cause in tools, processes, or training
- Implement portfolio-wide improvements
- Update templates and standards
- Provide additional team training
- Revise project acceptance criteria

## Early Warning System

### Predictive Indicators
*Signs that suggest triggers may occur soon*

#### Team-Level Predictors
- Developers reporting feeling "behind" or "overwhelmed"
- Increased frequency of "quick fixes"
- Meetings discussing technical debt
- Delays in feature completion estimates
- Reduced participation in code reviews

#### Project-Level Predictors
- Files consistently growing larger each commit
- Increasing number of dependencies
- Longer time between user demos
- More complex feature requests
- Performance optimization discussions

#### Technical Predictors
- Build times gradually increasing
- More frequent merge conflicts
- Test suite taking longer to run
- Development environment setup becoming complex
- Debugging sessions becoming longer

## Custom Trigger Configuration

### Project-Specific Triggers
*Add triggers based on project type and requirements*

#### Frontend Projects
- [ ] Bundle size exceeds 500KB
- [ ] Component nesting depth > 4 levels
- [ ] CSS file exceeds 200 lines
- [ ] Page load time > 2 seconds

#### Backend Projects
- [ ] API response time > 200ms
- [ ] Database queries taking > 1 second
- [ ] Memory usage > 500MB
- [ ] More than 10 API endpoints

#### Full-Stack Projects
- [ ] More than 3 different technologies
- [ ] Frontend and backend not in sync
- [ ] Cross-cutting concerns not abstracted
- [ ] Environment setup takes > 15 minutes

## Trigger History

### Resolved Triggers
**Track triggers that have been successfully addressed**

#### Date: [Date]
**Project**: [Project Name]
**Trigger**: [Specific trigger that fired]
**Response**: [Action taken]
**Resolution Time**: [How long to resolve]
**Prevention**: [Changes made to prevent recurrence]
**Lessons**: [What was learned]

#### Date: [Date]
**Project**: [Project Name]
**Trigger**: [Trigger description]
**Response**: [Response action]
**Resolution Time**: [Time to fix]
**Prevention**: [Prevention measures]
**Lessons**: [Key learnings]

### Trigger Analytics

#### Most Common Triggers
1. File size violations (40% of triggers)
2. Scope creep (25% of triggers)
3. Documentation staleness (15% of triggers)
4. Performance degradation (10% of triggers)
5. Other (10% of triggers)

#### Average Response Times
- Yellow alerts: 24 hours average
- Red alerts: 4 hours average
- Prevention success rate: 75%

---
*Effective trigger systems prevent small problems from becoming large failures.*