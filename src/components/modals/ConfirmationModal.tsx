import React from 'react';
import { AlertTriangle, LucideIcon } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  icon?: LucideIcon;
  details?: Array<{
    label: string;
    value: string | number | React.ReactNode;
  }>;
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  icon: Icon = AlertTriangle,
  details,
  isLoading = false
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          header: 'bg-gradient-to-r from-red-600 via-red-500 to-red-600',
          button: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
          icon: 'text-red-100'
        };
      case 'warning':
        return {
          header: 'bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600',
          button: 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800',
          icon: 'text-yellow-100'
        };
      case 'info':
        return {
          header: 'bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600',
          button: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
          icon: 'text-purple-100'
        };
      default:
        return {
          header: 'bg-gradient-to-r from-red-600 via-red-500 to-red-600',
          button: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
          icon: 'text-red-100'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md flex items-center justify-center z-50 p-1 sm:p-2">
      <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-xl w-full max-w-md shadow-2xl border border-gray-100">
        {/* Header */}
        <div className={`${styles.header} p-3 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                {description && (
                  <p className={`text-sm ${styles.icon}`}>{description}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-xl transition-all duration-200 hover:scale-110 bg-white/10 rounded-full w-6 h-6 flex items-center justify-center backdrop-blur-sm"
              disabled={isLoading}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-700 mb-3">{message}</p>
          </div>

          {/* Details Section */}
          {details && details.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Details</h4>
              <div className="space-y-2 text-sm">
                {details.map((detail, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">{detail.label}:</span>
                    <span className="text-gray-900">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white/80 backdrop-blur-sm p-3 border-t border-gray-100">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              disabled={isLoading}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 text-white rounded-md transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${styles.button}`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>{confirmText}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
