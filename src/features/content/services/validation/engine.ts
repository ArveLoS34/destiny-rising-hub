import type { ValidationRule, ValidationResult, ValidationError, ValidationWarning } from '@/types/domain';

/**
 * Validation Engine
 * Validates content against defined rules
 */

export interface ValidationContext {
  entityType: string;
  entityId?: string;
  data: Record<string, any>;
  rules: ValidationRule[];
}

export class ValidationEngine {
  private rules: Map<string, ValidationRule[]> = new Map();

  /**
   * Register validation rules for an entity type
   */
  registerRules(entityType: string, rules: ValidationRule[]): void {
    this.rules.set(entityType, rules);
  }

  /**
   * Get rules for an entity type
   */
  getRules(entityType: string): ValidationRule[] {
    return this.rules.get(entityType) || [];
  }

  /**
   * Validate data against rules
   */
  validate(context: ValidationContext): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const rules = context.rules.length > 0 ? context.rules : this.getRules(context.entityType);

    for (const rule of rules) {
      if (!rule.isActive) continue;

      const result = this.applyRule(rule, context.data);
      
      if (!result.valid) {
        errors.push({
          field: rule.field,
          rule: rule.type,
          message: rule.errorMessage,
          value: context.data[rule.field],
        });
      } else if (result.warning) {
        warnings.push({
          field: rule.field,
          message: result.warning,
          suggestion: result.suggestion,
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Apply a single validation rule
   */
  private applyRule(
    rule: ValidationRule,
    data: Record<string, any>
  ): { valid: boolean; warning?: string; suggestion?: string } {
    const value = data[rule.field];

    switch (rule.type) {
      case 'required':
        return this.validateRequired(value, rule);

      case 'type':
        return this.validateType(value, rule);

      case 'range':
        return this.validateRange(value, rule);

      case 'format':
        return this.validateFormat(value, rule);

      case 'enum':
        return this.validateEnum(value, rule);

      case 'custom':
        return this.validateCustom(value, rule, data);

      default:
        return { valid: true };
    }
  }

  /**
   * Validate required field
   */
  private validateRequired(
    value: any,
    rule: ValidationRule
  ): { valid: boolean; warning?: string } {
    const isValid = value !== undefined && value !== null && value !== '';
    return { valid: isValid };
  }

  /**
   * Validate field type
   */
  private validateType(
    value: any,
    rule: ValidationRule
  ): { valid: boolean; warning?: string } {
    const expectedType = rule.config.type;
    
    if (value === undefined || value === null) {
      return { valid: true }; // Let required rule handle this
    }

    const actualType = Array.isArray(value) ? 'array' : typeof value;
    const isValid = actualType === expectedType;

    return {
      valid: isValid,
      warning: isValid ? undefined : `Expected ${expectedType}, got ${actualType}`,
    };
  }

  /**
   * Validate value range
   */
  private validateRange(
    value: any,
    rule: ValidationRule
  ): { valid: boolean; warning?: string; suggestion?: string } {
    if (typeof value !== 'number') {
      return { valid: true }; // Let type rule handle this
    }

    const { min, max } = rule.config;
    let isValid = true;
    let warning: string | undefined;
    let suggestion: string | undefined;

    if (min !== undefined && value < min) {
      isValid = false;
      warning = `Value ${value} is below minimum ${min}`;
      suggestion = `Increase value to at least ${min}`;
    }

    if (max !== undefined && value > max) {
      isValid = false;
      warning = `Value ${value} exceeds maximum ${max}`;
      suggestion = `Decrease value to at most ${max}`;
    }

    return { valid: isValid, warning, suggestion };
  }

  /**
   * Validate value format
   */
  private validateFormat(
    value: any,
    rule: ValidationRule
  ): { valid: boolean; warning?: string } {
    if (typeof value !== 'string') {
      return { valid: true }; // Let type rule handle this
    }

    const format = rule.config.format;
    let isValid = true;

    switch (format) {
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;

      case 'url':
        try {
          new URL(value);
          isValid = true;
        } catch {
          isValid = false;
        }
        break;

      case 'slug':
        isValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
        break;

      case 'date':
        isValid = !isNaN(Date.parse(value));
        break;

      case 'uuid':
        isValid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
        break;

      default:
        if (rule.config.pattern) {
          const regex = new RegExp(rule.config.pattern);
          isValid = regex.test(value);
        }
    }

    return {
      valid: isValid,
      warning: isValid ? undefined : `Value does not match format: ${format}`,
    };
  }

  /**
   * Validate enum value
   */
  private validateEnum(
    value: any,
    rule: ValidationRule
  ): { valid: boolean; warning?: string } {
    const allowedValues = rule.config.values as any[];
    const isValid = allowedValues.includes(value);

    return {
      valid: isValid,
      warning: isValid ? undefined : `Value must be one of: ${allowedValues.join(', ')}`,
    };
  }

  /**
   * Validate custom rule
   */
  private validateCustom(
    value: any,
    rule: ValidationRule,
    data: Record<string, any>
  ): { valid: boolean; warning?: string } {
    // Custom validation logic can be added here
    // For now, just return valid
    return { valid: true };
  }

  /**
   * Validate multiple entities
   */
  validateBatch(
    entityType: string,
    entities: Record<string, any>[]
  ): { results: ValidationResult[]; summary: { total: number; valid: number; invalid: number } } {
    const results = entities.map((entity) =>
      this.validate({
        entityType,
        data: entity,
        rules: this.getRules(entityType),
      })
    );

    const valid = results.filter((r) => r.valid).length;
    const invalid = results.length - valid;

    return {
      results,
      summary: {
        total: results.length,
        valid,
        invalid,
      },
    };
  }
}

export const validationEngine = new ValidationEngine();
