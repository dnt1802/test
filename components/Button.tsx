import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  className = '',
  disabled = false
}) => {
  const baseStyles = "px-6 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white border-b-4 border-blue-700",
    secondary: "bg-white hover:bg-gray-100 text-blue-500 border-b-4 border-gray-200",
    success: "bg-green-500 hover:bg-green-600 text-white border-b-4 border-green-700",
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed transform-none' : ''} ${className}`}
    >
      {children}
    </button>
  );
};