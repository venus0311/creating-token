import { http, createStorage, cookieStorage } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

// You must set NEXT_PUBLIC_PROJECT_ID in your .env file from WalletConnect Cloud
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "demo";

export const config = getDefaultConfig({
  appName: "TokenFi",
  projectId,
  chains: [mainnet, sepolia],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
}); 