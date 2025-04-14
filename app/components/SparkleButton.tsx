import React from 'react';

interface SparkleButtonProps {
  onClick: () => void;
  isLoading: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SparkleButton: React.FC<SparkleButtonProps> = ({
  onClick,
  isLoading,
  title = 'Generate with AI',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      title={title}
      aria-label={title}
      className={`text-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full transition-colors duration-200 ${className}`}
    >
      {isLoading ? (
        <svg
          className={`animate-spin ${sizeClasses[size]}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <svg
          className={`${sizeClasses[size]}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      )}
    </button>
  );
};

export default SparkleButton;
