import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '',
  onClick 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
