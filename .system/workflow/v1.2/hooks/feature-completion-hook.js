#!/usr/bin/env node

// PURPOSE: Global feature completion hook for human testing workflow
// SCOPE: Triggers after AI completes feature implementation
// IMPORTS: Node.js fs, path, and child_process for file operations and testing

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Feature Completion Hook - Post-Implementation Testing Workflow
 * 
 * Triggers: After AI agent completes feature implementation
 * Actions:
 * 1. Create human testing case documentation
 * 2. Present testing instructions to human
 * 3. Wait for human feedback submission
 * 4. Process feedback and route next actions
 */

class FeatureCompletionHook {
    constructor(projectPath, featureName, featureDescription) {
        this.projectPath = projectPath || process.cwd();
        this.featureName = featureName || 'unnamed-feature';
        this.featureDescription = featureDescription || 'No description provided';
        this.testingDir = path.join(this.projectPath, 'docs/testing/features');
        this.testingFile = path.join(this.testingDir, `${this.featureName}.md`);
    }

    /**
     * Main hook execution flow
     */
    async execute() {
        console.log('🔗 Feature Completion Hook Triggered');
        console.log(`📁 Project: ${this.projectPath}`);
        console.log(`🎯 Feature: ${this.featureName}`);
        console.log('');

        try {
            // Step 1: Create testing documentation
            await this.createTestingDocumentation();
            
            // Step 2: Present to human
            const participationChoice = await this.requestHumanParticipation();
            
            if (participationChoice) {
                // Step 3: Wait for human testing and feedback
                const feedback = await this.collectHumanFeedback();
                
                // Step 4: Process feedback and determine next actions
                await this.processFeedbackAndRoute(feedback);
            } else {
                console.log('👤 Human declined testing participation');
                console.log('🤖 Proceeding with automated testing only');
                await this.recordTestingDecision('automated-only');
            }

        } catch (error) {
            console.error('❌ Hook execution failed:', error.message);
            process.exit(1);
        }
    }

    /**
     * Create comprehensive testing documentation for the human tester
     */
    async createTestingDocumentation() {
        console.log('📋 Creating human testing documentation...');
        
        // Ensure testing directory exists
        fs.mkdirSync(this.testingDir, { recursive: true });

        // Analyze the feature to create test scenarios
        const testScenarios = await this.analyzeFeatureForTesting();
        
        const testingDoc = this.generateTestingTemplate(testScenarios);
        
        fs.writeFileSync(this.testingFile, testingDoc);
        console.log(`✅ Testing documentation created: ${this.testingFile}`);
    }

    /**
     * Analyze the implemented feature to generate appropriate test scenarios
     */
    async analyzeFeatureForTesting() {
        // This would integrate with the actual implemented code to create relevant test scenarios
        // For now, generating template scenarios based on common patterns
        
        return {
            scenarios: [
                {
                    name: "Happy Path Testing",
                    description: `Test the ${this.featureName} feature under normal conditions`,
                    steps: [
                        "Navigate to the feature",
                        "Execute the primary functionality",
                        "Verify expected results"
                    ],
                    expectedResults: "Feature works as specified without errors"
                },
                {
                    name: "Edge Case Testing", 
                    description: `Test ${this.featureName} with boundary conditions and edge cases`,
                    steps: [
                        "Test with empty/null inputs",
                        "Test with maximum values",
                        "Test with invalid data types"
                    ],
                    expectedResults: "Feature handles edge cases gracefully"
                },
                {
                    name: "User Experience Testing",
                    description: `Evaluate the usability and UX of ${this.featureName}`,
                    steps: [
                        "Follow the user workflow naturally",
                        "Note any confusion points",
                        "Assess visual/interaction feedback"
                    ],
                    expectedResults: "Feature is intuitive and user-friendly"
                }
            ],
            commands: this.generateTestCommands(),
            screenshots: this.shouldTakeScreenshots()
        };
    }

    /**
     * Generate testing template with scenarios and feedback form
     */
    generateTestingTemplate(testScenarios) {
        const timestamp = new Date().toISOString();
        
        return `# Human Testing: ${this.featureName}

## Feature Overview
**Description:** ${this.featureDescription}
**Created:** ${timestamp}
**Testing Status:** 🟡 Pending Human Testing

## Pre-Testing Setup

### Commands to Run
\`\`\`bash
cd ${this.projectPath}

# Install dependencies (if needed)
npm install

# Start the application
npm run dev

# Run any setup commands
${testScenarios.commands.join('\n')}
\`\`\`

## Testing Scenarios

${testScenarios.scenarios.map((scenario, index) => `
### ${index + 1}. ${scenario.name}
**Objective:** ${scenario.description}

**Steps:**
${scenario.steps.map(step => `- [ ] ${step}`).join('\n')}

**Expected Results:** ${scenario.expectedResults}

**Actual Results:** 
_[Human tester fill this out]_

**Issues Found:**
_[Document any problems, unexpected behaviors, or suggestions]_

**Screenshots/Logs:**
_[Attach relevant screenshots or console logs]_

---
`).join('')}

## Human Feedback Form

### Overall Assessment
- [ ] ✅ Feature works as specified
- [ ] ⚠️ Feature works with minor issues
- [ ] ❌ Feature has significant problems
- [ ] 🚫 Feature doesn't work

### Detailed Feedback
**What worked well:**


**What needs improvement:**


**Bugs found:**


**UX/Usability issues:**


**Suggestions for enhancement:**


### Console Logs
\`\`\`
[Paste any relevant console logs here]
\`\`\`

### Screenshots
[Attach screenshots of the feature in action, including any error states]

## Next Steps Recommendation
- [ ] ✅ Ready for production
- [ ] 🔄 Needs minor fixes
- [ ] 🛠️ Needs significant rework
- [ ] 📋 Needs additional features

**Human Tester:** _[Your name]_
**Testing Date:** _[Date completed]_
**Time Spent:** _[Approximate testing duration]_

---

*This testing document will be processed by the AI system after human completion to determine next development actions.*
`;
    }

    /**
     * Generate project-specific test commands
     */
    generateTestCommands() {
        const packageJsonPath = path.join(this.projectPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            const scripts = packageJson.scripts || {};
            
            const commands = [];
            if (scripts.dev) commands.push('# Start development server');
            if (scripts.build) commands.push('npm run build');
            if (scripts.test) commands.push('npm test');
            
            return commands;
        }
        
        return ['# No specific commands identified'];
    }

    /**
     * Determine if screenshots should be taken based on project type
     */
    shouldTakeScreenshots() {
        // Check if this is a UI/frontend project
        const packageJsonPath = path.join(this.projectPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
            
            return !!(deps.react || deps.vue || deps['@angular/core'] || deps.svelte);
        }
        
        return true; // Default to true for comprehensive testing
    }

    /**
     * Request human participation in testing
     */
    async requestHumanParticipation() {
        console.log('');
        console.log('🎯 FEATURE TESTING REQUEST');
        console.log('============================');
        console.log(`Feature: ${this.featureName}`);
        console.log(`Description: ${this.featureDescription}`);
        console.log('');
        console.log('📋 Testing documentation created at:');
        console.log(`   ${this.testingFile}`);
        console.log('');
        console.log('❓ Would you like to participate in testing this feature and provide feedback?');
        console.log('   This helps ensure the feature works correctly from a human perspective.');
        console.log('');
        console.log('Options:');
        console.log('  1. Yes - I will test and provide feedback');
        console.log('  2. No - Continue with automated testing only');
        console.log('');
        
        // In a real implementation, this would use a proper input mechanism
        // For now, returning true to demonstrate the workflow
        return true;
    }

    /**
     * Collect and process human feedback
     */
    async collectHumanFeedback() {
        console.log('⏳ Waiting for human testing completion...');
        console.log('');
        console.log('📝 Instructions for human tester:');
        console.log(`   1. Open: ${this.testingFile}`);
        console.log('   2. Follow the testing scenarios');
        console.log('   3. Fill out the feedback form');
        console.log('   4. Save the file when complete');
        console.log('   5. Return here to continue');
        console.log('');
        console.log('Press Enter when testing is complete...');
        
        // In real implementation, this would:
        // 1. Monitor the file for changes
        // 2. Parse the completed feedback
        // 3. Validate the feedback is complete
        // 4. Return structured feedback data
        
        return this.parseFeedbackFromFile();
    }

    /**
     * Parse feedback from the completed testing file
     */
    parseFeedbackFromFile() {
        if (!fs.existsSync(this.testingFile)) {
            throw new Error('Testing file not found');
        }
        
        const content = fs.readFileSync(this.testingFile, 'utf8');
        
        // Extract feedback using simple parsing
        // In production, this would be more sophisticated
        const feedback = {
            status: 'completed',
            overallAssessment: this.extractOverallAssessment(content),
            detailedFeedback: this.extractDetailedFeedback(content),
            recommendation: this.extractRecommendation(content),
            timestamp: new Date().toISOString()
        };
        
        return feedback;
    }

    /**
     * Extract overall assessment from feedback content
     */
    extractOverallAssessment(content) {
        if (content.includes('✅ Feature works as specified')) return 'success';
        if (content.includes('⚠️ Feature works with minor issues')) return 'minor-issues';
        if (content.includes('❌ Feature has significant problems')) return 'major-issues';
        if (content.includes('🚫 Feature doesn\'t work')) return 'failure';
        return 'unknown';
    }

    /**
     * Extract detailed feedback sections
     */
    extractDetailedFeedback(content) {
        return {
            workedWell: this.extractSection(content, 'What worked well:'),
            needsImprovement: this.extractSection(content, 'What needs improvement:'),
            bugsFound: this.extractSection(content, 'Bugs found:'),
            uxIssues: this.extractSection(content, 'UX/Usability issues:'),
            suggestions: this.extractSection(content, 'Suggestions for enhancement:')
        };
    }

    /**
     * Extract recommendation for next steps
     */
    extractRecommendation(content) {
        if (content.includes('✅ Ready for production')) return 'ready';
        if (content.includes('🔄 Needs minor fixes')) return 'minor-fixes';
        if (content.includes('🛠️ Needs significant rework')) return 'major-rework';
        if (content.includes('📋 Needs additional features')) return 'more-features';
        return 'unknown';
    }

    /**
     * Extract content from a specific section
     */
    extractSection(content, sectionHeader) {
        const lines = content.split('\n');
        let capturing = false;
        let section = '';
        
        for (const line of lines) {
            if (line.includes(sectionHeader)) {
                capturing = true;
                continue;
            }
            
            if (capturing) {
                if (line.startsWith('**') || line.startsWith('###')) {
                    break;
                }
                section += line + '\n';
            }
        }
        
        return section.trim();
    }

    /**
     * Process feedback and route to appropriate next actions
     */
    async processFeedbackAndRoute(feedback) {
        console.log('');
        console.log('🔄 Processing human feedback...');
        console.log('');

        // Create feedback summary
        this.logFeedbackSummary(feedback);

        // Determine and execute next actions based on feedback
        switch (feedback.recommendation) {
            case 'ready':
                await this.routeToProduction(feedback);
                break;
                
            case 'minor-fixes':
                await this.routeToMinorFixes(feedback);
                break;
                
            case 'major-rework':
                await this.routeToMajorRework(feedback);
                break;
                
            case 'more-features':
                await this.routeToFeatureEnhancement(feedback);
                break;
                
            default:
                await this.routeToManualReview(feedback);
        }

        // Archive the testing session
        await this.archiveTestingSession(feedback);
    }

    /**
     * Log feedback summary for review
     */
    logFeedbackSummary(feedback) {
        console.log('📊 HUMAN FEEDBACK SUMMARY');
        console.log('==========================');
        console.log(`Overall Assessment: ${feedback.overallAssessment}`);
        console.log(`Recommendation: ${feedback.recommendation}`);
        console.log('');
        
        if (feedback.detailedFeedback.bugsFound) {
            console.log('🐛 Bugs Found:');
            console.log(feedback.detailedFeedback.bugsFound);
            console.log('');
        }
        
        if (feedback.detailedFeedback.needsImprovement) {
            console.log('🛠️ Needs Improvement:');
            console.log(feedback.detailedFeedback.needsImprovement);
            console.log('');
        }
    }

    /**
     * Route feature to production readiness
     */
    async routeToProduction(feedback) {
        console.log('✅ ROUTING TO PRODUCTION');
        console.log('Human testing passed - feature ready for production');
        
        // Create production readiness checklist
        const checklistPath = path.join(this.testingDir, `${this.featureName}-production-checklist.md`);
        const checklist = this.generateProductionChecklist(feedback);
        fs.writeFileSync(checklistPath, checklist);
        
        console.log(`📋 Production checklist created: ${checklistPath}`);
    }

    /**
     * Route to minor fixes workflow
     */
    async routeToMinorFixes(feedback) {
        console.log('🔄 ROUTING TO MINOR FIXES');
        console.log('Creating fix list from human feedback...');
        
        const fixListPath = path.join(this.testingDir, `${this.featureName}-fixes.md`);
        const fixList = this.generateFixList(feedback);
        fs.writeFileSync(fixListPath, fixList);
        
        console.log(`🛠️ Fix list created: ${fixListPath}`);
        console.log('Next: AI will address these fixes and request re-testing');
    }

    /**
     * Route to major rework workflow
     */
    async routeToMajorRework(feedback) {
        console.log('🛠️ ROUTING TO MAJOR REWORK');
        console.log('Significant issues found - planning rework...');
        
        const reworkPlanPath = path.join(this.testingDir, `${this.featureName}-rework-plan.md`);
        const reworkPlan = this.generateReworkPlan(feedback);
        fs.writeFileSync(reworkPlanPath, reworkPlan);
        
        console.log(`📋 Rework plan created: ${reworkPlanPath}`);
    }

    /**
     * Route to feature enhancement workflow
     */
    async routeToFeatureEnhancement(feedback) {
        console.log('📋 ROUTING TO FEATURE ENHANCEMENT');
        console.log('Additional features requested...');
        
        const enhancementPath = path.join(this.testingDir, `${this.featureName}-enhancements.md`);
        const enhancements = this.generateEnhancementPlan(feedback);
        fs.writeFileSync(enhancementPath, enhancements);
        
        console.log(`🎯 Enhancement plan created: ${enhancementPath}`);
    }

    /**
     * Route to manual review when feedback is unclear
     */
    async routeToManualReview(feedback) {
        console.log('👤 ROUTING TO MANUAL REVIEW');
        console.log('Feedback requires human interpretation...');
        
        const reviewPath = path.join(this.testingDir, `${this.featureName}-manual-review.md`);
        const review = this.generateManualReviewRequest(feedback);
        fs.writeFileSync(reviewPath, review);
        
        console.log(`📋 Manual review request created: ${reviewPath}`);
    }

    /**
     * Generate production readiness checklist
     */
    generateProductionChecklist(feedback) {
        return `# Production Readiness: ${this.featureName}

## Human Testing Results
✅ **Passed Human Testing**
- Overall Assessment: ${feedback.overallAssessment}
- Tested on: ${feedback.timestamp}

## What Worked Well
${feedback.detailedFeedback.workedWell}

## Pre-Production Checklist
- [ ] Code review completed
- [ ] Automated tests passing
- [ ] Performance benchmarks met
- [ ] Security review (if applicable)
- [ ] Documentation updated
- [ ] Deployment plan ready

## Deployment Notes
Based on human testing, this feature is ready for production deployment.

## Monitoring Plan
- Monitor for any issues in first 24 hours
- Track user adoption metrics
- Watch for any edge cases not caught in testing
`;
    }

    /**
     * Generate fix list from feedback
     */
    generateFixList(feedback) {
        return `# Fix List: ${this.featureName}

## Human Testing Feedback
Based on human testing, the following fixes are needed:

## Bugs to Fix
${feedback.detailedFeedback.bugsFound || 'None reported'}

## Improvements Needed
${feedback.detailedFeedback.needsImprovement || 'None reported'}

## UX/Usability Issues
${feedback.detailedFeedback.uxIssues || 'None reported'}

## Action Items
- [ ] Address reported bugs
- [ ] Implement suggested improvements
- [ ] Fix UX/usability issues
- [ ] Re-test with human after fixes
- [ ] Update documentation if needed

## Re-Testing Required
After fixes are implemented, human re-testing is required to validate the improvements.
`;
    }

    /**
     * Generate rework plan
     */
    generateReworkPlan(feedback) {
        return `# Major Rework Plan: ${this.featureName}

## Human Testing Results
❌ **Significant Issues Found**
- Overall Assessment: ${feedback.overallAssessment}

## Critical Issues
${feedback.detailedFeedback.bugsFound}

## Major Improvements Needed
${feedback.detailedFeedback.needsImprovement}

## Rework Strategy
1. **Analysis Phase**
   - Review fundamental approach
   - Identify root causes of issues
   - Consider alternative implementations

2. **Redesign Phase**
   - Create new implementation plan
   - Address core problems identified
   - Design with human feedback in mind

3. **Re-implementation Phase**
   - Implement revised solution
   - Focus on issues raised in testing
   - Build in better error handling

4. **Re-testing Phase**
   - Complete human testing cycle again
   - Validate all issues addressed
   - Ensure no regressions introduced

## Timeline Estimate
Major rework typically requires 2-3x original implementation time.
`;
    }

    /**
     * Generate enhancement plan
     */
    generateEnhancementPlan(feedback) {
        return `# Feature Enhancement Plan: ${this.featureName}

## Current Status
✅ Core feature works
📋 Enhancement requests from human testing

## Suggested Enhancements
${feedback.detailedFeedback.suggestions}

## Enhancement Priority
1. **High Priority**: Critical for user experience
2. **Medium Priority**: Would improve usability
3. **Low Priority**: Nice-to-have features

## Implementation Plan
- [ ] Prioritize enhancement requests
- [ ] Create implementation plan for each
- [ ] Implement in priority order
- [ ] Test each enhancement with human feedback
- [ ] Integrate into main feature

## Enhancement Testing
Each enhancement will go through the same human testing cycle to ensure quality and usability.
`;
    }

    /**
     * Generate manual review request
     */
    generateManualReviewRequest(feedback) {
        return `# Manual Review Required: ${this.featureName}

## Human Testing Completed
The human tester provided feedback that requires manual interpretation and decision-making.

## Feedback Summary
- Overall Assessment: ${feedback.overallAssessment}
- Recommendation: ${feedback.recommendation}

## Raw Feedback
${JSON.stringify(feedback.detailedFeedback, null, 2)}

## Manual Review Needed For:
- Unclear feedback interpretation
- Strategic direction decisions
- Priority/resource allocation
- Complex technical trade-offs

## Next Steps
1. Human project manager/lead to review feedback
2. Make strategic decisions on direction
3. Provide clear guidance for AI implementation
4. Resume development with clarified requirements
`;
    }

    /**
     * Archive the testing session for future reference
     */
    async archiveTestingSession(feedback) {
        const archiveDir = path.join(this.projectPath, 'docs/testing/archive');
        fs.mkdirSync(archiveDir, { recursive: true });
        
        const archiveFile = path.join(archiveDir, `${this.featureName}-${Date.now()}.json`);
        const sessionData = {
            feature: this.featureName,
            description: this.featureDescription,
            feedback: feedback,
            testingFile: this.testingFile,
            timestamp: new Date().toISOString()
        };
        
        fs.writeFileSync(archiveFile, JSON.stringify(sessionData, null, 2));
        console.log(`📁 Testing session archived: ${archiveFile}`);
    }

    /**
     * Record testing decision (when human declines to participate)
     */
    async recordTestingDecision(decision) {
        const decisionsFile = path.join(this.testingDir, 'testing-decisions.md');
        const entry = `\n## ${this.featureName} - ${new Date().toISOString()}\n**Decision:** ${decision}\n**Reason:** Human declined participation\n\n`;
        
        fs.appendFileSync(decisionsFile, entry);
        console.log('📝 Testing decision recorded');
    }
}

// CLI interface for the hook
if (require.main === module) {
    const args = process.argv.slice(2);
    const projectPath = args[0] || process.cwd();
    const featureName = args[1] || 'unnamed-feature';
    const featureDescription = args[2] || 'No description provided';
    
    const hook = new FeatureCompletionHook(projectPath, featureName, featureDescription);
    hook.execute().catch(console.error);
}

module.exports = FeatureCompletionHook;