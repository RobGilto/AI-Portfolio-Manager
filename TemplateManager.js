// PURPOSE: Template JSON Architecture - Core CRUD operations for templates
const fs = require('fs');
const path = require('path');

class TemplateManager {
  constructor() {
    this.root = process.cwd();
    this.templatesDir = path.join(this.root, 'docs', 'templates');
    this.indexPath = path.join(this.templatesDir, 'template-index.json');
    this.ensureDirectories();
    this.index = this.loadIndex();
  }

  ensureDirectories() {
    const dirs = [
      this.templatesDir,
      path.join(this.templatesDir, 'schemas'),
      path.join(this.templatesDir, 'project'),
      path.join(this.templatesDir, 'workflow'), 
      path.join(this.templatesDir, 'component')
    ];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  loadIndex() {
    if (fs.existsSync(this.indexPath)) {
      try {
        return JSON.parse(fs.readFileSync(this.indexPath, 'utf8'));
      } catch (error) {
        console.warn(`Failed to load template index: ${error.message}`);
      }
    }
    
    return {
      templates: {},
      lastUpdated: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  saveIndex() {
    try {
      this.index.lastUpdated = new Date().toISOString();
      fs.writeFileSync(this.indexPath, JSON.stringify(this.index, null, 2));
      return true;
    } catch (error) {
      console.error(`Failed to save template index: ${error.message}`);
      return false;
    }
  }

  getTemplatePath(id, category = null) {
    if (category) {
      return path.join(this.templatesDir, category, `${id}.json`);
    }
    
    // Try to find in existing index
    const templateData = this.index.templates[id];
    if (templateData && templateData.category) {
      return path.join(this.templatesDir, templateData.category, `${id}.json`);
    }
    
    // Default to project category
    return path.join(this.templatesDir, 'project', `${id}.json`);
  }

  templateExists(id) {
    return this.index.templates.hasOwnProperty(id);
  }

  createTemplate(id, category, templateData) {
    if (this.templateExists(id)) {
      throw new Error(`Template "${id}" already exists`);
    }

    const validCategories = ['project', 'workflow', 'component'];
    if (!validCategories.includes(category)) {
      throw new Error(`Invalid category "${category}". Must be one of: ${validCategories.join(', ')}`);
    }

    // Validate template structure
    if (!templateData.meta || !templateData.meta.name) {
      throw new Error('Template must have meta.name field');
    }

    const template = {
      id: id,
      meta: {
        name: templateData.meta.name,
        category: category,
        version: templateData.meta.version || '1.0.0',
        description: templateData.meta.description || '',
        tags: templateData.meta.tags || [],
        author: templateData.meta.author || '',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      },
      files: templateData.files || [],
      claudeMd: templateData.claudeMd || {
        sections: [],
        variables: {},
        instructions: []
      },
      variables: templateData.variables || {},
      dependencies: templateData.dependencies || [],
      postCreate: templateData.postCreate || []
    };

    const templatePath = this.getTemplatePath(id, category);
    
    try {
      fs.writeFileSync(templatePath, JSON.stringify(template, null, 2));
      
      // Update index
      this.index.templates[id] = {
        category: category,
        name: template.meta.name,
        description: template.meta.description,
        version: template.meta.version,
        path: templatePath,
        createdAt: template.meta.createdAt,
        lastModified: template.meta.lastModified,
        tags: template.meta.tags
      };
      
      this.saveIndex();
      return template;
    } catch (error) {
      throw new Error(`Failed to create template: ${error.message}`);
    }
  }

  readTemplate(id) {
    if (!this.templateExists(id)) {
      throw new Error(`Template "${id}" not found`);
    }

    const templatePath = this.getTemplatePath(id);
    
    try {
      const templateData = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
      return templateData;
    } catch (error) {
      throw new Error(`Failed to read template: ${error.message}`);
    }
  }

  updateTemplate(id, updates) {
    if (!this.templateExists(id)) {
      throw new Error(`Template "${id}" not found`);
    }

    try {
      const existing = this.readTemplate(id);
      
      // Merge updates with existing template
      const updated = {
        ...existing,
        ...updates,
        meta: {
          ...existing.meta,
          ...updates.meta,
          lastModified: new Date().toISOString()
        }
      };

      const templatePath = this.getTemplatePath(id);
      fs.writeFileSync(templatePath, JSON.stringify(updated, null, 2));
      
      // Update index
      this.index.templates[id] = {
        ...this.index.templates[id],
        name: updated.meta.name,
        description: updated.meta.description,
        version: updated.meta.version,
        lastModified: updated.meta.lastModified,
        tags: updated.meta.tags || []
      };
      
      this.saveIndex();
      return updated;
    } catch (error) {
      throw new Error(`Failed to update template: ${error.message}`);
    }
  }

  deleteTemplate(id) {
    if (!this.templateExists(id)) {
      throw new Error(`Template "${id}" not found`);
    }

    try {
      const templatePath = this.getTemplatePath(id);
      fs.unlinkSync(templatePath);
      
      delete this.index.templates[id];
      this.saveIndex();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete template: ${error.message}`);
    }
  }

  listTemplates(category = null) {
    const templates = Object.entries(this.index.templates)
      .filter(([id, data]) => !category || data.category === category)
      .map(([id, data]) => ({
        id,
        ...data
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    
    return templates;
  }

  searchTemplates(query) {
    const searchTerm = query.toLowerCase();
    
    return this.listTemplates().filter(template => {
      return template.name.toLowerCase().includes(searchTerm) ||
             template.description.toLowerCase().includes(searchTerm) ||
             template.tags.some(tag => tag.toLowerCase().includes(searchTerm));
    });
  }

  validateTemplate(id) {
    try {
      const template = this.readTemplate(id);
      const errors = [];
      
      // Basic structure validation
      if (!template.meta || !template.meta.name) {
        errors.push('Missing meta.name field');
      }
      
      if (!template.files || !Array.isArray(template.files)) {
        errors.push('Missing or invalid files array');
      }
      
      // Validate file entries
      if (template.files) {
        template.files.forEach((file, index) => {
          if (!file.path) {
            errors.push(`File ${index}: Missing path field`);
          }
          if (!file.content && file.content !== '') {
            errors.push(`File ${index}: Missing content field`);
          }
        });
      }
      
      return {
        valid: errors.length === 0,
        errors: errors,
        template: template
      };
    } catch (error) {
      return {
        valid: false,
        errors: [`Failed to load template: ${error.message}`],
        template: null
      };
    }
  }

  syncTemplateIndex() {
    console.log('Syncing template index with filesystem...');
    const categories = ['project', 'workflow', 'component'];
    let syncedCount = 0;
    let addedCount = 0;
    let removedCount = 0;
    
    // Discover templates on filesystem
    const filesystemTemplates = {};
    
    categories.forEach(category => {
      const categoryPath = path.join(this.templatesDir, category);
      if (fs.existsSync(categoryPath)) {
        const files = fs.readdirSync(categoryPath)
          .filter(file => file.endsWith('.json'))
          .map(file => file.replace('.json', ''));
        
        files.forEach(id => {
          filesystemTemplates[id] = category;
        });
      }
    });
    
    // Check for templates in index that don't exist on filesystem
    for (const [templateId, templateData] of Object.entries(this.index.templates)) {
      if (!filesystemTemplates[templateId]) {
        console.log(`Removing from index: ${templateId} (file not found)`);
        delete this.index.templates[templateId];
        removedCount++;
      }
    }
    
    // Check for templates on filesystem not in index
    for (const [templateId, category] of Object.entries(filesystemTemplates)) {
      if (!this.index.templates[templateId]) {
        try {
          // Read template directly from filesystem
          const templatePath = this.getTemplatePath(templateId, category);
          const templateData = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
          console.log(`Adding to index: ${templateId} (found in ${category})`);
          
          this.index.templates[templateId] = {
            category: category,
            name: templateData.meta?.name || templateId,
            description: templateData.meta?.description || '',
            version: templateData.meta?.version || '1.0.0',
            path: templatePath,
            createdAt: templateData.meta?.createdAt || new Date().toISOString(),
            lastModified: templateData.meta?.lastModified || new Date().toISOString(),
            tags: templateData.meta?.tags || []
          };
          
          addedCount++;
        } catch (error) {
          console.warn(`Failed to index ${templateId}: ${error.message}`);
        }
      }
    }
    
    this.saveIndex();
    
    console.log(`Template sync complete:`);
    console.log(`  • ${addedCount} templates added to index`);
    console.log(`  • ${syncedCount} templates updated in index`);
    console.log(`  • ${removedCount} templates removed from index`);
    console.log(`  • Total templates: ${Object.keys(this.index.templates).length}`);
    
    return { addedCount, syncedCount, removedCount };
  }

  getCategories() {
    return ['project', 'workflow', 'component'];
  }

  getTemplateStats() {
    const templates = this.listTemplates();
    const stats = {
      total: templates.length,
      byCategory: {}
    };
    
    this.getCategories().forEach(category => {
      stats.byCategory[category] = templates.filter(t => t.category === category).length;
    });
    
    return stats;
  }
}

module.exports = TemplateManager;