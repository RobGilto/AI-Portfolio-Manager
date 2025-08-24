#!/bin/bash

# PURPOSE: Install global hooks system across AIPortfolio
# SCOPE: Sets up hooks in all existing projects and creates integration scripts
# IMPORTS: None - bash script

echo "🔗 Installing AIPortfolio Global Hook System v1.2"
echo "================================================="

# Set portfolio root
PORTFOLIO_ROOT="/home/robert/AIPortfolio"
HOOKS_DIR="$PORTFOLIO_ROOT/workflow/v1.2/hooks"

# Make sure we're in the right directory
cd "$PORTFOLIO_ROOT" || {
    echo "❌ Error: Could not find AIPortfolio directory"
    exit 1
}

# Create hooks directory structure
echo "📁 Creating hook system directories..."
mkdir -p "$HOOKS_DIR"
mkdir -p "$HOOKS_DIR/logs"
mkdir -p "$HOOKS_DIR/config"

# Make hook scripts executable
echo "🔧 Setting executable permissions..."
chmod +x "$HOOKS_DIR"/*.js
chmod +x "$HOOKS_DIR"/*.sh

# Install hooks in existing projects
echo "📦 Installing hooks in existing projects..."

# Function to install hooks in a project
install_project_hooks() {
    local project_path="$1"
    local project_name=$(basename "$project_path")
    
    echo "  Installing hooks in: $project_name"
    
    # Create project hook integration script
    cat > "$project_path/hooks.js" << EOF
#!/usr/bin/env node

// PURPOSE: Project-specific hook integration for $project_name
// SCOPE: Connects project to global hook system
// IMPORTS: HookManager from global system

const path = require('path');
const HookManager = require('$HOOKS_DIR/hook-manager.js');

const manager = new HookManager();
const projectPath = __dirname;

// Export hook triggers for this project
module.exports = {
    // Trigger after AI completes a feature
    featureCompleted: async (featureName, featureDescription) => {
        console.log('🎯 Feature completion detected: ' + featureName);
        return manager.triggerFeatureCompletion(projectPath, featureName, featureDescription);
    },
    
    // Trigger health check
    healthCheck: async () => {
        console.log('🏥 Running health check...');
        return manager.triggerHealthCheck(projectPath);
    },
    
    // Trigger documentation sync
    syncDocs: async () => {
        console.log('📚 Syncing documentation...');
        return manager.triggerDocumentationSync(projectPath);
    }
};

// CLI interface for project hooks
if (require.main === module) {
    const command = process.argv[2];
    const args = process.argv.slice(3);
    
    switch (command) {
        case 'feature-completed':
            module.exports.featureCompleted(args[0], args[1]);
            break;
        case 'health-check':
            module.exports.healthCheck();
            break;
        case 'sync-docs':
            module.exports.syncDocs();
            break;
        default:
            console.log('Usage: node hooks.js <command> [args]');
            console.log('Commands: feature-completed, health-check, sync-docs');
    }
}
EOF
    
    chmod +x "$project_path/hooks.js"
    
    # Update package.json to include hook commands
    if [ -f "$project_path/package.json" ]; then
        # Create a backup
        cp "$project_path/package.json" "$project_path/package.json.backup"
        
        # Add hook scripts using Node.js to modify JSON safely
        node -e "
            const fs = require('fs');
            const path = require('path');
            const packagePath = '$project_path/package.json';
            
            try {
                const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
                
                // Add hook-related scripts
                pkg.scripts = pkg.scripts || {};
                pkg.scripts['hook:feature-completed'] = 'node hooks.js feature-completed';
                pkg.scripts['hook:health-check'] = 'node hooks.js health-check';
                pkg.scripts['hook:sync-docs'] = 'node hooks.js sync-docs';
                
                fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
                console.log('✅ Package.json updated with hook scripts');
            } catch (error) {
                console.log('⚠️ Could not update package.json:', error.message);
            }
        "
    fi
    
    # Create testing directory structure if it doesn't exist
    mkdir -p "$project_path/docs/testing/features"
    mkdir -p "$project_path/docs/testing/archive"
    
    echo "  ✅ Hooks installed in: $project_name"
}

# Install in all active projects
echo "🚀 Installing in active projects..."
for project in active/*/; do
    if [ -d "$project" ] && [ -f "$project/package.json" ]; then
        install_project_hooks "$(realpath "$project")"
    fi
done

# Install in exploration projects
echo "🔍 Installing in exploration projects..."
for project in exploration/*/; do
    if [ -d "$project" ] && [ -f "$project/package.json" ]; then
        install_project_hooks "$(realpath "$project")"
    fi
done

# Install in dev projects
echo "🛠️ Installing in dev projects..."
for project in dev/*/; do
    if [ -d "$project" ] && [ -f "$project/package.json" ]; then
        install_project_hooks "$(realpath "$project")"
    fi
done

# Create global hook commands
echo "🌐 Creating global hook commands..."

# Create global feature completion command
cat > "$PORTFOLIO_ROOT/scripts/feature-completed" << 'EOF'
#!/bin/bash

# PURPOSE: Global command to trigger feature completion hooks
# SCOPE: Can be called from anywhere in the portfolio
# USAGE: ./scripts/feature-completed <feature-name> <description>

PORTFOLIO_ROOT="/home/robert/AIPortfolio"
HOOKS_DIR="$PORTFOLIO_ROOT/workflow/v1.2/hooks"

# Get current project directory
PROJECT_PATH=$(pwd)

# Check if we're in a project directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in a project directory (no package.json found)"
    exit 1
fi

FEATURE_NAME="${1:-unnamed-feature}"
FEATURE_DESC="${2:-No description provided}"

echo "🎯 Triggering feature completion hook..."
echo "Project: $(basename "$PROJECT_PATH")"
echo "Feature: $FEATURE_NAME"

# Execute the feature completion hook
node "$HOOKS_DIR/hook-manager.js" feature-completed "$PROJECT_PATH" "$FEATURE_NAME" "$FEATURE_DESC"
EOF

chmod +x "$PORTFOLIO_ROOT/scripts/feature-completed"

# Create global health check command
cat > "$PORTFOLIO_ROOT/scripts/health-check-all" << 'EOF'
#!/bin/bash

# PURPOSE: Run health checks across all portfolio projects
# SCOPE: Global health monitoring command
# USAGE: ./scripts/health-check-all

PORTFOLIO_ROOT="/home/robert/AIPortfolio"
HOOKS_DIR="$PORTFOLIO_ROOT/workflow/v1.2/hooks"

echo "🏥 Running health checks across all portfolio projects..."

node "$HOOKS_DIR/hook-manager.js" health-check-all
EOF

chmod +x "$PORTFOLIO_ROOT/scripts/health-check-all"

# Create portfolio status command
cat > "$PORTFOLIO_ROOT/scripts/hook-status" << 'EOF'
#!/bin/bash

# PURPOSE: Show status of hook system across portfolio
# SCOPE: Global hook system monitoring
# USAGE: ./scripts/hook-status

PORTFOLIO_ROOT="/home/robert/AIPortfolio"
HOOKS_DIR="$PORTFOLIO_ROOT/workflow/v1.2/hooks"

echo "🔗 AIPortfolio Hook System Status"
echo "================================="

node "$HOOKS_DIR/hook-manager.js" status
EOF

chmod +x "$PORTFOLIO_ROOT/scripts/hook-status"

# Update root package.json with global hook commands
echo "📝 Updating root package.json with global commands..."
if [ -f "$PORTFOLIO_ROOT/package.json" ]; then
    cp "$PORTFOLIO_ROOT/package.json" "$PORTFOLIO_ROOT/package.json.backup"
    
    node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        pkg.scripts = pkg.scripts || {};
        pkg.scripts['hooks:status'] = './scripts/hook-status';
        pkg.scripts['hooks:health-all'] = './scripts/health-check-all';
        pkg.scripts['hooks:feature'] = './scripts/feature-completed';
        
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
        console.log('✅ Root package.json updated');
    "
fi

# Create hook usage documentation
echo "📚 Creating hook system documentation..."
cat > "$HOOKS_DIR/README.md" << 'EOF'
# AIPortfolio Hook System v1.2

## Overview

The global hook system enables automated workflows after AI feature completion, including:
- Human testing request and feedback collection
- Automated health monitoring
- Documentation synchronization
- Cross-project workflow coordination

## Hook Types

### 1. Feature Completion Hook
**Trigger:** After AI completes feature implementation
**Actions:**
- Creates human testing documentation
- Requests human participation
- Collects and processes feedback
- Routes to appropriate next steps

### 2. Health Check Hook  
**Trigger:** Scheduled or on-demand
**Actions:**
- Monitors file size compliance
- Checks PURPOSE comments
- Validates project health metrics

### 3. Documentation Sync Hook
**Trigger:** After code changes
**Actions:**
- Updates CLAUDE.md if needed
- Syncs README with package.json
- Maintains documentation currency

## Global Commands

```bash
# Check hook system status
npm run hooks:status

# Run health checks across all projects  
npm run hooks:health-all

# Trigger feature completion (from project directory)
npm run hooks:feature "feature-name" "description"
```

## Project Commands

From within any project directory:

```bash
# Trigger feature completion hook
node hooks.js feature-completed "feature-name" "description"

# Run project health check
node hooks.js health-check

# Sync project documentation
node hooks.js sync-docs
```

## Integration with AI Development

### When AI Completes a Feature:
1. AI calls: `node hooks.js feature-completed "auth-system" "User authentication"`
2. Hook creates testing documentation in `docs/testing/features/`
3. Human is prompted to test and provide feedback
4. System processes feedback and routes to next steps

### Human Testing Workflow:
1. **Testing Documentation Created** - Step-by-step instructions
2. **Human Participation Requested** - Optional but recommended
3. **Feedback Collection** - Structured form in markdown
4. **Automatic Routing** - Based on feedback:
   - ✅ Ready for production
   - 🔄 Minor fixes needed  
   - 🛠️ Major rework required
   - 📋 Additional features requested

## Configuration

Hook configuration is stored in `workflow/v1.2/hooks/hooks.json`:

```json
{
  "hooks": {
    "feature-completion": {
      "enabled": true,
      "projects": "all",
      "timeout": 300000
    }
  }
}
```

## Logs and Monitoring

- Hook execution logs: `workflow/v1.2/hooks/hooks.log`
- Testing archives: `docs/testing/archive/`
- Health check results: Project-specific output

## Customization

Projects can add custom hooks by:
1. Creating hook scripts in project directory
2. Adding to project `hooks.js` exports
3. Updating package.json scripts

This system enhances the disciplined development process with automated human-AI collaboration workflows.
EOF

echo ""
echo "🎉 AIPortfolio Hook System v1.2 Installation Complete!"
echo "====================================================="
echo ""
echo "📋 What was installed:"
echo "  ✅ Global hook management system"
echo "  ✅ Feature completion hooks in all projects"
echo "  ✅ Health check monitoring"
echo "  ✅ Documentation sync automation"
echo "  ✅ Project-specific integration scripts"
echo "  ✅ Global portfolio commands"
echo ""
echo "🚀 Quick Start:"
echo "  cd active/your-project"
echo "  node hooks.js feature-completed 'new-feature' 'Feature description'"
echo ""
echo "🔍 Monitor system status:"
echo "  npm run hooks:status"
echo ""
echo "🏥 Run global health check:"
echo "  npm run hooks:health-all"
echo ""
echo "📚 Documentation:"
echo "  See: workflow/v1.2/hooks/README.md"