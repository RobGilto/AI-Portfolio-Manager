# AI Coding Constitution v1.1 - Human-AI Collaborative Development

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

### 4. Human-AI Testing Protocol (NEW v1.1)
- **Mandatory human testing** for UI/UX, workflows, and complex features
- **AI creates testing documentation** before requesting human participation
- **Human feedback integration** required before feature completion
- **Documented results** with console logs, screenshots, and feedback

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

### During Session
- Check file sizes every 10 minutes
- Maintain scope awareness
- Document any scope changes with justification

### End of Session
- Document what was accomplished
- Note any scope changes and why
- **Request human testing** (if feature warrants it)
- **Process human feedback** and integrate insights
- Identify next single objective
- Archive session notes

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

### The Testing Avoidance Pattern (NEW v1.1)
- Skipping human testing for user-facing features
- Assuming automated tests cover usability
- Not documenting testing procedures for future reference

## File Templates

### Minimal Component Template
```javascript
// PURPOSE: [Single responsibility statement]
// SCOPE: [What this file does and doesn't do]
// IMPORTS: [Justify each of max 3 imports]

import { essential } from 'library';

export function Component() {
  // Implementation
}
```

### Service Template
```javascript
// PURPOSE: [Single service responsibility]
// SCOPE: [Clear boundaries of what this service handles]
// IMPORTS: [Max 3, each justified]

class Service {
  // Implementation
}
```

## Automated Health Monitoring

### Health Check Commands
```bash
# Daily health check
npm run check:health

# Import discipline check
npm run check:imports

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

### AI-Powered Analysis
- Real-time constraint violation detection
- Predictive early warning for file size limits
- Pattern recognition for successful/problematic approaches
- Automated victory capture and learning documentation

## Success Metrics

### Green Flags
- ✅ All files under 300 lines
- ✅ Each file has clear PURPOSE
- ✅ Session objective achieved
- ✅ No scope creep
- ✅ Working code over perfect code
- ✅ Health checks passing automatically
- ✅ Documentation stays current with code
- ✅ **Human testing completed** for applicable features (NEW v1.1)
- ✅ **Human feedback integrated** into feature implementation (NEW v1.1)

### Daily Review Questions
1. Did I maintain file size discipline?
2. Did I stick to session scope?
3. Is each file's purpose clear?
4. Can I explain every import?
5. Is the code working and minimal?
6. Are automated health checks passing?
7. Is the AI learning from my development patterns?
8. **Did I request human testing for appropriate features?** (NEW v1.1)
9. **Did I integrate human feedback effectively?** (NEW v1.1)

### Weekly Automation Review
- Review automated health reports
- Check GitHub Actions suggestions
- Validate AI-captured learning patterns
- Update triggers based on effectiveness

---

*This constitution prioritizes discipline over cleverness, constraints over freedom, and working code over perfect architecture. The automated systems support but never replace human judgment and disciplined development practices.*