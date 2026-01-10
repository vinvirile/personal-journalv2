import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  type = 'danger',
}) => {
  if (!isOpen) return null;

  const typeClasses = {
    danger: {
      button: 'bg-red-500 hover:bg-red-600',
      icon: 'text-red-500',
    },
    warning: {
      button: 'bg-yellow-500 hover:bg-yellow-600',
      icon: 'text-yellow-500',
    },
    info: {
      button: 'bg-blue-500 hover:bg-blue-600',
      icon: 'text-blue-500',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-md animate-fade-in">
      <div className="glass shadow-2xl max-w-sm w-full mx-auto overflow-hidden rounded-3xl border-glass-border animate-fade-in">
        <div className="p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-foreground/5`}>
              {type === 'danger' && (
                <svg className={`w-7 h-7 ${typeClasses[type].icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
              {type === 'warning' && (
                <svg className={`w-7 h-7 ${typeClasses[type].icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              )}
              {type === 'info' && (
                <svg className={`w-7 h-7 ${typeClasses[type].icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              )}
            </div>
            <h3 className="text-xl font-bold text-foreground font-outfit">{title}</h3>
            <p className="text-foreground/50 mt-2 font-outfit text-sm leading-relaxed">{message}</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`w-full py-3.5 px-4 text-sm font-bold text-white rounded-2xl shadow-lg transition-all-custom active:scale-95 disabled:opacity-50 font-outfit ${typeClasses[type].button}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : confirmText}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full py-3.5 px-4 text-sm font-bold text-foreground/40 hover:text-foreground/60 hover:bg-foreground/5 rounded-2xl transition-all-custom disabled:opacity-50 font-outfit"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
