/**
 * Types for Marketplace GraphQL API
 */

export interface Erc1155Token {
  readonly tokenAddress: string;
  readonly tokenId: string;
  readonly name: string;
  readonly image: string;
  readonly minPrice: string | null;
}

export interface Erc1155TokensResponse {
  readonly total: number;
  readonly results: ReadonlyArray<Erc1155Token>;
}

export interface GraphQLResponse<T> {
  readonly data: T;
  readonly errors?: ReadonlyArray<GraphQLError>;
}

export interface GraphQLError {
  readonly message: string;
  readonly locations?: ReadonlyArray<{ line: number; column: number }>;
  readonly path?: ReadonlyArray<string | number>;
}

export interface Erc1155TokensData {
  readonly erc1155Tokens: Erc1155TokensResponse;
}

export type SortBy =
  | "IdDesc"
  | "IdAsc"
  | "PriceDesc"
  | "PriceAsc"
  | "Latest"
  | "ListingDateDesc"
  | "ListingDateAsc";

export type AuctionType = "Sale" | "Auction" | "NotForSale" | "All";

export interface SearchCriteria {
  readonly name: string;
  readonly values: ReadonlyArray<string>;
}

export interface RangeSearchCriteria {
  readonly name: string;
  readonly range: {
    readonly from?: number;
    readonly to?: number;
  };
}

export interface Erc1155TokensVariables {
  readonly tokenAddress?: string;
  readonly slug?: string;
  readonly criteria?: ReadonlyArray<SearchCriteria>;
  readonly from: number;
  readonly size: number;
  readonly sort?: SortBy;
  readonly auctionType?: AuctionType;
  readonly name?: string;
  readonly rangeCriteria?: ReadonlyArray<RangeSearchCriteria>;
  readonly owner?: string;
}

export interface MarketplaceQueryConfig {
  readonly query: string;
  readonly variables: Erc1155TokensVariables;
  readonly operationName: string;
}
