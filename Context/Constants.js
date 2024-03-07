import nftMint from "./NFTMintUpgradable.json";

export const NFTMintABI = nftMint.abi;

const NFTMintSampleAddressNormCase = "0x1440e929fE5FfC51aa8e2E3f3eF4521fC412ADB2";
const NFTMintSampleAddressNormCase_DEV = "0x7a3d52eba0477cfeaeb3742e13d89c6ba120fd5f";
export const NFTMintSampleAddress = process.env.NODE_ENV == "production" ? NFTMintSampleAddressNormCase : NFTMintSampleAddressNormCase_DEV;

import nftMarketplace from "./NFTMarketplaceUpgradableV2.json";

const NFTMarketplaceAddressNormCase = "0xBa7FB0f905dFC69bD144C6Cc2E763D28f62eFc4e";
const NFTMarketplaceAddressNormCase_DEV = "0x014e12408911830d31a7846593f937b66b2caa46";
export const NFTMarketplaceAddress = process.env.NODE_ENV == "production" ? NFTMarketplaceAddressNormCase.toLowerCase() : NFTMarketplaceAddressNormCase_DEV.toLocaleLowerCase();
export const NFTMarketplaceABI = nftMarketplace.abi;

import nftMintFactory from "./NFTMintFactory.json";

export const NFTMintFactoryABI = nftMintFactory.abi;
const NFTMintFactoryNormCase = "0x298f6262aEf444403b56Ca88b8bC74bcF1Cd6249";
const NFTMintFactoryNormCase_DEV = "0xC7A9074039C7ef74c8fb087dFA9546B4917510f7";
export const NFTMintFactoryAddress = process.env.NODE_ENV == "production" ? NFTMintFactoryNormCase : NFTMintFactoryNormCase_DEV;