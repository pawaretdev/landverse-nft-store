import { TOKEN_DECIMALS } from "@/constants/contracts";

/**
 * Formats a token amount from wei to human-readable format
 */
export function formatTokenAmount(amount: bigint): string {
  const divisor = Math.pow(10, TOKEN_DECIMALS);
  const formatted = Number(amount) / divisor;
  return formatted.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

/**
 * Truncates an address for display
 */
export function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

