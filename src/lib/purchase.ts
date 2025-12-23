import type { Address, Hex } from "viem";
import type {
  ContractPurchaseArgs,
  ParsedPayloadResult,
  PurchasePayload,
  PurchaseRequest,
} from "@/types/purchase";

/**
 * Parses and validates purchase payload JSON
 */
export function parsePurchasePayload(jsonString: string): ParsedPayloadResult {
  try {
    const data = JSON.parse(jsonString);
    if (data.request && data.signature) {
      return {
        isValid: true,
        payload: data as PurchasePayload,
        error: "",
      };
    }
    if (data.buyer && data.items) {
      return {
        isValid: false,
        payload: null,
        error: 'Please use format: { "request": {...}, "signature": "0x..." }',
      };
    }
    return {
      isValid: false,
      payload: null,
      error: "Invalid payload format",
    };
  } catch {
    return {
      isValid: false,
      payload: null,
      error: "Invalid JSON",
    };
  }
}

/**
 * Calculates total price from purchase request items
 */
export function calculateTotalPrice(request: PurchaseRequest | null): bigint {
  if (!request || !Array.isArray(request.items)) return BigInt(0);
  return request.items.reduce((sum, item) => {
    const price = BigInt(item.price);
    const quantity = BigInt(item.quantity);
    return sum + price * quantity;
  }, BigInt(0));
}

/**
 * Validates purchase request has all required fields
 */
export function validatePurchaseRequest(
  request: PurchaseRequest
): string | null {
  if (!request.buyer) {
    return "Buyer address is missing";
  }
  if (!request.orderId) {
    return "Order ID is missing";
  }
  if (!request.deadline) {
    return "Deadline is missing";
  }
  if (!Array.isArray(request.items) || request.items.length === 0) {
    return "Items are missing or empty";
  }
  const totalPrice = calculateTotalPrice(request);
  if (totalPrice <= BigInt(0)) {
    return "Total price must be greater than 0";
  }
  return null;
}

/**
 * Converts purchase request to contract-compatible arguments
 */
export function toContractPurchaseArgs(
  request: PurchaseRequest
): ContractPurchaseArgs {
  return {
    buyer: request.buyer as Address,
    items: request.items.map((item) => ({
      tokenId: BigInt(item.tokenId),
      quantity: BigInt(item.quantity),
      price: BigInt(item.price),
    })),
    nonce: BigInt(request.nonce),
    deadline: BigInt(request.deadline),
    orderId: request.orderId as Hex,
  };
}

