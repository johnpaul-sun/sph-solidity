import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider; // Replace 'any' with the appropriate type for ethereum
  }
}
