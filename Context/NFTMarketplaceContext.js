import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";

import axios from "axios";
import { getAnalytics, logEvent } from "firebase/analytics";

import { prepareContractCall, createThirdwebClient, resolveMethod, encode, NATIVE_TOKEN_ADDRESS, getContract, sendAndConfirmTransaction } from "thirdweb";
import { useActiveAccount, useActiveWallet, useDisconnect } from "thirdweb/react";
import { createAuth, signLoginPayload } from 'thirdweb/auth';
import { polygon, polygonAmoy } from "thirdweb/chains";
import { nextTokenIdToMint, setClaimConditions, lazyMint, uri, claimTo, cancelListing, getActiveClaimCondition } from "thirdweb/extensions/erc1155";
import { getListing, updateListing, createListing } from "thirdweb/extensions/marketplace";
import { deployERC1155Contract } from "thirdweb/deploys";
import { name, symbol } from "thirdweb/extensions/common";
import { approve } from "thirdweb/extensions/erc20";

import { getAuth, signInWithCustomToken, onAuthStateChanged, signOut, updateProfile, deleteUser } from "firebase/auth";

import * as LitJsSdk from "@lit-protocol/lit-node-client";
const FormData = require('form-data');
//Internal Imports
import { editionDropABI, MarketplaceOwner } from "./Constants";
import { FaPowerOff } from "react-icons/fa";

//The following two are repetitive functionalities.
//Fetch contrant find the contract.
const fetchContract = (ContractAddress, ContractABI, signerOrProvider) =>
    new ethers.Contract(
        ContractAddress,
        ContractABI,
        signerOrProvider
    );

const postOnDB = async (url, data = {}, token) => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + token,
        },
        body: data
    });
    return response.json()
}

const getFromDB = async (url, token) => {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + token,
        }
    });
    return response.json();
}

const patchOnDB = async (url, data = {}, token) => {
    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + token,
        },
        body: data
    });
    return response.json();

}

const deleteOnDB = async (url, token) => {
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + token,
        }
    });
    return response.json();
}

//Creates a Context object. 
//When React renders a component that subscribes to this Context object it will read the current context value from the closest matching Provider above it in the tree.
export const NFTMarketplaceContext = React.createContext();


const auth = createAuth({
    domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
});

// whatever data we are goin to pass inside here it will be available to the entire application. (we connected in _app.js)
export const NFTMarketplaceProvider = ({ children }) => {
    const DBUrl = process.env.DB_URL;

    // Open Error
    const [error, setError] = useState("");
    const [openError, setOpenError] = useState(false);

    // Open Error Auth
    const [errorAuth, setErrorAuth] = useState("");
    const [openErrorAuth, setOpenErrorAuth] = useState(false);

    //Open Loading Page
    const [loading, setLoading] = useState("");
    const [openLoading, setOpenLoading] = useState(false);

    //Open FooterAudioPlayer
    const [openFooterAudio, setOpenFooterAudio] = useState(false);
    const [nft, setNft] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [stopFooter, setStopFooter] = useState(false);
    const [stopAudioPlayer, setStopAudioPlayer] = useState(true);
    const [openUsername, setOpenUsername] = useState(false);

    //We want to get the address of the wallet of who interact with the smart contract

    const router = useRouter();

    const account = useActiveAccount();
    const activeWallet = useActiveWallet();
    const { disconnect } = useDisconnect();
    const address = account?.address;

    const client = createThirdwebClient({
        clientId: process.env.THIRDWEB_PROJECT_ID,
    });

    const chain = process.env.ACTIVE_CHAIN == "polygon" ? polygon : polygonAmoy;
    const USDCAddress = process.env.ACTIVE_CHAIN == "polygon" ? "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" : "0x14196f08a4fa0b66b7331bc40dd6bcd8a1deea9f"

    const contractUSDC = getContract({
        client,
        chain,
        address: USDCAddress
    })

    const connectingwithSmartContractOwner = async (ContractAddress, ContractABI) => {
        try {
            const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_RPC_MAINNET);
            const owner_privateKey = process.env.OWNER_PRIVATE_KEY;
            const signer = new ethers.Wallet(owner_privateKey, provider);
            const contract = fetchContract(ContractAddress, ContractABI, signer);
            const gasPrice = (await provider.getFeeData()).gasPrice;
            return [contract, gasPrice];
        } catch (error) {
            console.log(error);
            handleMetaMaskErrors(error, "Something went wrong while connecting with the smart contract. <br/>Please try again. If the error persist contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR_connect_contract")
        }
    };

    const handleMetaMaskErrors = (error, string, event) => {
        console.log(error);
        setOpenLoading(false);
        setOpenError(true); setError(`${string}`);
        const analytics = getAnalytics();
        logEvent(analytics, `${event}`);
    }

    // Upload image to IPFS function. The input is a file (audio). 
    const pinFileToIPFS = async (file, artist) => {
        const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

        //making axios POST request to Pinata
        let data = new FormData();
        data.append(`file`, file);

        const metadata = JSON.stringify({
            name: `${file.path}`,
            keyvalues: {
                ArtistID: `${artist}`
            },
        });
        data.append('pinataMetadata', metadata);

        const pinataOptions = JSON.stringify({
            cidversion: 0,
        });
        data.append('pinataOptions', pinataOptions);

        return axios
            .post(url, data, {
                maxBodyLength: 'Infinity',
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    pinata_api_key: process.env.PINATA_API_KEY,
                    pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
                }
            })
            .then(function (response) {
                console.log("file uploaded", response.data.IpfsHash);
                const pinataURL = "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash;
                return (
                    pinataURL
                );
            })
            .catch(function (error) {
                console.log(error);
                return {
                    message: error.message,
                }
            })
    };

    const pinAndEncryptFileToIPFS = async (fileToUpload, contractAddress, artistName, id, nftMintArtistContract) => {
        try {
            const tokenId = process.env.ACTIVE_CHAIN == "polygon" ? (await nextTokenIdToMint({ contract: nftMintArtistContract })).toString() : '0';

            // Instead of just sending the file to our /api/files endoint we're going to encrypt it first
            // Start by creating a new LitNodeClient
            const litNodeClient = new LitJsSdk.LitNodeClient({
                litNetwork: 'cayenne',
            });
            // then get the authSig
            await litNodeClient.connect();
            const signurature = await createPayload();
            /* const authSig = await LitJsSdk.checkAndSignAuthMessage({
                chain: process.env.ACTIVE_CHAIN == "polygon" ? "polygon" : "sepolia",
                nonce: ''
            }); */
            console.log(signurature);
            const authSig = signurature;
            // Here we can setup any access control conditions we want, such as must hold a specifc NFT, or have a certain amount of ETH
            // Right now its blank so anyone can decrypt the file
            const accs = [
                {
                    contractAddress: process.env.ACTIVE_CHAIN == "polygon" ? contractAddress : "0xc9Ded40852af6957a226b37FccA2DDA12E452d9D", //contractAddress,
                    standardContractType: 'ERC1155',
                    chain: process.env.ACTIVE_CHAIN == "polygon" ? "polygon" : "sepolia",
                    method: 'balanceOf',
                    parameters: [':userAddress', tokenId],
                    returnValueTest: {
                        comparator: '>',
                        value: '0',
                    },
                },
            ];
            // Then we use our access controls and authSig to encrypt the file and zip it up with the metadata
            const encryptedZip = await LitJsSdk.encryptFileAndZipWithMetadata({
                accessControlConditions: accs,
                authSig,
                chain: process.env.ACTIVE_CHAIN == "polygon" ? "polygon" : "sepolia",
                file: fileToUpload,
                litNodeClient: litNodeClient,
                readme: "Use IPFS CID of this file to decrypt it"
            });

            console.log(encryptedZip);

            // Then we turn it into a file that will be accepted by the Pinata API
            const encryptedBlob = new Blob([encryptedZip], { type: 'text/plain' })
            const encryptedFile = new File([encryptedBlob], fileToUpload.name)

            // Finally we upload the file by passing it to our /api/files endpoint
            // Keep in mind this works for smaller files and you may need to do a presigned JWT and upload from the client if you're dealing with larger files
            // Read more about that here: https://www.pinata.cloud/blog/how-to-upload-to-ipfs-from-the-frontend-with-signed-jwts
            const formData = new FormData();
            const name = artistName + " - " + encryptedFile.name
            const metadata = JSON.stringify({
                name: `${name}`
            });
            console.log(name)
            formData.append("file", encryptedFile, { filename: name });
            formData.append("pinataMetadata", metadata);

            const res = await fetch(
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                {
                    method: "POST",
                    headers: {
                        pinata_api_key: process.env.PINATA_API_KEY,
                        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
                    },
                    body: formData,
                }
            );
            const ipfsHash = await res.text();
            console.log(ipfsHash)
            return ipfsHash
        } catch (e) {
            console.log(e);
        }

    };

    const decryptFile = async (fileToDecrypt) => {
        try {
            // First we fetch the file from IPFS using the CID and our Gateway URL, then turn it into a blob
            console.log("Fetching the file...")
            const fileRes = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${fileToDecrypt}?pinataGatewayToken=${process.env.PINATA_GATEWAY_TOKEN}`)
            const file = await fileRes.blob()
            // We recreated the litNodeClient and the authSig
            console.log('Starting the client...')
            const litNodeClient = new LitJsSdk.LitNodeClient({
                litNetwork: 'cayenne',
            });
            await litNodeClient.connect();
            const authSig = await LitJsSdk.checkAndSignAuthMessage({
                chain: process.env.ACTIVE_CHAIN == "polygon" ? "polygon" : "sepolia",
            });
            console.log("Decryption starts...")
            // Then we simpyl extract the file and metadata from the zip
            // We could do more with this, like try to display it in the app UI if we wanted to
            const { decryptedFile, metadata } = await LitJsSdk.decryptZipFileWithMetadata({
                file: file,
                litNodeClient: litNodeClient,
                authSig: authSig,
            })
            console.log("Download...")
            // After we have our dcypted file we can download it
            const blob = new Blob([decryptedFile], { type: 'application/octet-stream' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = metadata.name;  // Use the metadata to get the file name and type
            downloadLink.click();

        } catch (error) {
            alert("Trouble decrypting file")
            console.log(error)
        }

    };

    const cloudinaryUploadVideo = async (file, artist) => {
        try {
            const data = new FormData();
            data.append("file", file[0]);
            if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
                data.append("upload_preset", "my-uploads");
            } else {
                data.append("upload_preset", "test_uploads");
            }
            data.append("folder", artist);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
                {
                    method: "POST",
                    body: data,
                }
            ).then((r) => r.json());

            return response;
        } catch (error) {
            console.error("Error uploading video:", error);
            throw error;
        }
    };

    const cloudinaryUploadImage = async (file, artist) => {
        try {
            const data = new FormData();
            data.append("file", file[0]);
            if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
                data.append("upload_preset", "my-uploads");
            } else {
                data.append("upload_preset", "test_uploads");
            }
            data.append("folder", artist);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: data,
                }
            ).then((r) => r.json());

            console.log("Upload response:", response); // Log response for debugging

            return response;
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
        }
    }

    async function createEditionDrop(nameToken, symbolToken, royalties, user) {
        try {
            setLoading("The smart contract creating procedure has started. Accept the transaction."); setOpenLoading(true);

            const defaultAdmin = address;
            const description = "Smart Contract Representing Unpublished Musical Content"
            const name = nameToken;
            const symbol = symbolToken;

            const contractURI = { "artist name": user.artist_name, "artist description": user.artist_description };

            const trustedForwarders = [];
            const saleRecipient = address;
            const royaltyRecipient = address;
            const royaltyBps = royalties * 100;
            const platformFeeBps = user.artist_first_sale_fee * 100;
            const platformFeeRecipient = MarketplaceOwner;

            console.log(defaultAdmin, name, symbol, contractURI, trustedForwarders, saleRecipient, royaltyRecipient, royaltyBps, platformFeeBps, platformFeeRecipient)

            const contractAddress = (await deployERC1155Contract({
                chain,
                client,
                account,
                type: "DropERC1155",
                params: {
                    contractURI,
                    defaultAdmin,
                    description,
                    name,
                    platformFeeBps,
                    platformFeeRecipient,
                    royaltyBps,
                    royaltyRecipient,
                    saleRecipient,
                    symbol,
                    trustedForwarders
                }
            }));

            console.log(contractAddress);

            /* const dataEnablingContractForPayments = JSON.stringify({ "chain": process.env.ACTIVE_CHAIN == "mumbai" ? "Amoy" : "Polygon", "contractAddress": BeaconProxyAddress, "contractType": "THIRDWEB", "contractDefinition": EditionDropABI });
    
            console.log(dataEnablingContractForPayments);
            const post = async (url, data = {}, token) => {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'x-secret-key': token,
                    },
                    body: data
                });
                return response.json()
            }
    
            const final = await post("https://payments.thirdweb.com/api/2022-08-12/register-contract", dataEnablingContractForPayments, process.env.THIRDWEB_API_KEY);
    
            console.log(final);
            const contract_id = final.contractId
            console.log(contract_id); */

            const accessToken = (await fetchUserInformation()).accessToken;
            const data = JSON.stringify({ "artist_minting_contract": contractAddress, "artist_royalties": royalties/* , contract_id  */ });
            await patchOnDB(`${DBUrl}/api/v1/users/updateMe`, data, accessToken)
                .then((response) => {
                    console.log(response);
                    setOpenLoading(false);
                });

            setOpenLoading(false);
            setToast("Smart Contract successfully created");
            setOpenToast(true);
            window.location.reload()
        } catch (error) {
            console.error("Transaction error", error);
            handleMetaMaskErrors(error, "Something went wrong. Please try again.<br/>Check if you have enough funds. If the error persist contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR_smartContract_interaction")
        }
    }

    async function createNFT(
        contractEditionDrop, artist, song, formInputPrice, audioPinata, imageSongPinata, description, supply, launch_date) {


        setLoading("The tokens creation procedure has started. Accept the transaction."); setOpenLoading(true);

        console.log(contractEditionDrop);
        const nextTokenId = await nextTokenIdToMint({ contract: contractEditionDrop })
        console.log(nextTokenId);

        const lazyMintTransaction = lazyMint({
            contract: contractEditionDrop,
            nfts: [{ name: song, artist, description, image: imageSongPinata, audio: audioPinata }]
        });
        console.log(lazyMintTransaction);
        let txLazyMintEncoded = await encode(lazyMintTransaction);

        const startingTime = launch_date ? launch_date : new Date();
        let phase = {
            startTime: startingTime,
            currencyAddress: USDCAddress,
            price: formInputPrice, // public sale price
            maxClaimableSupply: supply,
        };

        if (formInputPrice == 0) {
            phase.maxClaimablePerWallet = 1;
        }
        console.log(phase);

        const claimConditionsTransaction = setClaimConditions({
            contract: contractEditionDrop,
            tokenId: nextTokenId,
            phases: [phase],
        });
        console.log(claimConditionsTransaction);
        let txClaimConditionEncoded = await encode(claimConditionsTransaction);

        return prepareContractCall({
            contract: contractEditionDrop,
            method: resolveMethod("multicall"),
            params: [[txLazyMintEncoded, txClaimConditionEncoded]]
        });
    }
    async function updateDBOnNFTCreation(contractEditionDrop, receipt, startPreview, audioCloudinary, royalties, supply, song, artist, author_address, collection_id, description, imageSongPinata, imageSongCloudinary, audioPinata, audioDuration, formInputPrice, launch_date) {
        try {
            const nextTokenId = await nextTokenIdToMint({ contract: contractEditionDrop });
            const token_id = parseInt(nextTokenId) - 1;
            const token_URI = await uri({ tokenId: token_id, contract: contractEditionDrop });

            const transactionHash = receipt.transactionHash;

            const token_address = contractEditionDrop.address;

            const token_symbol = await symbol({ contract: contractEditionDrop });
            const token_name = await name({ contract: contractEditionDrop })

            //Post NFTInfo document
            const endPreview = parseInt(startPreview) + 30;
            const audioPreview = `/du_30,so_${startPreview},eo_${endPreview}` + audioCloudinary;
            let dataTokenInfo;
            const accessToken = (await fetchUserInformation()).accessToken;
            if (launch_date) {
                dataTokenInfo = JSON.stringify({ token_id, token_address, "name": token_name, "symbol": token_symbol, author_address, royalties, supply, song, artist, description, imageSongPinata, imageSongCloudinary, audioPinata, audioCloudinary, audioPreview, audioDuration, collection_id, token_URI, "launch_price": formInputPrice, "launch_date": launch_date.toISOString() });
            } else {
                dataTokenInfo = JSON.stringify({ token_id, token_address, "name": token_name, "symbol": token_symbol, author_address, royalties, supply, song, artist, description, imageSongPinata, imageSongCloudinary, audioPinata, audioCloudinary, audioPreview, audioDuration, collection_id, token_URI, "launch_price": formInputPrice });
            }
            await postOnDB(`${DBUrl}/api/v1/nfts`, dataTokenInfo, accessToken).then((response) => {
                console.log("response:", response);
            });

            //Post Owners document
            /* const dataTokenOwner = JSON.stringify({ token_id, token_address, "owner_of": address, "amount": 0, "sellingQuantity": supply, "price": formInputPrice, date: new Date(), "isFirstSale": true });

            await postOnDB(`${DBUrl}/api/v1/owners`, dataTokenOwner, accessToken).then((response) => {
                console.log("response:", response);
            }); */

            //Post Transaction document
            const dataTransaction = JSON.stringify({ token_id, token_address, 'quantity': [supply], "transactions": [transactionHash], 'transactions_type': ["LAZY MINTING"], 'price': [formInputPrice] })
            await postOnDB(`${DBUrl}/api/v1/transactions`, dataTransaction, accessToken).then((response) => {
                console.log("response:", response);
            });

            const analytics = getAnalytics();
            logEvent(analytics, 'create');

            setOpenLoading(false);
            setToast("Tokens successfully created");
            setOpenToast(true);

            router.push("/collection");
        } catch (error) {
            handleMetaMaskErrors(error, "You successfully create tokens but something went wrong. <br/>Please contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR_NFT_creation");
        }
    }

    const SecondListing = async (NFTMarketplaceContract, nft, formInputPrice, amount) => {
        /* setOpenLoading(true); setLoading("The token listing producedure has started. Accept the transaction."); */
        console.log(NFTMarketplaceContract);
        let tx;
        const totalQuantity = parseInt(nft.sellingQuantity) + parseInt(amount);
        console.log(totalQuantity);
        if (nft.sellingQuantity && nft.sellingQuantity > 0) {
            const params = await getListing({ contract: NFTMarketplaceContract, listingId: nft.listing_id });
            console.log(params);
            const date = new Date(params.startTimeInSeconds * 1000);
            console.log(date);
            //Call updateListing
            const listing = {
                assetContractAddress: nft.token_address,
                tokenId: nft.token_id,
                currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                pricePerToken: formInputPrice,
                quantity: totalQuantity,
                isReservedListing: false,
                startTimestamp: date
            }
            tx = updateListing({ contract: NFTMarketplaceContract, listingId: nft.listing_id, listing });
            setLoading("Tokens are being listed.");

        } else {
            console.log("here");

            tx = createListing({
                contract: NFTMarketplaceContract,
                assetContractAddress: nft.token_address,
                tokenId: nft.token_id,
                quantity: amount,
                currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                pricePerToken: formInputPrice,
                startTimestamp: new Date(),
                isReservedListing: false
            });
            console.log(tx);
        }
        return tx;
    };
    async function updateDBOnSecondListing(receipt, nft, formInputPrice, amount, listing_id) {
        try {
            /*             //Update transaction history
                        const transactions = receipt.transactionHash;
                        const accessToken = (await fetchUserInformation()).accessToken;
                        const dataTransaction = JSON.stringify({ "token_id": nft.token_id, "token_address": nft.token_address, transactions, 'transactions_type': "LISTING", 'price': formInputPrice, 'quantity': amount });
                        await patchOnDB(
                            `${DBUrl}/api/v1/transactions/addTransaction`, dataTransaction, accessToken).then((response) => {
                                console.log(response);
                            });
                        //Update token Owners
                        const dataTokenOwner = JSON.stringify({ "token_id": nft.token_id, "token_address": nft.token_address, "owner_of": address, listing_id, "sellingQuantity": amount, "price": formInputPrice });
                        await patchOnDB(`${DBUrl}/api/v1/owners/nftRelisted`, dataTokenOwner, accessToken).then((response) => {
                            console.log(response);
                        }); */

            const analytics = getAnalytics();
            logEvent(analytics, 'secondary_listing');

            setOpenLoading(false);

            setToast("Token successfully listed");
            setOpenToast(true);
            router.push("/my-profile");
        } catch (error) {
            handleMetaMaskErrors(error, "You successfully list tokens but something went wrong. <br/>Please contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR_secondary_listing");
        }
    }

    //Fetch NFT related to discover page.
    const fetchDiscoverNFTs = async () => {
        const response = await getFromDB(`${DBUrl}/api/v1/owners/discoverItem`
        ).then((response) => { return response });
        console.log("discoverNFT:", response);
        console.log("discoverNFT:", response.data.discoverNFT);
        return response.data.discoverNFT;
    };

    //Given a Firebase accessToken returns NFT related to my items.
    const fetchMyNFTs = async () => {
        const accessToken = (await fetchUserInformation()).accessToken;
        const response = await getFromDB(`${DBUrl}/api/v1/nfts/ownersNFTInfo`, accessToken
        ).then((response) => { return response });
        console.log(response);
        return response?.data?.NFTInfoOwned;
    };

    //Given the owner _id returns the related item.
    const fetchNFTOwner = async (token_id, token_address, uid) => {
        const response = await getFromDB(`${DBUrl}/api/v1/nfts/ownersNFTInfo/${token_id}/${token_address}/${uid}`
        ).then((response) => { return response });
        return response.data.ownerNFTInfo;
    }

    //Given the token_id and token_address fetch all the listing
    const fetchSellingSameTokenNFT = async (token_id, token_address) => {
        const response = await getFromDB(`${DBUrl}/api/v1/owners/?token_id=${token_id}&token_address=${token_address}&sellingQuantity[gte]=1&sort=price`
        ).then((response) => { return response });
        return response.data.owners;
    };

    const fetchNFTOwners = async (token_id, token_address) => {
        const accessToken = (await fetchUserInformation()).accessToken;
        const myNFTs = await fetchMyNFTs(accessToken);
        const filteredNFTs = myNFTs.filter(nft => {
            return nft.token_id === token_id && nft.token_address === token_address;
        });
        console.log(filteredNFTs);
        return filteredNFTs;
    }

    //Given the artist wallet it returns the token created
    const fetchArtistNFT = async (wallet) => {
        const response = await getFromDB(`${DBUrl}/api/v1/owners/artistNFT?uid=${wallet}`
        ).then((response) => { return response });
        console.log(response);
        console.log(response.data.artNFT)
        return response?.data?.artNFT;
    };

    const fetchArtistName = async (wallet) => {
        const response = await getFromDB(`${DBUrl}/api/v1/users/artistName?uid=${wallet}`
        ).then((response) => { return response });
        console.log("Artist", response);
        return response.data;
    };

    const fetchTopCollectors = async () => {
        const response = await getFromDB(`${DBUrl}/api/v1/users/top10Collectors`
        ).then((response) => { return response });
        console.log("TopCollectors", response);
        return response.topCollectors;
    }

    const fetchSupporters = async (token_id, token_address) => {
        const response = await getFromDB(`${DBUrl}/api/v1/users/supporters/${token_id}/${token_address}`
        ).then((response) => { console.log(response); return response });
        return response.supporters;
    }

    const sendArtistForm = async (name, email, instagram, spotify, soundcloud, other) => {
        const data = JSON.stringify({ name, email, instagram, spotify, soundcloud, other })
        const response = await postOnDB(`${DBUrl}/api/v1/artistForm`, data).then((response) => { return response });
        console.log(response);
        setToast("Form successfully sent");
        setOpenToast(true);
    }

    async function claimNFT(contract, nft) {
        setOpenLoading(true); setLoading("The token buying procedure has started. Accept the transaction.");
        let tx;

        if (nft.isFirstSale) {
            const approveTx = approve({
                contract: contractUSDC,
                spender: contract.address,
                amount: nft.price
            })

            const transactionResult = await sendAndConfirmTransaction({ account, transaction: approveTx });
            transactionResult.wait();

            tx = claimTo({
                contract,
                to: address,
                tokenId: nft.token_id,
                quantity: 1,
            });
            console.log("transaction", tx);
        } else {
            tx = await buyFromListing({
                contract,
                listingId: nft.listing_id,
                quantity: 1,
                recipient: address,
            });
            console.log("transaction", tx);
        }
        return tx;
    };
    async function updateDBafterPurchase() {
        try {
            const analytics = getAnalytics();
            logEvent(analytics, 'purchase');

            setOpenLoading(false);
            setToast("Token successfully purchased");
            setOpenToast(true);
            router.push("/my-profile");
        } catch (error) {
            handleMetaMaskErrors(error, "You successfully bought the track but something went wrong. <br/>Please contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR_token_claim");
        }
    };
    async function afterPurchaseCreditCard() {
        try {
            const analytics = getAnalytics();
            logEvent(analytics, 'purchase');

            if (window.opener) {
                window.opener.location.href = '/my-profile';
                window.close();
            }
        } catch (error) {
            handleMetaMaskErrors(error, "You successfully bought the track but something went wrong. <br/>Please contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR_token_claim");
        }
    }

    const freeNFTTransfer = async (contract, nft) => {
        try {
            setOpenLoading(true); setLoading("The token is being transferred. Wait for the transaction to be completed. Do not refresh or close the page.")

            const [EditionDropContract, gasPrice] = await connectingwithSmartContractOwner(nft.token_address, editionDropABI);
            console.log(EditionDropContract, gasPrice);
            console.log(address, nft.token_id, nft.token_address, address);
            console.log(contract);
            const claimConditions = await getActiveClaimCondition({ contract, tokenId: nft.token_id });
            console.log(claimConditions);
            const allowlistProof = {
                proof: [claimConditions.merkleRoot],
                quantityLimitPerWallet: claimConditions.quantityLimitPerWallet,
                pricePerToken: claimConditions.pricePerToken,
                currency: claimConditions.currency
            };

            const transaction = await EditionDropContract.claim(address, nft.token_id, 1, USDCAddress, 0, allowlistProof, "0x", {
                gasPrice: gasPrice
            })

            console.log(transaction);
            const trans = await transaction.wait();
            console.log(trans);

            await updateDBafterPurchase(trans, nft, address);

        } catch (error) {
            handleMetaMaskErrors(error, "Something went wrong while transfering the token. <br/>Please try again. If the error persist contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR_retrieve");
        }
    }

    async function changeNFTPrice(contract, nft, formInputPrice) {
        setLoading("The change price procedure has started. Accept the transaction."); setOpenLoading(true);
        let tx;
        if (nft.isFirstSale) {
            tx = setClaimConditions({
                contract,
                tokenId: nft.token_id,
                phases: [
                    {
                        maxClaimableSupply: nft.supply,
                        currencyAddress: NATIVE_TOKEN_ADDRESS,
                        price: formInputPrice,
                        startTime: new Date(),
                    },
                ],
            });
        } else {
            const params = await getListing({ contract, listingId: nft.listing_id });
            const date = new Date(params.startTimeInSeconds * 1000);
            console.log(date);
            //Call updateListing
            const listing = {
                assetContractAddress: nft.token_address,
                tokenId: nft.token_id,
                currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                pricePerToken: formInputPrice,
                quantity: nft.sellingQuantity,
                isReservedListing: false,
                startTimestamp: date
            }
            tx = updateListing({ contract, listingId: nft.listing_id, listing });
        }
        return tx;
    };
    async function updateDBOnPriceChange(receipt, formInputPrice, nft) {
        try {
            const transactions = receipt.transactionHash;
            const accessToken = (await fetchUserInformation()).accessToken;
            const transactionData = JSON.stringify({ "token_id": nft.token_id, "token_address": nft.token_address, transactions, 'transactions_type': "PRICE CHANGE", "price": formInputPrice, 'quantity': nft.sellingQuantity });
            await patchOnDB(
                `${DBUrl}/api/v1/transactions/addTransaction`, transactionData, accessToken).then((response) => {
                    console.log(response);
                });
            //Update Owners selling price
            const data = JSON.stringify({ "token_id": nft.token_id, "token_address": nft.token_address, "owner_of": nft.owner_of, 'price': formInputPrice });
            await patchOnDB(`${DBUrl}/api/v1/owners/updatePrice`, data, accessToken).then((response) => {
                console.log(response);
            });

            const analytics = getAnalytics();
            logEvent(analytics, 'change_price');

            setOpenLoading(false);

            setToast("Price successfully modified");
            setOpenToast(true);
            router.push("/my-profile");
        } catch (error) {
            handleMetaMaskErrors(error, "You successfully changed the token price, but something went wrong. <br/>Please contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR_change_price");
        }
    };

    async function delistItem(NFTMarketplaceContract, nft, amount) {
        setOpenLoading(true); setLoading("The token delisting producedure has started. Accept the transaction.");
        let tx
        if (amount >= nft.sellingQuantity) {
            tx = cancelListing({
                contract: NFTMarketplaceContract,
                listingId: nft.listing_id
            });
            setLoading("The token is being delisted.");
        } else {
            const params = await getListing({ contract: NFTMarketplaceContract, listingId: nft.listing_id });
            const date = new Date(params.startTimeInSeconds * 1000);
            console.log(date);
            const newAmount = params.quantity - amount;
            //Call updateListing
            const listing = {
                assetContractAddress: nft.token_address,
                tokenId: nft.token_id,
                currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                pricePerToken: nft.price,
                quantity: newAmount,
                isReservedListing: false,
                startTimestamp: date
            }
            tx = updateListing({ contract, listingId: nft.listing_id, listing });
            setLoading("The price is being changed.");
        }
        return tx;
    };
    async function updateDBOnItemDelisting(receipt, nft, amount) {
        try {
            const transactions = receipt.transactionHash;
            //Update transaction hystory
            const accessToken = (await fetchUserInformation()).accessToken;
            const transactionData = JSON.stringify({ "token_id": nft.token_id, "token_address": nft.token_address, transactions, 'transactions_type': "DELISTING", "price": nft.price, 'quantity': amount });
            await patchOnDB(
                `${DBUrl}/api/v1/transactions/addTransaction`, transactionData, accessToken).then((response) => {
                    console.log(response);
                });

            //Update Owners selling quantity
            const data = JSON.stringify({ "token_id": nft.token_id, "token_address": nft.token_address, "owner_of": nft.owner_of, "amount": amount });
            await patchOnDB(`${DBUrl}/api/v1/owners/delistItems`, data, accessToken).then((response) => {
                console.log(response);
            });

            const analytics = getAnalytics();
            logEvent(analytics, 'delist');

            setOpenLoading(false);

            setToast("Tokens successfully delisted");
            setOpenToast(true);
            router.push("/my-profile");
        } catch (error) {
            handleMetaMaskErrors(error, "Tokens were delisted but something went wrong. <br/>Please contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR_token_delisting");
        }
    };

    //Function to handle Authentication Firebase Errors
    const handleAuthFirebaseError = (error, string) => {
        console.log(error);
        if (error.code) {
            const msg = error.code;
            const message = msg.replace("auth/", "").replaceAll("-", " ");
            const FirstCapitalLetter = message.charAt(0).toUpperCase() + message.slice(1);
            setOpenErrorAuth(true); setErrorAuth(FirstCapitalLetter);
        } else {
            setOpenErrorAuth(true); setErrorAuth(string);
        }
    }

    //Get who is currently connected
    const fetchUserInformation = () => {
        const auth = getAuth();
        return new Promise((resolve, reject) => {
            onAuthStateChanged(auth, async (user) => {
                resolve(user);
            });
        });
    };

    const disconnectUser = () => {
        router.push("/");
        disconnect(activeWallet);
        const auth = getAuth();
        signOut(auth).then(() => {
            setUser(null);
        })
            .catch((error) => {
                console.error(error);
            }
            );
    };

    //Given the Firebase token returns the saved DB user
    const userToWallet = async (accessToken) => {
        const response = await getFromDB(`${DBUrl}/api/v1/users/getMe`, accessToken);
        console.log(response.data.user);
        return response.data.user;
    };

    const updateUserDisplayName = async (display_name) => {
        const accessToken = (await fetchUserInformation()).accessToken;

        const data = JSON.stringify({ display_name });
        await patchOnDB(`${DBUrl}/api/v1/users/updateMe`, data, accessToken)
            .then((response) => {
                console.log(response);

                setToast("Informations successfully updated");
                setOpenToast(true);

                setOpenArtistSettings(false);
                setOpenUsername(false);
                setUserLogged();
            });
    };

    const updateUserInformations = async (artist_name, artist_email, artist_description, artist_instagram, artist_spotify, artist_soundcloud, artist_photo) => {
        const accessToken = (await fetchUserInformation()).accessToken;
        const dataObject = {
            artist_name,
            artist_email,
            artist_description,
            artist_instagram,
            artist_spotify,
            artist_soundcloud,
            artist_photo,
        };

        const data = JSON.stringify(dataObject);
        console.log(data);
        await patchOnDB(`${DBUrl}/api/v1/users/updateMe`, data, accessToken)
            .then((response) => {
                console.log(response);

                setToast("Informations successfully updated");
                setOpenToast(true);

                setOpenArtistSettings(false);
                setUserLogged();
            });
    }

    const deleteUsers = () => {
        const auth = getAuth();
        createPayload().then((signatureResult) => {
            signInOrUp(signatureResult).then((loggedInUser) => {
                deleteUser(loggedInUser).then(() => {

                    setToast("Account successfully deleted");
                    setOpenToast(true);
                    setOpenAccountSetting(false);
                    window.location.reload();
                })
                    .catch((error) => {
                        handleAuthFirebaseError(error, "Error re-authenticating user");
                    });
            });
        });
    }

    const fetchTransactionsInfo = async (token_id, token_address) => {
        const response = await getFromDB(`${DBUrl}/api/v1/transactions?token_id=${token_id}&token_address=${token_address}`);
        const transactions = response.data.transactions[0];
        return transactions;
    }

    const renderString = (inputString, maxLength) => {
        if (inputString.length <= maxLength) {
            return inputString;
        } else {
            const truncatedString = inputString.substring(0, maxLength);
            return `${truncatedString}`;
        }
    }

    const sendUserActivity = async (token_id, token_address, isPreview) => {
        const analytics = getAnalytics();
        logEvent(analytics, 'userListeningSong');
        const dataUserActivity = JSON.stringify({ token_id, token_address, "from_where": "web app", isPreview });
        if (user) {
            const response = await postOnDB(`${DBUrl}/api/v1/userListeningActivity`, dataUserActivity, user.accessToken);
            console.log("Prova", response);
        } else {
            const response = await postOnDB(`${DBUrl}/api/v1/userListeningActivity/anonymous`, dataUserActivity);
            console.log("Prova", response);
        }
    }

    const downloadSong = async () => {
        const analytics = getAnalytics();
        logEvent(analytics, 'download')
    }

    const [user, setUser] = useState(null);

    const [openAccountSetting, setOpenAccountSetting] = useState(false);
    const [openArtistSettings, setOpenArtistSettings] = useState(false);
    const [openArtistForm, setOpenArtistForm] = useState(false);

    const [openCreateItem, setOpenCreateItem] = useState(false);

    const [openToast, setOpenToast] = useState(false);
    const [toast, setToast] = useState(null);
    const [openNotification, setOpenNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState(null);
    const [notificationText, setNotificationText] = useState(null);

    async function createPayload() {
        const payload = await auth.generatePayload({ address: address, chainId: chain });
        const signatureResult = await signLoginPayload({ account, payload });
        console.log(signatureResult);
        return signatureResult
    }
    async function signInOrUp(signatureResult) {
        const data = JSON.stringify({ "payload": signatureResult });
        const response = await postOnDB(`${DBUrl}/api/v1/authToken`, data);
        console.log(response);
        const authFirebase = getAuth();
        const userCredential = await signInWithCustomToken(authFirebase, response.token);
        // On success, we have access to the user object.
        const userFirebase = userCredential.user;
        console.log(userFirebase);
        return userFirebase;
    }
    async function completeLogin() {
        createPayload().then((signatureResult) => {
            signInOrUp(signatureResult).then((loggedInUser) => {
                userToWallet(loggedInUser.accessToken).then((UserDB) => {
                    const userData = { ...loggedInUser, ...UserDB };
                    setUser(userData);
                    console.log("DB + Firebase:", userData);
                    console.log(UserDB.display_name);
                    checkIfHasDisplayName(userData);
                })
            });
        })
    }
    async function checkIfHasDisplayName(user) {
        if (!user.display_name) {
            setOpenUsername(true);
        }
    }

    async function setUserLogged() {
        fetchUserInformation().then((userFirebase) => {
            console.log("userFire: ", userFirebase)
            if (!userFirebase || userFirebase.uid != address) {
                completeLogin()
            } else {
                userToWallet(userFirebase.accessToken).then((UserDB) => {
                    const userData = { ...userFirebase, ...UserDB };
                    setUser(userData);
                    console.log("DB + Firebase:", userData);
                    checkIfHasDisplayName(userData)
                })
            }
        })
    }

    useEffect(() => {
        if (address) {
            console.log(address);
            setUserLogged();
        };
    }, [address])

    return (
        <NFTMarketplaceContext.Provider
            value={{
                handleMetaMaskErrors,
                error,
                setError,
                openError,
                setOpenError,
                errorAuth,
                setErrorAuth,
                openErrorAuth,
                setOpenErrorAuth,
                loading,
                setLoading,
                openLoading,
                setOpenLoading,
                openFooterAudio,
                setOpenFooterAudio,
                nft,
                setNft,
                currentIndex,
                setCurrentIndex,
                stopFooter,
                setStopFooter,
                user,
                stopAudioPlayer,
                setStopAudioPlayer,

                openAccountSetting,
                setOpenAccountSetting,
                openArtistSettings,
                setOpenArtistSettings,
                openArtistForm,
                setOpenArtistForm,

                openCreateItem, setOpenCreateItem,

                openToast, setOpenToast,
                toast, setToast,
                openNotification, setOpenNotification,
                notificationTitle, setNotificationTitle,
                notificationText, setNotificationText,
                openUsername, setOpenUsername,

                pinFileToIPFS,
                pinAndEncryptFileToIPFS,
                decryptFile,
                cloudinaryUploadVideo,
                cloudinaryUploadImage,

                createEditionDrop,

                createNFT,
                updateDBOnNFTCreation,

                SecondListing,
                updateDBOnSecondListing,

                fetchDiscoverNFTs,
                fetchMyNFTs,
                fetchNFTOwner,
                fetchSellingSameTokenNFT,
                fetchNFTOwners,
                fetchArtistNFT,
                fetchArtistName,
                fetchTopCollectors,
                fetchSupporters,
                sendArtistForm,
                claimNFT,
                freeNFTTransfer,
                updateDBafterPurchase,
                afterPurchaseCreditCard,

                changeNFTPrice,
                updateDBOnPriceChange,

                delistItem,
                updateDBOnItemDelisting,

                disconnectUser,

                updateUserDisplayName,
                updateUserInformations,
                deleteUsers,
                fetchTransactionsInfo,
                renderString,
                sendUserActivity,
                downloadSong,
                completeLogin
            }}
        >
            {children}
        </NFTMarketplaceContext.Provider>
    )
}
