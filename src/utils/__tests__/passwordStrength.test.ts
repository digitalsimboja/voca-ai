import { validatePasswordStrength } from '../passwordStrength';

describe('validatePasswordStrength', () => {
  test('should validate empty password', () => {
    const result = validatePasswordStrength('');
    expect(result.isValid).toBe(false);
    expect(result.score).toBe(0);
    expect(result.missingRequirements).toContain('at least 8 characters');
    expect(result.missingRequirements).toContain('an uppercase letter (A-Z)');
    expect(result.missingRequirements).toContain('a lowercase letter (a-z)');
    expect(result.missingRequirements).toContain('a number (0-9)');
    expect(result.missingRequirements).toContain('a special character (!@#$%^&*...)');
  });

  test('should validate weak password', () => {
    const result = validatePasswordStrength('weak');
    expect(result.isValid).toBe(false);
    expect(result.score).toBe(1); // Only has lowercase
    expect(result.hasLowercase).toBe(true);
    expect(result.hasUppercase).toBe(false);
    expect(result.hasNumber).toBe(false);
    expect(result.hasSpecialChar).toBe(false);
    expect(result.hasMinLength).toBe(false);
  });

  test('should validate password with uppercase and lowercase', () => {
    const result = validatePasswordStrength('WeakPass');
    expect(result.isValid).toBe(false);
    expect(result.score).toBe(2); // Has uppercase and lowercase
    expect(result.hasLowercase).toBe(true);
    expect(result.hasUppercase).toBe(true);
    expect(result.hasNumber).toBe(false);
    expect(result.hasSpecialChar).toBe(false);
    expect(result.hasMinLength).toBe(true);
  });

  test('should validate password with uppercase, lowercase, and number', () => {
    const result = validatePasswordStrength('WeakPass1');
    expect(result.isValid).toBe(false);
    expect(result.score).toBe(3); // Has uppercase, lowercase, and number
    expect(result.hasLowercase).toBe(true);
    expect(result.hasUppercase).toBe(true);
    expect(result.hasNumber).toBe(true);
    expect(result.hasSpecialChar).toBe(false);
    expect(result.hasMinLength).toBe(true);
  });

  test('should validate strong password', () => {
    const result = validatePasswordStrength('StrongPass1!');
    expect(result.isValid).toBe(true);
    expect(result.score).toBe(5); // Has all requirements
    expect(result.hasLowercase).toBe(true);
    expect(result.hasUppercase).toBe(true);
    expect(result.hasNumber).toBe(true);
    expect(result.hasSpecialChar).toBe(true);
    expect(result.hasMinLength).toBe(true);
    expect(result.missingRequirements).toHaveLength(0);
  });

  test('should provide correct feedback for missing requirements', () => {
    const result = validatePasswordStrength('weak');
    expect(result.feedback).toContain('Password needs');
    expect(result.feedback).toContain('at least 8 characters');
  });

  test('should provide success feedback for valid password', () => {
    const result = validatePasswordStrength('StrongPass1!');
    expect(result.feedback).toBe('Password meets all requirements!');
  });
});
