# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
npx hardhat run scripts/deploy.js --network localhost
npx hardhat run scripts/deploy.js --network polygon_mumbai

//To deploy another NFTMint contract
npx hardhat run scripts/deployNFTMint.js --network polygon_mumbai

//To update the contract that can interact with NFTMarketplace
npx hardhat run scripts/addNewContract.js --network polygon_mumbai "contractAddress"