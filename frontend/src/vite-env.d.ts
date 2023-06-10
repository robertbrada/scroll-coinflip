/// <reference types="vite/client" />

import { MetaMaskInpageProvider } from "@metamask/providers";

// make "ethereum" available globally on "window" object
declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}


