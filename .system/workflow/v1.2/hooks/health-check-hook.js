#!/usr/bin/env node

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
        console.log(`🏥 Health Check Hook - ${this.projectName}`);
        
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
            if (/\.(js|jsx|ts|tsx)$/.test(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                const lines = content.split('\n').length;
                
                if (lines > 300) {
                    console.log(`❌ File size violation: ${filePath} (${lines} lines)`);
                    violations++;
                } else if (lines > 250) {
                    console.log(`⚠️ Approaching limit: ${filePath} (${lines} lines)`);
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
            if (/\.(js|jsx|ts|tsx)$/.test(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                const firstLines = content.split('\n').slice(0, 10).join('\n');
                
                if (!/\/\/\s*PURPOSE:|\/*\s*PURPOSE:/i.test(firstLines)) {
                    console.log(`⚠️ Missing PURPOSE comment: ${filePath}`);
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
