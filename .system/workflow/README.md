# Workflow Management

## Version History

### v1.0/ (Current)
Production-ready workflow system with:
- AI coding constitution (CLAUDE.md)
- Project reset protocols (START_FRESH.md)
- Health monitoring system
- Complete project templates
- Disciplined development practices
- **GitHub Actions automation** for documentation sync
- **Claude Code integration** for AI-powered analysis
- **Weekly health reports** with actionable insights
- **Learning pattern capture** from development activities

### v0.1/ (Legacy)
Original workflow prototype - kept for reference

### archive/
Historical workflow versions and experiments

## Using the Templates

### For New Projects
1. Copy entire `v1.0/templates/` folder
2. Customize CLAUDE.md for project specifics
3. Set up health monitoring scripts
4. Configure GitHub Actions automation (see AUTOMATION_SETUP.md)
5. Set up Claude Code integration with API key
6. Follow 3-2-1 development rhythm

### For Existing Projects
1. Gradually implement health checks
2. Add PURPOSE comments to files
3. Split oversized files
4. Establish session discipline
5. Add automation workflows incrementally
6. Configure AI-powered analysis tools

## Automation Features

### Self-Maintaining Documentation
- **CLAUDE.md synchronization**: Automatically updated based on codebase changes
- **Health report generation**: Weekly AI-powered project analysis
- **Pattern learning**: Automatic capture of successful/problematic practices
- **Trigger refinement**: Early warning system that improves over time

### Setup Requirements
- GitHub repository with Actions enabled
- Anthropic Claude Pro subscription
- ANTHROPIC_API_KEY configured in repository secrets
- Node.js 18+ for local development

### Quick Start with Automation
```bash
# Copy templates including automation
cp -r workflow/v1.0/templates/* your-project/

# Install dependencies
npm install

# Set up GitHub secrets
gh secret set ANTHROPIC_API_KEY

# Test local health checks
npm run check:health

# Start development with automation
npm run session:start
```

## Workflow Evolution

When updating workflow:
1. Create new version folder
2. Document changes and rationale
3. Test on exploration projects first
4. Migrate active projects gradually
5. Archive old versions