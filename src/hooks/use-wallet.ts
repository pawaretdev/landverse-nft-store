"use client";

import { useCallback, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { saigonTestnet } from "@/config/wagmi";

interface UseWalletResult {
  readonly address: `0x${string}` | undefined;
  readonly isConnected: boolean;
  readonly isConnecting: boolean;
  readonly isWrongChain: boolean;
  readonly chainId: number | undefined;
  readonly connectError: string;
  readonly connect: () => void;
  readonly disconnect: () => void;
  readonly switchToSaigon: () => void;
}

export function useWallet(): UseWalletResult {
  const { address, isConnected, chainId } = useAccount();
  const {
    connect,
    connectors,
    isPending: isConnecting,
    error: wagmiConnectError,
  } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [connectError, setConnectError] = useState("");

  const isWrongChain = isConnected && chainId !== saigonTestnet.id;

  const handleConnect = useCallback(() => {
    setConnectError("");
    // Find the best connector: prefer injected, then any available
    const injectedConnector = connectors.find((c) => c.id === "injected");
    const connector = injectedConnector ?? connectors[0];
    if (connector) {
      connect(
        { connector },
        {
          onError: (error) => {
            const message = error.message.includes("No provider")
              ? "No wallet detected. Please install MetaMask or another Web3 wallet."
              : error.message;
            setConnectError(message);
          },
        }
      );
    } else {
      setConnectError(
        "No wallet connector available. Please install MetaMask."
      );
    }
  }, [connect, connectors]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setConnectError("");
  }, [disconnect]);

  const switchToSaigon = useCallback(() => {
    switchChain({ chainId: saigonTestnet.id });
  }, [switchChain]);

  // Combine internal and wagmi errors
  const formatErrorMessage = (message: string): string => {
    if (message.includes("Provider not found") || message.includes("No provider")) {
      return "No wallet found. Please install MetaMask or Ronin Wallet.";
    }
    if (message.includes("User rejected")) {
      return "Connection rejected by user.";
    }
    return message;
  };

  const displayError = connectError
    ? formatErrorMessage(connectError)
    : wagmiConnectError
      ? formatErrorMessage(wagmiConnectError.message)
      : "";

  return {
    address,
    isConnected,
    isConnecting,
    isWrongChain,
    chainId,
    connectError: displayError,
    connect: handleConnect,
    disconnect: handleDisconnect,
    switchToSaigon,
  };
}
