# Failure Prevention Strategies

## Proactive Measures
*Systems and practices that prevent common failures before they occur*

### Project Initiation Prevention

#### Scope Definition Protocol
**Problem Prevented**: Undefined or expanding scope
**Implementation**:
1. **Single Sentence Purpose**: Every project must be explainable in one sentence
2. **Explicit Out-of-Scope**: Document what the project will NOT do
3. **Success Criteria**: Define 3-5 measurable completion criteria
4. **Time Box**: Set maximum time investment before reassessment
5. **Exit Criteria**: Define conditions that would end the project

**Template**:
```markdown
## Project Scope Definition
**Purpose**: [Single sentence describing what this project does]
**In Scope**: [3-5 specific features/capabilities]
**Out of Scope**: [Explicitly list what won't be included]
**Success Criteria**: [Measurable, testable outcomes]
**Time Limit**: [Maximum time before reassessment]
**Exit Triggers**: [Conditions that would end project]
```

#### Architecture Constraint System
**Problem Prevented**: Over-engineering and complexity creep
**Implementation**:
- **300-line file limit** enforced by tooling
- **3-import maximum** per file
- **25-file project limit** before reassessment
- **5-utility file limit** maximum
- **Single responsibility** enforced through PURPOSE comments

### Development Prevention

#### Session Structure Protocol
**Problem Prevented**: Unfocused development and scope drift
**Implementation**:
1. **Session Start Ritual**:
   - Define single session objective
   - Set time limit (max 3 hours)
   - Review previous session notes
   - Run health check

2. **During Session**:
   - Use 3-2-1 rhythm (3min plan, 2min code, 1min verify)
   - Document decisions immediately
   - Park off-topic ideas in PARKED.md
   - Check triggers every 30 minutes

3. **Session End Ritual**:
   - Verify objective completion
   - Update documentation
   - Run final health check
   - Define next session objective

#### Quality Gate System
**Problem Prevented**: Technical debt accumulation
**Implementation**:
- **File Size Gates**: Automatic warnings at 200, 250, and 300 lines
- **Import Gates**: Block commits with more than 3 imports per file
- **TODO Gates**: No production deployments with TODO/FIXME comments
- **Test Gates**: All new features must have basic tests
- **Documentation Gates**: PURPOSE comments required for all new files

### Team Prevention

#### Knowledge Transfer Protocol
**Problem Prevented**: Single points of failure and knowledge silos
**Implementation**:
1. **Documentation Standards**: Every project must be explainable to new team member in 15 minutes
2. **Code Review Requirements**: All changes reviewed by someone unfamiliar with the code
3. **Rotation Schedule**: Developers rotate through different projects monthly
4. **Handoff Testing**: New team members must successfully modify project within first day

#### Communication Prevention
**Problem Prevented**: Misaligned expectations and requirements
**Implementation**:
- **Daily Scope Checks**: 5-minute daily review of project objectives
- **Weekly User Check-ins**: Regular validation with actual users
- **Bi-weekly Demo Requirements**: Working software demonstrated every 2 weeks
- **Monthly Portfolio Review**: Team assessment of all active projects

## Failure Mode Analysis

### High-Risk Scenarios
*Situations that commonly lead to project failure*

#### Scenario: "Quick Fix" Requests
**Risk**: Scope creep through small additions
**Prevention Strategy**:
- All requests go through formal scope review
- "Quick" fixes must be time-boxed to 30 minutes
- No changes without updating documentation
- Alternative solutions always considered first

#### Scenario: New Technology Introduction
**Risk**: Complexity explosion and learning curve
**Prevention Strategy**:
- New tech only in exploration projects
- Proof of concept required before adoption
- Team training completed before project use
- Fallback plan to previous technology

#### Scenario: Performance Optimization
**Risk**: Premature optimization and complexity
**Prevention Strategy**:
- Performance requirements defined upfront
- Optimization only after working solution
- Measurements required before and after
- Simple solutions always tried first

#### Scenario: User Feedback Integration
**Risk**: Scope expansion based on user requests
**Prevention Strategy**:
- Feedback collection separate from implementation
- User requests evaluated against project scope
- New features require scope renegotiation
- User education considered before feature addition

### Early Detection Systems

#### Automated Prevention
**Tools that catch problems before human intervention**

```json
{
  "preventionTools": {
    "preCommitHooks": [
      "File size validation",
      "Import count checking",
      "TODO/FIXME detection",
      "Purpose comment validation"
    ],
    "buildChecks": [
      "Health metrics collection",
      "Performance regression detection",
      "Bundle size monitoring",
      "Test coverage validation"
    ],
    "scheduledChecks": [
      "Daily health dashboard",
      "Weekly scope review",
      "Monthly portfolio assessment",
      "Quarterly process review"
    ]
  }
}
```

#### Human Prevention
**Practices that rely on team discipline**

- **Pair Programming**: Second set of eyes on all critical code
- **Code Reviews**: Mandatory review of all changes
- **Design Reviews**: Architecture decisions reviewed by team
- **User Testing**: Regular validation with actual users
- **Retrospectives**: Regular process improvement discussions

## Prevention Effectiveness Tracking

### Success Metrics
**Indicators that prevention systems are working**

#### Quantitative Measures
- **Prevented Scope Creep**: 85% of sessions stay within defined scope
- **File Size Compliance**: 95% of files under 300 lines
- **Documentation Currency**: 90% of docs updated within 1 week
- **User Satisfaction**: Consistently high ratings on delivered features
- **Team Velocity**: Stable or improving sprint completion rates

#### Qualitative Measures
- **Developer Confidence**: Team feels comfortable modifying any project
- **User Feedback**: Users report software "just works" as expected
- **Maintenance Burden**: Low effort required to maintain existing projects
- **Knowledge Sharing**: New team members productive within days
- **Decision Speed**: Quick, confident architectural decisions

### Prevention Failure Analysis
**When prevention systems don't work**

#### Common Prevention Failures
1. **Process Not Followed**: Team skips prevention steps under pressure
2. **Tools Not Working**: Automated systems fail silently
3. **Wrong Prevention**: Solving the wrong problem
4. **Prevention Overhead**: Process slower than fixing problems
5. **Cultural Resistance**: Team doesn't buy into prevention value

#### Prevention System Improvement
- **Regular Process Review**: Monthly assessment of prevention effectiveness
- **Tool Maintenance**: Weekly verification of automated systems
- **Training Updates**: Quarterly team training on prevention practices
- **Process Simplification**: Remove ineffective or burdensome preventions
- **Culture Building**: Celebrate prevention successes

## Emergency Prevention
*Last resort measures when standard prevention fails*

### Circuit Breaker Patterns
**Automatic stopping of problematic processes**

- **Development Stop**: Automatic halt when trigger thresholds exceeded
- **Deployment Block**: Prevent releases when quality gates fail
- **Feature Freeze**: Stop new development when stability threatened
- **Team Rotation**: Mandatory break when individual productivity drops

### Recovery Protocols
**Getting back on track after prevention failure**

1. **Immediate Assessment**: What prevention failed and why?
2. **Damage Containment**: Prevent problem from spreading
3. **Root Cause Analysis**: Understand why prevention didn't work
4. **System Improvement**: Update prevention to catch this failure mode
5. **Team Learning**: Share lessons with entire team

---
*Prevention is always cheaper than fixing. Invest in preventing known failure modes.*