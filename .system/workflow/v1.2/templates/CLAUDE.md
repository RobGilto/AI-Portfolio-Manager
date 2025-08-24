# AI Coding Constitution v1.2 - Enhanced Code Quality Standards

## Hard Rules (Non-Negotiable)

### 1. File Size Discipline
- **300 line limit per file** - No exceptions
- Split files when approaching 250 lines
- Prefer composition over inheritance to maintain boundaries

### 2. Scope Discipline
- **One feature per session** - Complete before starting next
- Define scope in first 3 comments, stick to it
- Reject scope creep immediately

### 3. File Creation Protocol
- **PURPOSE comment required** at top of every new file
- **Maximum 3 imports** per file - forces intentional dependencies
- Must justify each import in PURPOSE comment

### 4. Human-AI Testing Protocol
- **Mandatory human testing** for UI/UX, workflows, and complex features
- **AI creates testing documentation** before requesting human participation
- **Human feedback integration** required before feature completion
- **Documented results** with console logs, screenshots, and feedback

### 5. Error Handling Protocol
- **Never silently fail** - All errors must be logged or thrown
- **Specific error messages** - Include context and recovery suggestions
- **Try-catch at boundaries** - API calls, file I/O, external services
- **Graceful degradation** - Features should fail without crashing app

### 6. Security Requirements
- **No hardcoded secrets** - Use environment variables only
- **Input validation** - Sanitize all user inputs
- **SQL injection prevention** - Use parameterized queries
- **XSS prevention** - Escape HTML in outputs
- **Authentication checks** - Verify permissions before operations

### 7. Performance Standards
- **Lazy loading** - Load resources only when needed
- **Debounce/throttle** - Rate limit expensive operations
- **Memoization** - Cache expensive computations
- **Pagination** - Never load unlimited data sets
- **Database indexing** - Index foreign keys and search fields

### 8. Testing Standards
- **Unit test coverage** - Minimum 70% for critical paths
- **Edge case testing** - Null, empty, boundary values
- **Integration tests** - For API endpoints and database operations
- **Error path testing** - Test failure scenarios explicitly

### 9. Documentation Requirements
- **API documentation** - All endpoints with request/response examples
- **Complex logic comments** - Explain "why" not "what"
- **README updates** - Keep installation and usage current
- **Change logs** - Document breaking changes

## Development Rhythm: 3-2-1

### 3 Minutes: Planning Phase
- Define the single objective
- Identify the minimal viable change
- Write PURPOSE comment before coding

### 2 Minutes: Implementation
- Code the minimal solution
- No optimization, no extras
- Focus on working > perfect

### 1 Minute: Verification
- Test the specific change
- Verify scope boundaries maintained
- Check file size limits
- **Create human testing documentation** (for applicable features)

## Chaos Indicators (Emergency Protocols)

### Red Flags
- File exceeds 250 lines → **STOP, split immediately**
- More than 3 imports needed → **STOP, reconsider approach**
- Lost track of original objective → **STOP, review PURPOSE**
- Multiple files being edited → **STOP, focus on one**
- Console.logs in production code → **STOP, remove or use proper logging**
- Hardcoded values that should be configurable → **STOP, use environment variables**

### Emergency Reset Protocol
1. **STOP ALL CODING**
2. Document current state in session notes
3. Return to last working state
4. Redefine scope using 3-2-1 rhythm
5. Resume with single, minimal objective

## Session Management

### Start of Session
- Review previous session notes
- Define single session objective
- Set file size checkpoints
- Identify success criteria
- Run `npm run check:health` to baseline

### During Session
- Check file sizes every 10 minutes
- Maintain scope awareness
- Document any scope changes with justification
- Commit working code frequently (small, atomic commits)

### End of Session
- Document what was accomplished
- Note any scope changes and why
- **Request human testing** (if feature warrants it)
- **Process human feedback** and integrate insights
- Identify next single objective
- Archive session notes
- Run `npm run check:all` for comprehensive validation

## Anti-Patterns to Avoid

### The "While We're Here" Trap
- Seeing related code and wanting to "improve" it
- Making "quick fixes" outside scope
- Adding "just one more feature"

### The Utility Sprawl
- Creating utils for single use cases
- Over-abstracting early
- Building for imaginary future needs

### The Perfect Code Myth
- Optimizing before it works
- Adding features beyond requirements
- Refactoring working code without clear benefit

### The Testing Avoidance Pattern
- Skipping human testing for user-facing features
- Assuming automated tests cover usability
- Not documenting testing procedures for future reference

### The Security Bypass Pattern
- "Temporary" hardcoded credentials
- Disabled security checks "for development"
- Overly permissive CORS settings
- Unvalidated user inputs

## Pre-Commit Checklist

Before ANY commit:
- [ ] All files under 300 lines
- [ ] PURPOSE comments present
- [ ] No more than 3 imports per file
- [ ] Error handling implemented
- [ ] Security measures in place
- [ ] Tests written/updated
- [ ] Documentation current
- [ ] No console.logs in production code
- [ ] No commented-out code blocks
- [ ] Consistent naming conventions
- [ ] Environment variables for configuration
- [ ] Input validation on all user data
- [ ] Proper error messages with context

## File Templates

### Minimal Component Template
```javascript
// PURPOSE: [Single responsibility statement]
// SCOPE: [What this file does and doesn't do]
// IMPORTS: [Justify each of max 3 imports]

import { essential } from 'library';

export function Component() {
  try {
    // Implementation
  } catch (error) {
    // Proper error handling
    throw new Error(`Component failed: ${error.message}`);
  }
}
```

### Service Template with Error Handling
```javascript
// PURPOSE: [Single service responsibility]
// SCOPE: [Clear boundaries of what this service handles]
// IMPORTS: [Max 3, each justified]

class Service {
  constructor() {
    // Validate required config
    if (!process.env.REQUIRED_VAR) {
      throw new Error('Service requires REQUIRED_VAR environment variable');
    }
  }
  
  async operation(input) {
    // Input validation
    if (!input || typeof input !== 'string') {
      throw new Error('Operation requires valid string input');
    }
    
    try {
      // Implementation
    } catch (error) {
      // Log and re-throw with context
      console.error('Service operation failed:', error);
      throw new Error(`Operation failed for input "${input}": ${error.message}`);
    }
  }
}
```

## Automated Health Monitoring

### Health Check Commands
```bash
# Daily health check
npm run check:health

# Import discipline check
npm run check:imports

# Security audit
npm run check:security

# Performance profiling
npm run check:performance

# Human testing check
npm run check:testing

# Comprehensive analysis
npm run check:all

# Session management
npm run session:start
npm run session:end
```

### Automated Documentation Sync
- **GitHub Actions** automatically analyze codebase changes
- **CLAUDE.md updates** proposed via pull requests
- **Weekly health reports** generated with actionable insights
- **Learning pattern capture** from successful practices
- **Security vulnerability scanning** with automated alerts

### AI-Powered Analysis
- Real-time constraint violation detection
- Predictive early warning for file size limits
- Pattern recognition for successful/problematic approaches
- Automated victory capture and learning documentation
- Security pattern analysis and recommendations

## Success Metrics

### Green Flags
- ✅ All files under 300 lines
- ✅ Each file has clear PURPOSE
- ✅ Session objective achieved
- ✅ No scope creep
- ✅ Working code over perfect code
- ✅ Health checks passing automatically
- ✅ Documentation stays current with code
- ✅ **Human testing completed** for applicable features
- ✅ **Human feedback integrated** into feature implementation
- ✅ **Zero security vulnerabilities** in dependency scan
- ✅ **All errors handled gracefully**
- ✅ **Performance benchmarks met**
- ✅ **Test coverage above threshold**

### Daily Review Questions
1. Did I maintain file size discipline?
2. Did I stick to session scope?
3. Is each file's purpose clear?
4. Can I explain every import?
5. Is the code working and minimal?
6. Are automated health checks passing?
7. Is the AI learning from my development patterns?
8. **Did I request human testing for appropriate features?**
9. **Did I integrate human feedback effectively?**
10. **Are all errors handled with proper messages?**
11. **Did I avoid hardcoding any sensitive data?**
12. **Are all user inputs validated?**

### Weekly Automation Review
- Review automated health reports
- Check GitHub Actions suggestions
- Validate AI-captured learning patterns
- Update triggers based on effectiveness
- Review security scan results
- Analyze performance metrics trends
- Update test coverage reports

## Code Quality Gates

### Definition of Done
A feature is only complete when:
1. Code follows all hard rules
2. All tests pass (unit, integration, e2e where applicable)
3. Documentation is updated
4. Security scan shows no vulnerabilities
5. Performance benchmarks met
6. Human testing completed (for UI/UX features)
7. Code reviewed (by human or AI with human approval)
8. Deployment checklist verified

### Deployment Readiness
Before ANY deployment:
- [ ] All environment variables documented
- [ ] Database migrations tested and reversible
- [ ] Rollback plan documented
- [ ] Monitoring and alerts configured
- [ ] Error tracking integrated
- [ ] Performance baseline established
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Backup strategy verified

---

*This constitution prioritizes discipline over cleverness, constraints over freedom, and working code over perfect architecture. Quality gates ensure production readiness. The automated systems support but never replace human judgment and disciplined development practices.*

*Version 1.2 adds enhanced security, performance, and quality standards while maintaining the core discipline principles.*