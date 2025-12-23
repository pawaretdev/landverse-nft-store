import type { ReactNode, JSX } from "react";

interface CardProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function Card({ children, className = "" }: CardProps): JSX.Element {
  return (
    <div
      className={`bg-zinc-800/80 backdrop-blur-lg rounded-2xl border border-zinc-700/50 shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function CardHeader({
  children,
  className = "",
}: CardHeaderProps): JSX.Element {
  return (
    <div className={`text-xl font-bold mb-4 text-amber-400 ${className}`}>{children}</div>
  );
}

interface CardContentProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function CardContent({
  children,
  className = "",
}: CardContentProps): JSX.Element {
  return <div className={className}>{children}</div>;
}

