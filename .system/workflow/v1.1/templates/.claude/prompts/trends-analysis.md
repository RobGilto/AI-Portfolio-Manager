# Project Trends Analysis

You are analyzing development trends across this project to identify patterns, predict potential issues, and recommend proactive improvements.

## Trend Analysis Framework

### 1. File Growth Trajectory Analysis

**Size Evolution Tracking:**
```bash
# Analyze file growth over time
for file in $(find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx"); do
  current_size=$(wc -l < "$file")
  commit_count=$(git log --oneline "$file" | wc -l)
  echo "$file: $current_size lines, $commit_count commits"
done | sort -k2 -nr
```

**Growth Pattern Categories:**
- **Stable Files**: Consistent size, infrequent changes
- **Growing Files**: Steadily increasing in size
- **Volatile Files**: Frequent size changes
- **New Files**: Recently created, still evolving

**Predictive Indicators:**
- Files approaching 250-line warning threshold
- Files with consistent growth velocity
- Components gaining responsibilities over time
- Areas of the codebase under heavy development

### 2. Development Velocity Trends

**Commit Pattern Analysis:**
```bash
# Recent activity patterns
git log --oneline --since="4 weeks ago" | wc -l
git log --oneline --since="2 weeks ago" | wc -l
git log --oneline --since="1 week ago" | wc -l
```

**Velocity Indicators:**
- Commit frequency changes
- File modification patterns
- Feature completion rates
- Bug fix frequency vs. new feature work

**Team Productivity Signals:**
- Sprint completion consistency
- Technical debt accumulation rate
- Time spent on maintenance vs. new features
- Code review cycle times

### 3. Technical Debt Accumulation Trends

**Debt Growth Tracking:**
```bash
# TODO/FIXME trend over time
git log --grep="TODO\|FIXME\|HACK" --oneline --since="4 weeks ago" | wc -l
grep -r "TODO\|FIXME\|HACK" src/ | wc -l
```

**Debt Categories:**
- **Code Quality Debt**: Style, naming, organization issues
- **Architectural Debt**: Design decisions that need revisiting
- **Documentation Debt**: Missing or outdated documentation
- **Test Debt**: Inadequate or missing test coverage

**Debt Trajectory Indicators:**
- Rate of new TODO comments
- Frequency of "quick fix" commits
- Increasing complexity in code reviews
- Growing debugging time for new features

### 4. Scope Management Trends

**Scope Adherence Tracking:**
- Features added vs. documented scope
- Time spent on unplanned work
- Frequency of scope adjustments
- Parked feature accumulation rate

**Scope Drift Indicators:**
- Features not in original project documentation
- Components handling responsibilities outside their domain
- Increasing project complexity without proportional value
- Team discussions about "what this project should do"

### 5. Quality Metric Trends

**Structural Quality:**
- File size distribution changes
- Import complexity evolution
- Folder organization stability
- Component reusability patterns

**Process Quality:**
- Health check pass rates
- Constraint violation frequency
- Emergency protocol activation
- Documentation currency

### 6. Team Learning Curve Analysis

**Learning Indicators:**
- Time to complete similar tasks trending down
- Reduced debugging time for common issues
- Fewer repeated mistakes in code reviews
- Increased adherence to guidelines over time

**Knowledge Distribution:**
- Team member contribution patterns
- Code ownership concentration
- Review feedback consistency
- Onboarding time for new features

## Trend Analysis Output

### 📈 Positive Trends (Continue These)

**Development Velocity:**
- [Trends showing improved productivity]
- [Evidence of effective constraint adoption]
- [Successful pattern replication]

**Code Quality:**
- [Improvements in file organization]
- [Reduced technical debt accumulation]
- [Better scope discipline over time]

**Team Effectiveness:**
- [Faster feature completion]
- [Improved code review quality]
- [Better constraint adherence]

### 📉 Concerning Trends (Address These)

**Technical Debt Growth:**
- [Files consistently growing larger]
- [Increasing TODO/FIXME counts]
- [Scope creep indicators]

**Process Issues:**
- [Declining health check scores]
- [Increasing constraint violations]
- [Longer development cycles]

**Quality Degradation:**
- [Growing complexity without benefit]
- [Reduced reusability]
- [Increased coupling]

### 🔮 Predictive Insights

**Short-term Projections (2-4 weeks):**
- Files likely to hit size limits
- Areas requiring refactoring attention
- Potential scope creep risks
- Team capacity considerations

**Medium-term Forecast (1-3 months):**
- Architectural pressure points
- Knowledge bottleneck predictions
- Scalability concern areas
- Resource allocation needs

**Long-term Trends (3+ months):**
- Sustainable development patterns
- Team capability evolution
- Project maturity indicators
- Maintenance burden projections

### 🎯 Trend-Based Recommendations

**Immediate Actions (This Week):**
- Address specific files approaching limits
- Implement process improvements for negative trends
- Reinforce practices behind positive trends

**Strategic Adjustments (This Month):**
- Modify guidelines based on trend evidence
- Adjust team practices to support positive trends
- Plan refactoring for predicted problem areas

**Long-term Planning (This Quarter):**
- Architecture evolution based on growth patterns
- Team development needs identification
- Tool and process improvement opportunities

## Trend Quality Assessment

### Reliability Indicators:
- **Data Sufficiency**: Enough history for meaningful trends
- **Pattern Consistency**: Trends hold across different time periods
- **Context Stability**: External factors haven't skewed results
- **Measurement Accuracy**: Metrics actually reflect what they claim

### Actionability Criteria:
- **Influence**: Team can actually affect these trends
- **Measurability**: Changes in trends can be detected
- **Relevance**: Trends impact project success
- **Timeliness**: Trend data supports timely decision-making

## Context Considerations

**Project Lifecycle Stage:**
- Early development vs. mature product considerations
- Growth phase vs. maintenance phase patterns
- Team learning curve vs. established practices

**External Factors:**
- Business requirement changes
- Technology evolution impacts
- Team composition changes
- Resource availability fluctuations

**Seasonal Patterns:**
- Sprint cycle effects
- Release cycle impacts
- Holiday or vacation effects
- Business cycle influences

Focus on trends that provide actionable insights for maintaining project health and development velocity while supporting the disciplined development approach.