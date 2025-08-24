# Daily Health Check

Runs a comprehensive health check across the entire AI portfolio to identify project health status and issues.

## Usage

```bash
/daily-health
```

## What it does

1. **Scans Portfolio Directories**
   - `active/` - Projects currently being developed
   - `exploration/` - Proof of concepts and experiments  
   - `dev/` - Development projects

2. **Checks Each Project**
   - Verifies `package.json` exists
   - Confirms `check:health` script is available
   - Runs health check and reports status

3. **Provides Summary Report**
   - Total projects found
   - Healthy vs failed projects
   - Specific recommendations for failed projects

## Sample Output

```
🏥 Portfolio Health Check
==========================
Date: Wed Aug 21 10:30:00 2025

📋 ACTIVE PROJECTS:
-------------------
🔍 Checking: active/consensus
  ✅ Healthy
🔍 Checking: active/domo-cli-harcourts-dataset-alerts
  ✅ Healthy

🧪 EXPLORATION PROJECTS:
------------------------
🔍 Checking: exploration/neutron-ai-pkm
  ✅ Healthy

📊 HEALTH SUMMARY:
==================
Total projects checked: 3
Healthy projects: 3
Failed projects: 0
🎉 All projects are healthy!

💡 RECOMMENDATIONS:
===================
• Run individual health checks: npm run check:health
• Check file sizes: scripts/check-file-sizes (if available)
• Review CLAUDE.md files for project-specific guidance
```

## Implementation Details

The health check:
- Skips directories without `package.json`
- Validates health check scripts exist
- Provides actionable recommendations
- Returns appropriate exit codes for automation

## Related Commands

- Individual project health: `npm run check:health` (from project directory)
- File size monitoring: `npm run check:size` (from project directory)
- Session management: `npm run session:start` / `npm run session:end`