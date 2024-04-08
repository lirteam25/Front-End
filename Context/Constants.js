//SAMPLE MINT
import editionDrop from "./EditionDrop.json";
export const EditionDropABI = editionDrop.abi;

const NFTMintSampleAddressNormCase = "0x1440e929fE5FfC51aa8e2E3f3eF4521fC412ADB2";
const NFTMintSampleAddressNormCase_DEV = "0xcf66168C58519C2E7aEAFCcfb0E67e72983ed15C";
export const NFTMintSampleAddress = process.env.NODE_ENV == "production" ? NFTMintSampleAddressNormCase : NFTMintSampleAddressNormCase_DEV;

//NFTMarketplace
import nftMarketplace from "./NFTMarketplaceUpgradableV2.json";

const NFTMarketplaceAddressNormCase = "0xBa7FB0f905dFC69bD144C6Cc2E763D28f62eFc4e";
const NFTMarketplaceAddressNormCase_DEV = "0x79b046BaEaBCeea366365B617E0086225F1d9873";
export const NFTMarketplaceAddress = process.env.NODE_ENV == "production" ? NFTMarketplaceAddressNormCase.toLowerCase() : NFTMarketplaceAddressNormCase_DEV.toLocaleLowerCase();

const NFTMarketplaceContractId = null;
const NFTMarketplaceContractId_DEV = "8e78cdd7-e70f-44cb-b46b-17f1c839243f"
export const NFTMarketplaceAddressContractId = process.env.NODE_ENV == "production" ? NFTMarketplaceContractId : NFTMarketplaceContractId_DEV;
export const NFTMarketplaceABI = nftMarketplace.abi;

//Factory Contract
import nftMintFactory from "./NFTMintFactory.json";

export const NFTMintFactoryABI = nftMintFactory.abi;
const NFTMintFactoryNormCase = "0x298f6262aEf444403b56Ca88b8bC74bcF1Cd6249";
const NFTMintFactoryNormCase_DEV = "0x6194880f5b2f24B4c5Ef4b6FF5c2498dc10B6d10";
export const NFTMintFactoryAddress = process.env.NODE_ENV == "production" ? NFTMintFactoryNormCase : NFTMintFactoryNormCase_DEV;

//Marketplace Owner
export const MarketplaceOwner = "0x2d90fc78ad933717Bc4a31097fd845C478F9B204"