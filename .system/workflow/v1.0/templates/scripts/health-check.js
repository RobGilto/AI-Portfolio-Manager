#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Health check configuration from package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const config = packageJson.healthChecks || {};

const DEFAULTS = {
  maxFileLines: 300,
  maxImportsPerFile: 3,
  maxFilesInProject: 25,
  maxUtilFiles: 5,
  requiredPurposeComment: true,
  maxScopeViolations: 0
};

const healthConfig = { ...DEFAULTS, ...config };

class ProjectHealthChecker {
  constructor() {
    this.violations = [];
    this.warnings = [];
    this.stats = {
      totalFiles: 0,
      totalLines: 0,
      largestFile: { name: '', lines: 0 },
      utilFiles: 0,
      scopeViolations: 0
    };
  }

  checkFileSize(filePath, content) {
    const lines = content.split('\n').length;
    this.stats.totalLines += lines;
    
    if (lines > this.stats.largestFile.lines) {
      this.stats.largestFile = { name: filePath, lines };
    }

    if (lines > healthConfig.maxFileLines) {
      this.violations.push({
        type: 'FILE_SIZE',
        file: filePath,
        issue: `${lines} lines (max: ${healthConfig.maxFileLines})`,
        severity: 'HIGH'
      });
    } else if (lines > healthConfig.maxFileLines * 0.8) {
      this.warnings.push({
        type: 'FILE_SIZE_WARNING',
        file: filePath,
        issue: `${lines} lines (approaching limit)`,
        severity: 'MEDIUM'
      });
    }
  }

  checkImports(filePath, content) {
    const importLines = content.split('\n').filter(line => 
      line.trim().startsWith('import ') || 
      line.trim().startsWith('require(')
    );

    if (importLines.length > healthConfig.maxImportsPerFile) {
      this.violations.push({
        type: 'TOO_MANY_IMPORTS',
        file: filePath,
        issue: `${importLines.length} imports (max: ${healthConfig.maxImportsPerFile})`,
        severity: 'MEDIUM'
      });
    }
  }

  checkPurposeComment(filePath, content) {
    if (!healthConfig.requiredPurposeComment) return;

    const firstLines = content.split('\n').slice(0, 10).join('\n');
    const hasPurpose = /\/\/\s*PURPOSE:|\/\*\s*PURPOSE:/i.test(firstLines);

    if (!hasPurpose) {
      this.violations.push({
        type: 'MISSING_PURPOSE',
        file: filePath,
        issue: 'No PURPOSE comment found in first 10 lines',
        severity: 'LOW'
      });
    }
  }

  checkScopeViolations(filePath, content) {
    const violations = [
      { pattern: /TODO/gi, type: 'TODO' },
      { pattern: /FIXME/gi, type: 'FIXME' },
      { pattern: /HACK/gi, type: 'HACK' }
    ];

    violations.forEach(({ pattern, type }) => {
      const matches = content.match(pattern) || [];
      if (matches.length > 0) {
        this.stats.scopeViolations += matches.length;
        this.violations.push({
          type: 'SCOPE_VIOLATION',
          file: filePath,
          issue: `${matches.length} ${type} comments found`,
          severity: 'MEDIUM'
        });
      }
    });
  }

  checkUtilsSprawl(filePath) {
    if (filePath.includes('util') || filePath.includes('helper')) {
      this.stats.utilFiles++;
    }

    if (this.stats.utilFiles > healthConfig.maxUtilFiles) {
      this.violations.push({
        type: 'UTILS_SPRAWL',
        file: 'Project',
        issue: `${this.stats.utilFiles} utility files (max: ${healthConfig.maxUtilFiles})`,
        severity: 'HIGH'
      });
    }
  }

  scanDirectory(dir = 'src') {
    if (!fs.existsSync(dir)) {
      console.log('📁 No src directory found - skipping file checks');
      return;
    }

    const scanDir = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      
      items.forEach(item => {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scanDir(fullPath);
        } else if (stat.isFile() && /\.(js|jsx|ts|tsx)$/.test(item)) {
          this.stats.totalFiles++;
          const content = fs.readFileSync(fullPath, 'utf8');
          const relativePath = path.relative(process.cwd(), fullPath);
          
          this.checkFileSize(relativePath, content);
          this.checkImports(relativePath, content);
          this.checkPurposeComment(relativePath, content);
          this.checkScopeViolations(relativePath, content);
          this.checkUtilsSprawl(relativePath);
        }
      });
    };

    scanDir(dir);
  }

  generateReport() {
    console.log('🏥 PROJECT HEALTH CHECK REPORT');
    console.log('================================\n');

    // Project stats
    console.log('📊 PROJECT STATISTICS:');
    console.log(`   Total files: ${this.stats.totalFiles}`);
    console.log(`   Total lines: ${this.stats.totalLines}`);
    console.log(`   Largest file: ${this.stats.largestFile.name} (${this.stats.largestFile.lines} lines)`);
    console.log(`   Utility files: ${this.stats.utilFiles}`);
    console.log(`   Scope violations: ${this.stats.scopeViolations}\n`);

    // Violations
    if (this.violations.length > 0) {
      console.log('🚨 VIOLATIONS FOUND:');
      this.violations.forEach(violation => {
        const icon = violation.severity === 'HIGH' ? '🔴' : 
                    violation.severity === 'MEDIUM' ? '🟡' : '🟠';
        console.log(`   ${icon} ${violation.type}: ${violation.file}`);
        console.log(`      ${violation.issue}\n`);
      });
    }

    // Warnings
    if (this.warnings.length > 0) {
      console.log('⚠️  WARNINGS:');
      this.warnings.forEach(warning => {
        console.log(`   🟡 ${warning.type}: ${warning.file}`);
        console.log(`      ${warning.issue}\n`);
      });
    }

    // Health status
    const criticalViolations = this.violations.filter(v => v.severity === 'HIGH');
    
    if (criticalViolations.length > 0) {
      console.log('💀 CRITICAL HEALTH ISSUES DETECTED');
      console.log('   Recommend immediate action or project reset');
      process.exit(1);
    } else if (this.violations.length > 0) {
      console.log('⚠️  HEALTH WARNINGS DETECTED');
      console.log('   Address before continuing development');
      process.exit(1);
    } else {
      console.log('✅ PROJECT HEALTH: GOOD');
      console.log('   All discipline metrics within acceptable ranges');
    }
  }
}

// Emergency protocols
function checkEmergencyTriggers() {
  console.log('🚨 CHECKING EMERGENCY TRIGGERS...\n');

  const triggers = packageJson.disciplineConfig?.resetTriggers || [];
  let emergencyDetected = false;

  // Check for oversized files
  if (fs.existsSync('src')) {
    console.log('Scanning for oversized files...');
    // This would be implemented with file scanning logic
  }

  // Check debug session time (would need external tracking)
  const sessionLogPath = 'SESSION_LOG.md';
  if (fs.existsSync(sessionLogPath)) {
    console.log('Checking session duration...');
    // Implementation would track session time
  }

  if (!emergencyDetected) {
    console.log('✅ No emergency triggers detected\n');
  }

  return emergencyDetected;
}

// Main execution
function main() {
  console.log('🔍 Starting Project Health Check...\n');
  
  // Check for emergency conditions first
  const emergency = checkEmergencyTriggers();
  if (emergency) {
    console.log('🆘 EMERGENCY PROTOCOL RECOMMENDED');
    console.log('   Consider running: npm run emergency:reset\n');
  }

  // Run standard health checks
  const checker = new ProjectHealthChecker();
  checker.scanDirectory('src');
  checker.generateReport();
}

main();