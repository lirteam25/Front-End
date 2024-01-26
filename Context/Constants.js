import nftMint from "./NFTMintUpgradable.json";

export const NFTMintABI = nftMint.abi;

const NFTMintSampleAddressNormCase = "0x1440e929fE5FfC51aa8e2E3f3eF4521fC412ADB2";
const NFTMintSampleAddressNormCase_DEV = "0x9df5f32ebb7009fc329a3636ff13ac706bf1557b";
export const NFTMintSampleAddress = process.env.NODE_ENV == "production" ? NFTMintSampleAddressNormCase : NFTMintSampleAddressNormCase_DEV;

import nftMarketplace from "./NFTMarketplaceUpgradableV2.json";

const NFTMarketplaceAddressNormCase = "0xBa7FB0f905dFC69bD144C6Cc2E763D28f62eFc4e";
const NFTMarketplaceAddressNormCase_DEV = "0x2c783c72f46b1e6213a2cba0d92e9e3711b694ca";
export const NFTMarketplaceAddress = process.env.NODE_ENV == "production" ? NFTMarketplaceAddressNormCase.toLowerCase() : NFTMarketplaceAddressNormCase_DEV.toLocaleLowerCase();
export const NFTMarketplaceABI = nftMarketplace.abi;

import nftMintFactory from "./NFTMintFactory.json";

export const NFTMintFactoryABI = nftMintFactory.abi;
const NFTMintFactoryNormCase = "0x298f6262aEf444403b56Ca88b8bC74bcF1Cd6249";
const NFTMintFactoryNormCase_DEV = "0x952505E7B231a8cE6016c2140c00D8EA43d6415A";
export const NFTMintFactoryAddress = process.env.NODE_ENV == "production" ? NFTMintFactoryNormCase : NFTMintFactoryNormCase_DEV;
