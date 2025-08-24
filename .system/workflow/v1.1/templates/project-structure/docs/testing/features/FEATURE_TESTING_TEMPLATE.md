# Feature Testing Instructions: [Feature Name]

## Feature Overview
**Purpose:** [Single sentence describing what this feature does]  
**Scope:** [What's included and what's not]  
**Implementation Status:** [Ready for testing/In development/etc.]

## Pre-Testing Requirements

### Environment Setup
```bash
# Commands to set up testing environment
npm install
npm run dev
```

### Test Data Preparation
- [ ] [Data requirement 1]
- [ ] [Data requirement 2]
- [ ] [Any specific setup needed]

## Human Testing Scenarios

### Scenario 1: Happy Path Testing
**Objective:** Test the primary use case under normal conditions

**Steps:**
1. [Detailed step 1]
2. [Detailed step 2]
3. [Detailed step 3]

**Expected Results:**
- [Expected outcome 1]
- [Expected outcome 2]
- [Console output should show: X]

**Success Criteria:**
- [ ] Feature works as specified
- [ ] No console errors
- [ ] UI responds appropriately (if applicable)

**Screenshots Needed:**
- [ ] Before state
- [ ] During operation
- [ ] After completion

---

### Scenario 2: Edge Case Testing
**Objective:** Test boundary conditions and edge cases

**Steps:**
1. [Edge case step 1]
2. [Edge case step 2]

**Expected Results:**
- [How system should handle edge cases]

**Watch For:**
- Error handling behavior
- System stability
- User feedback/messaging

---

### Scenario 3: Error Condition Testing
**Objective:** Test how feature handles invalid input or error states

**Steps:**
1. [Error condition step 1]
2. [Try invalid input: X]

**Expected Results:**
- [Graceful error handling expected]
- [User should see appropriate error message]

## Console Commands for Testing

### Basic Functionality Test
```bash
# Command to test basic feature
npm run test:feature-[name]
```

### Performance/Load Testing
```bash
# Commands for performance testing
npm run test:performance
```

### Integration Testing
```bash
# Test feature integration with other components
npm run test:integration
```

## Data Collection Instructions

### Console Logs to Capture
- [ ] Application startup logs
- [ ] Feature execution logs  
- [ ] Any error messages
- [ ] Performance metrics (if available)

### Screenshots to Take
- [ ] Initial state before testing
- [ ] Feature in action (step-by-step if complex)
- [ ] Final result state
- [ ] Any error states encountered

### Performance Metrics to Note
- [ ] Response times
- [ ] Resource usage
- [ ] Network requests (if applicable)

## Feedback Collection

### What to Document
1. **Functionality:** Does it work as expected?
2. **Usability:** Is it intuitive to use?
3. **Performance:** Is it responsive enough?
4. **Reliability:** Any glitches or inconsistencies?
5. **Edge Cases:** Any unexpected behaviors?

### Human Tester Questions
1. How intuitive was the feature to use?
2. What confused you or seemed unclear?
3. What would you improve about the user experience?
4. Did you discover any use cases not covered in the tests?
5. Any suggestions for enhancements?

## Post-Testing Actions

### For Human Tester
- [ ] Complete testing report using HUMAN_TESTING_TEMPLATE.md
- [ ] Attach all screenshots and console logs
- [ ] Provide feedback to AI agent
- [ ] Note any additional test scenarios discovered

### For AI Agent (Upon Receiving Feedback)
- [ ] Review all human feedback
- [ ] Address critical issues immediately
- [ ] Plan enhancements based on suggestions
- [ ] Update documentation based on real usage
- [ ] Create follow-up tasks if needed

## Integration Points to Test
[List other features/components this feature interacts with]
- [ ] [Integration point 1]
- [ ] [Integration point 2]

## Known Limitations
[Document any current limitations or planned future enhancements]

## Support Resources
- **Documentation:** [Link to relevant docs]
- **Code Location:** [File paths for feature implementation]
- **Related Issues:** [Links to any GitHub issues or related work]