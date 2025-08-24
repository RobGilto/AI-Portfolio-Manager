# /move-project

Move project between lifecycle stages

## Usage
```
/move-project <project> <from-stage> <to-stage>
```

## Parameters
- `project` - Name of the project to move
- `from-stage` - Current lifecycle stage
- `to-stage` - Target lifecycle stage

## Lifecycle Stages
- `exploration` - Proof of concepts and experiments
- `active` - Currently being developed
- `dev` - Development/testing phase
- `paused` - Temporarily on hold
- `shipped` - Production-ready projects

## Examples
```
/move-project my-app exploration active
/move-project old-prototype active paused
/move-project finished-app active shipped
```

## Implementation
```bash
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo "Usage: /move-project <project> <from-stage> <to-stage>"
    echo "Stages: exploration, active, dev, paused, shipped"
    echo "Example: /move-project my-app exploration active"
    exit 1
fi

npm run move:project "$1" "$2" "$3"
```