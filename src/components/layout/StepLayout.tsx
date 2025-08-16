import { ReactNode } from "react";

interface StepLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function StepLayout({ children, className = "" }: StepLayoutProps) {
  return (
    <div className={`p-2 sm:p-3 max-w-lg mx-auto w-full ${className}`}>
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
  