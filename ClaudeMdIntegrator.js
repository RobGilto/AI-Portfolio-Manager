// PURPOSE: CLAUDE.md integration for template system
const fs = require('fs');
const path = require('path');

class ClaudeMdIntegrator {
  constructor() {
    this.claudeMdPath = path.join(process.cwd(), 'CLAUDE.md');
    this.templateMarkerRegex = /<!-- TEMPLATE:([\w-]+) -->/g;
    this.sectionMarkerRegex = /<!-- TEMPLATE_SECTION:([\w-]+):([\w-]+) -->/g;
  }

  hasClaudeMd() {
    return fs.existsSync(this.claudeMdPath);
  }

  loadClaudeMd() {
    if (!this.hasClaudeMd()) {
      return null;
    }
    
    try {
      return fs.readFileSync(this.claudeMdPath, 'utf8');
    } catch (error) {
      console.warn(`Failed to load CLAUDE.md: ${error.message}`);
      return null;
    }
  }

  saveClaudeMd(content) {
    try {
      fs.writeFileSync(this.claudeMdPath, content);
      return true;
    } catch (error) {
      console.error(`Failed to save CLAUDE.md: ${error.message}`);
      return false;
    }
  }

  findTemplateReferences(content) {
    const references = [];
    let match;

    // Find template markers
    while ((match = this.templateMarkerRegex.exec(content)) !== null) {
      references.push({
        type: 'template',
        templateId: match[1],
        marker: match[0],
        index: match.index
      });
    }

    // Reset regex for section markers
    this.sectionMarkerRegex.lastIndex = 0;
    
    // Find section markers
    while ((match = this.sectionMarkerRegex.exec(content)) !== null) {
      references.push({
        type: 'section',
        templateId: match[1],
        sectionId: match[2],
        marker: match[0],
        index: match.index
      });
    }

    return references.sort((a, b) => a.index - b.index);
  }

  insertTemplateContent(templateId, templateData) {
    const content = this.loadClaudeMd();
    if (!content) {
      console.warn('No CLAUDE.md file found');
      return false;
    }

    if (!templateData.claudeMd || !templateData.claudeMd.sections) {
      console.warn('Template has no CLAUDE.md content');
      return false;
    }

    const marker = `<!-- TEMPLATE:${templateId} -->`;
    const templateContent = templateData.claudeMd.sections.join('\n');
    
    let updatedContent;
    
    if (content.includes(marker)) {
      // Replace existing content
      const startMarker = marker;
      const endMarker = `<!-- /TEMPLATE:${templateId} -->`;
      const startIndex = content.indexOf(startMarker);
      
      if (startIndex === -1) {
        console.warn(`Template marker ${templateId} not found`);
        return false;
      }
      
      let endIndex = content.indexOf(endMarker, startIndex);
      if (endIndex === -1) {
        // Create end marker if it doesn't exist
        endIndex = content.indexOf('\n', startIndex + startMarker.length);
        if (endIndex === -1) endIndex = content.length;
      } else {
        endIndex += endMarker.length;
      }
      
      updatedContent = content.substring(0, startIndex) +
                      startMarker + '\n' +
                      templateContent + '\n' +
                      endMarker + '\n' +
                      content.substring(endIndex);
    } else {
      // Append new content
      const newSection = `\n${marker}\n${templateContent}\n<!-- /TEMPLATE:${templateId} -->\n`;
      updatedContent = content + newSection;
    }

    return this.saveClaudeMd(updatedContent);
  }

  removeTemplateContent(templateId) {
    const content = this.loadClaudeMd();
    if (!content) {
      return false;
    }

    const startMarker = `<!-- TEMPLATE:${templateId} -->`;
    const endMarker = `<!-- /TEMPLATE:${templateId} -->`;
    
    const startIndex = content.indexOf(startMarker);
    if (startIndex === -1) {
      return true; // Already removed
    }
    
    const endIndex = content.indexOf(endMarker, startIndex);
    if (endIndex === -1) {
      console.warn(`End marker for template ${templateId} not found`);
      return false;
    }
    
    const updatedContent = content.substring(0, startIndex) +
                          content.substring(endIndex + endMarker.length);
    
    return this.saveClaudeMd(updatedContent);
  }

  resolveVariables(content, variables) {
    if (!variables || typeof variables !== 'object') {
      return content;
    }

    let resolvedContent = content;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      const replacement = typeof value === 'string' ? value : 
                         (value.default || value.description || key);
      
      resolvedContent = resolvedContent.replace(
        new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), 
        replacement
      );
    });

    return resolvedContent;
  }

  addInstructions(instructions) {
    const content = this.loadClaudeMd();
    if (!content || !instructions || !Array.isArray(instructions)) {
      return false;
    }

    const instructionsMarker = '## Development Instructions';
    const instructionsContent = instructions.map(inst => `- ${inst}`).join('\n');
    
    let updatedContent;
    
    if (content.includes(instructionsMarker)) {
      // Find the instructions section and append
      const markerIndex = content.indexOf(instructionsMarker);
      const nextSectionIndex = content.indexOf('\n## ', markerIndex + instructionsMarker.length);
      const insertIndex = nextSectionIndex === -1 ? content.length : nextSectionIndex;
      
      updatedContent = content.substring(0, insertIndex) +
                      '\n' + instructionsContent + '\n' +
                      content.substring(insertIndex);
    } else {
      // Add new instructions section
      const newSection = `\n## Development Instructions\n\n${instructionsContent}\n`;
      updatedContent = content + newSection;
    }

    return this.saveClaudeMd(updatedContent);
  }

  validateTemplateIntegration(templateData) {
    const errors = [];
    const warnings = [];

    if (!templateData.claudeMd) {
      warnings.push('Template has no CLAUDE.md integration defined');
      return { valid: true, errors, warnings };
    }

    const { sections, variables, instructions } = templateData.claudeMd;

    // Validate sections
    if (sections && !Array.isArray(sections)) {
      errors.push('claudeMd.sections must be an array');
    }

    // Validate variables
    if (variables && typeof variables !== 'object') {
      errors.push('claudeMd.variables must be an object');
    }

    // Validate instructions
    if (instructions && !Array.isArray(instructions)) {
      errors.push('claudeMd.instructions must be an array');
    }

    // Check for variable references in sections
    if (sections && variables) {
      const sectionContent = sections.join('\n');
      const referencedVars = this.extractVariableReferences(sectionContent);
      
      referencedVars.forEach(varName => {
        if (!templateData.variables || !templateData.variables[varName]) {
          warnings.push(`CLAUDE.md sections reference undefined variable: ${varName}`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  extractVariableReferences(content) {
    const variableRegex = /\{\{([A-Z_][A-Z0-9_]*)\}\}/g;
    const variables = [];
    let match;

    while ((match = variableRegex.exec(content)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }

    return variables;
  }

  generateTemplateReport() {
    const content = this.loadClaudeMd();
    if (!content) {
      return {
        hasClaudeMd: false,
        templates: [],
        sections: []
      };
    }

    const references = this.findTemplateReferences(content);
    const templates = references.filter(ref => ref.type === 'template');
    const sections = references.filter(ref => ref.type === 'section');

    return {
      hasClaudeMd: true,
      fileSize: content.length,
      templates: templates.map(t => t.templateId),
      sections: sections.map(s => ({ template: s.templateId, section: s.sectionId })),
      totalReferences: references.length
    };
  }

  cleanupOrphanedReferences(activeTemplateIds) {
    const content = this.loadClaudeMd();
    if (!content) {
      return false;
    }

    const references = this.findTemplateReferences(content);
    const orphanedTemplates = references
      .filter(ref => ref.type === 'template')
      .filter(ref => !activeTemplateIds.includes(ref.templateId));

    if (orphanedTemplates.length === 0) {
      return true; // Nothing to clean
    }

    console.log(`Cleaning up ${orphanedTemplates.length} orphaned template references`);
    
    let updatedContent = content;
    
    orphanedTemplates.forEach(ref => {
      const startMarker = `<!-- TEMPLATE:${ref.templateId} -->`;
      const endMarker = `<!-- /TEMPLATE:${ref.templateId} -->`;
      
      const startIndex = updatedContent.indexOf(startMarker);
      const endIndex = updatedContent.indexOf(endMarker, startIndex);
      
      if (startIndex !== -1 && endIndex !== -1) {
        updatedContent = updatedContent.substring(0, startIndex) +
                        updatedContent.substring(endIndex + endMarker.length);
      }
    });

    return this.saveClaudeMd(updatedContent);
  }
}

module.exports = ClaudeMdIntegrator;