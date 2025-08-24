#!/usr/bin/env node

// PURPOSE: AI workflow guidance script to help users find the right functions or slash commands

const fs = require('fs');
const path = require('path');

const COMMANDS = {
  '/analyze': {
    description: 'Analyze codebase or specific files',
    usage: '/analyze [file-pattern]',
    example: '/analyze src/**/*.js',
    category: 'analysis'
  },
  '/test': {
    description: 'Run tests for the project',
    usage: '/test [test-pattern]',
    example: '/test unit',
    category: 'testing'
  },
  '/build': {
    description: 'Build the project',
    usage: '/build [environment]',
    example: '/build production',
    category: 'build'
  },
  '/deploy': {
    description: 'Deploy the project',
    usage: '/deploy [target]',
    example: '/deploy staging',
    category: 'deployment'
  },
  '/health': {
    description: 'Check project health and dependencies',
    usage: '/health',
    example: '/health',
    category: 'maintenance'
  },
  '/session': {
    description: 'Manage development sessions',
    usage: '/session [start|end|status]',
    example: '/session start',
    category: 'workflow'
  }
};

const WORKFLOWS = {
  'new-project': {
    description: 'Start a new project from template',
    command: 'scripts/new-project',
    steps: [
      'Run: scripts/new-project',
      'Enter project name when prompted',
      'Navigate to new project directory',
      'Begin development'
    ],
    category: 'project-management'
  },
  'daily-health': {
    description: 'Daily health check across portfolio',
    command: 'scripts/daily-health',
    steps: [
      'Run: scripts/daily-health',
      'Review health summary',
      'Address any failed projects',
      'Follow recommendations'
    ],
    category: 'maintenance'
  },
  'project-move': {
    description: 'Move project between lifecycle stages',
    command: 'scripts/project-move',
    steps: [
      'Run: scripts/project-move',
      'Select source and destination stages',
      'Confirm project move',
      'Update project documentation'
    ],
    category: 'project-management'
  }
};

function showHelp() {
  console.log('\n🤖 AI Portfolio Workflow Helper\n');
  console.log('Available commands and workflows for your AI development process.\n');
  
  console.log('📋 SLASH COMMANDS:');
  console.log('==================');
  
  const categories = [...new Set(Object.values(COMMANDS).map(cmd => cmd.category))];
  
  categories.forEach(category => {
    console.log(`\n${category.toUpperCase()}:`);
    Object.entries(COMMANDS)
      .filter(([_, cmd]) => cmd.category === category)
      .forEach(([name, cmd]) => {
        console.log(`  ${name.padEnd(12)} - ${cmd.description}`);
        console.log(`  ${' '.repeat(12)} Usage: ${cmd.usage}`);
        console.log(`  ${' '.repeat(12)} Example: ${cmd.example}\n`);
      });
  });
  
  console.log('\n🔄 COMMON WORKFLOWS:');
  console.log('====================');
  
  const workflowCategories = [...new Set(Object.values(WORKFLOWS).map(wf => wf.category))];
  
  workflowCategories.forEach(category => {
    console.log(`\n${category.toUpperCase()}:`);
    Object.entries(WORKFLOWS)
      .filter(([_, wf]) => wf.category === category)
      .forEach(([name, workflow]) => {
        console.log(`  ${name.padEnd(15)} - ${workflow.description}`);
        if (workflow.command) {
          console.log(`  ${' '.repeat(15)} Command: ${workflow.command}`);
        }
        console.log(`  ${' '.repeat(15)} Steps:`);
        workflow.steps.forEach((step, i) => {
          console.log(`  ${' '.repeat(15)}   ${i + 1}. ${step}`);
        });
        console.log('');
      });
  });
  
  console.log('\n📁 PROJECT STRUCTURE:');
  console.log('======================');
  console.log('  active/       - Projects currently being developed');
  console.log('  exploration/  - Proof of concepts and experiments');
  console.log('  paused/       - Projects temporarily on hold');
  console.log('  shipped/      - Production-ready projects');
  console.log('  dev/          - Development environment');
  console.log('  workflow/     - Templates and standards');
  console.log('  meta/         - Cross-project patterns');
  console.log('');
  
  console.log('🔧 DEVELOPMENT CONSTRAINTS:');
  console.log('============================');
  console.log('  • 300-line file limit - Split files before they become unwieldy');
  console.log('  • Single responsibility - Each file has one clear purpose');
  console.log('  • 3-import maximum - Forces intentional dependencies');
  console.log('  • Session discipline - Clear objectives and time limits');
  console.log('  • Health monitoring - Proactive problem detection');
  console.log('');
  
  console.log('💡 TIPS:');
  console.log('========');
  console.log('  • Use health checks every 10 minutes during development');
  console.log('  • Document scope changes with justification');
  console.log('  • Emergency reset protocols available for scope creep');
  console.log('  • Check CLAUDE.md files for project-specific guidance');
  console.log('  • Run global commands from AIPortfolio root directory');
  console.log('');
}

function searchHelp(query) {
  const results = [];
  
  // Search commands
  Object.entries(COMMANDS).forEach(([name, cmd]) => {
    if (name.toLowerCase().includes(query.toLowerCase()) || 
        cmd.description.toLowerCase().includes(query.toLowerCase()) ||
        cmd.category.toLowerCase().includes(query.toLowerCase())) {
      results.push({ type: 'command', name, ...cmd });
    }
  });
  
  // Search workflows
  Object.entries(WORKFLOWS).forEach(([name, workflow]) => {
    if (name.toLowerCase().includes(query.toLowerCase()) || 
        workflow.description.toLowerCase().includes(query.toLowerCase()) ||
        workflow.category.toLowerCase().includes(query.toLowerCase())) {
      results.push({ type: 'workflow', name, ...workflow });
    }
  });
  
  if (results.length === 0) {
    console.log(`\n❌ No results found for "${query}"`);
    console.log('Try searching for: analyze, test, build, deploy, health, session, project, workflow\n');
    return;
  }
  
  console.log(`\n🔍 Search results for "${query}":\n`);
  
  results.forEach(result => {
    if (result.type === 'command') {
      console.log(`COMMAND: ${result.name}`);
      console.log(`  Description: ${result.description}`);
      console.log(`  Usage: ${result.usage}`);
      console.log(`  Example: ${result.example}`);
      console.log('');
    } else {
      console.log(`WORKFLOW: ${result.name}`);
      console.log(`  Description: ${result.description}`);
      if (result.command) {
        console.log(`  Command: ${result.command}`);
      }
      console.log(`  Steps:`);
      result.steps.forEach((step, i) => {
        console.log(`    ${i + 1}. ${step}`);
      });
      console.log('');
    }
  });
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  showHelp();
} else if (args[0] === 'search' && args[1]) {
  searchHelp(args[1]);
} else {
  console.log('\nUsage:');
  console.log('  node help.js              - Show all available commands and workflows');
  console.log('  node help.js search TERM  - Search for specific commands or workflows');
  console.log('');
  console.log('Examples:');
  console.log('  node help.js search test');
  console.log('  node help.js search project');
  console.log('  node help.js search build');
  console.log('');
}