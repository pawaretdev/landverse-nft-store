"use client";

import type { Hex } from "viem";
import { saigonTestnet } from "@/config/wagmi";
import { Alert } from "@/components/ui/alert";

interface TransactionStatusProps {
  readonly status: string;
  readonly error: string;
  readonly txHash: Hex | undefined;
}

export function TransactionStatus({
  status,
  error,
  txHash,
}: TransactionStatusProps): React.ReactNode {
  return (
    <>
      {status && (
        <Alert variant="info">{status}</Alert>
      )}
      {error && (
        <Alert variant="error" title="Error:">
          {error}
        </Alert>
      )}
      {txHash && (
        <div className="bg-emerald-900/20 border border-emerald-600/50 rounded-xl p-4 mb-6">
          <p className="text-sm text-zinc-400 mb-2">Transaction Hash:</p>
          <a
            href={`${saigonTestnet.blockExplorers.default.url}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-amber-400 break-all hover:underline hover:text-amber-300"
          >
            {txHash}
          </a>
        </div>
      )}
    </>
  );
}

