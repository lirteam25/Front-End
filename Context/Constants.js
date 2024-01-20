import nftMint from "./NFTMintUpgradable.json";

export const NFTMintABI = nftMint.abi;

const NFTMintSampleAddressNormCase = " ";
const NFTMintSampleAddressNormCase_DEV = "0x9df5f32ebb7009fc329a3636ff13ac706bf1557b";
export const NFTMintSampleAddress = process.env.NODE_ENV == "production" ? NFTMintSampleAddressNormCase : NFTMintSampleAddressNormCase_DEV;

import nftMarketplace from "./NFTMarketplaceUpgradable.json";

const NFTMarketplaceAddressNormCase = "0xBa7FB0f905dFC69bD144C6Cc2E763D28f62eFc4e";
const NFTMarketplaceAddressNormCase_DEV = "0x5f5f41df03c52c47067543c5534800204ad0a634";
export const NFTMarketplaceAddress = process.env.NODE_ENV == "production" ? NFTMarketplaceAddressNormCase.toLowerCase() : NFTMarketplaceAddressNormCase_DEV.toLocaleLowerCase();
export const NFTMarketplaceABI = nftMarketplace.abi;

import nftMintFactory from "./NFTMintFactory.json";

export const NFTMintFactoryABI = nftMintFactory.abi;
const NFTMintFactoryNormCase = " ";
const NFTMintFactoryNormCase_DEV = "0x952505E7B231a8cE6016c2140c00D8EA43d6415A";
export const NFTMintFactoryAddress = process.env.NODE_ENV == "production" ? NFTMintFactoryNormCase : NFTMintFactoryNormCase_DEV;
