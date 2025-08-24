# Human-AI Collaborative Testing Protocol

## Testing Philosophy
Every feature requires **both** AI automated testing AND human validation with documented feedback.

## Testing Workflow

### Phase 1: AI Agent Preparation
1. **Feature Implementation Complete**
   - AI agent completes feature coding
   - All automated tests pass
   - Code follows development discipline (300-line limit, PURPOSE comments, etc.)

2. **Testing Documentation Creation**
   - AI creates `docs/testing/features/[feature-name].md`
   - Documents test scenarios, expected outcomes
   - Provides step-by-step instructions for human testing

3. **Human Testing Request**
   - AI asks human: "Would you like to participate in testing this feature and provide feedback?"
   - If yes: AI provides testing instructions and feedback template
   - If no: AI proceeds with automated testing only

### Phase 2: Human Testing Execution
1. **Human follows testing instructions**
2. **Human documents results using provided template**
3. **Human provides feedback to AI agent**

### Phase 3: Feedback Integration
1. **AI analyzes human feedback**
2. **AI makes necessary adjustments**
3. **AI updates feature based on human insights**

## Testing Documentation Requirements

### For AI Agents
- Create detailed testing instructions
- Specify expected vs actual results
- Include console commands to run
- Document screenshot requirements
- Provide feedback collection template

### For Human Testers
- Follow step-by-step instructions
- Document actual results vs expected
- Capture console logs when specified
- Take screenshots for UI features
- Report any issues or unexpected behavior

## Feedback Channels
- **Immediate**: Direct conversation during testing session
- **Documented**: Results logged in testing documentation
- **Iterative**: Multiple rounds if needed based on feedback

## Success Criteria
✅ Feature works as specified  
✅ Human testing completed with documented feedback  
✅ AI incorporated human insights  
✅ All edge cases identified and addressed  
✅ Documentation updated based on real usage  