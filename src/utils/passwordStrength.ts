export interface PasswordStrengthResult {
  isValid: boolean;
  score: number; // 0-4
  missingRequirements: string[];
  feedback: string;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  hasMinLength: boolean;
}

export function validatePasswordStrength(password: string): PasswordStrengthResult {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };

  const missingRequirements: string[] = [];
  
  if (!requirements.minLength) {
    missingRequirements.push("at least 8 characters");
  }
  if (!requirements.hasUppercase) {
    missingRequirements.push("an uppercase letter (A-Z)");
  }
  if (!requirements.hasLowercase) {
    missingRequirements.push("a lowercase letter (a-z)");
  }
  if (!requirements.hasNumber) {
    missingRequirements.push("a number (0-9)");
  }
  if (!requirements.hasSpecialChar) {
    missingRequirements.push("a special character (!@#$%^&*...)");
  }

  // Calculate score (0-4)
  const score = Object.values(requirements).filter(Boolean).length;

  // Generate feedback message
  let feedback = "";
  if (missingRequirements.length === 0) {
    feedback = "Password meets all requirements!";
  } else if (missingRequirements.length === 1) {
    feedback = `Password needs ${missingRequirements[0]}`;
  } else {
    const lastRequirement = missingRequirements.pop();
    feedback = `Password needs ${missingRequirements.join(", ")} and ${lastRequirement}`;
  }

  return {
    isValid: missingRequirements.length === 0,
    score,
    missingRequirements,
    feedback,
    hasUppercase: requirements.hasUppercase,
    hasLowercase: requirements.hasLowercase,
    hasNumber: requirements.hasNumber,
    hasSpecialChar: requirements.hasSpecialChar,
    hasMinLength: requirements.minLength
  };
}

export function getPasswordStrengthColor(score: number): string {
  switch (score) {
    case 0:
    case 1:
      return "bg-red-500";
    case 2:
      return "bg-orange-500";
    case 3:
      return "bg-yellow-500";
    case 4:
    case 5:
      return "bg-green-500";
    default:
      return "bg-gray-300";
  }
}

export function getPasswordStrengthText(score: number): string {
  switch (score) {
    case 0:
    case 1:
      return "Very Weak";
    case 2:
      return "Weak";
    case 3:
      return "Fair";
    case 4:
      return "Good";
    case 5:
      return "Strong";
    default:
      return "Unknown";
  }
}
