import type {
  Erc1155TokensData,
  Erc1155TokensVariables,
  GraphQLResponse,
  MarketplaceQueryConfig,
} from "@/types/marketplace";
import axios from "axios";

const MARKETPLACE_GRAPHQL_URL =
  "https://marketplace-graphql.skymavis.com/graphql";

const DEFAULT_ERC1155_TOKENS_QUERY = `
  query GetERC1155TokensList(
    $tokenAddress: String
    $slug: String
    $criteria: [SearchCriteria!]
    $from: Int!
    $size: Int!
    $sort: SortBy
    $auctionType: AuctionType
    $name: String
    $rangeCriteria: [RangeSearchCriteria!]
    $owner: String
  ) {
    erc1155Tokens(
      tokenAddress: $tokenAddress
      slug: $slug
      criteria: $criteria
      from: $from
      size: $size
      sort: $sort
      auctionType: $auctionType
      name: $name
      rangeCriteria: $rangeCriteria
      owner: $owner
    ) {
      total
      results {
        tokenAddress
        tokenId
        name
        image
        minPrice
      }
    }
  }
`;

const DEFAULT_VARIABLES: Erc1155TokensVariables = {
  from: 0,
  size: 50,
  tokenAddress: "0xf6fe00893eea4d47f0cba303ef518fe4ab1c9dd6",
  sort: "IdDesc",
  auctionType: "Sale",
};

/**
 * Creates default marketplace query configuration
 */
export function createDefaultQueryConfig(): MarketplaceQueryConfig {
  return {
    query: DEFAULT_ERC1155_TOKENS_QUERY,
    variables: DEFAULT_VARIABLES,
    operationName: "GetERC1155TokensList",
  };
}

/**
 * Fetches ERC1155 tokens from the Skymavis marketplace GraphQL API
 */
export async function fetchErc1155Tokens(
  config: MarketplaceQueryConfig
): Promise<GraphQLResponse<Erc1155TokensData>> {
  const response = await axios.post<GraphQLResponse<Erc1155TokensData>>(
    MARKETPLACE_GRAPHQL_URL,
    {
      query: config.query,
      variables: config.variables,
      operationName: config.operationName,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

/**
 * Updates query variables while preserving other config
 */
export function updateQueryVariables(
  config: MarketplaceQueryConfig,
  updates: Partial<Erc1155TokensVariables>
): MarketplaceQueryConfig {
  return {
    ...config,
    variables: {
      ...config.variables,
      ...updates,
    },
  };
}
