//NFTMarketplace
import oldNftMarketplace from "./NFTMarketplaceUpgradableV2.json";

const NFTMarketplaceAddressNormCase = "0xBa7FB0f905dFC69bD144C6Cc2E763D28f62eFc4e";
const NFTMarketplaceAddressNormCase_DEV = "0x79b046BaEaBCeea366365B617E0086225F1d9873";
export const NFTMarketplaceAddress = process.env.NODE_ENV == "polygon" ? NFTMarketplaceAddressNormCase : NFTMarketplaceAddressNormCase_DEV;

const NFTMarketplaceContractId = null;
const NFTMarketplaceContractId_DEV = "8e78cdd7-e70f-44cb-b46b-17f1c839243f"
export const NFTMarketplaceAddressContractId = process.env.NODE_ENV == "polygon" ? NFTMarketplaceContractId : NFTMarketplaceContractId_DEV;

const OldMarketplaceContractAddress = "0xBa7FB0f905dFC69bD144C6Cc2E763D28f62eFc4e";
const OldMarketplaceContractAddress_DEV = "0x014e12408911830d31a7846593f937b66b2caa46";
export const OldNFTMarketplaceAddress = process.env.NODE_ENV == "polygon" ? OldMarketplaceContractAddress : OldMarketplaceContractAddress_DEV;
export const OldNFTMarketplaceABI = oldNftMarketplace.abi

//Marketplace Owner
export const MarketplaceOwner = "0x2d90fc78ad933717Bc4a31097fd845C478F9B204"

import EditionDrop from "./EditionDrop.json";
export const editionDropABI = EditionDrop.abi