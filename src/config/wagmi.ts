import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { defineChain } from "viem";

export const saigonTestnet = defineChain({
  id: 2021,
  name: "Saigon Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "RON",
    symbol: "RON",
  },
  rpcUrls: {
    default: {
      http: ["https://saigon-testnet.roninchain.com/rpc"],
    },
  },
  blockExplorers: {
    default: {
      name: "Saigon Explorer",
      url: "https://saigon-app.roninchain.com",
    },
  },
  testnet: true,
});

export const CHAIN_NAME = "Saigon Testnet";

export const wagmiConfig = createConfig({
  chains: [saigonTestnet],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [saigonTestnet.id]: http(),
  },
  ssr: true,
});
