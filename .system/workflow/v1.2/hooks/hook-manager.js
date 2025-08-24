#!/usr/bin/env node

// PURPOSE: Global hook management system for AIPortfolio
// SCOPE: Manages all hooks across portfolio projects
// IMPORTS: Node.js fs, path for file operations

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

/**
 * Hook Manager - Centralized hook system for AIPortfolio
 * 
 * Manages hooks across all projects in the portfolio:
 * - Feature completion hooks
 * - Health check hooks
 * - Documentation sync hooks
 * - Custom project hooks
 */

class HookManager {
    constructor(portfolioRoot = '/home/robert/AIPortfolio') {
        this.portfolioRoot = portfolioRoot;
        this.hooksDir = path.join(portfolioRoot, 'workflow/v1.2/hooks');
        this.configFile = path.join(this.hooksDir, 'hooks.json');
        this.logFile = path.join(this.hooksDir, 'hooks.log');
        
        this.initializeHooks();
    }

    /**
     * Initialize hook system and load configuration
     */
    initializeHooks() {
        // Create hooks directory if it doesn't exist
        fs.mkdirSync(this.hooksDir, { recursive: true });

        // Load or create hooks configuration
        this.config = this.loadHooksConfig();
        
        // Register default hooks
        this.registerDefaultHooks();
    }

    /**
     * Load hooks configuration from file
     */
    loadHooksConfig() {
        if (fs.existsSync(this.configFile)) {
            return JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
        }

        // Default configuration
        const defaultConfig = {
            version: "1.2",
            enabled: true,
            hooks: {
                "feature-completion": {
                    enabled: true,
                    script: "./feature-completion-hook.js",
                    trigger: "post-feature-implementation",
                    projects: "all",
                    timeout: 300000 // 5 minutes
                },
                "health-check": {
                    enabled: true,
                    script: "./health-check-hook.js",
                    trigger: "scheduled",
                    schedule: "0 */2 * * *", // Every 2 hours
                    projects: "all",
                    timeout: 60000 // 1 minute
                },
                "documentation-sync": {
                    enabled: true,
                    script: "./documentation-sync-hook.js",
                    trigger: "post-code-change",
                    projects: "all",
                    timeout: 120000 // 2 minutes
                }
            },
            projects: {
                "active/*": {
                    enabled: true,
                    customHooks: []
                },
                "exploration/*": {
                    enabled: true,
                    customHooks: []
                },
                "dev/*": {
                    enabled: true,
                    customHooks: []
                }
            }
        };

        this.saveHooksConfig(defaultConfig);
        return defaultConfig;
    }

    /**
     * Save hooks configuration to file
     */
    saveHooksConfig(config) {
        fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
    }

    /**
     * Register default hooks in the system
     */
    registerDefaultHooks() {
        this.log('🔗 Registering default hooks...');
        
        // Feature completion hook is already created
        this.log('✅ Feature completion hook registered');
        
        // Create other default hooks
        this.createHealthCheckHook();
        this.createDocumentationSyncHook();
        
        this.log('🎯 All default hooks registered');
    }

    /**
     * Trigger a specific hook for a project
     */
    async triggerHook(hookName, projectPath, ...args) {
        if (!this.config.enabled) {
            this.log('⚠️ Hook system disabled');
            return false;
        }

        const hook = this.config.hooks[hookName];
        if (!hook || !hook.enabled) {
            this.log(`⚠️ Hook '${hookName}' not found or disabled`);
            return false;
        }

        // Check if this project should run this hook
        if (!this.shouldRunHookForProject(hook, projectPath)) {
            this.log(`⚠️ Hook '${hookName}' not enabled for project: ${projectPath}`);
            return false;
        }

        this.log(`🔗 Triggering hook: ${hookName} for project: ${projectPath}`);

        try {
            const scriptPath = path.resolve(this.hooksDir, hook.script);
            const result = await this.executeHook(scriptPath, projectPath, args, hook.timeout);
            
            this.log(`✅ Hook '${hookName}' completed successfully`);
            return result;
            
        } catch (error) {
            this.log(`❌ Hook '${hookName}' failed: ${error.message}`);
            return false;
        }
    }

    /**
     * Check if hook should run for specific project
     */
    shouldRunHookForProject(hook, projectPath) {
        if (hook.projects === 'all') {
            return true;
        }

        if (Array.isArray(hook.projects)) {
            return hook.projects.some(pattern => this.matchesPattern(projectPath, pattern));
        }

        return false;
    }

    /**
     * Match project path against pattern
     */
    matchesPattern(projectPath, pattern) {
        const relativePath = path.relative(this.portfolioRoot, projectPath);
        
        if (pattern.includes('*')) {
            const regex = new RegExp(pattern.replace(/\*/g, '.*'));
            return regex.test(relativePath);
        }
        
        return relativePath.includes(pattern);
    }

    /**
     * Execute a hook script
     */
    async executeHook(scriptPath, projectPath, args, timeout = 120000) {
        return new Promise((resolve, reject) => {
            const child = spawn('node', [scriptPath, projectPath, ...args], {
                stdio: 'pipe',
                cwd: this.hooksDir
            });

            let output = '';
            let error = '';

            child.stdout.on('data', (data) => {
                output += data.toString();
                process.stdout.write(data); // Real-time output
            });

            child.stderr.on('data', (data) => {
                error += data.toString();
                process.stderr.write(data);
            });

            child.on('close', (code) => {
                if (code === 0) {
                    resolve({ success: true, output, error });
                } else {
                    reject(new Error(`Hook exited with code ${code}: ${error}`));
                }
            });

            // Set timeout
            const timeoutHandle = setTimeout(() => {
                child.kill('SIGTERM');
                reject(new Error(`Hook timed out after ${timeout}ms`));
            }, timeout);

            child.on('close', () => clearTimeout(timeoutHandle));
        });
    }

    /**
     * Feature completion hook trigger (main entry point for AI completion)
     */
    async triggerFeatureCompletion(projectPath, featureName, featureDescription) {
        return this.triggerHook('feature-completion', projectPath, featureName, featureDescription);
    }

    /**
     * Health check hook trigger
     */
    async triggerHealthCheck(projectPath) {
        return this.triggerHook('health-check', projectPath);
    }

    /**
     * Documentation sync hook trigger
     */
    async triggerDocumentationSync(projectPath) {
        return this.triggerHook('documentation-sync', projectPath);
    }

    /**
     * Run hooks for all portfolio projects
     */
    async runForAllProjects(hookName) {
        const projects = this.findAllProjects();
        const results = [];

        for (const project of projects) {
            try {
                const result = await this.triggerHook(hookName, project);
                results.push({ project, success: result !== false, result });
            } catch (error) {
                results.push({ project, success: false, error: error.message });
            }
        }

        return results;
    }

    /**
     * Find all projects in the portfolio
     */
    findAllProjects() {
        const projects = [];
        const stages = ['active', 'exploration', 'dev', 'paused'];

        for (const stage of stages) {
            const stageDir = path.join(this.portfolioRoot, stage);
            if (fs.existsSync(stageDir)) {
                const stageProjects = fs.readdirSync(stageDir)
                    .map(name => path.join(stageDir, name))
                    .filter(projectPath => {
                        return fs.statSync(projectPath).isDirectory() &&
                               fs.existsSync(path.join(projectPath, 'package.json'));
                    });
                
                projects.push(...stageProjects);
            }
        }

        return projects;
    }

    /**
     * Create health check hook
     */
    createHealthCheckHook() {
        const hookPath = path.join(this.hooksDir, 'health-check-hook.js');
        
        if (fs.existsSync(hookPath)) {
            return; // Already exists
        }

        const healthCheckHook = `#!/usr/bin/env node

// PURPOSE: Portfolio-wide health check hook
// SCOPE: Monitors project health across all portfolio projects
// IMPORTS: Node.js fs, path for file operations

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class HealthCheckHook {
    constructor(projectPath) {
        this.projectPath = projectPath || process.cwd();
        this.projectName = path.basename(this.projectPath);
    }

    async execute() {
        console.log(\`🏥 Health Check Hook - \${this.projectName}\`);
        
        try {
            // Run project-specific health checks
            if (fs.existsSync(path.join(this.projectPath, 'package.json'))) {
                const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectPath, 'package.json'), 'utf8'));
                
                if (packageJson.scripts && packageJson.scripts['check:health']) {
                    console.log('Running project health check...');
                    execSync('npm run check:health', { cwd: this.projectPath, stdio: 'inherit' });
                } else {
                    console.log('⚠️ No health check script found');
                }
            }
            
            // Check file sizes
            this.checkFileSizes();
            
            // Check for PURPOSE comments
            this.checkPurposeComments();
            
            console.log('✅ Health check completed');
            
        } catch (error) {
            console.error('❌ Health check failed:', error.message);
            process.exit(1);
        }
    }

    checkFileSizes() {
        const srcDir = path.join(this.projectPath, 'src');
        if (!fs.existsSync(srcDir)) return;

        let violations = 0;
        this.walkDir(srcDir, (filePath) => {
            if (/\\.(js|jsx|ts|tsx)$/.test(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                const lines = content.split('\\n').length;
                
                if (lines > 300) {
                    console.log(\`❌ File size violation: \${filePath} (\${lines} lines)\`);
                    violations++;
                } else if (lines > 250) {
                    console.log(\`⚠️ Approaching limit: \${filePath} (\${lines} lines)\`);
                }
            }
        });

        if (violations === 0) {
            console.log('✅ All files within size limits');
        }
    }

    checkPurposeComments() {
        const srcDir = path.join(this.projectPath, 'src');
        if (!fs.existsSync(srcDir)) return;

        let missing = 0;
        this.walkDir(srcDir, (filePath) => {
            if (/\\.(js|jsx|ts|tsx)$/.test(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                const firstLines = content.split('\\n').slice(0, 10).join('\\n');
                
                if (!/\\/\\/\\s*PURPOSE:|\\/*\\s*PURPOSE:/i.test(firstLines)) {
                    console.log(\`⚠️ Missing PURPOSE comment: \${filePath}\`);
                    missing++;
                }
            }
        });

        if (missing === 0) {
            console.log('✅ All files have PURPOSE comments');
        }
    }

    walkDir(dir, callback) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory() && !file.startsWith('.')) {
                this.walkDir(filePath, callback);
            } else if (stat.isFile()) {
                callback(filePath);
            }
        });
    }
}

// CLI interface
if (require.main === module) {
    const projectPath = process.argv[2] || process.cwd();
    const hook = new HealthCheckHook(projectPath);
    hook.execute().catch(console.error);
}

module.exports = HealthCheckHook;
`;

        fs.writeFileSync(hookPath, healthCheckHook);
        fs.chmodSync(hookPath, 0o755);
        this.log('✅ Health check hook created');
    }

    /**
     * Create documentation sync hook
     */
    createDocumentationSyncHook() {
        const hookPath = path.join(this.hooksDir, 'documentation-sync-hook.js');
        
        if (fs.existsSync(hookPath)) {
            return; // Already exists
        }

        const docSyncHook = `#!/usr/bin/env node

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
        console.log(\`📚 Documentation Sync Hook - \${this.projectName}\`);
        
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
        return \`# \${packageJson.name}

\${packageJson.description || 'Project description'}

## Quick Start

\\\`\\\`\\\`bash
# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm test
\\\`\\\`\\\`

## Development

This project follows disciplined development practices:
- 300-line file limit
- Single responsibility principle  
- Human-AI collaborative testing

## Commands

- \\\`npm run dev\\\` - Start development
- \\\`npm run build\\\` - Build for production
- \\\`npm run check:health\\\` - Check project health
- \\\`npm run check:size\\\` - Monitor file sizes

## Testing

Features undergo both automated testing and human validation to ensure quality and usability.
\`;
    }
}

// CLI interface
if (require.main === module) {
    const projectPath = process.argv[2] || process.cwd();
    const hook = new DocumentationSyncHook(projectPath);
    hook.execute().catch(console.error);
}

module.exports = DocumentationSyncHook;
`;

        fs.writeFileSync(hookPath, docSyncHook);
        fs.chmodSync(hookPath, 0o755);
        this.log('✅ Documentation sync hook created');
    }

    /**
     * Log hook activity
     */
    log(message) {
        const timestamp = new Date().toISOString();
        const logEntry = `${timestamp} - ${message}\\n`;
        
        console.log(message);
        fs.appendFileSync(this.logFile, logEntry);
    }

    /**
     * Get hook status for all projects
     */
    getStatus() {
        const projects = this.findAllProjects();
        
        return {
            system: {
                enabled: this.config.enabled,
                hooks: Object.keys(this.config.hooks).filter(h => this.config.hooks[h].enabled),
                projects: projects.length
            },
            projects: projects.map(project => ({
                path: project,
                name: path.basename(project),
                stage: path.basename(path.dirname(project))
            }))
        };
    }
}

// CLI interface for the hook manager
if (require.main === module) {
    const manager = new HookManager();
    const command = process.argv[2];
    
    switch (command) {
        case 'feature-completed':
            const projectPath = process.argv[3] || process.cwd();
            const featureName = process.argv[4] || 'unnamed-feature';
            const featureDescription = process.argv[5] || 'No description';
            manager.triggerFeatureCompletion(projectPath, featureName, featureDescription);
            break;
            
        case 'health-check':
            const healthProject = process.argv[3] || process.cwd();
            manager.triggerHealthCheck(healthProject);
            break;
            
        case 'health-check-all':
            manager.runForAllProjects('health-check').then(results => {
                console.log('Health check results:', results);
            });
            break;
            
        case 'status':
            console.log(JSON.stringify(manager.getStatus(), null, 2));
            break;
            
        default:
            console.log('Usage:');
            console.log('  node hook-manager.js feature-completed <project> <feature> <description>');
            console.log('  node hook-manager.js health-check <project>');
            console.log('  node hook-manager.js health-check-all');
            console.log('  node hook-manager.js status');
    }
}

module.exports = HookManager;