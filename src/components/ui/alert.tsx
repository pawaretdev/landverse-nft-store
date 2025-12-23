import { AlertCircle, CheckCircle, Info } from "lucide-react";
import type { ReactNode, JSX } from "react";

type AlertVariant = "info" | "success" | "error";

interface AlertProps {
  readonly variant: AlertVariant;
  readonly title?: string;
  readonly children: ReactNode;
}

const variantConfig: Record<
  AlertVariant,
  { bgClass: string; borderClass: string; textClass: string; Icon: typeof Info }
> = {
  info: {
    bgClass: "bg-amber-900/20",
    borderClass: "border-amber-600/50",
    textClass: "text-amber-200",
    Icon: CheckCircle,
  },
  success: {
    bgClass: "bg-emerald-900/20",
    borderClass: "border-emerald-600/50",
    textClass: "text-emerald-200",
    Icon: CheckCircle,
  },
  error: {
    bgClass: "bg-red-900/20",
    borderClass: "border-red-700/50",
    textClass: "text-red-300",
    Icon: AlertCircle,
  },
};

export function Alert({
  variant,
  title,
  children,
}: AlertProps): JSX.Element {
  const { bgClass, borderClass, textClass, Icon } = variantConfig[variant];
  return (
    <div
      className={`${bgClass} border ${borderClass} rounded-xl p-4 mb-6 flex items-start gap-3`}
    >
      <Icon
        className={`w-5 h-5 ${textClass.replace("100", "400")} flex-shrink-0 mt-0.5`}
      />
      <div className="flex-1">
        {title && (
          <p className={`${textClass} font-semibold mb-2`}>{title}</p>
        )}
        <p className={`${textClass} text-sm break-all`}>{children}</p>
      </div>
    </div>
  );
}

