// PURPOSE: Template validation with security checks and JSON schema validation
const fs = require('fs');
const path = require('path');

class TemplateValidator {
  constructor() {
    this.schemaPath = path.join(process.cwd(), 'docs', 'templates', 'schemas');
    this.dangerousPatterns = [
      /\.\./,                    // Path traversal attempts
      /^\/|^\\/,                // Absolute paths  
      /\${.*exec.*}/i,          // Command execution patterns
      /eval\s*\(/i,             // JavaScript eval patterns
      /require\s*\(/i,          // Node.js require patterns
      /<script/i,               // Script tags
      /javascript:/i,           // JavaScript URLs
      /on\w+\s*=/i              // HTML event handlers
    ];
    
    this.allowedVariablePattern = /^[A-Z_][A-Z0-9_]*$/; // Only uppercase vars
    this.maxFileSize = 1024 * 1024; // 1MB per file
    this.maxTotalFiles = 100;
    this.maxTemplateSize = 10 * 1024 * 1024; // 10MB total
  }

  validateTemplate(template) {
    const errors = [];
    const warnings = [];

    try {
      // Basic structure validation
      this.validateBasicStructure(template, errors);
      
      // Security validation
      this.validateSecurity(template, errors, warnings);
      
      // Content validation
      this.validateContent(template, errors, warnings);
      
      // Dependencies validation
      this.validateDependencies(template, errors, warnings);
      
      // Size limits validation
      this.validateSizeLimits(template, errors);

      return {
        valid: errors.length === 0,
        errors: errors,
        warnings: warnings,
        severity: this.calculateSeverity(errors, warnings)
      };
    } catch (error) {
      return {
        valid: false,
        errors: [`Validation failed: ${error.message}`],
        warnings: [],
        severity: 'critical'
      };
    }
  }

  validateBasicStructure(template, errors) {
    // Required fields
    if (!template.id || typeof template.id !== 'string') {
      errors.push('Template must have a valid id string');
    }
    
    if (!template.meta || typeof template.meta !== 'object') {
      errors.push('Template must have a meta object');
    } else {
      if (!template.meta.name || typeof template.meta.name !== 'string') {
        errors.push('Template meta must have a name string');
      }
      
      if (!template.meta.category || typeof template.meta.category !== 'string') {
        errors.push('Template meta must have a category string');
      }
      
      const validCategories = ['project', 'workflow', 'component'];
      if (template.meta.category && !validCategories.includes(template.meta.category)) {
        errors.push(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
      }
    }

    if (!template.files || !Array.isArray(template.files)) {
      errors.push('Template must have a files array');
    }

    // Validate arrays
    const arrayFields = ['files', 'dependencies', 'postCreate'];
    arrayFields.forEach(field => {
      if (template[field] && !Array.isArray(template[field])) {
        errors.push(`${field} must be an array if present`);
      }
    });
  }

  validateSecurity(template, errors, warnings) {
    // Validate template ID against path traversal
    if (this.containsDangerousPattern(template.id)) {
      errors.push('Template ID contains potentially dangerous characters');
    }

    // Validate file paths
    if (template.files) {
      template.files.forEach((file, index) => {
        if (!file.path) {
          errors.push(`File ${index}: Missing path field`);
          return;
        }

        // Check for path traversal
        if (this.containsPathTraversal(file.path)) {
          errors.push(`File ${index}: Path contains directory traversal attempt`);
        }

        // Check for absolute paths
        if (path.isAbsolute(file.path)) {
          errors.push(`File ${index}: Absolute paths not allowed`);
        }

        // Check file content for dangerous patterns
        if (file.content && this.containsDangerousContent(file.content)) {
          warnings.push(`File ${index}: Content contains potentially unsafe patterns`);
        }
      });
    }

    // Validate variables
    if (template.variables) {
      Object.keys(template.variables).forEach(varName => {
        if (!this.isValidVariableName(varName)) {
          errors.push(`Invalid variable name: ${varName}. Use uppercase letters and underscores only`);
        }
      });
    }

    // Validate post-create scripts
    if (template.postCreate) {
      template.postCreate.forEach((script, index) => {
        if (typeof script === 'string' && this.containsDangerousCommand(script)) {
          errors.push(`PostCreate ${index}: Contains potentially dangerous command`);
        }
      });
    }
  }

  validateContent(template, errors, warnings) {
    if (!template.files || template.files.length === 0) {
      warnings.push('Template has no files defined');
      return;
    }

    template.files.forEach((file, index) => {
      if (!file.content && file.content !== '') {
        errors.push(`File ${index}: Missing content field`);
        return;
      }

      // Check for missing variable definitions
      const variables = this.extractVariables(file.content);
      variables.forEach(variable => {
        if (!template.variables || !template.variables.hasOwnProperty(variable)) {
          warnings.push(`File ${index}: Uses undefined variable {{${variable}}}`);
        }
      });

      // Validate file extensions match content
      const extension = path.extname(file.path).toLowerCase();
      if (extension && !this.validateContentForExtension(file.content, extension)) {
        warnings.push(`File ${index}: Content may not match file extension ${extension}`);
      }
    });
  }

  validateDependencies(template, errors, warnings) {
    if (!template.dependencies || template.dependencies.length === 0) {
      return;
    }

    template.dependencies.forEach((dep, index) => {
      if (typeof dep === 'string') {
        // Simple string dependency
        if (this.containsDangerousPattern(dep)) {
          errors.push(`Dependency ${index}: Contains potentially dangerous pattern`);
        }
      } else if (typeof dep === 'object') {
        // Object dependency
        if (!dep.name || typeof dep.name !== 'string') {
          errors.push(`Dependency ${index}: Must have a name string`);
        }
        
        if (dep.version && !this.isValidVersion(dep.version)) {
          warnings.push(`Dependency ${index}: Invalid version format`);
        }
      } else {
        errors.push(`Dependency ${index}: Must be string or object`);
      }
    });
  }

  validateSizeLimits(template, errors) {
    if (template.files && template.files.length > this.maxTotalFiles) {
      errors.push(`Too many files: ${template.files.length} (max: ${this.maxTotalFiles})`);
    }

    let totalSize = 0;
    if (template.files) {
      template.files.forEach((file, index) => {
        if (file.content) {
          const fileSize = Buffer.byteLength(file.content, 'utf8');
          
          if (fileSize > this.maxFileSize) {
            errors.push(`File ${index}: Size ${this.formatBytes(fileSize)} exceeds limit ${this.formatBytes(this.maxFileSize)}`);
          }
          
          totalSize += fileSize;
        }
      });
    }

    if (totalSize > this.maxTemplateSize) {
      errors.push(`Template size ${this.formatBytes(totalSize)} exceeds limit ${this.formatBytes(this.maxTemplateSize)}`);
    }
  }

  containsDangerousPattern(text) {
    return this.dangerousPatterns.some(pattern => pattern.test(text));
  }

  containsPathTraversal(filepath) {
    const normalized = path.normalize(filepath);
    return normalized.includes('..') || normalized.startsWith('/') || normalized.startsWith('\\');
  }

  containsDangerousContent(content) {
    return this.dangerousPatterns.some(pattern => pattern.test(content));
  }

  containsDangerousCommand(command) {
    const dangerousCommands = [
      /rm\s+-rf/i,
      /sudo/i,
      /chmod\s+\d*7/i,
      /eval/i,
      /exec/i,
      /system/i,
      /\|\s*sh/i,
      />\s*\/dev/i
    ];
    
    return dangerousCommands.some(pattern => pattern.test(command));
  }

  isValidVariableName(name) {
    return this.allowedVariablePattern.test(name);
  }

  isValidVersion(version) {
    // Simple semantic version check
    return /^\d+\.\d+\.\d+(-[a-zA-Z0-9-]+)?$/.test(version);
  }

  extractVariables(content) {
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

  validateContentForExtension(content, extension) {
    // Basic content validation for common file types
    switch (extension) {
      case '.json':
        try {
          JSON.parse(content);
          return true;
        } catch {
          return false;
        }
      case '.js':
        return !content.includes('<?') && !content.includes('<html');
      case '.html':
        return content.includes('<') || content.includes('html');
      case '.css':
        return content.includes('{') && content.includes('}');
      default:
        return true; // Don't validate unknown extensions
    }
  }

  calculateSeverity(errors, warnings) {
    if (errors.length > 0) {
      // Check for security-related errors
      const securityErrors = errors.filter(error => 
        error.includes('dangerous') || 
        error.includes('traversal') || 
        error.includes('absolute path')
      );
      
      if (securityErrors.length > 0) {
        return 'critical';
      }
      
      return 'error';
    }
    
    if (warnings.length > 0) {
      return 'warning';
    }
    
    return 'info';
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  validateSchema(template, schemaName = 'template') {
    const schemaFile = path.join(this.schemaPath, `${schemaName}.json`);
    
    if (!fs.existsSync(schemaFile)) {
      return {
        valid: false,
        errors: [`Schema file not found: ${schemaName}.json`],
        warnings: []
      };
    }

    try {
      const schema = JSON.parse(fs.readFileSync(schemaFile, 'utf8'));
      return this.validateAgainstSchema(template, schema);
    } catch (error) {
      return {
        valid: false,
        errors: [`Failed to load schema: ${error.message}`],
        warnings: []
      };
    }
  }

  validateAgainstSchema(data, schema) {
    // Basic JSON schema validation (simplified)
    const errors = [];
    
    if (schema.required) {
      schema.required.forEach(field => {
        if (!data.hasOwnProperty(field)) {
          errors.push(`Missing required field: ${field}`);
        }
      });
    }
    
    if (schema.properties) {
      Object.keys(schema.properties).forEach(prop => {
        if (data[prop] !== undefined) {
          const propSchema = schema.properties[prop];
          const value = data[prop];
          
          if (propSchema.type && typeof value !== propSchema.type) {
            errors.push(`Field ${prop} should be ${propSchema.type}, got ${typeof value}`);
          }
        }
      });
    }
    
    return {
      valid: errors.length === 0,
      errors: errors,
      warnings: []
    };
  }
}

module.exports = TemplateValidator;