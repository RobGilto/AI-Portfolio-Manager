# /session-start

Start development session with objective

## Usage
```
/session-start <objective>
```

## Parameters
- `objective` - Clear description of the session's development goal

## Examples
```
/session-start "Fix authentication bug in essayAI"
/session-start "Implement user dashboard for consensus system"
```

## Description
Initiates a focused development session with a clearly defined objective. Enforces session discipline by requiring explicit goals before starting work.

## Implementation
```bash
if [ -z "$1" ]; then
    echo "Usage: /session-start <objective>"
    echo "Example: /session-start \"Fix authentication bug in essayAI\""
    exit 1
fi

npm run session:start "$1"
echo "📋 Session started with objective: $1"
```