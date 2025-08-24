# Claude Code Automation Setup Guide

## Overview

This guide sets up automated CLAUDE.md synchronization and health monitoring using GitHub Actions and Claude Code, creating a self-maintaining disciplined development environment.

## Prerequisites

### Required Accounts & Access
- ✅ GitHub repository with Actions enabled
- ✅ Anthropic Claude Pro subscription with API access
- ✅ Node.js 18+ for local development
- ✅ npm or yarn package manager

### Repository Structure
Your project should include the template files from `workflow/v1.0/templates/`:
```
project/
├── .github/workflows/          # GitHub Actions workflows
├── .claude/                    # Claude Code configuration
├── CLAUDE.md                   # AI coding constitution
├── package.json               # With health check scripts
└── src/                       # Your source code
```

## Setup Steps

### 1. GitHub Secrets Configuration

**Required Secrets:**
Navigate to `Settings > Secrets and variables > Actions` in your GitHub repository and add:

```
ANTHROPIC_API_KEY
```
- Value: Your Claude Pro API key from https://console.anthropic.com/
- Description: Enables Claude Code to analyze your codebase

**Optional Secrets (for enhanced features):**
```
SLACK_WEBHOOK_URL
```
- Value: Webhook URL for Slack notifications
- Description: Sends health reports to your team channel

### 2. Local Development Setup

**Install Claude Code globally:**
```bash
npm install -g @anthropic/claude-code
```

**Install project dependencies:**
```bash
npm install
```

**Test local health checks:**
```bash
# Run basic health check
npm run check:health

# Run comprehensive analysis
npm run check:all

# Test Claude Code integration
claude-code --prompt-file .claude/prompts/health-check.md --config .claude/config.json
```

### 3. Repository Configuration

**Copy template files to your project:**
```bash
# From the AIPortfolio workflow templates
cp -r workflow/v1.0/templates/.github ./
cp -r workflow/v1.0/templates/.claude ./
cp workflow/v1.0/templates/CLAUDE.md ./
cp workflow/v1.0/templates/package.json ./  # Merge scripts with existing
```

**Update package.json scripts:**
```json
{
  "scripts": {
    "check:health": "node scripts/health-check.js",
    "check:scope": "grep -r 'TODO\\|FIXME\\|HACK' src/ || echo 'No scope violations found'",
    "check:size": "find src -name '*.js' -o -name '*.jsx' -o -name '*.ts' -o -name '*.tsx' | xargs wc -l | sort -nr",
    "check:imports": "node scripts/check-imports.js",
    "check:purpose": "node scripts/check-purpose.js",
    "check:all": "npm run check:health && npm run check:scope && npm run check:size",
    "session:start": "echo '# Session $(date)' >> SESSION_LOG.md && npm run check:health",
    "session:end": "npm run check:all && echo '## Session Complete: $(date)' >> SESSION_LOG.md"
  }
}
```

### 4. GitHub Actions Configuration

**Verify workflow files are in place:**
```bash
.github/workflows/
├── claude-sync.yml              # Automated documentation sync
└── weekly-health-check.yml      # Weekly health reports
```

**Test workflow locally (optional):**
```bash
# Install act for local GitHub Actions testing
npm install -g @nektos/act

# Test the workflows
act push
act schedule
```

### 5. Claude Code Configuration

**Customize .claude/config.json for your project:**
```json
{
  "model": "claude-3-sonnet-20240229",
  "max_tokens": 4000,
  "temperature": 0.1,
  "file_extensions": [".js", ".jsx", ".ts", ".tsx", ".md"],
  "ignore_patterns": [
    "node_modules/", 
    ".git/", 
    "dist/",
    "build/",
    "YOUR_SPECIFIC_PATTERNS_HERE"
  ],
  "analysis_depth": "comprehensive"
}
```

**Customize prompts in .claude/prompts/ for your specific needs:**
- Adjust file size thresholds if your project type needs different limits
- Modify success criteria based on your project goals
- Add project-specific anti-patterns to watch for

## Automation Features

### Automated Documentation Sync

**Triggers:**
- Code changes in `src/`, `docs/`, `package.json`
- Weekly scheduled runs (Mondays 9AM UTC)
- Manual workflow dispatch

**What it does:**
- Analyzes current codebase state
- Compares with CLAUDE.md guidelines
- Updates documentation based on actual project needs
- Creates pull requests with proposed changes

**Review process:**
1. GitHub Actions creates PR with documentation updates
2. Review changes for accuracy and appropriateness
3. Merge if changes align with project direction
4. AI learns from merge/reject decisions

### Weekly Health Reports

**Schedule:** Every Monday 10AM UTC

**Generated reports:**
- Project health dashboard with key metrics
- File size compliance analysis
- Technical debt assessment
- Trend analysis and predictions
- Actionable recommendations

**Delivery methods:**
- GitHub issue with comprehensive report
- Artifacts stored for historical tracking
- Optional Slack notifications (if webhook configured)

### Learning System Integration

**Pattern Recognition:**
- Identifies recurring issues across commits
- Captures successful development patterns
- Updates learning documentation automatically
- Improves trigger sensitivity over time

**Victory Documentation:**
- Recognizes successful constraint applications
- Documents effective refactoring approaches
- Captures team practices that work well
- Builds replicable success patterns

## Monitoring and Maintenance

### Daily Workflow Integration

**Start of development:**
```bash
npm run session:start
```

**During development:**
- Check health status: `npm run check:health`
- Monitor file sizes: `npm run check:size`
- Scope compliance: `npm run check:scope`

**End of development:**
```bash
npm run session:end
```

### Weekly Review Process

1. **Review GitHub Actions Reports**
   - Check weekly health check results
   - Review any automated documentation PRs
   - Validate AI-suggested pattern updates

2. **Assess Automation Effectiveness**
   - Are triggers catching problems early?
   - Are false positives manageable?
   - Is the learning system capturing valuable insights?

3. **Adjust Configuration**
   - Update thresholds based on project evolution
   - Refine prompts for better analysis
   - Modify triggers based on effectiveness

### Troubleshooting

**Common Issues:**

**GitHub Actions failing:**
```bash
# Check secrets are configured
gh secret list

# Verify ANTHROPIC_API_KEY is set
gh secret view ANTHROPIC_API_KEY
```

**Claude Code not working locally:**
```bash
# Check API key environment
echo $ANTHROPIC_API_KEY

# Test basic connectivity
claude-code --version

# Verify config file
cat .claude/config.json
```

**Health checks failing:**
```bash
# Check if scripts exist
ls scripts/

# Run individual checks
npm run check:size
npm run check:scope
```

**Performance Issues:**
- Large repositories may need longer timeouts in workflows
- Adjust `max_tokens` in Claude config for complex codebases
- Consider filtering analysis to specific directories

## Customization

### Project-Specific Adaptations

**For Frontend Projects:**
- Add bundle size monitoring
- Include CSS/SCSS file analysis
- Monitor component prop complexity

**For Backend Projects:**
- Add API endpoint documentation sync
- Monitor database query complexity
- Track service dependency graphs

**For Full-Stack Projects:**
- Cross-layer consistency checking
- API-frontend contract validation
- End-to-end feature tracking

### Team Integration

**Code Review Integration:**
- Add health check status to PR templates
- Include constraint compliance in review criteria
- Use automation reports in sprint planning

**Development Process Integration:**
- Include health metrics in daily standups
- Use victory documentation for retrospectives
- Reference pattern learning in architecture decisions

## Success Metrics

### Automation Effectiveness
- **Documentation Currency**: CLAUDE.md stays within 1 week of code changes
- **Problem Prevention**: 80%+ of constraint violations caught before merge
- **Learning Capture**: New patterns documented within 2 weeks of emergence
- **Team Adoption**: 90%+ of developers use health check commands

### Development Quality
- **File Size Compliance**: 95%+ of files under 300 lines
- **Scope Adherence**: 85%+ of sessions stay within defined objectives
- **Technical Debt**: Consistent or decreasing TODO/FIXME counts
- **Velocity Maintenance**: Sprint completion rates remain stable or improve

---

*The automation system enhances but never replaces disciplined development practices. Use it as a tool to support good habits, not as a substitute for developer judgment.*