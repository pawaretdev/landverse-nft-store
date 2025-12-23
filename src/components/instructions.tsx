import { Card } from "@/components/ui/card";

const STEPS = [
  "Connect your wallet using MetaMask",
  "Paste the complete payload JSON (with request and signature)",
  "App checks allowance, approves if needed, then executes purchase",
] as const;

export function Instructions(): React.ReactNode {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4 text-amber-400">How it works:</h3>
      <ol className="space-y-3 text-sm text-zinc-400">
        {STEPS.map((step, index) => (
          <li key={index} className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-amber-500 to-yellow-600 text-zinc-900 rounded-full flex items-center justify-center text-xs font-bold shadow-lg shadow-amber-500/20">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}

