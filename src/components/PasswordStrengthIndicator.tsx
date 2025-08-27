import { CheckCircle, XCircle } from "lucide-react";
import { 
  validatePasswordStrength, 
  getPasswordStrengthColor, 
  getPasswordStrengthText,
  type PasswordStrengthResult 
} from "@/utils/passwordStrength";

interface PasswordStrengthIndicatorProps {
  password: string;
  showIndicator?: boolean;
}

export function PasswordStrengthIndicator({ 
  password, 
  showIndicator = true 
}: PasswordStrengthIndicatorProps) {
  if (!password || !showIndicator) {
    return null;
  }

  // Don't show if password is empty
  if (password.length === 0) {
    return null;
  }

  const strength = validatePasswordStrength(password);
  const strengthColor = getPasswordStrengthColor(strength.score);
  const strengthText = getPasswordStrengthText(strength.score);

  const requirements = [
    {
      label: "At least 8 characters",
      met: strength.hasMinLength,
      icon: strength.hasMinLength ? CheckCircle : XCircle,
      color: strength.hasMinLength ? "text-green-600" : "text-red-600"
    },
    {
      label: "Uppercase letter (A-Z)",
      met: strength.hasUppercase,
      icon: strength.hasUppercase ? CheckCircle : XCircle,
      color: strength.hasUppercase ? "text-green-600" : "text-red-600"
    },
    {
      label: "Lowercase letter (a-z)",
      met: strength.hasLowercase,
      icon: strength.hasLowercase ? CheckCircle : XCircle,
      color: strength.hasLowercase ? "text-green-600" : "text-red-600"
    },
    {
      label: "Number (0-9)",
      met: strength.hasNumber,
      icon: strength.hasNumber ? CheckCircle : XCircle,
      color: strength.hasNumber ? "text-green-600" : "text-red-600"
    },
    {
      label: "Special character (!@#$%^&*...)",
      met: strength.hasSpecialChar,
      icon: strength.hasSpecialChar ? CheckCircle : XCircle,
      color: strength.hasSpecialChar ? "text-green-600" : "text-red-600"
    }
  ];

  return (
    <div className="mt-2 space-y-3">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Password strength:</span>
          <span className={`font-medium ${
            strength.isValid ? "text-green-600" : "text-gray-600"
          }`}>
            {strengthText}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${strengthColor}`}
            style={{ width: `${(strength.score / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Requirements:</p>
        <div className="space-y-1">
          {requirements.map((requirement, index) => {
            const Icon = requirement.icon;
            return (
              <div key={index} className="flex items-center space-x-2">
                <Icon className={`h-4 w-4 ${requirement.color}`} />
                <span className={`text-sm ${
                  requirement.met ? "text-green-600" : "text-red-600"
                }`}>
                  {requirement.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback Message */}
      <div className={`text-sm p-2 rounded-md transition-all duration-200 ${
        strength.isValid 
          ? "bg-green-50 text-green-700 border border-green-200" 
          : "bg-red-50 text-red-700 border border-red-200"
      }`}>
        {strength.feedback}
      </div>
    </div>
  );
}
