#!/usr/bin/env node

// PURPOSE: Check 3-import maximum rule across project files

const fs = require('fs');
const path = require('path');

function checkImports(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Count import statements
    const importLines = lines.filter(line => {
        const trimmed = line.trim();
        return trimmed.startsWith('import ') && 
               !trimmed.startsWith('import type') && // TypeScript type imports don't count
               !trimmed.includes('// @ignore-import-count'); // Allow override
    });
    
    return {
        file: filePath,
        importCount: importLines.length,
        imports: importLines,
        violation: importLines.length > 3
    };
}

function findSourceFiles(dir) {
    const files = [];
    
    function traverse(currentDir) {
        if (!fs.existsSync(currentDir)) return;
        
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                // Skip node_modules, .git, dist, build directories
                if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(item)) {
                    traverse(fullPath);
                }
            } else if (stat.isFile()) {
                // Check JS/TS files
                if (/\.(js|jsx|ts|tsx)$/.test(item)) {
                    files.push(fullPath);
                }
            }
        }
    }
    
    traverse(dir);
    return files;
}

function main() {
    console.log('🔍 Import Check - 3-Import Maximum Rule');
    console.log('=====================================');
    
    const sourceFiles = findSourceFiles('./src');
    
    if (sourceFiles.length === 0) {
        console.log('📁 No source files found in ./src directory');
        return;
    }
    
    let violations = 0;
    let totalFiles = 0;
    
    for (const file of sourceFiles) {
        try {
            const result = checkImports(file);
            totalFiles++;
            
            if (result.violation) {
                violations++;
                console.log(`❌ ${result.file}`);
                console.log(`   Import count: ${result.importCount} (exceeds limit of 3)`);
                result.imports.forEach(imp => {
                    console.log(`   • ${imp.trim()}`);
                });
                console.log('');
            }
        } catch (error) {
            console.log(`⚠️  Error checking ${file}: ${error.message}`);
        }
    }
    
    console.log('📊 Import Check Summary');
    console.log('======================');
    console.log(`Files checked: ${totalFiles}`);
    console.log(`Violations: ${violations}`);
    
    if (violations === 0) {
        console.log('✅ All files respect the 3-import maximum rule!');
    } else {
        console.log('❌ Import violations found. Consider refactoring files with too many dependencies.');
        console.log('');
        console.log('💡 Solutions:');
        console.log('  • Split large files into smaller, focused modules');
        console.log('  • Use composition instead of deep import chains');
        console.log('  • Add // @ignore-import-count comment to bypass check if justified');
    }
    
    // Exit with error code if violations found
    process.exit(violations > 0 ? 1 : 0);
}

if (require.main === module) {
    main();
}