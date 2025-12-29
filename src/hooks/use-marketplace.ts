"use client";

import {
  createDefaultQueryConfig,
  fetchErc1155Tokens,
  updateQueryVariables,
} from "@/lib/marketplace-api";
import type {
  Erc1155Token,
  Erc1155TokensVariables,
  MarketplaceQueryConfig,
} from "@/types/marketplace";
import { useCallback, useState } from "react";

interface UseMarketplaceResult {
  readonly tokens: ReadonlyArray<Erc1155Token>;
  readonly total: number;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly config: MarketplaceQueryConfig;
  readonly fetchTokens: () => Promise<void>;
  readonly updateVariables: (updates: Partial<Erc1155TokensVariables>) => void;
  readonly updateQuery: (query: string) => void;
  readonly resetConfig: () => void;
}

/**
 * Custom hook for fetching and managing marketplace tokens
 */
export function useMarketplace(): UseMarketplaceResult {
  const [config, setConfig] = useState<MarketplaceQueryConfig>(
    createDefaultQueryConfig()
  );
  const [tokens, setTokens] = useState<ReadonlyArray<Erc1155Token>>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchErc1155Tokens(config);
      if (response.errors && response.errors.length > 0) {
        setError(response.errors.map((e) => e.message).join(", "));
        return;
      }
      setTokens(response.data.erc1155Tokens.results);
      setTotal(response.data.erc1155Tokens.total);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch tokens";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  const updateVariables = useCallback(
    (updates: Partial<Erc1155TokensVariables>): void => {
      setConfig((prev) => updateQueryVariables(prev, updates));
    },
    []
  );

  const updateQuery = useCallback((query: string): void => {
    setConfig((prev) => ({ ...prev, query }));
  }, []);

  const resetConfig = useCallback((): void => {
    setConfig(createDefaultQueryConfig());
  }, []);

  return {
    tokens,
    total,
    isLoading,
    error,
    config,
    fetchTokens,
    updateVariables,
    updateQuery,
    resetConfig,
  };
}
