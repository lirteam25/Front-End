import nftMint from "./NFTMintUpgradable.json";

export const NFTMintABI = nftMint.abi;

import nftMarketplace from "./NFTMarketplaceUpgradable.json";

const NFTMarketplaceAddressNormCase = "0xBa7FB0f905dFC69bD144C6Cc2E763D28f62eFc4e";
export const NFTMarketplaceAddress = NFTMarketplaceAddressNormCase.toLowerCase();
export const NFTMarketplaceABI = nftMarketplace.abi;