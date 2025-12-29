"use client";

import { useEffect, useState, type JSX } from "react";
import { Search, RefreshCw, Settings, X, ChevronDown } from "lucide-react";
import { useMarketplace } from "@/hooks/use-marketplace";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AuctionType, SortBy } from "@/types/marketplace";

interface TokenCardProps {
  readonly tokenAddress: string;
  readonly tokenId: string;
  readonly name: string;
  readonly image: string;
  readonly minPrice: string | null;
}

function TokenCard({
  tokenId,
  name,
  image,
  minPrice,
}: TokenCardProps): JSX.Element {
  const formatPrice = (price: string | null): string => {
    if (!price) return "Not for sale";
    const priceInEth = parseFloat(price) / 1e18;
    return `${priceInEth.toFixed(4)} RON`;
  };

  return (
    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 border border-zinc-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
      <div className="aspect-square overflow-hidden bg-zinc-900">
        {image ? (
          <img
            src={image}
            alt={name || `Token #${tokenId}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            <span className="text-4xl">🖼️</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white truncate mb-1">
          {name || `Token #${tokenId}`}
        </h3>
        <p className="text-xs text-zinc-500 mb-2">ID: {tokenId}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-cyan-400">
            {formatPrice(minPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}

interface QueryEditorProps {
  readonly query: string;
  readonly variablesJson: string;
  readonly onQueryChange: (query: string) => void;
  readonly onVariablesChange: (variables: string) => void;
  readonly onClose: () => void;
  readonly onApply: () => void;
  readonly parseError: string | null;
}

function QueryEditor({
  query,
  variablesJson,
  onQueryChange,
  onVariablesChange,
  onClose,
  onApply,
  parseError,
}: QueryEditorProps): JSX.Element {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
          <h2 className="text-xl font-bold text-cyan-400">Edit GraphQL Query</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              GraphQL Query
            </label>
            <textarea
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="w-full h-64 bg-zinc-800 border border-zinc-700 rounded-lg p-3 font-mono text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
              spellCheck={false}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Variables (JSON)
            </label>
            <textarea
              value={variablesJson}
              onChange={(e) => onVariablesChange(e.target.value)}
              className="w-full h-40 bg-zinc-800 border border-zinc-700 rounded-lg p-3 font-mono text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
              spellCheck={false}
            />
            {parseError && (
              <p className="mt-2 text-sm text-red-400">{parseError}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-zinc-700">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onApply}>Apply & Fetch</Button>
        </div>
      </div>
    </div>
  );
}

export function MarketplacePage(): JSX.Element {
  const marketplace = useMarketplace();
  const [searchName, setSearchName] = useState<string>("");
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editQuery, setEditQuery] = useState<string>("");
  const [editVariables, setEditVariables] = useState<string>("");
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    marketplace.fetchTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (): void => {
    marketplace.updateVariables({
      name: searchName || undefined,
      from: 0,
    });
    marketplace.fetchTokens();
  };

  const handleSortChange = (sort: SortBy): void => {
    marketplace.updateVariables({ sort, from: 0 });
    marketplace.fetchTokens();
  };

  const handleAuctionTypeChange = (auctionType: AuctionType): void => {
    marketplace.updateVariables({ auctionType, from: 0 });
    marketplace.fetchTokens();
  };

  const handleOpenEditor = (): void => {
    setEditQuery(marketplace.config.query);
    setEditVariables(JSON.stringify(marketplace.config.variables, null, 2));
    setParseError(null);
    setIsEditorOpen(true);
  };

  const handleApplyQuery = (): void => {
    try {
      const parsedVariables = JSON.parse(editVariables);
      marketplace.updateQuery(editQuery);
      marketplace.updateVariables(parsedVariables);
      setIsEditorOpen(false);
      setParseError(null);
      setTimeout(() => marketplace.fetchTokens(), 0);
    } catch {
      setParseError("Invalid JSON in variables");
    }
  };

  const handleLoadMore = (): void => {
    const currentFrom = marketplace.config.variables.from;
    const size = marketplace.config.variables.size;
    marketplace.updateVariables({ from: currentFrom + size });
    marketplace.fetchTokens();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                NFT Marketplace
              </h1>
              <p className="text-zinc-500 text-sm mt-1">
                Explore and discover unique digital assets
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={handleOpenEditor}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Edit Query
              </Button>
              <Button
                onClick={() => marketplace.fetchTokens()}
                disabled={marketplace.isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${marketplace.isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="flex-1 min-w-[200px] max-w-md">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search by name..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                </div>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={marketplace.config.variables.sort || "IdDesc"}
                  onChange={(e) => handleSortChange(e.target.value as SortBy)}
                  className="appearance-none bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
                >
                  <option value="IdDesc">ID (Newest)</option>
                  <option value="IdAsc">ID (Oldest)</option>
                  <option value="PriceDesc">Price (High to Low)</option>
                  <option value="PriceAsc">Price (Low to High)</option>
                  <option value="Latest">Latest</option>
                  <option value="ListingDateDesc">Listed (Recent)</option>
                  <option value="ListingDateAsc">Listed (Oldest)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>

              {/* Auction Type */}
              <div className="relative">
                <select
                  value={marketplace.config.variables.auctionType || "Sale"}
                  onChange={(e) =>
                    handleAuctionTypeChange(e.target.value as AuctionType)
                  }
                  className="appearance-none bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
                >
                  <option value="Sale">For Sale</option>
                  <option value="Auction">Auction</option>
                  <option value="NotForSale">Not For Sale</option>
                  <option value="All">All</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>

              <Button onClick={handleSearch}>Search</Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-zinc-400">
            Showing{" "}
            <span className="text-white font-medium">
              {marketplace.tokens.length}
            </span>{" "}
            of <span className="text-white font-medium">{marketplace.total}</span>{" "}
            tokens
          </p>
          <p className="text-zinc-500 text-sm">
            Token Address:{" "}
            <code className="bg-zinc-800 px-2 py-1 rounded text-xs">
              {marketplace.config.variables.tokenAddress}
            </code>
          </p>
        </div>

        {/* Error State */}
        {marketplace.error && (
          <Card className="mb-8 border-red-500/50">
            <CardHeader className="text-red-400">Error</CardHeader>
            <CardContent>
              <p className="text-red-300">{marketplace.error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {marketplace.isLoading && marketplace.tokens.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
              <p className="text-zinc-400">Loading tokens...</p>
            </div>
          </div>
        )}

        {/* Token Grid */}
        {marketplace.tokens.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {marketplace.tokens.map((token) => (
              <TokenCard
                key={`${token.tokenAddress}-${token.tokenId}`}
                tokenAddress={token.tokenAddress}
                tokenId={token.tokenId}
                name={token.name}
                image={token.image}
                minPrice={token.minPrice}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!marketplace.isLoading && marketplace.tokens.length === 0 && !marketplace.error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-zinc-300 mb-2">
              No tokens found
            </h3>
            <p className="text-zinc-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Load More */}
        {marketplace.tokens.length > 0 &&
          marketplace.tokens.length < marketplace.total && (
            <div className="flex justify-center mt-10">
              <Button
                variant="secondary"
                onClick={handleLoadMore}
                disabled={marketplace.isLoading}
                className="px-8"
              >
                {marketplace.isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
      </main>

      {/* Query Editor Modal */}
      {isEditorOpen && (
        <QueryEditor
          query={editQuery}
          variablesJson={editVariables}
          onQueryChange={setEditQuery}
          onVariablesChange={setEditVariables}
          onClose={() => setIsEditorOpen(false)}
          onApply={handleApplyQuery}
          parseError={parseError}
        />
      )}
    </div>
  );
}

