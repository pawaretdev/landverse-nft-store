"use client";

import { Wallet } from "lucide-react";
import { CHAIN_NAME, saigonTestnet } from "@/config/wagmi";
import { formatTokenAmount, truncateAddress } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface WalletConnectionProps {
  readonly address: `0x${string}` | undefined;
  readonly isConnected: boolean;
  readonly isConnecting: boolean;
  readonly isWrongChain: boolean;
  readonly currentAllowance: bigint | undefined;
  readonly onConnect: () => void;
  readonly onDisconnect: () => void;
  readonly onSwitchChain: () => void;
}

export function WalletConnection({
  address,
  isConnected,
  isConnecting,
  isWrongChain,
  currentAllowance,
  onConnect,
  onDisconnect,
  onSwitchChain,
}: WalletConnectionProps): React.ReactNode {
  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wallet className="w-6 h-6 text-amber-500" />
          <div>
            <p className="text-sm text-zinc-400">
              Network: {CHAIN_NAME} (Chain ID: {saigonTestnet.id})
            </p>
            <p className="font-mono text-sm text-white">
              {isConnected && address
                ? truncateAddress(address)
                : "Not Connected"}
            </p>
            {isConnected && currentAllowance !== undefined && (
              <p className="text-xs text-amber-400 mt-1">
                Current Allowance: {formatTokenAmount(currentAllowance)}
              </p>
            )}
            {isWrongChain && (
              <p className="text-xs text-orange-400 mt-1">
                Wrong network detected
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {isWrongChain && (
            <Button variant="warning" onClick={onSwitchChain}>
              Switch Network
            </Button>
          )}
          {isConnected ? (
            <Button variant="danger" onClick={onDisconnect}>
              Disconnect
            </Button>
          ) : (
            <Button onClick={onConnect} disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

