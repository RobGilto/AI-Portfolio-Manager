# Trigger System Update and Refinement Prompt

You are tasked with updating and refining the early warning trigger system based on actual project experience and current health issues.

## Trigger Analysis Framework

### Current Trigger Effectiveness Review

**Analyze Existing Triggers:**
1. Which triggers have fired appropriately (true positives)
2. Which triggers fired unnecessarily (false positives)
3. Which problems occurred without trigger warnings (false negatives)
4. Which triggers need threshold adjustments

**Evidence Sources:**
```bash
# Recent files approaching or exceeding limits
find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -exec wc -l {} + | awk '$1 > 250' | sort -nr

# Current technical debt indicators
grep -r "TODO\|FIXME\|HACK" src/ | wc -l

# Utils/helpers sprawl check
find src -path "*util*" -name "*.js" -o -path "*util*" -name "*.jsx" -o -path "*util*" -name "*.ts" -o -path "*util*" -name "*.tsx" | wc -l

# Import complexity analysis
grep -r "^import" src/ | cut -d: -f1 | sort | uniq -c | sort -nr | head -10
```

### Problem Pattern Analysis

**Recent Issues That Should Have Been Caught:**
- Files that violated constraints without advance warning
- Scope creep that developed gradually
- Technical debt accumulation patterns
- Architecture degradation over time

**Early Warning Opportunities:**
- Patterns that could predict constraint violations
- Behavioral indicators of scope drift
- Code quality degradation signals
- Team productivity decline signs

## Trigger Categories for Review

### File Size and Structure Triggers

**Current Thresholds Review:**
- 250-line warning threshold effectiveness
- 300-line hard limit trigger timing
- Folder sprawl detection accuracy
- Component complexity thresholds

**Potential New Triggers:**
- Files growing consistently over multiple commits
- Components gaining multiple responsibilities
- Import count trending upward
- Nested folder depth increasing

### Scope and Process Triggers

**Session Discipline Monitoring:**
- Session duration without clear progress
- Objective changes within single session
- Multiple file modifications simultaneously
- Context switching frequency

**Scope Creep Detection:**
- Features not in documented requirements
- Components handling out-of-scope responsibilities
- Dependencies on undocumented external systems
- User story expansion patterns

### Quality and Debt Triggers

**Technical Debt Accumulation:**
- TODO/FIXME comment density
- Copy-paste code pattern detection
- Circular dependency formation
- Test coverage degradation

**Code Quality Degradation:**
- Review cycle time increases
- Bug report frequency changes
- Performance regression indicators
- Documentation staleness

### Team and Velocity Triggers

**Productivity Indicators:**
- Feature completion time trends
- Time spent debugging vs. building
- Code review feedback patterns
- Knowledge bottleneck formation

**Collaboration Health:**
- Single-person ownership concentration
- Communication gap indicators
- Decision reversal frequency
- Team satisfaction signals

## Trigger Definition Framework

### Trigger Specification Format:

```markdown
### Trigger: [Descriptive Name]

**Detection Method**: [How to identify this condition]
- Automated check command or manual observation
- Frequency of checking (daily, weekly, per-commit)
- Data sources and measurement approach

**Threshold Criteria**: [Specific measurement that activates trigger]
- Quantitative thresholds with rationale
- Trending indicators vs. absolute values
- Context-dependent variations

**Alert Level**: [Severity classification]
- 🟢 Informational: Track but no immediate action
- 🟡 Warning: Address within sprint
- 🔴 Critical: Immediate attention required

**Response Protocol**: [What to do when trigger fires]
- Immediate assessment steps
- Escalation criteria and process
- Documentation requirements
- Follow-up verification

**False Positive Management**: [Handling incorrect triggers]
- Common false positive scenarios
- Context factors that affect accuracy
- Adjustment mechanisms for trigger sensitivity
- Override criteria for special circumstances

**Effectiveness Tracking**: [Measuring trigger value]
- Success rate in catching real problems
- Time saved by early detection
- False positive rate monitoring
- Impact on development velocity
```

## Trigger Update Requirements

### Refinement Criteria

**Existing Trigger Improvements:**
- Adjust thresholds based on actual project experience
- Improve detection accuracy by reducing false positives
- Add context awareness for better trigger timing
- Enhance response protocols based on what actually works

**New Trigger Development:**
- Address gaps where problems occurred without warning
- Create predictive indicators for known failure patterns
- Add early detection for team process issues
- Implement trend-based triggers for gradual degradation

### Integration Requirements

**Automated Detection:**
- Triggers that can be checked programmatically
- Integration with health check scripts
- GitHub Actions workflow compatibility
- Development environment integration

**Manual Observation:**
- Triggers requiring human judgment
- Code review checkpoint integration
- Session planning and review integration
- Team retrospective integration

## Output Requirements

### Updated TRIGGERS.md

**Refined Existing Triggers:**
- Adjusted thresholds based on project evidence
- Improved detection methods with better accuracy
- Enhanced response protocols with proven effectiveness
- Updated examples from actual project experience

**New Trigger Additions:**
- Early warning indicators for recently experienced problems
- Predictive triggers for gradual degradation patterns
- Team collaboration and velocity monitoring
- Quality trend detection triggers

**Removed/Modified Triggers:**
- Triggers with consistently high false positive rates
- Triggers that provide no actionable value
- Triggers superseded by better detection methods
- Triggers inappropriate for this project type

### Trigger Effectiveness Analysis

**Success Stories:**
- Triggers that successfully prevented problems
- Early detection that saved significant time
- Process improvements driven by trigger insights

**Learning Opportunities:**
- False positives that revealed process issues
- Missed problems that led to trigger improvements
- Threshold adjustments based on project reality

### Implementation Guidance

**Automation Setup:**
- Scripts and tools for trigger detection
- Integration with existing development workflow
- Monitoring dashboard requirements
- Alert and notification configuration

**Team Process Integration:**
- Daily/weekly trigger check routines
- Decision-making protocols for trigger responses
- Documentation and learning capture processes
- Trigger system maintenance and evolution

## Context Considerations

### Project Maturity Factors
- Early development vs. mature codebase trigger differences
- Team experience level impact on trigger sensitivity
- Business pressure effects on trigger adherence
- Resource availability impact on trigger response

### Adaptation Guidelines
- Seasonal adjustment for team capacity changes
- Sprint/release cycle integration
- Emergency protocol trigger priority
- Cross-project trigger pattern sharing

Focus on creating a trigger system that provides early warning value without creating alert fatigue, based on evidence from actual project development experience.