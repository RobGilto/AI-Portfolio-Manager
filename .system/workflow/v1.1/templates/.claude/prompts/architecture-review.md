# Architecture Review and Analysis

You are conducting an architectural analysis of this codebase to identify structural strengths, weaknesses, and improvement opportunities while maintaining the disciplined development approach.

## Review Objectives

### 1. Structural Health Assessment
Evaluate the current architecture against CLAUDE.md principles and industry best practices for maintainable, scalable code.

### 2. Constraint Effectiveness Analysis
Assess how well the 300-line file limit, 3-import maximum, and single responsibility principles are working in practice.

### 3. Evolutionary Guidance
Provide specific recommendations for architectural improvements that maintain development velocity while reducing complexity.

## Analysis Framework

### A. Component Architecture Review

**Single Responsibility Analysis:**
- Identify components with clear, single purposes
- Flag components handling multiple concerns
- Assess component coupling and cohesion
- Review component interface design

**Size and Complexity Assessment:**
```bash
# Analyze component complexity
find src/components -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -exec wc -l {} + | sort -nr
```

**Reusability Patterns:**
- Components used across multiple contexts
- Over-abstracted components (premature optimization)
- Under-abstracted repeated patterns
- Effective composition patterns

### B. Service Layer Architecture

**Business Logic Organization:**
- Clear separation of concerns
- Service responsibility boundaries
- Data flow patterns
- Error handling consistency

**Integration Patterns:**
- API communication strategies
- State management approaches
- Side effect handling
- Async operation patterns

### C. File Organization Effectiveness

**Folder Structure Analysis:**
```bash
# Review current structure
find src -type d | head -20
tree src -d -L 3
```

**Co-location Principles:**
- Related files grouped appropriately
- Feature-based vs. type-based organization
- Import distance and complexity
- Navigation and discoverability

### D. Dependency Architecture

**Import Graph Analysis:**
```bash
# Analyze import patterns
grep -r "^import" src/ | cut -d: -f1 | sort | uniq -c | sort -nr
```

**Dependency Health:**
- Circular dependency detection
- Deep import chains
- External dependency usage
- Internal coupling patterns

### E. State Management Architecture

**State Organization:**
- Global vs. local state decisions
- State update patterns
- Data flow predictability
- Performance implications

**State Boundaries:**
- Clear ownership of state pieces
- State sharing strategies
- State synchronization approaches
- Side effect management

## Architectural Quality Metrics

### Maintainability Indicators
- **Low Coupling**: Components depend on few other components
- **High Cohesion**: Related functionality grouped together
- **Clear Interfaces**: Component APIs are simple and focused
- **Consistent Patterns**: Similar problems solved in similar ways

### Scalability Factors
- **Modular Design**: Easy to add new features without massive changes
- **Layer Separation**: Clear boundaries between different concerns
- **Configuration Management**: Easy to adapt for different environments
- **Performance Characteristics**: Architecture supports growth

### Developer Experience
- **Navigation Ease**: Easy to find and understand code
- **Debugging Capability**: Problems can be isolated and fixed quickly
- **Testing Friendliness**: Architecture supports effective testing
- **Onboarding Speed**: New developers can become productive quickly

## Analysis Output Structure

### 🏗️ Architectural Strengths
**What's Working Well:**
- Patterns that effectively support the disciplined approach
- Good examples of constraint-driven design
- Successful abstraction levels
- Effective separation of concerns

### ⚠️ Structural Concerns
**Areas Needing Attention:**
- Violations of architectural principles
- Growing complexity hotspots
- Coupling issues
- Abstraction mismatches

### 🔧 Improvement Opportunities
**Specific Recommendations:**
- File restructuring suggestions
- Component extraction opportunities
- Service layer improvements
- Dependency reduction strategies

### 📊 Constraint Effectiveness Review

**300-Line File Limit Impact:**
- How this constraint has shaped the architecture
- Cases where the limit has been beneficial
- Situations where the limit has caused awkward splits
- Effectiveness for this specific project type

**3-Import Maximum Analysis:**
- Import patterns that work well within this constraint
- Areas where the limit encourages better design
- Cases where the limit creates friction
- Suggestions for import organization improvements

**Single Responsibility Principle Application:**
- Examples of effective single responsibility
- Components that blur responsibility boundaries
- Opportunities for clearer responsibility definition
- Impact on overall architecture clarity

### 🎯 Strategic Architectural Decisions

**Short-term Improvements (Next Sprint):**
- Specific refactoring opportunities
- Component extraction suggestions
- File reorganization recommendations
- Import structure cleanup

**Medium-term Evolution (Next Quarter):**
- Major architectural improvements
- Technology adoption considerations
- Performance optimization opportunities
- Scalability preparation steps

**Long-term Vision (6+ Months):**
- Architectural evolution direction
- Technology migration considerations
- Team growth accommodation
- Maintenance strategy alignment

## Architecture Quality Score

### Assessment Criteria:
- **Maintainability**: 30% - Easy to modify and extend
- **Clarity**: 25% - Easy to understand and navigate
- **Constraint Adherence**: 20% - Following disciplined development rules
- **Performance**: 15% - Adequate performance characteristics
- **Testability**: 10% - Easy to test effectively

### Rating Scale:
- **🟢 Excellent (90-100%)**: Architecture strongly supports project goals
- **🟡 Good (75-89%)**: Solid architecture with minor improvement areas
- **🟠 Needs Work (60-74%)**: Functional but with significant improvement opportunities
- **🔴 Problematic (<60%)**: Architecture is hindering development effectiveness

## Actionable Recommendations

Each architectural recommendation should include:

1. **Specific Problem**: What exactly needs to be addressed
2. **Impact Assessment**: How this affects development and maintenance
3. **Proposed Solution**: Concrete steps to implement improvement
4. **Effort Estimate**: Realistic time and complexity assessment
5. **Success Metrics**: How to measure improvement effectiveness
6. **Risk Factors**: Potential complications or side effects

## Context Considerations

**Project Stage**: Consider whether this is early development, mature product, or legacy maintenance
**Team Size**: Architecture should match team capacity and expertise
**Performance Requirements**: Balance architectural purity with performance needs
**Business Constraints**: Consider timeline and resource limitations
**Future Growth**: Plan for anticipated expansion and evolution

Focus on architectural insights that enable sustained development velocity while maintaining code quality and developer productivity.