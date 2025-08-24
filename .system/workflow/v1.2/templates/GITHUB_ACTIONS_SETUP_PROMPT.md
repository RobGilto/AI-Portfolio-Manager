# GitHub Actions Setup Prompt for Claude Code

## Context
You are setting up GitHub Actions for a newly created repository that needs automated CLAUDE.md maintenance. The user has Claude Code Pro subscription and wants weekly automated reviews of their codebase to keep CLAUDE.md accurate and up-to-date.

## Your Task

Create a comprehensive GitHub Actions workflow that:

1. **Runs on a weekly schedule** (Sundays at 2 AM UTC)
2. **Can be manually triggered** via workflow_dispatch
3. **Uses Claude Code** to analyze the entire codebase
4. **Updates CLAUDE.md** based on actual code patterns found
5. **Creates a PR** with proposed CLAUDE.md changes
6. **Includes detailed analysis** in the PR description

## Requirements

### Authentication Setup
- Use OAuth token authentication (user has Claude Pro)
- The workflow should use `CLAUDE_CODE_OAUTH_TOKEN` secret
- Include instructions for the user to generate this token

### Workflow Structure

Create `.github/workflows/claude-md-maintenance.yml` with:

```yaml
name: CLAUDE.md Weekly Maintenance

on:
  schedule:
    # Run every Sunday at 2 AM UTC
    - cron: '0 2 * * 0'
  workflow_dispatch:
    inputs:
      analysis_depth:
        description: 'Depth of analysis'
        required: false
        default: 'comprehensive'
        type: choice
        options:
          - quick
          - standard
          - comprehensive

permissions:
  contents: write
  pull-requests: write
  issues: write

jobs:
  analyze-and-update:
    runs-on: ubuntu-latest
    steps:
      # Complete the workflow implementation
```

### Analysis Prompt for Claude

The prompt sent to Claude should be extremely detailed and include:

```markdown
# Codebase Analysis for CLAUDE.md Update

You are analyzing the codebase to update the CLAUDE.md file, which serves as the AI coding constitution for this repository. Your analysis should be thorough and evidence-based.

## Analysis Tasks

### 1. Current State Assessment
- Count total files and their sizes
- Identify files exceeding 250 lines (warning) or 300 lines (violation)
- Check for PURPOSE comments in each file
- Count imports per file
- Identify patterns of code organization

### 2. Code Quality Metrics
- Error handling patterns used
- Security practices observed
- Testing coverage and patterns
- Documentation completeness
- Performance optimizations present

### 3. Architecture Patterns
- Component structure and organization
- Service layer patterns
- Data flow patterns
- State management approach
- API design patterns

### 4. Development Patterns
- Commit message patterns
- PR patterns
- Testing patterns
- Refactoring patterns
- Bug fix patterns

### 5. Technical Debt Indicators
- TODO/FIXME/HACK comments
- Commented-out code blocks
- Duplicate code patterns
- Overly complex functions
- Missing error handling

### 6. Positive Patterns to Reinforce
- Well-structured components
- Good separation of concerns
- Effective error handling
- Clear naming conventions
- Proper abstraction levels

## CLAUDE.md Update Requirements

Based on your analysis, update the CLAUDE.md file to:

1. **Reflect Actual Practices**
   - Update rules to match what's actually working
   - Remove rules that aren't being followed
   - Add new rules for patterns that should be formalized

2. **Add Project-Specific Sections**
   - Technology stack specifics
   - Domain-specific patterns
   - Team conventions observed
   - Performance requirements

3. **Update Metrics**
   - Actual file size distributions
   - Real import patterns
   - Testing coverage actuals
   - Performance baselines

4. **Enhance Guidelines**
   - Add examples from actual code
   - Include anti-patterns found
   - Document victory patterns
   - Update emergency protocols

5. **Maintain Core Principles**
   - Keep the 300-line file limit
   - Maintain 3-import maximum
   - Preserve PURPOSE comment requirement
   - Keep human-AI testing protocol

## Output Format

Provide:
1. Analysis summary with key findings
2. Updated CLAUDE.md content
3. Changelog explaining each change
4. Recommendations for immediate actions
5. Metrics dashboard in markdown table

## Important Notes

- Be specific with file paths and line numbers
- Provide evidence for each recommendation
- Maintain the disciplined development philosophy
- Don't remove working constraints
- Add project-specific enhancements
- Keep the document actionable and clear
```

### PR Creation Details

The PR should include:

1. **Title**: `chore: Weekly CLAUDE.md update - [date]`

2. **Description Template**:
```markdown
## 🤖 Automated CLAUDE.md Update

This PR contains automated updates to CLAUDE.md based on weekly codebase analysis.

### 📊 Analysis Summary
- Files analyzed: [count]
- Patterns identified: [count]
- Violations found: [count]
- Improvements suggested: [count]

### 🔍 Key Findings
[Claude's analysis summary]

### 📝 Changes Made
[Changelog from Claude]

### ⚡ Immediate Actions Recommended
[Priority items needing attention]

### 📈 Metrics Dashboard
[Metrics table]

### 🔄 Review Instructions
1. Review the proposed changes to CLAUDE.md
2. Verify that changes align with team practices
3. Adjust any project-specific recommendations
4. Merge to update the AI coding constitution

---
*This update was generated automatically by Claude Code based on codebase analysis.*
*Generated on: [timestamp]*
```

### Setup Instructions for User

Include these instructions in the workflow file as comments:

```yaml
# SETUP INSTRUCTIONS:
# 1. Generate your Claude Code OAuth token:
#    Run locally: claude setup-token
#    Copy the generated token
#
# 2. Add to GitHub Secrets:
#    - Go to Settings > Secrets and variables > Actions
#    - Create secret: CLAUDE_CODE_OAUTH_TOKEN
#    - Paste your token
#
# 3. Initial Setup Verification:
#    - Run workflow manually first time
#    - Check logs for any issues
#    - Review first PR carefully
#
# 4. Customization:
#    - Adjust schedule in cron expression
#    - Modify analysis prompt for your needs
#    - Add project-specific checks
```

### Error Handling

Include robust error handling:
- Timeout after 30 minutes
- Retry logic for API failures
- Fallback to previous CLAUDE.md if analysis fails
- Notification on failure (issue creation)

### Success Metrics

Track and report:
- Analysis completion time
- Number of findings
- CLAUDE.md diff size
- Actionable recommendations count

## Implementation Notes

1. Use the `anthropics/claude-code-action@beta` action
2. Set appropriate `max_turns` (suggest 5-10)
3. Include `continue-on-error: false` for critical steps
4. Add caching for dependencies if needed
5. Consider matrix strategy for large codebases

## Testing the Workflow

Provide a test plan:
1. Manual trigger with 'quick' analysis
2. Verify PR creation
3. Check CLAUDE.md changes are relevant
4. Ensure no sensitive data exposed
5. Validate markdown formatting

## Important Reminders

- Never commit the OAuth token directly
- Keep prompts focused and specific
- Respect rate limits
- Monitor API usage/costs
- Review changes before merging

This workflow will help maintain an accurate, living CLAUDE.md document that evolves with the codebase while preserving core development disciplines.