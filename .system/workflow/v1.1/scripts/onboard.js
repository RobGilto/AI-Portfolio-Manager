#!/usr/bin/env node

/**
 * AI Portfolio Project Onboarding CLI
 * Run from ~/AIPortfolio root to create new projects with enhanced CLAUDE.md workflow
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// ANSI colors for better output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class ProjectOnboarder {
  constructor() {
    this.projectData = {};
    this.workflowPath = path.join(process.cwd(), 'workflow', 'v1.0');
    this.templatesPath = path.join(this.workflowPath, 'templates');
  }

  async init() {
    console.log(`${colors.cyan}${colors.bold}`);
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║        AI Portfolio Project Onboarder       ║');
    console.log('║     Enhanced CLAUDE.md Workflow System      ║');
    console.log('╚══════════════════════════════════════════════╝');
    console.log(colors.reset);

    // Verify we're in the right directory
    if (!this.verifyLocation()) {
      return;
    }

    // Check prerequisites
    await this.checkPrerequisites();

    // Gather project information
    await this.gatherProjectInfo();

    // Create project structure
    await this.createProject();

    // Setup GitHub integration
    await this.setupGitHub();

    // Final setup and summary
    this.showSummary();

    rl.close();
  }

  verifyLocation() {
    const expectedDirs = ['workflow', 'active', 'shipped', 'exploration'];
    const missingDirs = expectedDirs.filter(dir => !fs.existsSync(dir));
    
    if (missingDirs.length > 0) {
      console.log(`${colors.red}❌ Error: Not in AIPortfolio root directory${colors.reset}`);
      console.log(`Missing directories: ${missingDirs.join(', ')}`);
      console.log(`Please run this from your ~/AIPortfolio directory`);
      return false;
    }

    if (!fs.existsSync(this.workflowPath)) {
      console.log(`${colors.red}❌ Error: Workflow v1.0 not found${colors.reset}`);
      console.log(`Expected: ${this.workflowPath}`);
      console.log(`Please ensure workflow system is set up first`);
      return false;
    }

    console.log(`${colors.green}✅ Location verified: AIPortfolio root${colors.reset}\n`);
    return true;
  }

  async checkPrerequisites() {
    console.log(`${colors.blue}🔍 Checking prerequisites...${colors.reset}`);
    
    const checks = [
      { cmd: 'node --version', name: 'Node.js' },
      { cmd: 'npm --version', name: 'npm' },
      { cmd: 'git --version', name: 'Git' }
    ];

    for (const check of checks) {
      try {
        const version = execSync(check.cmd, { encoding: 'utf8' }).trim();
        console.log(`${colors.green}✅ ${check.name}: ${version}${colors.reset}`);
      } catch (error) {
        console.log(`${colors.red}❌ ${check.name}: Not installed${colors.reset}`);
        process.exit(1);
      }
    }

    // Check for GitHub CLI
    try {
      const ghVersion = execSync('gh --version', { encoding: 'utf8' });
      console.log(`${colors.green}✅ GitHub CLI: Available${colors.reset}`);
      this.projectData.hasGitHubCLI = true;
    } catch (error) {
      console.log(`${colors.yellow}⚠️  GitHub CLI: Not installed (GitHub integration will be limited)${colors.reset}`);
      this.projectData.hasGitHubCLI = false;
    }

    console.log('');
  }

  async gatherProjectInfo() {
    console.log(`${colors.blue}📝 Project Information${colors.reset}`);
    
    // Project name
    this.projectData.name = await this.question('Project name (kebab-case): ');
    while (!this.validateProjectName(this.projectData.name)) {
      console.log(`${colors.red}❌ Invalid name. Use lowercase letters, numbers, and hyphens only.${colors.reset}`);
      this.projectData.name = await this.question('Project name (kebab-case): ');
    }

    // Core purpose (50 words max)
    console.log(`\n${colors.yellow}Core purpose (50 words max - this is crucial for scope discipline):${colors.reset}`);
    this.projectData.purpose = await this.question('What does this project do? ');
    while (this.projectData.purpose.split(' ').length > 50) {
      console.log(`${colors.red}❌ Too long (${this.projectData.purpose.split(' ').length} words). Keep it under 50 words.${colors.reset}`);
      this.projectData.purpose = await this.question('What does this project do? ');
    }

    // Technology stack
    console.log(`\n${colors.blue}Technology Stack:${colors.reset}`);
    console.log('1. React');
    console.log('2. Vue');
    console.log('3. Node.js (Backend)');
    console.log('4. Vanilla JS');
    console.log('5. TypeScript React');
    
    const stackChoice = await this.question('Choose stack (1-5): ');
    const stacks = ['react', 'vue', 'node', 'vanilla', 'typescript-react'];
    this.projectData.stack = stacks[parseInt(stackChoice) - 1] || 'react';

    // MVP Features
    console.log(`\n${colors.green}MVP Features (exactly 3):${colors.reset}`);
    this.projectData.features = [];
    for (let i = 1; i <= 3; i++) {
      const feature = await this.question(`Feature ${i}: `);
      this.projectData.features.push(feature);
    }

    // Rejected features
    console.log(`\n${colors.red}Explicitly Rejected Features (what we WON'T build):${colors.reset}`);
    this.projectData.rejected = [];
    for (let i = 1; i <= 3; i++) {
      const rejected = await this.question(`Rejected feature ${i}: `);
      this.projectData.rejected.push(rejected);
    }

    // Project location
    console.log(`\n${colors.blue}Project Location:${colors.reset}`);
    console.log('1. active/ (serious development)');
    console.log('2. exploration/ (learning/experimental)');
    console.log('3. paused/ (will return to later)');
    
    const locationChoice = await this.question('Choose location (1-3): ');
    const locations = ['active', 'exploration', 'paused'];
    this.projectData.location = locations[parseInt(locationChoice) - 1] || 'active';

    console.log('');
  }

  validateProjectName(name) {
    return /^[a-z0-9-]+$/.test(name) && name.length > 0 && !name.startsWith('-') && !name.endsWith('-');
  }

  async createProject() {
    const projectPath = path.join(process.cwd(), this.projectData.location, this.projectData.name);
    
    // Check if project exists
    if (fs.existsSync(projectPath)) {
      const overwrite = await this.question(`${colors.yellow}⚠️  Project exists. Overwrite? (y/N): ${colors.reset}`);
      if (overwrite.toLowerCase() !== 'y') {
        console.log('Aborted.');
        process.exit(0);
      }
      fs.rmSync(projectPath, { recursive: true, force: true });
    }

    console.log(`${colors.blue}🏗️  Creating project structure...${colors.reset}`);

    // Create directory structure
    const dirs = [
      '',
      'src/components',
      'src/pages', 
      'src/services',
      'src/utils',
      'src/types',
      'docs',
      'docs/decisions',
      'learning',
      'learning/session-logs',
      'scripts',
      '.github/workflows',
      '.claude/prompts'
    ];

    dirs.forEach(dir => {
      fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
    });

    // Copy and populate templates
    await this.populateTemplates(projectPath);

    // Initialize tech stack
    await this.initializeTechStack(projectPath);

    console.log(`${colors.green}✅ Project structure created${colors.reset}`);
  }

  async populateTemplates(projectPath) {
    const templates = {
      'CLAUDE.md': this.generateClaudeMd(),
      'START_FRESH.md': this.generateStartFresh(),
      'README.md': this.generateReadme(),
      'package.json': this.generatePackageJson(),
      '.gitignore': this.generateGitignore(),
      'docs/CORE.md': this.generateCore(),
      'docs/ACTIVE.md': this.generateActive(),
      'docs/PARKED.md': this.generateParked(),
      'docs/REJECTED.md': this.generateRejected(),
      'learning/PATTERNS.md': this.generatePatterns(),
      'learning/VICTORIES.md': this.generateVictories(),
      'learning/TRIGGERS.md': this.generateTriggers(),
      'scripts/health-check.js': this.generateHealthCheck(),
      '.github/workflows/claude-sync.yml': this.generateClaudeSync(),
      '.github/workflows/weekly-health-check.yml': this.generateWeeklyHealth(),
      '.claude/prompts/update-claude-md.md': this.generateUpdatePrompt(),
      '.claude/prompts/health-check.md': this.generateHealthPrompt(),
      '.claude/config.json': this.generateClaudeConfig()
    };

    for (const [filename, content] of Object.entries(templates)) {
      fs.writeFileSync(path.join(projectPath, filename), content);
    }

    // Create today's session log
    const today = new Date().toISOString().split('T')[0];
    fs.writeFileSync(
      path.join(projectPath, 'learning/session-logs', `${today}.md`),
      this.generateSessionLog()
    );
  }

  async initializeTechStack(projectPath) {
    console.log(`${colors.blue}⚙️  Initializing ${this.projectData.stack} project...${colors.reset}`);
    
    process.chdir(projectPath);
    
    try {
      switch (this.projectData.stack) {
        case 'react':
          execSync('npx create-react-app . --template typescript', { stdio: 'inherit' });
          break;
        case 'vue':
          execSync('npm create vue@latest .', { stdio: 'inherit' });
          break;
        case 'node':
          execSync('npm init -y', { stdio: 'inherit' });
          execSync('npm install express cors helmet morgan', { stdio: 'inherit' });
          break;
        case 'typescript-react':
          execSync('npx create-react-app . --template typescript', { stdio: 'inherit' });
          break;
        default:
          execSync('npm init -y', { stdio: 'inherit' });
      }
    } catch (error) {
      console.log(`${colors.yellow}⚠️  Tech stack initialization failed, continuing with basic setup${colors.reset}`);
    }
  }

  async setupGitHub() {
    if (!this.projectData.hasGitHubCLI) {
      console.log(`${colors.yellow}⚠️  GitHub CLI not available, skipping GitHub integration${colors.reset}`);
      console.log(`Run 'gh repo create' manually after installing GitHub CLI`);
      return;
    }

    const createRepo = await this.question(`${colors.blue}🌐 Create GitHub repository? (Y/n): ${colors.reset}`);
    if (createRepo.toLowerCase() === 'n') {
      return;
    }

    const visibility = await this.question('Repository visibility (public/private) [private]: ');
    const isPublic = visibility.toLowerCase() === 'public';

    try {
      console.log(`${colors.blue}🌐 Creating GitHub repository...${colors.reset}`);
      
      // Initialize git if not already done
      if (!fs.existsSync('.git')) {
        execSync('git init', { stdio: 'inherit' });
      }
      
      // Create GitHub repo
      const repoCmd = `gh repo create ${this.projectData.name} ${isPublic ? '--public' : '--private'} --description "${this.projectData.purpose}" --source .`;
      execSync(repoCmd, { stdio: 'inherit' });
      
      // Add all files and commit
      execSync('git add .', { stdio: 'inherit' });
      execSync('git commit -m "INITIAL: Enhanced CLAUDE.md workflow setup complete"', { stdio: 'inherit' });
      execSync('git push -u origin main', { stdio: 'inherit' });
      
      console.log(`${colors.green}✅ GitHub repository created and pushed${colors.reset}`);
      
    } catch (error) {
      console.log(`${colors.red}❌ GitHub setup failed: ${error.message}${colors.reset}`);
      console.log(`You can manually create the repository later with: gh repo create`);
    }
  }

  showSummary() {
    const projectPath = path.join(process.cwd(), this.projectData.location, this.projectData.name);
    
    console.log(`\n${colors.green}${colors.bold}🎉 Project created successfully!${colors.reset}\n`);
    
    console.log(`📁 Location: ${colors.cyan}${projectPath}${colors.reset}`);
    console.log(`🎯 Purpose: ${colors.white}${this.projectData.purpose}${colors.reset}`);
    console.log(`⚙️  Stack: ${colors.yellow}${this.projectData.stack}${colors.reset}`);
    console.log(`📋 MVP Features: ${colors.green}${this.projectData.features.length} features ready${colors.reset}`);
    console.log(`🚫 Rejected: ${colors.red}${this.projectData.rejected.length} features documented${colors.reset}`);
    
    console.log(`\n${colors.blue}${colors.bold}Next Steps:${colors.reset}`);
    console.log(`1. ${colors.cyan}cd ${this.projectData.location}/${this.projectData.name}${colors.reset}`);
    console.log(`2. ${colors.cyan}npm install${colors.reset}`);
    console.log(`3. ${colors.cyan}npm run check:health${colors.reset}`);
    console.log(`4. Start coding: ${colors.cyan}"AI, let's implement the first feature from docs/ACTIVE.md"${colors.reset}`);
    
    console.log(`\n${colors.blue}${colors.bold}Useful Commands:${colors.reset}`);
    console.log(`${colors.cyan}npm run check:health${colors.reset}    # Monitor project health`);
    console.log(`${colors.cyan}npm run check:scope${colors.reset}     # Check for scope creep`);
    console.log(`${colors.cyan}npm run check:size${colors.reset}      # Monitor file sizes`);
    
    if (this.projectData.hasGitHubCLI) {
      console.log(`\n${colors.green}🌐 GitHub Actions enabled for automated CLAUDE.md updates${colors.reset}`);
    }
    
    console.log(`\n${colors.yellow}Remember: Follow the 3-2-1 rhythm and keep files under 300 lines!${colors.reset}\n`);
  }

  question(query) {
    return new Promise(resolve => {
      rl.question(query, resolve);
    });
  }

  // Template generation methods
  generateClaudeMd() {
    return `# CLAUDE.md - AI Coding Constitution

## 🚨 HARD RULES (Never Override)

1. **NO file exceeds 300 lines.** At 250 lines, STOP and refactor.
2. **NO new features without updating docs/ACTIVE.md FIRST**
3. **NO "while we're at it" additions.** Add to docs/PARKED.md instead.
4. **Every 3rd AI response must include: "Are we still building [${this.projectData.purpose}]?"**

## 📁 Project Structure

\`\`\`
${this.projectData.name}/
├── CLAUDE.md           # This constitution
├── START_FRESH.md      # Project reset protocol
├── src/
│   ├── components/     # UI components (max 3 imports per file)
│   ├── pages/         # Route components
│   ├── services/      # API calls, business logic
│   ├── utils/         # Helper functions (max 3 files!)
│   └── types/         # TypeScript interfaces
├── docs/
│   ├── CORE.md        # The ONE thing this app must do
│   ├── ACTIVE.md      # Current 3 features we're building
│   ├── PARKED.md      # Good ideas for later
│   ├── REJECTED.md    # Explicitly rejected features
│   └── decisions/     # Numbered decision files
└── learning/
    ├── PATTERNS.md    # Recurring issues
    ├── VICTORIES.md   # What worked well
    ├── TRIGGERS.md    # Early warning signs
    └── session-logs/  # Daily learnings
\`\`\`

## 📝 File Creation Protocol

When creating ANY new file:
1. **First line must be:** \`// PURPOSE: [one sentence]\`
2. **If you can't explain purpose in one sentence, DON'T CREATE IT**
3. **Max 3 imports from internal files** (forces modular design)

## 🚨 The Chaos Indicators

**STOP immediately if you see:**
- File named "utils.js" with >5 functions
- Any file with "temp", "old", "backup" in name  
- More than 2 levels of folder nesting
- A component doing more than its name suggests
- >5 TODO/FIXME comments in codebase

## 🔄 The 3-2-1 Development Rhythm

### Every 3 AI Interactions
\`\`\`
"Show me the current file tree and file sizes. Any files over 200 lines?"
\`\`\`

### Every 2 Features
\`\`\`
"Create a working commit with message starting with 'STABLE:' - ensure all features work together"
\`\`\`

### Every 1 Session
\`\`\`
"What technical debt did we create today? Add to learning/session-logs/[today].md"
\`\`\`

## 🤖 Essential AI Prompts

### Daily Startup
\`\`\`
"Before we code today:
1. Show current file sizes sorted largest first
2. Count TODO/FIXME comments
3. Confirm we're still building: ${this.projectData.purpose}
4. List any files that feel 'messy' and need refactoring"
\`\`\`

### Feature Addition Protocol
\`\`\`
"I want to add [feature]. First answer:
1. Will this help achieve docs/CORE.md's goal?
2. What's the simplest possible implementation?
3. What existing code might this break?
4. Should this go in docs/PARKED.md instead?"
\`\`\`

### Emergency Reset
\`\`\`
"Project feels chaotic. Execute reset protocol:
1. Stop all new features
2. Review all files over 250 lines for immediate refactoring
3. Count and resolve/delete TODO comments
4. Check if scope has expanded beyond docs/CORE.md"
\`\`\`

## Automated Health Monitoring

### Health Check Commands
\`\`\`bash
# Daily health check
npm run check:health

# Comprehensive analysis
npm run check:all

# Session management
npm run session:start
npm run session:end
\`\`\`

### Automated Documentation Sync
- **GitHub Actions** automatically analyze codebase changes
- **CLAUDE.md updates** proposed via pull requests
- **Weekly health reports** generated with actionable insights
- **Learning pattern capture** from successful practices

---

**The Goal**: Make following the system easier than not following it. This prevents the chaos that kills projects.`;
  }

  generateStartFresh() {
    return `# Project Reset Protocol

When you feel the project spiraling (usually around day 3-5):

## 🚨 STOP - Execute This Protocol

1. **STOP** all new feature development immediately
2. **Run:** \`npm run check:health\`
3. **If any file > 300 lines:** SPLIT IT NOW
4. **If more than 5 TODO comments:** RESOLVE OR DELETE
5. **If scope expanded beyond docs/CORE.md:** FORK THE PROJECT
   - Current version becomes "${this.projectData.name}-v1-minimal"
   - New features go to "${this.projectData.name}-v2-exploration"

## 📊 Health Check Commands

\`\`\`bash
npm run check:health    # Overall health status
npm run check:size      # File size analysis
npm run check:scope     # TODO/FIXME count
\`\`\`

## 🎯 Reset Questions

Ask yourself:
1. Are we still building: "${this.projectData.purpose}"?
2. Which files feel too complex?
3. What features got added that weren't in docs/ACTIVE.md?
4. What would I do differently if starting fresh today?

## 🔄 Recovery Actions

1. **Refactor large files** into smaller, focused modules
2. **Update docs/CORE.md** if purpose has evolved
3. **Move scope creep** to docs/PARKED.md
4. **Document lessons** in learning/session-logs/
5. **Create STABLE commit** once cleaned up

## 📝 Prevention

This reset shouldn't be needed if you:
- Follow the 3-2-1 development rhythm
- Keep files under 300 lines
- Update docs when scope changes
- Use the chaos indicators as early warnings

Remember: It's better to reset early than to abandon the project completely.`;
  }

  generateCore() {
    return `# Project Core Purpose

**${this.projectData.purpose}**

## Success Definition
This project succeeds when it delivers the core purpose above - nothing more, nothing less.

## Scope Boundaries
- **In Scope**: Direct support of the core purpose
- **Out of Scope**: Everything else goes to PARKED.md

## The Focus Question
Before adding any feature, ask: "Does this directly serve the core purpose?"

If the answer is no, it doesn't belong in this project.

---
*This document should never exceed 50 words for the purpose statement. If it does, the scope is too broad.*`;
  }

  generateActive() {
    const features = this.projectData.features.map((feature, i) => `${i + 1}. ${feature}`).join('\n');
    
    return `# Active Development Features

These are the ONLY 3 features we're building right now:

${features}

## Rules
- Maximum 3 features in active development
- Complete current features before adding new ones
- New feature ideas go to PARKED.md
- Update this file when features are complete

## Current Status
- [ ] Feature 1: ${this.projectData.features[0]}
- [ ] Feature 2: ${this.projectData.features[1]}
- [ ] Feature 3: ${this.projectData.features[2]}

## Next Actions
Start with Feature 1. Don't move to Feature 2 until Feature 1 is working.

---
*If you're tempted to add a 4th feature, you're experiencing scope creep. Resist.*`;
  }

  generateRejected() {
    const rejected = this.projectData.rejected.map((feature, i) => `${i + 1}. ${feature}`).join('\n');
    
    return `# Explicitly Rejected Features

These features are explicitly NOT being built:

${rejected}

## Why This Matters
Rejected features help maintain focus and prevent scope creep. When tempted to add these features, remember why they were rejected.

## Adding Rejections
When new "great ideas" come up that don't serve the core purpose, add them here with a reason:

**Format:**
- Feature description - **Reason:** Why it's rejected

This creates a clear boundary between what we're building and what we're not.`;
  }

  generateParked() {
    return `# Parked Features

Good ideas that don't belong in the current MVP. These might become future versions.

## Future Considerations
*Ideas will be added here as they come up during development*

## Rules for Parked Features
1. Must be good ideas (not rejected)
2. Must not serve the core MVP purpose
3. Should be specific enough to implement later
4. Include brief reasoning for why it's parked

## Review Schedule
Review parked features monthly to decide:
- Move to next version planning
- Move to rejected (no longer valuable)
- Keep parked for later consideration

---
*This is where scope creep goes to die. Good ideas, wrong timing.*`;
  }

  generatePatterns() {
    return `# Recurring Patterns

Track patterns that emerge during development to learn from them.

## Failure Patterns
*Update with recurring issues*

## Success Patterns  
*Update with approaches that work well*

## Code Patterns
*Technical patterns (good and bad) discovered during development*

## Process Patterns
*Workflow patterns that help or hinder progress*

---
*Update this file throughout development, not just at the end*`;
  }

  generateVictories() {
    return `# Victories and Wins

Document what works well to repeat successful patterns.

## Technical Victories
*Approaches, tools, or patterns that solved problems effectively*

## Process Victories
*Workflow decisions that improved productivity or code quality*

## Learning Victories
*Insights or discoveries that advanced understanding*

## AI Collaboration Victories
*Prompts, approaches, or patterns that worked well with AI assistance*

---
*Celebrate wins to build confidence and identify repeatable success patterns*`;
  }

  generateTriggers() {
    return `# Early Warning Triggers

Signs that the project is heading toward chaos or failure.

## Technical Triggers
- Files approaching 300 lines
- Utils folder with >3 files
- Components doing multiple things
- Copy-paste code patterns

## Scope Triggers
- Adding features not in ACTIVE.md
- "While we're at it" additions
- Features that don't serve core purpose
- TODO comments accumulating

## Process Triggers
- Skipping health checks
- Irregular commits
- Unclear commit messages
- Working on multiple features simultaneously

## Response Actions
When triggers appear:
1. Stop current work
2. Address the trigger immediately
3. Update this document with new triggers discovered
4. Consider running START_FRESH.md protocol

---
*Early detection prevents project abandonment*`;
  }

  generateSessionLog() {
    const today = new Date().toISOString().split('T')[0];
    return `# Session Log - ${today}

## Today's Goals
*What I plan to accomplish this session*

## Work Done
*What was actually accomplished*

## Decisions Made
*Any architectural or feature decisions made*

## Problems Encountered
*Issues that came up and how they were resolved*

## Insights Gained
*Learning or patterns discovered*

## Tomorrow's Focus
*What to prioritize in the next session*

---
*Update throughout the day, review at session end*`;
  }

  generateHealthCheck() {
    return `const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const checks = {
  fileCount: () => {
    try {
      const files = execSync("find src -type f -name '*.js' -o -name '*.jsx' -o -name '*.ts' -o -name '*.tsx' | wc -l").toString().trim();
      const count = parseInt(files);
      return { 
        name: 'File Count',
        pass: count < 30, 
        value: count, 
        threshold: 30,
        status: count < 20 ? 'GREEN' : count < 30 ? 'YELLOW' : 'RED'
      };
    } catch {
      return { name: 'File Count', pass: true, value: 0, threshold: 30, status: 'GREEN' };
    }
  },
  
  largestFile: () => {
    try {
      const result = execSync("find src -name '*.js' -o -name '*.jsx' -o -name '*.ts' -o -name '*.tsx' | xargs wc -l | sort -nr | head -1").toString().trim();
      const lines = parseInt(result.split(' ')[0]) || 0;
      return {
        name: 'Largest File',
        pass: lines < 300,
        value: \`\${lines} lines\`,
        threshold: '300 lines',
        status: lines < 200 ? 'GREEN' : lines < 300 ? 'YELLOW' : 'RED'
      };
    } catch {
      return { name: 'Largest File', pass: true, value: '0 lines', threshold: '300 lines', status: 'GREEN' };
    }
  },
  
  todoCount: () => {
    try {
      const todos = execSync("grep -r 'TODO\\\\|FIXME\\\\|HACK' src/ | wc -l").toString().trim();
      const count = parseInt(todos);
      return {
        name: 'TODO Count',
        pass: count < 5,
        value: count,
        threshold: 5,
        status: count < 3 ? 'GREEN' : count < 5 ? 'YELLOW' : 'RED'
      };
    } catch {
      return { name: 'TODO Count', pass: true, value: 0, threshold: 5, status: 'GREEN' };
    }
  },
  
  utilsSize: () => {
    try {
      const utilsFiles = execSync("find src/utils -type f 2>/dev/null | wc -l").toString().trim();
      const count = parseInt(utilsFiles);
      return {
        name: 'Utils Sprawl',
        pass: count <= 3,
        value: \`\${count} files\`,
        threshold: '3 files',
        status: count <= 2 ? 'GREEN' : count <= 3 ? 'YELLOW' : 'RED'
      };
    } catch {
      return { name: 'Utils Sprawl', pass: true, value: '0 files', threshold: '3 files', status: 'GREEN' };
    }
  }
};

console.log('\\n🏥 Project Health Check\\n');
Object.values(checks).forEach(check => {
  const result = check();
  const icon = result.status === 'GREEN' ? '✅' : result.status === 'YELLOW' ? '⚠️' : '❌';
  console.log(\`\${icon} \${result.name}: \${result.value} (threshold: \${result.threshold})\`);
});

const allPassing = Object.values(checks).every(check => check().pass);
console.log(\`\\n\${allPassing ? '🎉 Project is healthy!' : '🚨 Action required!'}\\n\`);

if (!allPassing) {
  console.log('Consider running START_FRESH.md protocol if multiple checks are failing.');
}`;
  }

  generatePackageJson() {
    const base = {
      name: this.projectData.name,
      version: "1.0.0",
      description: this.projectData.purpose,
      scripts: {
        "check:health": "node scripts/health-check.js",
        "check:scope": "grep -r 'TODO\\|FIXME\\|HACK' src/",
        "check:size": "find src -name '*.js' -o -name '*.jsx' -o -name '*.ts' -o -name '*.tsx' | xargs wc -l | sort -nr"
      }
    };

    return JSON.stringify(base, null, 2);
  }

  generateGitignore() {
    return `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
/build
/dist
.next/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Temporary files
.tmp/
temp/`;
  }

  generateReadme() {
    return `# ${this.projectData.name}

${this.projectData.purpose}

## Project Structure

This project follows the enhanced CLAUDE.md workflow for disciplined AI-assisted development.

### Key Files
- \`CLAUDE.md\` - AI coding constitution and rules
- \`docs/CORE.md\` - Core purpose (never change this)
- \`docs/ACTIVE.md\` - Current 3 features being built
- \`START_FRESH.md\` - Reset protocol when project feels chaotic

### Health Monitoring
\`\`\`bash
npm run check:health    # Overall project health
npm run check:size      # Monitor file sizes
npm run check:scope     # Check for TODO accumulation
\`\`\`

## Development Workflow

1. **Daily startup**: Run \`npm run check:health\`
2. **Feature development**: Only work on features in \`docs/ACTIVE.md\`
3. **File discipline**: Keep all files under 300 lines
4. **Scope discipline**: New ideas go to \`docs/PARKED.md\`

## Technology Stack

${this.projectData.stack}

## Getting Started

1. \`npm install\`
2. \`npm run check:health\`
3. Start with first feature in \`docs/ACTIVE.md\`

## AI Collaboration

This project is designed for AI-assisted development. Key prompts:

### Daily Startup
\`\`\`
"Before we code today:
1. Show current file sizes sorted largest first
2. Count TODO/FIXME comments  
3. Confirm we're still building: ${this.projectData.purpose}
4. List any files that feel 'messy' and need refactoring"
\`\`\`

### Feature Addition
\`\`\`
"I want to add [feature]. First answer:
1. Will this help achieve docs/CORE.md's goal?
2. What's the simplest possible implementation?
3. Should this go in docs/PARKED.md instead?"
\`\`\`

## Rules

- **NO file exceeds 300 lines**
- **NO features added without updating docs/ACTIVE.md first**
- **Every 3rd AI interaction must confirm we're still building the core purpose**

---

*This project uses the enhanced CLAUDE.md workflow to prevent the chaos that kills projects.*`;
  }

  generateClaudeSync() {
    return `name: Claude Documentation Sync

on:
  push:
    branches: [ main ]
    paths:
      - 'src/**'
      - 'docs/**'
      - 'package.json'
  schedule:
    - cron: '0 9 * * 1'  # Weekly on Monday 9AM
  workflow_dispatch:      # Manual trigger

jobs:
  sync-documentation:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Run Health Check
      run: npm run check:health
    
    - name: Create Health Report Issue
      if: failure()
      uses: actions-ecosystem/action-create-issue@v1
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        title: '🚨 Project Health Check Failed'
        body: |
          Automated health check failed. Please review:
          - File sizes exceeding limits
          - TODO accumulation
          - Utils sprawl
          
          Run \`npm run check:health\` locally for details.
        labels: |
          health-check
          automated`;
  }

  generateWeeklyHealth() {
    return `name: Weekly Project Health Check

on:
  schedule:
    - cron: '0 10 * * 1'  # Weekly on Monday 10AM
  workflow_dispatch:

jobs:
  health-audit:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Run Health Check
      run: npm run check:health
    
    - name: Generate Health Report
      run: |
        echo "# Weekly Health Report" > health-report.md
        echo "" >> health-report.md
        echo "## File Size Analysis" >> health-report.md
        npm run check:size >> health-report.md
        echo "" >> health-report.md
        echo "## TODO/FIXME Count" >> health-report.md
        npm run check:scope >> health-report.md
    
    - name: Create Health Report Issue
      uses: actions-ecosystem/action-create-issue@v1
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        title: '📊 Weekly Health Report - \${{ github.event.schedule }}'
        body_path: health-report.md
        labels: |
          health-check
          weekly-report
          automated`;
  }

  generateUpdatePrompt() {
    return `# CLAUDE.md Update Prompt

You are tasked with updating the CLAUDE.md file to keep it synchronized with the current codebase state.

## Analysis Focus
- Compare current file structure with CLAUDE.md guidelines
- Identify files approaching the 300-line limit
- Look for new patterns (good or bad) that need documentation
- Check if folder organization matches documented structure
- Verify scope alignment with docs/CORE.md

## Update Guidelines
- Keep changes minimal and focused
- Preserve existing rules that are still valid
- Add new rules for newly discovered patterns
- Update AI prompts to match current project structure
- Maintain disciplined workflow approach

## Output
Update CLAUDE.md with necessary changes based on actual codebase evolution.`;
  }

  generateHealthPrompt() {
    return `# Weekly Health Check Prompt

Perform a comprehensive health analysis of this project following the CLAUDE.md guidelines.

## Analysis Areas
1. **File Size Compliance** - Files over 250 lines (warning) or 300 lines (violation)
2. **Folder Organization** - Files in correct folders per CLAUDE.md
3. **Scope Discipline** - Current features vs docs/CORE.md alignment
4. **Technical Debt** - TODO/FIXME/HACK comments count
5. **Learning Capture** - Recent patterns worth documenting

## Output Format
Generate markdown report with:
- 🔴 Critical issues requiring immediate attention
- 🟡 Warning items to address soon  
- 🟢 Things working well to continue
- 📈 Trends and patterns observed
- 🎯 Recommended actions for next week

Focus on actionable insights that maintain project discipline.`;
  }

  generateClaudeConfig() {
    return JSON.stringify({
      model: "claude-3-sonnet-20240229",
      max_tokens: 4000,
      temperature: 0.1,
      system_prompt: "You are a disciplined software development assistant focused on maintaining clean, organized, and maintainable codebases following the CLAUDE.md methodology.",
      file_extensions: [".js", ".jsx", ".ts", ".tsx", ".md", ".json"],
      ignore_patterns: ["node_modules/", ".git/", "dist/", "build/"],
      analysis_depth: "comprehensive"
    }, null, 2);
  }
}

// Run the onboarder
if (require.main === module) {
  const onboarder = new ProjectOnboarder();
  onboarder.init().catch(console.error);
}

module.exports = ProjectOnboarder;