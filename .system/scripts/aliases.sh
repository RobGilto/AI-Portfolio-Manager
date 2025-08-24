#!/bin/bash

# PURPOSE: Global aliases for AI Portfolio workflow commands
# NOTE: Commands now reference markdown documentation instead of shell scripts

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to show command documentation
show_command_doc() {
    local cmd_name="$1"
    if [ -f "$SCRIPT_DIR/${cmd_name}.md" ]; then
        echo "📖 Documentation for /${cmd_name}:"
        echo "=================================="
        cat "$SCRIPT_DIR/${cmd_name}.md"
    else
        echo "❌ Documentation not found for /${cmd_name}"
    fi
}

# Function to run actual command scripts (kept for backwards compatibility)
run_command() {
    local cmd_name="$1"
    shift
    if [ -f "$SCRIPT_DIR/${cmd_name}" ]; then
        "$SCRIPT_DIR/${cmd_name}" "$@"
    else
        echo "❌ Command script not found: ${cmd_name}"
        echo "📖 Showing documentation instead:"
        show_command_doc "$cmd_name"
    fi
}

# Define aliases that show documentation first, then execute
alias portfolio-help="node $SCRIPT_DIR/help.js"
alias portfolio-new="run_command new-project"
alias portfolio-move="run_command project-move" 
alias portfolio-health="run_command daily-health"

# Short aliases
alias ph="node $SCRIPT_DIR/help.js"
alias pn="run_command new-project"
alias pm="run_command project-move"
alias phc="run_command daily-health"

# Documentation-only aliases
alias doc-new="show_command_doc new-project"
alias doc-move="show_command_doc project-move"
alias doc-health="show_command_doc daily-health"

echo "✅ AI Portfolio aliases loaded:"
echo "  portfolio-help  (ph)   - Show workflow help"
echo "  portfolio-new   (pn)   - Create new project"
echo "  portfolio-move  (pm)   - Move project between stages"
echo "  portfolio-health(phc)  - Run health check"
echo ""
echo "📖 Documentation aliases:"
echo "  doc-new                 - Show /new-project documentation"
echo "  doc-move                - Show /project-move documentation"
echo "  doc-health              - Show /daily-health documentation"
echo ""
echo "Example: ph                  # Show help"
echo "Example: pn                  # Create new project"
echo "Example: doc-new             # Show new-project docs"