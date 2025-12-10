import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    icon?: React.ElementType;
}

const Button = ({
    children,
    variant = 'primary',
    className = '',
    icon: Icon,
    ...props
}: ButtonProps) => {
    const baseStyles = "inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 focus:ring-blue-500",
        secondary: "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-900/20 focus:ring-violet-500",
        outline: "border border-slate-700 text-slate-300 hover:bg-slate-800 focus:ring-slate-500",
        ghost: "text-slate-400 hover:text-white hover:bg-slate-800/50"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {Icon && <Icon className="w-4 h-4 mr-2" />}
            {children}
        </button>
    );
};

export default Button;
