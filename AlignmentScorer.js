// PURPOSE: Project alignment scoring algorithm for AI engineering mission framework
// Evaluates how well projects contribute to competency development and mission goals
// Provides 0-100 scores with detailed breakdown and learning value analysis

const fs = require('fs');
const path = require('path');

class AlignmentScorer {
  constructor(portfolioRoot = __dirname) {
    this.root = portfolioRoot;
    this.systemDir = path.join(this.root, '.system');
    this.scoresFile = path.join(this.systemDir, 'alignment-scores.json');
    this.missionFile = path.join(this.systemDir, 'mission-data.json');
    this.competencyFile = path.join(this.systemDir, 'competency-framework.json');
    
    this._loadData();
  }

  // === DATA LOADING ===

  _loadData() {
    try {
      this.scoresData = JSON.parse(fs.readFileSync(this.scoresFile, 'utf8'));
      this.missionData = JSON.parse(fs.readFileSync(this.missionFile, 'utf8'));
      this.competencyFramework = JSON.parse(fs.readFileSync(this.competencyFile, 'utf8'));
    } catch (error) {
      console.error('Failed to load alignment data:', error.message);
      throw error;
    }
  }

  _saveScoresData() {
    this.scoresData.lastUpdated = new Date().toISOString();
    fs.writeFileSync(this.scoresFile, JSON.stringify(this.scoresData, null, 2));
  }

  // === SCORING INTERFACE ===

  scoreProject(projectName, projectData = {}) {
    const {
      description = '',
      tags = [],
      projectType = 'learning',
      estimatedHours = 0,
      technologies = [],
      learningGoals = []
    } = projectData;

    const score = this._calculateAlignmentScore({
      projectName,
      description,
      tags,
      projectType,
      estimatedHours,
      technologies,
      learningGoals
    });

    // Store the score
    this.scoresData.projectScores[projectName] = {
      ...score,
      scoredAt: new Date().toISOString(),
      projectData: {
        description,
        tags,
        projectType,
        technologies
      }
    };

    // Add to scoring history
    if (!this.scoresData.scoringHistory) {
      this.scoresData.scoringHistory = [];
    }
    
    this.scoresData.scoringHistory.unshift({
      projectName,
      totalScore: score.totalScore,
      timestamp: new Date().toISOString(),
      missionId: this.missionData.activeMission
    });

    // Keep only last 50 entries in history
    this.scoresData.scoringHistory = this.scoresData.scoringHistory.slice(0, 50);

    this._saveScoresData();
    return score;
  }

  getProjectScore(projectName) {
    return this.scoresData.projectScores[projectName] || null;
  }

  getAllProjectScores() {
    return this.scoresData.projectScores;
  }

  getScoringHistory(limit = 10) {
    return (this.scoresData.scoringHistory || []).slice(0, limit);
  }

  getHighestScoringProjects(limit = 5) {
    const scores = Object.entries(this.scoresData.projectScores)
      .map(([name, score]) => ({ name, ...score }))
      .sort((a, b) => b.totalScore - a.totalScore);
    
    return scores.slice(0, limit);
  }

  // === CORE SCORING ALGORITHM ===

  _calculateAlignmentScore(projectInfo) {
    const activeMission = this._getActiveMission();
    const userAssessments = this.missionData.userAssessments || {};
    const weights = this.scoresData.settings.weightings || this._getDefaultWeightings();

    // Component scores
    const competencyGapScore = this._calculateCompetencyGapScore(projectInfo, userAssessments);
    const learningPotentialScore = this._calculateLearningPotentialScore(projectInfo);
    const missionAlignmentScore = this._calculateMissionAlignmentScore(projectInfo, activeMission);
    const timeInvestmentScore = this._calculateTimeInvestmentScore(projectInfo);

    // Calculate weighted total
    const totalScore = Math.round(
      (competencyGapScore.score * weights.competencyGap) +
      (learningPotentialScore.score * weights.learningPotential) +
      (missionAlignmentScore.score * weights.missionAlignment) +
      (timeInvestmentScore.score * weights.timeInvestment)
    );

    return {
      totalScore,
      components: {
        competencyGap: competencyGapScore,
        learningPotential: learningPotentialScore,
        missionAlignment: missionAlignmentScore,
        timeInvestment: timeInvestmentScore
      },
      breakdown: this._generateScoreBreakdown(totalScore),
      recommendations: this._generateRecommendations(totalScore, projectInfo),
      metadata: {
        activeMission: activeMission?.title || 'No active mission',
        scoringWeights: weights,
        projectType: projectInfo.projectType
      }
    };
  }

  // === COMPONENT SCORING FUNCTIONS ===

  _calculateCompetencyGapScore(projectInfo, assessments) {
    const competencies = Object.keys(this.competencyFramework.competencies);
    let totalGapValue = 0;
    let maxPossibleValue = 0;
    const competencyMatches = {};

    competencies.forEach(competencyId => {
      const assessment = assessments[competencyId] || { currentLevel: 1, targetLevel: 2 };
      const gap = assessment.targetLevel - assessment.currentLevel;
      const relevanceScore = this._calculateCompetencyRelevance(competencyId, projectInfo);
      
      const gapValue = gap * relevanceScore;
      totalGapValue += gapValue;
      maxPossibleValue += 3 * relevanceScore; // Max gap of 3 levels
      
      if (relevanceScore > 0.3) {
        competencyMatches[competencyId] = {
          gap,
          relevance: relevanceScore,
          contribution: gapValue
        };
      }
    });

    const score = maxPossibleValue > 0 ? (totalGapValue / maxPossibleValue) * 100 : 0;

    return {
      score: Math.min(Math.round(score), 100),
      details: {
        matchedCompetencies: Object.keys(competencyMatches).length,
        topMatches: this._getTopCompetencyMatches(competencyMatches, 3),
        totalGapValue,
        explanation: `Addresses ${Object.keys(competencyMatches).length} competency areas with development gaps`
      }
    };
  }

  _calculateLearningPotentialScore(projectInfo) {
    let score = 0;
    const factors = [];

    // Technology diversity bonus
    const techCount = (projectInfo.technologies || []).length;
    if (techCount > 0) {
      const techScore = Math.min(techCount * 15, 30);
      score += techScore;
      factors.push(`Technology diversity: ${techCount} technologies (+${techScore})`);
    }

    // Project complexity bonus based on type
    const complexityBonus = this._getComplexityBonus(projectInfo.projectType);
    score += complexityBonus;
    factors.push(`Project complexity: ${projectInfo.projectType} (+${complexityBonus})`);

    // Learning goals alignment
    const learningGoalsCount = (projectInfo.learningGoals || []).length;
    if (learningGoalsCount > 0) {
      const goalsScore = Math.min(learningGoalsCount * 10, 25);
      score += goalsScore;
      factors.push(`Explicit learning goals: ${learningGoalsCount} (+${goalsScore})`);
    }

    // Description quality bonus
    const descriptionScore = this._assessDescriptionQuality(projectInfo.description);
    score += descriptionScore;
    if (descriptionScore > 0) {
      factors.push(`Clear project description (+${descriptionScore})`);
    }

    return {
      score: Math.min(Math.round(score), 100),
      details: {
        factors,
        explanation: 'Learning potential based on project complexity, technologies, and goals'
      }
    };
  }

  _calculateMissionAlignmentScore(projectInfo, mission) {
    if (!mission) {
      return {
        score: 50, // Neutral score when no mission
        details: {
          explanation: 'No active mission - neutral alignment score',
          missionStatus: 'No active mission'
        }
      };
    }

    let score = 0;
    const factors = [];

    // Competency focus alignment
    const focusAlignment = this._calculateFocusAlignment(projectInfo, mission);
    score += focusAlignment.score;
    factors.push(`Competency focus alignment (+${focusAlignment.score})`);

    // Timeline alignment
    const timelineAlignment = this._calculateTimelineAlignment(projectInfo, mission);
    score += timelineAlignment;
    if (timelineAlignment > 0) {
      factors.push(`Timeline alignment (+${timelineAlignment})`);
    }

    // Mission keywords alignment
    const keywordAlignment = this._calculateKeywordAlignment(projectInfo, mission);
    score += keywordAlignment;
    if (keywordAlignment > 0) {
      factors.push(`Keyword alignment (+${keywordAlignment})`);
    }

    return {
      score: Math.min(Math.round(score), 100),
      details: {
        mission: mission.title,
        factors,
        explanation: `Alignment with active mission: ${mission.title}`
      }
    };
  }

  _calculateTimeInvestmentScore(projectInfo) {
    const estimatedHours = projectInfo.estimatedHours || 0;
    let score = 50; // Base score
    
    // Optimal range is 8-40 hours for learning projects
    if (estimatedHours >= 8 && estimatedHours <= 40) {
      score = 85; // High score for optimal range
    } else if (estimatedHours > 40 && estimatedHours <= 80) {
      score = 70; // Good for larger projects
    } else if (estimatedHours > 80) {
      score = 40; // Lower score for very large projects
    } else if (estimatedHours > 0) {
      score = 60; // Some time estimate provided
    }

    // Project type adjustment
    const typeAdjustment = this._getTimeInvestmentTypeAdjustment(projectInfo.projectType);
    score += typeAdjustment;

    return {
      score: Math.min(Math.max(Math.round(score), 0), 100),
      details: {
        estimatedHours,
        optimalRange: '8-40 hours for learning projects',
        typeAdjustment,
        explanation: 'Time investment appropriateness for learning value'
      }
    };
  }

  // === HELPER FUNCTIONS ===

  _getActiveMission() {
    const activeMissionId = this.missionData.activeMission;
    return activeMissionId ? this.missionData.missions[activeMissionId] : null;
  }

  _calculateCompetencyRelevance(competencyId, projectInfo) {
    const text = `${projectInfo.description} ${projectInfo.tags.join(' ')} ${projectInfo.technologies.join(' ')}`.toLowerCase();
    const keywords = this._getCompetencyKeywords(competencyId);
    
    let relevance = 0;
    keywords.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        relevance += 0.3;
      }
    });

    // Technology-specific bonuses
    const techRelevance = this._calculateTechnologyRelevance(competencyId, projectInfo.technologies);
    relevance += techRelevance;

    return Math.min(relevance, 1.0);
  }

  _calculateTechnologyRelevance(competencyId, technologies) {
    const techMap = {
      'ml-fundamentals': ['python', 'scikit-learn', 'pandas', 'numpy'],
      'deep-learning': ['pytorch', 'tensorflow', 'keras', 'cuda'],
      'production-systems': ['docker', 'kubernetes', 'fastapi', 'flask'],
      'cloud-platforms': ['aws', 'azure', 'gcp', 'terraform'],
      'mlops-automation': ['mlflow', 'airflow', 'kubeflow', 'dvc']
    };

    const relevantTech = techMap[competencyId] || [];
    const matches = technologies.filter(tech => 
      relevantTech.some(rt => tech.toLowerCase().includes(rt))
    );

    return matches.length * 0.2;
  }

  _getCompetencyKeywords(competencyId) {
    const keywordMap = {
      'ml-fundamentals': ['machine learning', 'regression', 'classification', 'model'],
      'deep-learning': ['neural network', 'deep learning', 'cnn', 'rnn', 'transformer'],
      'production-systems': ['api', 'deployment', 'production', 'system'],
      'cloud-platforms': ['cloud', 'aws', 'azure', 'gcp'],
      'mlops-automation': ['mlops', 'pipeline', 'automation', 'ci/cd']
    };

    return keywordMap[competencyId] || [];
  }

  _getComplexityBonus(projectType) {
    const bonusMap = {
      'learning': 15,
      'usecase': 25,
      'trial': 20,
      'production': 35,
      'research': 30,
      'template': 10
    };

    return bonusMap[projectType] || 15;
  }

  _assessDescriptionQuality(description) {
    if (!description || description.length < 20) return 0;
    if (description.length < 50) return 5;
    if (description.length < 100) return 10;
    return 15;
  }

  _calculateFocusAlignment(projectInfo, mission) {
    if (!mission.competencyFocus || mission.competencyFocus.length === 0) {
      return { score: 30 }; // Base score if no specific focus
    }

    let alignmentScore = 0;
    const alignedCompetencies = [];

    mission.competencyFocus.forEach(competencyId => {
      const relevance = this._calculateCompetencyRelevance(competencyId, projectInfo);
      if (relevance > 0.3) {
        alignmentScore += relevance * 20; // Up to 20 points per competency
        alignedCompetencies.push(competencyId);
      }
    });

    return {
      score: Math.min(alignmentScore, 40),
      alignedCompetencies
    };
  }

  _calculateTimelineAlignment(projectInfo, mission) {
    // Simple timeline bonus - projects closer to mission target get higher scores
    const daysUntilTarget = Math.ceil((new Date(mission.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilTarget < 30) return 20;
    if (daysUntilTarget < 90) return 15;
    if (daysUntilTarget < 180) return 10;
    return 5;
  }

  _calculateKeywordAlignment(projectInfo, mission) {
    const missionText = `${mission.title} ${mission.description}`.toLowerCase();
    const projectText = `${projectInfo.description} ${projectInfo.tags.join(' ')}`.toLowerCase();
    
    const missionWords = missionText.split(/\s+/).filter(word => word.length > 3);
    const matches = missionWords.filter(word => projectText.includes(word));
    
    return Math.min(matches.length * 3, 15);
  }

  _getTimeInvestmentTypeAdjustment(projectType) {
    const adjustmentMap = {
      'learning': 5,
      'usecase': 0,
      'trial': 10,
      'production': -10, // Production projects may require more time
      'research': 5,
      'template': -5
    };

    return adjustmentMap[projectType] || 0;
  }

  _getTopCompetencyMatches(matches, limit) {
    return Object.entries(matches)
      .sort(([,a], [,b]) => b.contribution - a.contribution)
      .slice(0, limit)
      .map(([competencyId, data]) => ({
        competencyId,
        name: this.competencyFramework.competencies[competencyId]?.name || competencyId,
        ...data
      }));
  }

  _generateScoreBreakdown(totalScore) {
    if (totalScore >= 80) return { level: 'High', color: 'green', message: 'Excellent alignment with learning goals' };
    if (totalScore >= 60) return { level: 'Medium', color: 'yellow', message: 'Good learning value and alignment' };
    if (totalScore >= 40) return { level: 'Low', color: 'orange', message: 'Some learning value, could be improved' };
    return { level: 'Very Low', color: 'red', message: 'Limited learning value or alignment' };
  }

  _generateRecommendations(totalScore, projectInfo) {
    const recommendations = [];

    if (totalScore < 60) {
      recommendations.push('Consider adding specific learning goals to increase project value');
    }
    
    if ((projectInfo.technologies || []).length < 2) {
      recommendations.push('Incorporate additional technologies to maximize learning');
    }
    
    if (!projectInfo.estimatedHours) {
      recommendations.push('Add time estimation to better plan learning investment');
    }

    const activeMission = this._getActiveMission();
    if (activeMission && activeMission.competencyFocus.length > 0) {
      recommendations.push(`Align project with mission competencies: ${activeMission.competencyFocus.slice(0, 2).join(', ')}`);
    }

    return recommendations;
  }

  _getDefaultWeightings() {
    return {
      competencyGap: 0.4,
      learningPotential: 0.3,
      missionAlignment: 0.2,
      timeInvestment: 0.1
    };
  }
}

module.exports = AlignmentScorer;