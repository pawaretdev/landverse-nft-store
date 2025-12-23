"use client";

import { Loader2, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import type { Address } from "viem";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import {
  DEFAULT_NFT_STORE_ADDRESS,
  DEFAULT_PAYLOAD_JSON,
  DEFAULT_TOKEN_ADDRESS,
} from "@/constants/contracts";
import { formatTokenAmount } from "@/lib/format";
import { calculateTotalPrice, parsePurchasePayload } from "@/lib/purchase";
import type { PurchasePayload, TransactionStep } from "@/types/purchase";

interface PurchaseFormProps {
  readonly isConnected: boolean;
  readonly isWrongChain: boolean;
  readonly isLoading: boolean;
  readonly txStep: TransactionStep;
  readonly onSubmit: (
    payload: PurchasePayload,
    nftStoreAddress: Address,
    tokenAddress: Address,
    skipSimulation: boolean
  ) => void;
  readonly onConfigChange: (
    nftStoreAddress: Address,
    tokenAddress: Address,
    skipSimulation: boolean
  ) => void;
}

export function PurchaseForm({
  isConnected,
  isWrongChain,
  isLoading,
  txStep,
  onSubmit,
  onConfigChange,
}: PurchaseFormProps): React.ReactNode {
  const [nftStoreAddress, setNftStoreAddress] = useState<Address>(
    DEFAULT_NFT_STORE_ADDRESS
  );
  const [tokenAddress, setTokenAddress] = useState<Address>(
    DEFAULT_TOKEN_ADDRESS
  );
  const [payloadJson, setPayloadJson] = useState(DEFAULT_PAYLOAD_JSON);
  const [skipSimulation, setSkipSimulation] = useState(false);

  const parsed = useMemo(
    () => parsePurchasePayload(payloadJson),
    [payloadJson]
  );

  const displayTotalPrice = parsed.payload
    ? calculateTotalPrice(parsed.payload.request)
    : BigInt(0);

  const handleNftStoreAddressChange = (value: string): void => {
    const newAddress = value as Address;
    setNftStoreAddress(newAddress);
    onConfigChange(newAddress, tokenAddress, skipSimulation);
  };

  const handleTokenAddressChange = (value: string): void => {
    const newAddress = value as Address;
    setTokenAddress(newAddress);
    onConfigChange(nftStoreAddress, newAddress, skipSimulation);
  };

  const handleSkipSimulationChange = (checked: boolean): void => {
    setSkipSimulation(checked);
    onConfigChange(nftStoreAddress, tokenAddress, checked);
  };

  const handleSubmit = (): void => {
    if (parsed.isValid && parsed.payload) {
      onSubmit(parsed.payload, nftStoreAddress, tokenAddress, skipSimulation);
    }
  };

  const getButtonLabel = (): string => {
    if (txStep === "checking") return "Checking allowance...";
    if (txStep === "approving") return "Approving...";
    if (txStep === "purchasing") return "Purchasing...";
    return "Processing...";
  };

  return (
    <>
      {/* Configuration Section */}
      <Card className="p-6 mb-6">
        <CardHeader>Configuration</CardHeader>
        <div className="space-y-4">
          <Input
            label="NFT Store Address"
            value={nftStoreAddress}
            onChange={(e) => handleNftStoreAddressChange(e.target.value)}
            placeholder="0x..."
            disabled={isLoading}
          />
          <Input
            label="Token Address"
            value={tokenAddress}
            onChange={(e) => handleTokenAddressChange(e.target.value)}
            placeholder="0x..."
            disabled={isLoading}
          />
        </div>
      </Card>

      {/* Purchase Form */}
      <Card className="p-8 mb-6">
        <CardHeader className="flex items-center gap-3">
          <ShoppingCart className="w-7 h-7 text-amber-500" />
          <span>Purchase NFT</span>
        </CardHeader>
        <div className="space-y-6">
          <Textarea
            label="Payload JSON (request + signature) *"
            value={payloadJson}
            onChange={(e) => setPayloadJson(e.target.value)}
            placeholder='{"request":{...},"signature":"0x..."}'
            rows={14}
            disabled={isLoading}
            error={!parsed.isValid ? parsed.error : undefined}
            hint={
              parsed.isValid && displayTotalPrice > BigInt(0)
                ? `Total Price: ${formatTokenAmount(displayTotalPrice)} tokens`
                : undefined
            }
          />
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="skipSimulation"
              checked={skipSimulation}
              onChange={(e) => handleSkipSimulationChange(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-600 bg-zinc-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-zinc-800"
              disabled={isLoading}
            />
            <label
              htmlFor="skipSimulation"
              className="text-sm text-zinc-400 cursor-pointer"
            >
              Skip simulation (use if RPC simulation fails)
            </label>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={
              isLoading || !isConnected || !parsed.isValid || isWrongChain
            }
            className="w-full py-4 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {getButtonLabel()}
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                Execute Purchase
              </>
            )}
          </Button>
        </div>
      </Card>
    </>
  );
}

