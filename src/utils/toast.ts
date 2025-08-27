export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

class ToastManager {
  private container: HTMLDivElement | null = null;
  private toasts: HTMLDivElement[] = [];

  private createContainer(): HTMLDivElement {
    if (this.container) return this.container;

    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.className = 'fixed top-4 right-4 z-50 space-y-2';
    document.body.appendChild(this.container);
    return this.container;
  }

  private getToastStyles(type: ToastType): string {
    const baseStyles = 'flex items-center p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ease-in-out';
    
    const typeStyles = {
      success: 'bg-green-500 text-white border-l-4 border-green-400',
      error: 'bg-red-500 text-white border-l-4 border-red-600',
      info: 'bg-purple-500 text-white border-l-4 border-purple-600',
      warning: 'bg-yellow-500 text-white border-l-4 border-yellow-600'
    };

    return `${baseStyles} ${typeStyles[type]}`;
  }

  private getIcon(type: ToastType): string {
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠'
    };
    return icons[type];
  }

  show(message: string, type: ToastType = 'info', options: ToastOptions = {}): void {
    const { duration = 5000, position = 'top-right' } = options;
    
    // Ensure we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    const container = this.createContainer();
    
    // Update container position
    container.className = `fixed z-50 space-y-2 ${this.getPositionClasses(position)}`;

    const toast = document.createElement('div');
    toast.className = this.getToastStyles(type);
    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';

    const icon = document.createElement('span');
    icon.className = 'mr-3 text-lg font-bold';
    icon.textContent = this.getIcon(type);

    const messageSpan = document.createElement('span');
    messageSpan.className = 'flex-1 text-sm font-medium';
    messageSpan.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.className = 'ml-3 text-white hover:text-gray-200 focus:outline-none';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => this.removeToast(toast);

    toast.appendChild(icon);
    toast.appendChild(messageSpan);
    toast.appendChild(closeButton);
    container.appendChild(toast);
    this.toasts.push(toast);

    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 10);

    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(toast);
      }, duration);
    }
  }

  private removeToast(toast: HTMLDivElement): void {
    if (!toast.parentElement) return;

    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';

    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
      this.toasts = this.toasts.filter(t => t !== toast);
    }, 300);
  }

  private getPositionClasses(position: string): string {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };
    return positions[position as keyof typeof positions] || positions['top-right'];
  }

  // Convenience methods
  success(message: string, options?: ToastOptions): void {
    this.show(message, 'success', options);
  }

  error(message: string, options?: ToastOptions): void {
    this.show(message, 'error', options);
  }

  info(message: string, options?: ToastOptions): void {
    this.show(message, 'info', options);
  }

  warning(message: string, options?: ToastOptions): void {
    this.show(message, 'warning', options);
  }

  // Clear all toasts
  clear(): void {
    this.toasts.forEach(toast => this.removeToast(toast));
  }
}

// Create singleton instance
const toastManager = new ToastManager();

// Export convenience functions
export const toast = {
  show: (message: string, type?: ToastType, options?: ToastOptions) => toastManager.show(message, type, options),
  success: (message: string, options?: ToastOptions) => toastManager.success(message, options),
  error: (message: string, options?: ToastOptions) => toastManager.error(message, options),
  info: (message: string, options?: ToastOptions) => toastManager.info(message, options),
  warning: (message: string, options?: ToastOptions) => toastManager.warning(message, options),
  clear: () => toastManager.clear()
};

export default toast;
