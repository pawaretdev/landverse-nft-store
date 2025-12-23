import type { Address } from "viem";

export const NFT_STORE_ABI = [
  {
    name: "executePurchase",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "request",
        type: "tuple",
        components: [
          { name: "buyer", type: "address" },
          {
            name: "items",
            type: "tuple[]",
            components: [
              { name: "tokenId", type: "uint256" },
              { name: "quantity", type: "uint256" },
              { name: "price", type: "uint256" },
            ],
          },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
          { name: "orderId", type: "bytes32" },
        ],
      },
      { name: "signature", type: "bytes" },
    ],
    outputs: [],
  },
] as const;

export const DEFAULT_NFT_STORE_ADDRESS: Address =
  "0xef5801daea84ff3436881be6039084a907308114";

export const DEFAULT_TOKEN_ADDRESS: Address =
  "0xCb9d4e04E68b13CF6BDb428a317c9dB74A60551B";

export const DEFAULT_PAYLOAD_JSON = `{
  "request": {
    "buyer": "",
    "items": [
      { "tokenId": 1, "quantity": 1, "price": "0" }
    ],
    "nonce": 0,
    "deadline": 0,
    "orderId": "0x"
  },
  "signature": "0x"
}`;

export const GAS_LIMIT_APPROVE = BigInt(100000);
export const GAS_LIMIT_PURCHASE = BigInt(500000);
export const TOKEN_DECIMALS = 18;

