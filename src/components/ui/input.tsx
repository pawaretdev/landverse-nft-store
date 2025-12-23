import type { InputHTMLAttributes, TextareaHTMLAttributes, JSX } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly label?: string;
}

export function Input({
  label,
  className = "",
  ...props
}: InputProps): JSX.Element {
  const inputStyles =
    "w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-mono text-sm text-white placeholder-zinc-500";
  return (
    <div>
      {label && (
        <label className="block text-sm text-zinc-400 mb-2">{label}</label>
      )}
      <input className={`${inputStyles} ${className}`} {...props} />
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  readonly label?: string;
  readonly error?: string;
  readonly hint?: string;
}

export function Textarea({
  label,
  error,
  hint,
  className = "",
  ...props
}: TextareaProps): JSX.Element {
  const textareaStyles =
    "w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-mono text-sm text-white placeholder-zinc-500";
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          {label}
        </label>
      )}
      <textarea className={`${textareaStyles} ${className}`} {...props} />
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      {hint && !error && <p className="text-xs text-amber-400 mt-2">{hint}</p>}
    </div>
  );
}

