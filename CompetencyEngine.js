// PURPOSE: Competency assessment and calculation engine for AI engineering skills
// Provides detailed analysis of skill gaps, learning paths, and progress tracking
// Integrates with mission system for targeted skill development recommendations

const fs = require('fs');
const path = require('path');

class CompetencyEngine {
  constructor(portfolioRoot = __dirname) {
    this.root = portfolioRoot;
    this.systemDir = path.join(this.root, '.system');
    this.competencyFile = path.join(this.systemDir, 'competency-framework.json');
    this.missionFile = path.join(this.systemDir, 'mission-data.json');
    
    this._loadFramework();
  }

  // === DATA LOADING ===

  _loadFramework() {
    try {
      this.framework = JSON.parse(fs.readFileSync(this.competencyFile, 'utf8'));
      this.missionData = JSON.parse(fs.readFileSync(this.missionFile, 'utf8'));
    } catch (error) {
      console.error('Failed to load competency framework:', error.message);
      throw error;
    }
  }

  _saveMissionData() {
    this.missionData.lastUpdated = new Date().toISOString();
    fs.writeFileSync(this.missionFile, JSON.stringify(this.missionData, null, 2));
  }

  // === COMPETENCY ANALYSIS ===

  analyzeCompetency(competencyId) {
    const competency = this.framework.competencies[competencyId];
    if (!competency) {
      throw new Error(`Competency ${competencyId} not found`);
    }

    const userAssessment = this.missionData.userAssessments[competencyId] || {
      currentLevel: 1,
      targetLevel: 2,
      lastAssessed: null
    };

    const analysis = {
      competency,
      current: this._getLevelDetails(competencyId, userAssessment.currentLevel),
      target: this._getLevelDetails(competencyId, userAssessment.targetLevel),
      gap: userAssessment.targetLevel - userAssessment.currentLevel,
      category: this.framework.categories[competency.category],
      learningPath: this._generateLearningPath(competencyId, userAssessment),
      timeEstimate: this._calculateTimeEstimate(competencyId, userAssessment),
      prerequisites: this._getPrerequisites(competencyId, userAssessment.currentLevel),
      nextMilestone: this._getNextMilestone(competencyId, userAssessment.currentLevel)
    };

    return analysis;
  }

  getCompetencyMatrix() {
    const assessments = this.missionData.userAssessments || {};
    const matrix = {};

    Object.keys(this.framework.competencies).forEach(competencyId => {
      const competency = this.framework.competencies[competencyId];
      const assessment = assessments[competencyId] || {
        currentLevel: 1,
        targetLevel: 2
      };

      matrix[competencyId] = {
        name: competency.name,
        category: competency.category,
        currentLevel: assessment.currentLevel,
        targetLevel: assessment.targetLevel,
        gap: assessment.targetLevel - assessment.currentLevel,
        progress: this._calculateProgress(assessment.currentLevel, assessment.targetLevel),
        priority: this._calculatePriority(competencyId, assessment)
      };
    });

    return matrix;
  }

  recommendLearningPath(missionId = null) {
    const mission = missionId ? this.missionData.missions[missionId] : null;
    const assessments = this.missionData.userAssessments || {};
    
    // Get competencies to focus on
    const focusCompetencies = mission?.competencyFocus || Object.keys(this.framework.competencies);
    
    const recommendations = focusCompetencies.map(competencyId => {
      const assessment = assessments[competencyId] || {
        currentLevel: 1,
        targetLevel: 2
      };
      
      return {
        competencyId,
        analysis: this.analyzeCompetency(competencyId),
        priority: this._calculatePriority(competencyId, assessment),
        immediateActions: this._getImmediateActions(competencyId, assessment.currentLevel)
      };
    });

    // Sort by priority and gap size
    recommendations.sort((a, b) => {
      const priorityDiff = b.priority - a.priority;
      if (priorityDiff !== 0) return priorityDiff;
      return b.analysis.gap - a.analysis.gap;
    });

    return {
      mission: mission?.title || 'General Development',
      totalCompetencies: recommendations.length,
      recommendations: recommendations.slice(0, 5), // Top 5 recommendations
      estimatedTimeframe: this._calculateOverallTimeframe(recommendations.slice(0, 3))
    };
  }

  // === ASSESSMENT UTILITIES ===

  validateAssessment(competencyId, level) {
    const competency = this.framework.competencies[competencyId];
    if (!competency) {
      return { valid: false, error: `Competency ${competencyId} not found` };
    }

    const levelKeys = Object.keys(competency.levels);
    const validLevels = levelKeys.map(key => competency.levels[key].level);
    
    if (!validLevels.includes(level)) {
      return { 
        valid: false, 
        error: `Invalid level ${level}. Valid levels: ${validLevels.join(', ')}` 
      };
    }

    return { valid: true };
  }

  suggestSelfAssessment(competencyId) {
    const competency = this.framework.competencies[competencyId];
    if (!competency) {
      throw new Error(`Competency ${competencyId} not found`);
    }

    const questions = Object.entries(competency.levels).map(([levelKey, levelData]) => {
      return {
        level: levelData.level,
        name: levelData.name,
        question: `Can you confidently: ${levelData.skills.join(', ')}?`,
        skills: levelData.skills,
        timeToAchieve: levelData.timeToAchieve
      };
    });

    return {
      competency: competency.name,
      description: competency.description,
      assessmentQuestions: questions,
      instructions: "Rate your current ability level based on the skills you can confidently demonstrate."
    };
  }

  calculateCompetencyScore(competencyId, projectTags = [], projectDescription = '') {
    const competency = this.framework.competencies[competencyId];
    if (!competency) return 0;

    let score = 0;
    const keywords = this._getCompetencyKeywords(competencyId);
    const text = `${projectTags.join(' ')} ${projectDescription}`.toLowerCase();

    // Keyword matching
    keywords.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        score += keyword.weight || 1;
      }
    });

    // Category bonus
    const categoryKeywords = this._getCategoryKeywords(competency.category);
    categoryKeywords.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        score += 0.5;
      }
    });

    return Math.min(score, 10); // Cap at 10
  }

  // === PRIVATE HELPERS ===

  _getLevelDetails(competencyId, level) {
    const competency = this.framework.competencies[competencyId];
    const levelKey = Object.keys(competency.levels).find(
      key => competency.levels[key].level === level
    );
    
    return levelKey ? competency.levels[levelKey] : null;
  }

  _generateLearningPath(competencyId, assessment) {
    const currentLevel = assessment.currentLevel;
    const targetLevel = assessment.targetLevel;
    const competency = this.framework.competencies[competencyId];
    
    const path = [];
    for (let level = currentLevel + 1; level <= targetLevel; level++) {
      const levelDetails = this._getLevelDetails(competencyId, level);
      if (levelDetails) {
        path.push({
          level,
          name: levelDetails.name,
          skills: levelDetails.skills,
          timeEstimate: levelDetails.timeToAchieve,
          description: levelDetails.description
        });
      }
    }

    return path;
  }

  _calculateTimeEstimate(competencyId, assessment) {
    const path = this._generateLearningPath(competencyId, assessment);
    
    // Parse time estimates and sum them
    let totalMonths = 0;
    path.forEach(step => {
      const timeStr = step.timeEstimate || '1-2 months';
      const months = this._parseTimeEstimate(timeStr);
      totalMonths += months;
    });

    return {
      totalMonths,
      formattedTime: this._formatTimeEstimate(totalMonths),
      steps: path.length
    };
  }

  _parseTimeEstimate(timeStr) {
    // Parse strings like "1-3 months", "6-12 months", "2+ years"
    if (timeStr.includes('year')) {
      const match = timeStr.match(/(\d+)/);
      return match ? parseInt(match[1]) * 12 : 12;
    } else if (timeStr.includes('month')) {
      const match = timeStr.match(/(\d+)-?(\d+)?/);
      if (match) {
        const min = parseInt(match[1]);
        const max = match[2] ? parseInt(match[2]) : min;
        return (min + max) / 2;
      }
    }
    return 6; // Default fallback
  }

  _formatTimeEstimate(months) {
    if (months < 12) {
      return `${Math.round(months)} months`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      if (remainingMonths === 0) {
        return `${years} year${years > 1 ? 's' : ''}`;
      } else {
        return `${years}.${Math.round(remainingMonths / 12 * 10)} years`;
      }
    }
  }

  _calculateProgress(currentLevel, targetLevel) {
    if (targetLevel <= currentLevel) return 1.0;
    return (currentLevel - 1) / (targetLevel - 1);
  }

  _calculatePriority(competencyId, assessment) {
    let priority = 0;
    
    // Gap size factor
    const gap = assessment.targetLevel - assessment.currentLevel;
    priority += gap * 0.3;
    
    // Mission alignment factor
    const activeMissionId = this.missionData.activeMission;
    if (activeMissionId) {
      const mission = this.missionData.missions[activeMissionId];
      if (mission && mission.competencyFocus.includes(competencyId)) {
        priority += 0.4;
      }
    }
    
    // Time since last assessment factor
    if (assessment.lastAssessed) {
      const daysSince = (Date.now() - new Date(assessment.lastAssessed)) / (1000 * 60 * 60 * 24);
      if (daysSince > 30) {
        priority += 0.2;
      }
    } else {
      priority += 0.3; // Never assessed
    }
    
    // Category importance (technical skills get slight boost)
    const competency = this.framework.competencies[competencyId];
    if (competency.category.includes('technical')) {
      priority += 0.1;
    }

    return Math.min(priority, 1.0);
  }

  _getPrerequisites(competencyId, currentLevel) {
    // Define basic prerequisite logic
    const prerequisites = [];
    
    if (competencyId === 'deep-learning' && currentLevel < 2) {
      prerequisites.push('ml-fundamentals');
    }
    
    if (competencyId === 'production-systems' && currentLevel < 2) {
      prerequisites.push('ml-fundamentals');
    }
    
    if (competencyId === 'mlops-automation' && currentLevel < 3) {
      prerequisites.push('production-systems', 'cloud-platforms');
    }

    return prerequisites;
  }

  _getNextMilestone(competencyId, currentLevel) {
    const nextLevel = currentLevel + 1;
    const levelDetails = this._getLevelDetails(competencyId, nextLevel);
    
    if (!levelDetails) return null;
    
    return {
      level: nextLevel,
      name: levelDetails.name,
      description: levelDetails.description,
      keySkills: levelDetails.skills.slice(0, 2), // First 2 key skills
      timeEstimate: levelDetails.timeToAchieve
    };
  }

  _getImmediateActions(competencyId, currentLevel) {
    const nextLevel = this._getNextMilestone(competencyId, currentLevel);
    if (!nextLevel) return [];

    // Generate practical actions based on competency and level
    const actions = [];
    const competency = this.framework.competencies[competencyId];

    if (competencyId === 'ml-fundamentals' && currentLevel === 1) {
      actions.push(
        'Complete a supervised learning project with scikit-learn',
        'Learn basic statistics and probability concepts',
        'Implement linear regression from scratch'
      );
    } else if (competencyId === 'deep-learning' && currentLevel === 1) {
      actions.push(
        'Build a simple neural network with PyTorch or TensorFlow',
        'Complete a computer vision tutorial',
        'Study backpropagation algorithm'
      );
    } else if (competencyId === 'production-systems') {
      actions.push(
        'Deploy a model as REST API using FastAPI',
        'Set up basic monitoring and logging',
        'Learn Docker containerization'
      );
    } else {
      // Generic actions based on next level skills
      nextLevel.keySkills.forEach(skill => {
        actions.push(`Practice: ${skill}`);
      });
    }

    return actions.slice(0, 3); // Limit to 3 immediate actions
  }

  _getCompetencyKeywords(competencyId) {
    const keywordMap = {
      'ml-fundamentals': [
        { word: 'machine learning', weight: 3 },
        { word: 'regression', weight: 2 },
        { word: 'classification', weight: 2 },
        { word: 'scikit-learn', weight: 2 },
        { word: 'statistics', weight: 1 }
      ],
      'deep-learning': [
        { word: 'neural network', weight: 3 },
        { word: 'deep learning', weight: 3 },
        { word: 'pytorch', weight: 2 },
        { word: 'tensorflow', weight: 2 },
        { word: 'cnn', weight: 2 },
        { word: 'rnn', weight: 2 }
      ],
      'production-systems': [
        { word: 'api', weight: 2 },
        { word: 'deployment', weight: 3 },
        { word: 'production', weight: 3 },
        { word: 'fastapi', weight: 2 },
        { word: 'flask', weight: 2 }
      ]
    };

    return keywordMap[competencyId] || [];
  }

  _getCategoryKeywords(category) {
    const categoryMap = {
      'technical-foundation': ['algorithm', 'mathematics', 'programming'],
      'technical-advanced': ['research', 'cutting-edge', 'novel'],
      'engineering': ['system', 'architecture', 'scalable'],
      'infrastructure': ['cloud', 'devops', 'infrastructure'],
      'business': ['product', 'business', 'strategy'],
      'leadership': ['team', 'management', 'leadership']
    };

    return categoryMap[category] || [];
  }

  _calculateOverallTimeframe(recommendations) {
    const totalMonths = recommendations.reduce((sum, rec) => {
      return sum + rec.analysis.timeEstimate.totalMonths;
    }, 0);

    return this._formatTimeEstimate(totalMonths / recommendations.length);
  }
}

module.exports = CompetencyEngine;