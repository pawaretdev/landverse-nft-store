import type { Address, Hex } from "viem";

export interface PurchaseItem {
  readonly tokenId: number | string;
  readonly quantity: number | string;
  readonly price: number | string;
}

export interface PurchaseRequest {
  readonly buyer: string;
  readonly items: readonly PurchaseItem[];
  readonly nonce: number | string;
  readonly deadline: number | string;
  readonly orderId: string;
}

export interface PurchasePayload {
  readonly request: PurchaseRequest;
  readonly signature: string;
}

export interface ParsedPayloadResult {
  readonly isValid: boolean;
  readonly payload: PurchasePayload | null;
  readonly error: string;
}

export type TransactionStep = "idle" | "checking" | "approving" | "purchasing";

export interface ContractPurchaseArgs {
  readonly buyer: Address;
  readonly items: readonly {
    readonly tokenId: bigint;
    readonly quantity: bigint;
    readonly price: bigint;
  }[];
  readonly nonce: bigint;
  readonly deadline: bigint;
  readonly orderId: Hex;
}

export interface PurchaseConfig {
  readonly nftStoreAddress: Address;
  readonly tokenAddress: Address;
  readonly skipSimulation: boolean;
}
