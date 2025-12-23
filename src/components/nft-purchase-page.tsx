"use client";

import { useCallback, useState } from "react";
import type { Address } from "viem";

import { Instructions } from "@/components/instructions";
import { PurchaseForm } from "@/components/purchase-form";
import { TransactionStatus } from "@/components/transaction-status";
import { WalletConnection } from "@/components/wallet-connection";
import {
  DEFAULT_NFT_STORE_ADDRESS,
  DEFAULT_TOKEN_ADDRESS,
} from "@/constants/contracts";
import { usePurchase } from "@/hooks/use-purchase";
import { useWallet } from "@/hooks/use-wallet";
import type { PurchaseConfig, PurchasePayload } from "@/types/purchase";

export function NftPurchasePage(): React.ReactNode {
  const wallet = useWallet();
  const [config, setConfig] = useState<PurchaseConfig>({
    nftStoreAddress: DEFAULT_NFT_STORE_ADDRESS,
    tokenAddress: DEFAULT_TOKEN_ADDRESS,
    skipSimulation: false,
  });

  const purchase = usePurchase(config);

  const handleConfigChange = useCallback(
    (
      nftStoreAddress: Address,
      tokenAddress: Address,
      skipSimulation: boolean
    ) => {
      setConfig({ nftStoreAddress, tokenAddress, skipSimulation });
    },
    []
  );

  const handleSubmit = useCallback(
    (
      payload: PurchasePayload,
      nftStoreAddress: Address,
      tokenAddress: Address,
      skipSimulation: boolean
    ) => {
      setConfig({ nftStoreAddress, tokenAddress, skipSimulation });
      purchase.executePurchase(payload);
    },
    [purchase]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-neutral-900 to-stone-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
            Landverse NFT Purchase
          </h1>
          <p className="text-zinc-400 text-lg">
            Paste request + signature payload and execute purchase
          </p>
        </header>

        {/* Wallet Connection */}
        <WalletConnection
          address={wallet.address}
          isConnected={wallet.isConnected}
          isConnecting={wallet.isConnecting}
          isWrongChain={wallet.isWrongChain}
          currentAllowance={purchase.currentAllowance}
          connectError={wallet.connectError}
          onConnect={wallet.connect}
          onDisconnect={wallet.disconnect}
          onSwitchChain={wallet.switchToSaigon}
        />

        {/* Purchase Form */}
        <PurchaseForm
          isConnected={wallet.isConnected}
          isWrongChain={wallet.isWrongChain}
          isLoading={purchase.isLoading}
          txStep={purchase.txStep}
          onSubmit={handleSubmit}
          onConfigChange={handleConfigChange}
        />

        {/* Transaction Status */}
        <TransactionStatus
          status={purchase.status}
          error={purchase.error}
          txHash={purchase.currentTxHash}
        />

        {/* Instructions */}
        <Instructions />
      </div>
    </div>
  );
}

