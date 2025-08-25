# AI Portfolio Management System

A disciplined, ADHD-friendly project management system with integrated template architecture for AI development workflows.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

## 🎯 Overview

The AI Portfolio Management System provides a structured approach to managing AI and software development projects with built-in discipline mechanisms, template management, and workflow automation. Designed specifically for developers with ADHD, it enforces healthy development patterns while maintaining flexibility.

## ✨ Key Features

### 🔥 Project Flow Management
- **NOW/NEXT/MAYBE/DONE** workflow with focus tracking
- ADHD-friendly visual status indicators and emojis
- Project lifecycle management with automatic transitions
- Built-in failure analysis workflow (FUNERAL → GRAVEYARD)

### 📄 Template JSON Architecture
- **Complete CRUD operations** for template management
- **Security validation** with path traversal protection
- **Schema-driven validation** using JSON Schema
- **Variable substitution** system (`{{VARIABLE_NAME}}`)
- **Category organization** (project/workflow/component)
- **CLI integration** for seamless template operations

### 🏗️ Disciplined Development
- **300-line file limit** enforcement
- **3-import maximum** dependency constraints
- **Single responsibility** principle guidance
- **Health monitoring** with automated checks
- **Session discipline** with clear objectives

### 🎭 Project Types
- **Learning** - Educational projects and tutorials
- **Use Case** - Practical problem-solving applications
- **Trial-Error** - Experimental proof of concepts
- **Production** - Production-ready applications
- **Research** - Investigation and analysis projects
- **Template** - Reusable boilerplates

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/RobGilto/AI-Portfolio-Manager.git
cd AI-Portfolio-Manager

# Make CLI executable
chmod +x ./cli

# Initialize system directories
./cli status
```

### Basic Usage

```bash
# View all projects and current status
./cli status

# Create a new project with type guidance
./cli wizard my-ai-project

# Start working on a project
./cli start my-ai-project

# Set focus for ADHD-friendly concentration
./cli focus my-ai-project

# Complete and ship a project
./cli ship my-ai-project

# Quick help and command reference
./cli help
```

## 📄 Template System

### Template Management

```bash
# List all available templates
./cli template-list

# Show detailed template information
./cli template-show react-app

# Create a new template
./cli template-create my-template project

# Validate template security and structure
./cli template-validate my-template

# Synchronize template index
./cli template-sync
```

### Available Templates

| Template | Category | Description |
|----------|----------|-------------|
| `react-app` | project | Modern React application with TypeScript & Tailwind |
| `health-check` | workflow | Development health monitoring system |
| `basic-component` | component | Simple reusable component template |

### Template Structure

Templates follow a secure, validated structure:

```json
{
  "id": "template-id",
  "meta": {
    "name": "Template Name",
    "category": "project|workflow|component",
    "version": "1.0.0",
    "description": "Template description",
    "tags": ["tag1", "tag2"]
  },
  "files": [
    {
      "path": "README.md",
      "content": "# {{PROJECT_NAME}}\n\n{{PROJECT_DESCRIPTION}}"
    }
  ],
  "variables": {
    "PROJECT_NAME": {
      "description": "Name of the project",
      "default": "My Project"
    }
  }
}
```

## 🗂️ Project Structure

```
AI-Portfolio-Manager/
├── cli                          # Main CLI interface
├── TemplateManager.js          # Template CRUD operations
├── TemplateValidator.js        # Security & validation
├── ClaudeMdIntegrator.js       # Documentation integration
├── CLAUDE.md                   # Development instructions
├── docs/
│   └── templates/
│       ├── schemas/            # JSON schemas
│       ├── project/            # Project templates
│       ├── workflow/           # Workflow templates
│       ├── component/          # Component templates
│       └── template-index.json # Template registry
└── .system/                    # System state files
```

## 🛠️ Development Philosophy

### Disciplined Development Patterns

- **File Size Limits**: 300-line maximum per file
- **Import Constraints**: Maximum 3 imports per file
- **Single Purpose**: Each file has one clear responsibility
- **Health Monitoring**: Automated checks for code quality
- **Session Management**: Time-boxed development sessions

### ADHD-Friendly Features

- **Visual Status Indicators**: Clear emojis and colors
- **Focus Management**: Single project focus tracking
- **Quick Commands**: Shortened aliases for common operations
- **Immediate Feedback**: Real-time status and progress updates
- **Failure Workflow**: Structured post-mortem analysis

## 🎯 Workflow Examples

### Starting a New Learning Project

```bash
# Create learning project with guidance
./cli wizard learn-tensorflow

# Move to active development
./cli start learn-tensorflow

# Set focus for concentration
./cli focus learn-tensorflow

# Check progress anytime
./cli today
```

### Managing Failed Projects

```bash
# Move failed project for analysis
./cli fail problematic-project

# Conduct post-mortem
./cli analyze problematic-project

# Archive lessons learned
./cli bury problematic-project
```

### Template Development Workflow

```bash
# Create new template
./cli template-create nextjs-app project

# Validate security and structure
./cli template-validate nextjs-app

# Test template integrity
./cli template-show nextjs-app
```

## 🔧 Configuration

### Project Categories

Projects flow through these states:
- **NEXT**: Ready for development
- **NOW**: Currently active (max 3 projects)
- **MAYBE**: Ideas and future considerations
- **DONE**: Completed projects
- **VAULT**: Archived for reference
- **FUNERAL**: Failed projects under analysis
- **GRAVEYARD**: Permanently buried projects

### Template Categories

Templates are organized into:
- **project**: Complete project scaffolding
- **workflow**: Development process templates
- **component**: Reusable code components

## 🚨 Security Features

### Template Security

- **Path Traversal Protection**: Prevents `../` attacks
- **Dangerous Pattern Detection**: Blocks potentially harmful content
- **Command Validation**: Filters unsafe post-creation scripts
- **Size Limits**: Prevents resource exhaustion
- **Schema Enforcement**: Validates template structure

### Best Practices

- Templates undergo automatic security validation
- Variable names must follow `UPPERCASE_PATTERN`
- File paths must be relative and safe
- Content is scanned for injection patterns

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Follow disciplined development patterns
4. Add templates with security validation
5. Submit pull request with clear description

### Template Contributions

1. Create template using `./cli template-create`
2. Validate with `./cli template-validate`
3. Test thoroughly with real projects
4. Document variables and dependencies
5. Submit with usage examples

## 📚 Documentation

- **CLAUDE.md**: Development instructions and standards
- **Template Schemas**: JSON Schema validation rules
- **CLI Help**: `./cli help` for complete command reference
- **Examples**: `./cli examples` for usage patterns

## 🐛 Troubleshooting

### Common Issues

**Template validation failures:**
```bash
# Check template structure
./cli template-validate template-name

# Sync template index
./cli template-sync
```

**Project state inconsistencies:**
```bash
# Synchronize project index
./cli sync

# Check project location
./cli cd project-name
```

**CLI command errors:**
```bash
# Verify system directories
./cli status

# Check help for correct usage
./cli help
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙋 Support

- **Issues**: [GitHub Issues](https://github.com/RobGilto/AI-Portfolio-Manager/issues)
- **Documentation**: Built-in CLI help system (`./cli help`)
- **Examples**: `./cli examples` for usage patterns

## 🚀 Roadmap

- [ ] Web interface for project management
- [ ] Git integration for automatic project detection
- [ ] Template marketplace and sharing
- [ ] Advanced analytics and reporting
- [ ] Integration with popular development tools
- [ ] Mobile app for project tracking

---

**Built with ❤️ for disciplined AI development**