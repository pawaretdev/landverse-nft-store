"use client";

import { useCallback, useEffect, useState } from "react";
import { type Address, type Hex, erc20Abi } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import {
  GAS_LIMIT_APPROVE,
  GAS_LIMIT_PURCHASE,
  NFT_STORE_ABI,
} from "@/constants/contracts";
import {
  calculateTotalPrice,
  toContractPurchaseArgs,
  validatePurchaseRequest,
} from "@/lib/purchase";
import type {
  PurchaseConfig,
  PurchasePayload,
  TransactionStep,
} from "@/types/purchase";
import { formatTokenAmount } from "@/lib/format";

interface UsePurchaseResult {
  readonly txStep: TransactionStep;
  readonly status: string;
  readonly error: string;
  readonly isLoading: boolean;
  readonly currentTxHash: Hex | undefined;
  readonly currentAllowance: bigint | undefined;
  readonly executePurchase: (payload: PurchasePayload) => Promise<void>;
  readonly resetState: () => void;
}

export function usePurchase(config: PurchaseConfig): UsePurchaseResult {
  const { address, isConnected } = useAccount();
  const [txStep, setTxStep] = useState<TransactionStep>("idle");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [pendingPayload, setPendingPayload] = useState<PurchasePayload | null>(
    null
  );

  const { data: currentAllowance, refetch: refetchAllowance } = useReadContract(
    {
      address: config.tokenAddress,
      abi: erc20Abi,
      functionName: "allowance",
      args: address ? [address, config.nftStoreAddress] : undefined,
      query: {
        enabled: !!address && isConnected,
      },
    }
  );

  const {
    data: approveTxHash,
    writeContract: writeApprove,
    isPending: isApproving,
    error: approveError,
    reset: resetApprove,
  } = useWriteContract();

  const {
    data: purchaseTxHash,
    writeContract: writePurchase,
    isPending: isPurchasing,
    error: purchaseError,
    reset: resetPurchase,
  } = useWriteContract();

  const {
    isSuccess: isApproveConfirmed,
    isLoading: isApproveConfirming,
    error: approveReceiptError,
  } = useWaitForTransactionReceipt({
    hash: approveTxHash,
  });

  const {
    isSuccess: isPurchaseConfirmed,
    isLoading: isPurchaseConfirming,
    error: purchaseReceiptError,
  } = useWaitForTransactionReceipt({
    hash: purchaseTxHash,
  });

  const executePurchaseTransaction = useCallback(() => {
    if (!pendingPayload) return;
    const { request, signature } = pendingPayload;
    setStatus("Executing purchase...");
    setTxStep("purchasing");
    const purchaseArgs = toContractPurchaseArgs(request);
    writePurchase({
      address: config.nftStoreAddress,
      abi: NFT_STORE_ABI,
      functionName: "executePurchase",
      args: [purchaseArgs, signature as Hex],
      ...(config.skipSimulation ? { gas: GAS_LIMIT_PURCHASE } : {}),
    });
  }, [pendingPayload, config.nftStoreAddress, config.skipSimulation, writePurchase]);

  // Handle approve confirmed -> execute purchase
  useEffect(() => {
    if (isApproveConfirmed && txStep === "approving" && pendingPayload) {
      setStatus("Tokens approved! Executing purchase...");
      executePurchaseTransaction();
    }
  }, [isApproveConfirmed, txStep, pendingPayload, executePurchaseTransaction]);

  // Handle purchase confirmed
  useEffect(() => {
    if (isPurchaseConfirmed && txStep === "purchasing") {
      setStatus("Purchase completed successfully! 🎉");
      setTxStep("idle");
      setPendingPayload(null);
      refetchAllowance();
    }
  }, [isPurchaseConfirmed, txStep, refetchAllowance]);

  // Handle approve errors
  useEffect(() => {
    if (approveError && txStep === "approving") {
      const errorMessage = approveError.message.includes("User rejected")
        ? "Transaction rejected by user"
        : approveError.message;
      setError(errorMessage);
      setStatus("");
      setTxStep("idle");
    }
  }, [approveError, txStep]);

  // Handle purchase errors
  useEffect(() => {
    if (purchaseError && txStep === "purchasing") {
      const errorMessage = purchaseError.message.includes("User rejected")
        ? "Transaction rejected by user"
        : purchaseError.message;
      setError(errorMessage);
      setStatus("");
      setTxStep("idle");
    }
  }, [purchaseError, txStep]);

  // Handle receipt errors
  useEffect(() => {
    if (approveReceiptError && txStep === "approving") {
      setError("Approve transaction failed: " + approveReceiptError.message);
      setStatus("");
      setTxStep("idle");
    }
  }, [approveReceiptError, txStep]);

  useEffect(() => {
    if (purchaseReceiptError && txStep === "purchasing") {
      setError("Purchase transaction failed: " + purchaseReceiptError.message);
      setStatus("");
      setTxStep("idle");
    }
  }, [purchaseReceiptError, txStep]);

  const executePurchase = useCallback(
    async (payload: PurchasePayload) => {
      if (!isConnected) {
        setError("Please connect your wallet first");
        return;
      }
      const { request, signature } = payload;
      if (!signature?.trim()) {
        setError("Signature is missing in payload");
        return;
      }
      const validationError = validatePurchaseRequest(request);
      if (validationError) {
        setError(validationError);
        return;
      }
      const totalPrice = calculateTotalPrice(request);
      setError("");
      setPendingPayload(payload);
      resetApprove();
      resetPurchase();
      setStatus("Checking allowance...");
      setTxStep("checking");
      const { data: latestAllowance } = await refetchAllowance();
      const allowance = latestAllowance ?? BigInt(0);
      if (allowance >= totalPrice) {
        setStatus(
          `Allowance sufficient (${formatTokenAmount(allowance)}). Executing purchase...`
        );
        const purchaseArgs = toContractPurchaseArgs(request);
        setTxStep("purchasing");
        writePurchase({
          address: config.nftStoreAddress,
          abi: NFT_STORE_ABI,
          functionName: "executePurchase",
          args: [purchaseArgs, signature as Hex],
          ...(config.skipSimulation ? { gas: GAS_LIMIT_PURCHASE } : {}),
        });
      } else {
        setStatus(
          `Current allowance: ${formatTokenAmount(allowance)}. Need: ${formatTokenAmount(totalPrice)}. Approving tokens...`
        );
        setTxStep("approving");
        writeApprove({
          address: config.tokenAddress,
          abi: erc20Abi,
          functionName: "approve",
          args: [config.nftStoreAddress, totalPrice],
          ...(config.skipSimulation ? { gas: GAS_LIMIT_APPROVE } : {}),
        });
      }
    },
    [
      isConnected,
      refetchAllowance,
      resetApprove,
      resetPurchase,
      config,
      writeApprove,
      writePurchase,
    ]
  );

  const resetState = useCallback(() => {
    setTxStep("idle");
    setStatus("");
    setError("");
    setPendingPayload(null);
    resetApprove();
    resetPurchase();
  }, [resetApprove, resetPurchase]);

  const isLoading =
    isApproving ||
    isPurchasing ||
    isApproveConfirming ||
    isPurchaseConfirming ||
    txStep !== "idle";

  const currentTxHash = purchaseTxHash ?? approveTxHash;

  return {
    txStep,
    status,
    error,
    isLoading,
    currentTxHash,
    currentAllowance,
    executePurchase,
    resetState,
  };
}

