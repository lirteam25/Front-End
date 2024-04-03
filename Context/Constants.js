import nftMint from "./NFTMintABIThirdWeb.json";

export const NFTMintABI = nftMint;

const NFTMintSampleAddressNormCase = "0x1440e929fE5FfC51aa8e2E3f3eF4521fC412ADB2";
const NFTMintSampleAddressNormCase_DEV = "0xCCf28A443e35F8bD982b8E8651bE9f6caFEd4672";
//0x7a3d52eba0477cfeaeb3742e13d89c6ba120fd5f
export const NFTMintSampleAddress = process.env.NODE_ENV == "production" ? NFTMintSampleAddressNormCase : NFTMintSampleAddressNormCase_DEV;

import nftMarketplace from "./NFTMarketplaceUpgradableV2.json";

const NFTMarketplaceAddressNormCase = "0xBa7FB0f905dFC69bD144C6Cc2E763D28f62eFc4e";
const NFTMarketplaceAddressNormCase_DEV = "0x0ab38Fa75C98721F0604dcc5E52D30D9C1a68459";
export const NFTMarketplaceAddress = process.env.NODE_ENV == "production" ? NFTMarketplaceAddressNormCase.toLowerCase() : NFTMarketplaceAddressNormCase_DEV.toLocaleLowerCase();
export const NFTMarketplaceABI = nftMarketplace.abi;

import nftMintFactory from "./NFTMintFactory.json";

export const NFTMintFactoryABI = nftMintFactory.abi;
const NFTMintFactoryNormCase = "0x298f6262aEf444403b56Ca88b8bC74bcF1Cd6249";
const NFTMintFactoryNormCase_DEV = "0xD41341856bBDB36aDEfDB6a08Ad9d3c523a8973E";
export const NFTMintFactoryAddress = process.env.NODE_ENV == "production" ? NFTMintFactoryNormCase : NFTMintFactoryNormCase_DEV;

export const MarketplaceOwner = "0x2d90fc78ad933717Bc4a31097fd845C478F9B204"