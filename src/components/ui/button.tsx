import type { ButtonHTMLAttributes, ReactNode, JSX } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "warning";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly isLoading?: boolean;
  readonly children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-zinc-900 font-semibold",
  secondary:
    "bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700 border border-zinc-600",
  danger:
    "bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-800/50",
  warning:
    "bg-amber-500 hover:bg-amber-600 text-zinc-900",
};

export function Button({
  variant = "primary",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps): JSX.Element {
  const baseStyles =
    "px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {children}
    </button>
  );
}

