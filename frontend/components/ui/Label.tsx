import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
}

const Label = ({ children, className = '', ...props }: LabelProps) => {
    return (
        <label
            className={`block text-sm font-medium text-slate-300 mb-1.5 ${className}`}
            {...props}
        >
            {children}
        </label>
    );
};

export default Label;
