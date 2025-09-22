interface StepIndicatorProps {
  activeStep: number;
  totalSteps: number;
}

const stepLabels = ["Profile", "Social", "Orders", "Service", "AI Setup"];
const stepDescriptions = [
  "Agent Profile",
  "Social Media Platforms",
  "Order Management",
  "Customer Service",
  "Integrations & AI",
];

export default function StepIndicator({ activeStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm p-2 sm:p-3 border-b border-gray-100 w-full">
      {/* Step indicator row */}
      <div className="flex items-center justify-between w-full max-w-md mx-auto">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex items-center flex-1 min-w-[35px]">
            <div className="flex flex-col items-center flex-shrink-0 w-full">
              <div
                className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold transition-all duration-300 ${
                  i + 1 < activeStep
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm shadow-green-500/30"
                    : i + 1 === activeStep
                    ? "bg-gradient-to-r from-voca-cyan to-voca-cyan text-white shadow-sm shadow-voca-cyan/30 animate-pulse"
                    : "bg-gray-100 text-gray-400 border border-gray-200"
                }`}
              >
                {i + 1 < activeStep ? (
                  <svg
                    className="w-2 h-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`mt-0.5 font-medium text-[7px] sm:text-[8px] md:text-[9px] lg:text-xs truncate max-w-[30px] sm:max-w-[50px] text-center leading-tight ${
                  i + 1 <= activeStep ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {stepLabels[i]}
              </span>
            </div>

            {/* Connector */}
            {i < totalSteps - 1 && (
              <div
                className={`flex-1 h-0.5 mx-0.5 rounded-full transition-all duration-300 ${
                  i + 1 < activeStep
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Description */}
      <div className="mt-1 text-center">
        <span className="text-[8px] sm:text-[9px] md:text-xs font-medium text-gray-600 bg-white/70 px-1.5 sm:px-2 py-0.5 rounded-full">
          Step {activeStep} of {totalSteps} • {stepDescriptions[activeStep - 1]}
        </span>
      </div>
    </div>
  );
}
