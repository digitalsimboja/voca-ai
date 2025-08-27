import React from 'react';

interface ChangedFieldIndicatorProps {
  currentValue: unknown;
  originalValue: unknown;
  children: React.ReactNode;
}

export function ChangedFieldIndicator({ 
  currentValue, 
  originalValue, 
  children 
}: ChangedFieldIndicatorProps) {
  const hasChanged = JSON.stringify(currentValue) !== JSON.stringify(originalValue);
  
  return (
    <div className={`relative ${hasChanged ? 'ring-2 ring-purple-200 rounded-lg' : ''}`}>
      {children}
      {hasChanged && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border-2 border-white"></div>
      )}
    </div>
  );
}
