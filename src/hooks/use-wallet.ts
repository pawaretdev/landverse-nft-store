"use client";

import { useCallback } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { saigonTestnet } from "@/config/wagmi";

interface UseWalletResult {
  readonly address: `0x${string}` | undefined;
  readonly isConnected: boolean;
  readonly isConnecting: boolean;
  readonly isWrongChain: boolean;
  readonly chainId: number | undefined;
  readonly connect: () => void;
  readonly disconnect: () => void;
  readonly switchToSaigon: () => void;
}

export function useWallet(): UseWalletResult {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const isWrongChain = isConnected && chainId !== saigonTestnet.id;

  const handleConnect = useCallback(() => {
    const injectedConnector = connectors.find((c) => c.id === "injected");
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  }, [connect, connectors]);

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const switchToSaigon = useCallback(() => {
    switchChain({ chainId: saigonTestnet.id });
  }, [switchChain]);

  return {
    address,
    isConnected,
    isConnecting,
    isWrongChain,
    chainId,
    connect: handleConnect,
    disconnect: handleDisconnect,
    switchToSaigon,
  };
}

