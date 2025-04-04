// src/ui/Button.tsx
import React, { ButtonHTMLAttributes, FC } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

export const Button: FC<ButtonProps> = ({ children, className = "", ...props }) => (
  <button
    className={`bg-[#f56551] text-white font-bold py-2 px-4 rounded hover:bg-[#f34c39] ${className}`}
    {...props}
  >
    {children}
  </button>
);