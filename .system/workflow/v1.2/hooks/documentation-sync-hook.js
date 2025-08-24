#!/usr/bin/env node

// PURPOSE: Documentation synchronization hook
// SCOPE: Keeps project documentation in sync with code changes
// IMPORTS: Node.js fs, path for file operations

const fs = require('fs');
const path = require('path');

class DocumentationSyncHook {
    constructor(projectPath) {
        this.projectPath = projectPath || process.cwd();
        this.projectName = path.basename(this.projectPath);
    }

    async execute() {
        console.log(`📚 Documentation Sync Hook - ${this.projectName}`);
        
        try {
            // Check if CLAUDE.md exists and is current
            this.syncClaudeMd();
            
            // Update README if needed
            this.syncReadme();
            
            // Sync project documentation
            this.syncProjectDocs();
            
            console.log('✅ Documentation sync completed');
            
        } catch (error) {
            console.error('❌ Documentation sync failed:', error.message);
            process.exit(1);
        }
    }

    syncClaudeMd() {
        const claudePath = path.join(this.projectPath, 'CLAUDE.md');
        const templatePath = path.join(__dirname, '../templates/CLAUDE.md');
        
        if (!fs.existsSync(claudePath) && fs.existsSync(templatePath)) {
            console.log('📄 Creating CLAUDE.md from template...');
            const template = fs.readFileSync(templatePath, 'utf8');
            fs.writeFileSync(claudePath, template);
        } else {
            console.log('✅ CLAUDE.md is present');
        }
    }

    syncReadme() {
        const readmePath = path.join(this.projectPath, 'README.md');
        const packagePath = path.join(this.projectPath, 'package.json');
        
        if (fs.existsSync(packagePath)) {
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            
            if (!fs.existsSync(readmePath)) {
                console.log('📄 Creating README.md...');
                const readme = this.generateReadme(packageJson);
                fs.writeFileSync(readmePath, readme);
            }
        }
    }

    syncProjectDocs() {
        const docsDir = path.join(this.projectPath, 'docs');
        
        if (!fs.existsSync(docsDir)) {
            console.log('📁 Creating docs directory structure...');
            fs.mkdirSync(docsDir, { recursive: true });
            fs.mkdirSync(path.join(docsDir, 'testing', 'features'), { recursive: true });
        }
    }

    generateReadme(packageJson) {
        return `# ${packageJson.name}

${packageJson.description || 'Project description'}

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm test
\`\`\`

## Development

This project follows disciplined development practices:
- 300-line file limit
- Single responsibility principle  
- Human-AI collaborative testing

## Commands

- \`npm run dev\` - Start development
- \`npm run build\` - Build for production
- \`npm run check:health\` - Check project health
- \`npm run check:size\` - Monitor file sizes

## Testing

Features undergo both automated testing and human validation to ensure quality and usability.
`;
    }
}

// CLI interface
if (require.main === module) {
    const projectPath = process.argv[2] || process.cwd();
    const hook = new DocumentationSyncHook(projectPath);
    hook.execute().catch(console.error);
}

module.exports = DocumentationSyncHook;
