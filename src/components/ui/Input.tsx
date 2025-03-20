import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
} 