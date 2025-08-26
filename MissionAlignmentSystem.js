// PURPOSE: Core integration system for AI Engineering Mission Alignment Framework
// Coordinates between competency assessment, mission management, and project alignment scoring
// Integrates with existing portfolio CLI system while maintaining file size and import limits

const fs = require('fs');
const path = require('path');

class MissionAlignmentSystem {
  constructor(portfolioRoot = __dirname) {
    this.root = portfolioRoot;
    this.systemDir = path.join(this.root, '.system');
    this.dataFiles = {
      missions: path.join(this.systemDir, 'mission-data.json'),
      competencies: path.join(this.systemDir, 'competency-framework.json'),
      scores: path.join(this.systemDir, 'alignment-scores.json')
    };
    
    this._ensureDataFiles();
    this._loadData();
  }

  // === DATA MANAGEMENT ===
  
  _ensureDataFiles() {
    if (!fs.existsSync(this.systemDir)) {
      fs.mkdirSync(this.systemDir, { recursive: true });
    }
    
    // Initialize files if they don't exist
    Object.values(this.dataFiles).forEach(filePath => {
      if (!fs.existsSync(filePath)) {
        const filename = path.basename(filePath);
        const defaultData = this._getDefaultData(filename);
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      }
    });
  }

  _getDefaultData(filename) {
    const defaults = {
      'mission-data.json': {
        version: "1.0",
        lastUpdated: new Date().toISOString(),
        activeMission: null,
        missions: {},
        userAssessments: {},
        progressHistory: [],
        settings: {
          assessmentReminders: true,
          alignmentThreshold: 70,
          progressTrackingEnabled: true
        }
      },
      'competency-framework.json': {
        version: "1.0",
        lastUpdated: new Date().toISOString(),
        competencies: {},
        categories: {}
      },
      'alignment-scores.json': {
        version: "1.0",
        lastUpdated: new Date().toISOString(),
        projectScores: {},
        scoringHistory: [],
        settings: {
          scoringEnabled: true,
          autoScoreOnCreate: true
        }
      }
    };
    
    return defaults[filename] || {};
  }

  _loadData() {
    try {
      this.missionData = JSON.parse(fs.readFileSync(this.dataFiles.missions, 'utf8'));
      this.competencyFramework = JSON.parse(fs.readFileSync(this.dataFiles.competencies, 'utf8'));
      this.alignmentScores = JSON.parse(fs.readFileSync(this.dataFiles.scores, 'utf8'));
    } catch (error) {
      console.error('Failed to load mission alignment data:', error.message);
      throw error;
    }
  }

  _saveMissionData() {
    this.missionData.lastUpdated = new Date().toISOString();
    fs.writeFileSync(this.dataFiles.missions, JSON.stringify(this.missionData, null, 2));
  }

  _saveAlignmentScores() {
    this.alignmentScores.lastUpdated = new Date().toISOString();
    fs.writeFileSync(this.dataFiles.scores, JSON.stringify(this.alignmentScores, null, 2));
  }

  // === MISSION MANAGEMENT ===

  createMission(title, description, targetDate, competencyFocus = []) {
    const missionId = this._generateMissionId(title);
    
    const mission = {
      id: missionId,
      title,
      description,
      targetDate: new Date(targetDate).toISOString(),
      createdAt: new Date().toISOString(),
      status: 'active',
      competencyFocus,
      progress: {
        projectsCompleted: 0,
        totalLearningHours: 0,
        competencyGains: {}
      },
      metadata: {
        createdBy: 'user',
        lastModified: new Date().toISOString()
      }
    };

    this.missionData.missions[missionId] = mission;
    
    // Set as active mission if no other active mission exists
    if (!this.missionData.activeMission) {
      this.missionData.activeMission = missionId;
    }
    
    this._saveMissionData();
    return mission;
  }

  setActiveMission(missionId) {
    if (!this.missionData.missions[missionId]) {
      throw new Error(`Mission ${missionId} not found`);
    }
    
    this.missionData.activeMission = missionId;
    this._saveMissionData();
    return this.missionData.missions[missionId];
  }

  getActiveMission() {
    if (!this.missionData.activeMission) {
      return null;
    }
    
    const missionId = this.missionData.activeMission;
    return this.missionData.missions[missionId] || null;
  }

  getAllMissions() {
    return Object.values(this.missionData.missions);
  }

  getMissionStatus() {
    const activeMission = this.getActiveMission();
    if (!activeMission) {
      return {
        hasActiveMission: false,
        totalMissions: Object.keys(this.missionData.missions).length,
        message: 'No active mission set'
      };
    }

    const daysUntilTarget = this._calculateDaysUntil(activeMission.targetDate);
    const competencyProgress = this._calculateCompetencyProgress(activeMission);
    
    return {
      hasActiveMission: true,
      mission: activeMission,
      daysUntilTarget,
      competencyProgress,
      overallProgress: this._calculateOverallProgress(activeMission)
    };
  }

  // === COMPETENCY MANAGEMENT ===

  getCompetencyFramework() {
    return this.competencyFramework;
  }

  getUserAssessments() {
    return this.missionData.userAssessments || {};
  }

  updateCompetencyAssessment(competencyId, currentLevel, targetLevel = null, notes = '') {
    if (!this.competencyFramework.competencies[competencyId]) {
      throw new Error(`Competency ${competencyId} not found in framework`);
    }

    if (!this.missionData.userAssessments) {
      this.missionData.userAssessments = {};
    }

    const assessment = this.missionData.userAssessments[competencyId] || {};
    
    assessment.currentLevel = currentLevel;
    if (targetLevel !== null) {
      assessment.targetLevel = targetLevel;
    }
    assessment.lastAssessed = new Date().toISOString();
    assessment.selfAssessment = {
      confidence: assessment.selfAssessment?.confidence || 0,
      notes: notes
    };

    this.missionData.userAssessments[competencyId] = assessment;
    
    // Record progress history
    this._recordProgressHistory(competencyId, currentLevel, notes);
    
    this._saveMissionData();
    return assessment;
  }

  getCompetencyGaps() {
    const assessments = this.getUserAssessments();
    const gaps = [];

    Object.entries(assessments).forEach(([competencyId, assessment]) => {
      const gap = assessment.targetLevel - assessment.currentLevel;
      if (gap > 0) {
        gaps.push({
          competencyId,
          competency: this.competencyFramework.competencies[competencyId],
          currentLevel: assessment.currentLevel,
          targetLevel: assessment.targetLevel,
          gap,
          priority: this._calculateCompetencyPriority(competencyId, gap)
        });
      }
    });

    return gaps.sort((a, b) => b.priority - a.priority);
  }

  // === DASHBOARD AND REPORTING ===

  generateDashboard() {
    const activeMission = this.getActiveMission();
    const competencyGaps = this.getCompetencyGaps();
    const recentScores = this._getRecentAlignmentScores(5);
    
    return {
      mission: activeMission ? {
        title: activeMission.title,
        daysRemaining: this._calculateDaysUntil(activeMission.targetDate),
        progress: this._calculateOverallProgress(activeMission)
      } : null,
      competencies: {
        totalGaps: competencyGaps.length,
        highPriorityGaps: competencyGaps.filter(gap => gap.priority > 0.7).length,
        topGaps: competencyGaps.slice(0, 3)
      },
      recentActivity: {
        alignmentScores: recentScores,
        lastAssessment: this._getLastAssessmentDate()
      },
      recommendations: this._generateRecommendations()
    };
  }

  // === PRIVATE HELPERS ===

  _generateMissionId(title) {
    const base = title.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    let counter = 1;
    let id = base;
    
    while (this.missionData.missions[id]) {
      id = `${base}-${counter}`;
      counter++;
    }
    
    return id;
  }

  _calculateDaysUntil(targetDate) {
    const target = new Date(targetDate);
    const now = new Date();
    const diffTime = target - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  _calculateCompetencyProgress(mission) {
    if (!mission.competencyFocus || mission.competencyFocus.length === 0) {
      return {};
    }

    const progress = {};
    const assessments = this.getUserAssessments();

    mission.competencyFocus.forEach(competencyId => {
      const assessment = assessments[competencyId];
      if (assessment) {
        const totalLevels = assessment.targetLevel - 1; // Levels start from 1
        const currentProgress = assessment.currentLevel - 1;
        progress[competencyId] = totalLevels > 0 ? currentProgress / totalLevels : 0;
      }
    });

    return progress;
  }

  _calculateOverallProgress(mission) {
    const competencyProgress = this._calculateCompetencyProgress(mission);
    const progressValues = Object.values(competencyProgress);
    
    if (progressValues.length === 0) return 0;
    
    return progressValues.reduce((sum, progress) => sum + progress, 0) / progressValues.length;
  }

  _calculateCompetencyPriority(competencyId, gap) {
    const activeMission = this.getActiveMission();
    let priority = gap * 0.5; // Base priority on gap size
    
    // Boost priority if competency is in active mission focus
    if (activeMission && activeMission.competencyFocus.includes(competencyId)) {
      priority += 0.3;
    }
    
    // Consider time since last assessment
    const assessment = this.missionData.userAssessments[competencyId];
    if (assessment && assessment.lastAssessed) {
      const daysSinceAssessment = this._calculateDaysUntil(assessment.lastAssessed) * -1;
      if (daysSinceAssessment > 30) {
        priority += 0.2; // Boost priority for stale assessments
      }
    }
    
    return Math.min(priority, 1.0); // Cap at 1.0
  }

  _recordProgressHistory(competencyId, level, notes) {
    if (!this.missionData.progressHistory) {
      this.missionData.progressHistory = [];
    }

    this.missionData.progressHistory.push({
      competencyId,
      level,
      notes,
      timestamp: new Date().toISOString(),
      missionId: this.missionData.activeMission
    });

    // Keep only last 100 entries
    if (this.missionData.progressHistory.length > 100) {
      this.missionData.progressHistory = this.missionData.progressHistory.slice(-100);
    }
  }

  _getRecentAlignmentScores(limit = 5) {
    const scores = this.alignmentScores.scoringHistory || [];
    return scores
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  _getLastAssessmentDate() {
    const assessments = this.getUserAssessments();
    let lastDate = null;

    Object.values(assessments).forEach(assessment => {
      if (assessment.lastAssessed) {
        const assessmentDate = new Date(assessment.lastAssessed);
        if (!lastDate || assessmentDate > lastDate) {
          lastDate = assessmentDate;
        }
      }
    });

    return lastDate;
  }

  _generateRecommendations() {
    const recommendations = [];
    const activeMission = this.getActiveMission();
    const gaps = this.getCompetencyGaps();
    
    // Mission recommendations
    if (!activeMission) {
      recommendations.push({
        type: 'mission',
        priority: 'high',
        message: 'Create your first AI engineering mission to get started',
        action: 'mission-create'
      });
    } else {
      const daysRemaining = this._calculateDaysUntil(activeMission.targetDate);
      if (daysRemaining < 30) {
        recommendations.push({
          type: 'mission',
          priority: 'medium',
          message: `Mission "${activeMission.title}" target date approaching in ${daysRemaining} days`,
          action: 'mission-review'
        });
      }
    }
    
    // Competency recommendations
    if (gaps.length === 0) {
      recommendations.push({
        type: 'competency',
        priority: 'low',
        message: 'All competencies are at target levels - consider setting higher goals',
        action: 'competency-assess'
      });
    } else {
      const topGap = gaps[0];
      recommendations.push({
        type: 'competency',
        priority: 'medium',
        message: `Focus on "${topGap.competency.name}" - ${topGap.gap} level gap`,
        action: 'competency-focus'
      });
    }
    
    return recommendations.slice(0, 3); // Limit to top 3 recommendations
  }
}

module.exports = MissionAlignmentSystem;