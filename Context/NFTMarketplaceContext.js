import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import {
    useContract,
    NATIVE_TOKEN_ADDRESS
} from "@thirdweb-dev/react";
import axios from "axios";
import { getAnalytics, logEvent } from "firebase/analytics";
import { useAddress } from "@thirdweb-dev/react";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut, updateProfile, sendPasswordResetEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from "firebase/auth";
const FormData = require('form-data');
import {
    useConnect, metamaskWallet,
    coinbaseWallet,
    walletConnect,
    embeddedWallet
} from "@thirdweb-dev/react";

//Internal Imports
import { NFTMintABI, NFTMintSampleAddress, NFTMarketplaceAddress, NFTMarketplaceABI, MarketplaceOwner, NFTMintFactoryABI, NFTMintFactoryAddress } from "./Constants";

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

const walletConfig = [
    metamaskWallet(),
    coinbaseWallet(),
    walletConnect(),
    embeddedWallet()
];

//Creates a Context object. 
//When React renders a component that subscribes to this Context object it will read the current context value from the closest matching Provider above it in the tree.
export const NFTMarketplaceContext = React.createContext();


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

    //We want to get the address of the wallet of who interact with the smart contract

    const router = useRouter();

    const address = useAddress();
    const { data: NFTMintSample } = useContract(NFTMintSampleAddress);


    const connectingWithSmartContract = async (ContractAddress, ContractABI) => {
        try {
            const provider = new ethers.BrowserProvider(walletProvider);
            const signer = await provider.getSigner();
            const contract = fetchContract(ContractAddress, ContractABI, signer);
            console.log(contract);
            return contract;
        } catch (error) {
            console.log(error);
            handleMetaMaskErrors(error, "Something went wrong while connecting with the smart contract. <br/>Please try again. If the error persist contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR_connect_contract")
        }
    };

    const connectingwithSmartContractOwner = async (ContractAddress, ContractABI) => {
        try {
            const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_MAINNET);
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

    //Check if wallet is connected to the application
    const checkIfWalletConnected = async () => {
        try {
            if (address) { return address.toLocaleLowerCase() }
        } catch (error) {
            handleMetaMaskErrors(error, "Something went wrong while checking the wallet connected. <br/>Please try to refresh the page. If the error persist contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR_check_if_wallet_connected")
        }
    };

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

    const pinJSONToIPFS = async (JSONBody) => {
        const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
        //making axios POST request to Pinata
        return axios
            .post(url, JSONBody, {
                headers: {
                    pinata_api_key: process.env.PINATA_API_KEY,
                    pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
                }
            })
            .then(function (response) {
                const pinataURL = "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash;
                return (
                    pinataURL
                )
            })
    };

    const cloudinaryUploadVideo = async (file, artist) => {
        try {
            const data = new FormData();
            data.append("file", file[0]);
            if (process.env.NODE_ENV == "production") {
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
            if (process.env.NODE_ENV == "production") {
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

    async function withWalletCheck(fn) {
        const identification = await fetchUserInformation();
        const user = await userToWallet(identification.accessToken);
        if (address && user.wallet !== address.toLowerCase()) {
            setOpenLoading(false);
            setNotificationText(`The wallet connected ${renderString(address.toLowerCase(), 5)} is not the same wallet connected to your account. Switch to ${user.address.toLowerCase()} to complete the transaction`);
            setNotificationTitle("Wrong wallet connected");
            setOpenNotification(true);
        } else {
            return fn(identification.accessToken);
        }
    };

    async function createNFTMintSmartContract(NFTMintFactoryContract, nameToken, symbolToken, royalties, user) {
        await withWalletCheck(async () => {
            console.log(NFTMintFactoryContract, nameToken, symbolToken, royalties);
            setLoading("The smart contract creating procedure has started. Accept the MetaMask transaction."); setOpenLoading(true);

            const _defaultAdmin = address;
            const _name = nameToken;
            const _symbol = symbolToken;

            const _contractURI = { "artist name": user.artist_name, "artist description": user.artist_description };

            const _trustedForwarders = [];
            const _primarySaleRecipient = address;
            const _royaltyRecipient = address;
            const _royaltyBps = royalties * 100;
            const _platformFeeBps = user.artist_first_sale_fee;
            const _platformFeeRecipient = MarketplaceOwner;

            console.log(_defaultAdmin, _name, _symbol, _contractURI, _trustedForwarders, _primarySaleRecipient, _royaltyRecipient, _royaltyBps, _platformFeeBps, _platformFeeRecipient)

            const initData = NFTMintSample.encoder.encode(
                "initialize", [
                _defaultAdmin,
                _name,
                _symbol,
                _contractURI,
                _trustedForwarders,
                _primarySaleRecipient,
                _royaltyRecipient,
                _royaltyBps,
                _platformFeeBps,
                _platformFeeRecipient
            ]
            );

            const prova = await NFTMintFactoryContract.call("createNFTMint", [initData]);


            console.log(prova);
            const events = prova.receipt.events;
            let BeaconProxyAddress;
            for (const element of events) {
                let currentEvent = element;
                // Check if the current object has the desired fragment.name
                if (currentEvent.event && currentEvent.event === "NFTMintDeployed") {
                    BeaconProxyAddress = currentEvent.args[0].toLowerCase();
                    break;
                }
            };

            console.log(BeaconProxyAddress);

            const data = JSON.stringify({ "artist_minting_contract": BeaconProxyAddress, "artist_royalties": royalties });
            await patchOnDB(`${DBUrl}/api/v1/users/updateMe`, data, user.accessToken)
                .then((response) => {
                    console.log(response);
                    setOpenLoading(false);
                });
        })
    }

    async function createNFT(
        nftMintArtistContract, artist, song, formInputPrice, audioPinata, audioCloudinary, imageSongPinata, imageSongCloudinary, description, supply, royalties, launch_date, audioDuration) {

        await withWalletCheck(async (accessToken) => {
            const nextTokenIdToMint = parseInt(await nftMintArtistContract.call("nextTokenIdToMint", []));
            const metadatas = [{ name: song, description, image: imageSongPinata, audio: audioPinata }]
            const prepareMint = await nftMintArtistContract.erc1155.lazyMint.prepare(metadatas);
            console.log(prepareMint);

            let encodedMint = prepareMint.encode()
            const startingTime = launch_date ? launch_date : new Date();
            const claimConditions = [
                {
                },
                {
                    startTime: startingTime,
                    currencyAddress: NATIVE_TOKEN_ADDRESS,
                    price: formInputPrice, // public sale price
                    maxClaimableSupply: supply
                }];

            let preparedClaimCondition = await nftMintArtistContract.erc1155.claimConditions.set.prepare(nextTokenIdToMint, claimConditions, true);
            let encodedClaimCondition = preparedClaimCondition.encode()

            const transaction = await nftMintArtistContract.call("multicall", [[encodedMint, encodedClaimCondition]]);
            console.log(transaction);
            const transactionHash = transaction.receipt.transactionHash;
            const events = transaction.receipt.events;
            let token_id;
            let token_address;
            for (const element of events) {
                let currentEvent = element;
                // Check if the current object has the desired fragment.name
                if (currentEvent.event && currentEvent.event === "TokensLazyMinted") {
                    token_id = parseInt(currentEvent.args[0]);
                    token_address = currentEvent.address.toLowerCase();
                    break;
                }
            };

            const token_URI = await nftMintArtistContract.call("uri", [token_id]);
            console.log(token_URI);

            const symbol = await nftMintArtistContract.call("symbol", []);
            const name = await nftMintArtistContract.call("name", []);
            console.log(symbol, name);

            //Post NFTInfo document
            const audioPreview = "/du_30" + audioCloudinary;
            let dataTokenInfo;
            if (launch_date) {
                dataTokenInfo = JSON.stringify({ token_id, token_address, name, symbol, "author_address": address.toLowerCase(), royalties, supply, "remaining_for_minting": supply, song, artist, description, imageSongPinata, imageSongCloudinary, audioPinata, audioCloudinary, audioPreview, audioDuration, token_URI, "launch_price": formInputPrice, "launch_date": launch_date.toISOString() });
            } else {
                dataTokenInfo = JSON.stringify({ token_id, token_address, name, symbol, "author_address": address.toLowerCase(), royalties, supply, "remaining_for_minting": supply, song, artist, description, imageSongPinata, imageSongCloudinary, audioPinata, audioCloudinary, audioPreview, audioDuration, token_URI, "launch_price": formInputPrice });
            }
            await postOnDB(`${DBUrl}/api/v1/nfts`, dataTokenInfo, accessToken).then((response) => {
                console.log("response:", response);
            });

            //Post Owners document
            const dataTokenOwner = JSON.stringify({ token_id, token_address, "owner_of": address.toLowerCase(), "amount": 0, "sellingQuantity": supply, "price": formInputPrice, date: new Date(), "isFirstSale": true });

            await postOnDB(`${DBUrl}/api/v1/owners`, dataTokenOwner, accessToken).then((response) => {
                console.log("response:", response);
            });

            //Post Transaction document
            const dataTransaction = JSON.stringify({ token_id, token_address, 'quantity': [supply], "transactions": [transactionHash], 'transactions_type': ["LAZY MINTING"], 'price': [formInputPrice] })
            await postOnDB(`${DBUrl}/api/v1/transactions`, dataTransaction, accessToken).then((response) => {
                console.log("response:", response);
            });

            const analytics = getAnalytics();
            logEvent(analytics, 'create');

            router.push("/collection");
        })
    }

    const SecondListing = async (NFTMarketplaceContract, nft, formInputPrice, amount) => {
        await withWalletCheck(async (accessToken) => {
            try {
                setOpenLoading(true); setLoading("The token listing producedure has started. Accept the MetaMask transaction.");
                console.log(NFTMarketplaceContract);
                let transactions;
                let listing_id;
                const totalQuantity = parseInt(nft.sellingQuantity) + parseInt(amount);
                if (nft.sellingQuantity && nft.sellingQuantity > 0) {

                    const params = await NFTMarketplaceContract.call("getListing", [nft.listing_id])
                    const date = new Date(params.startTimestamp * 1000);
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

                    console.log(listing);
                    console.log(nft.listing_id);
                    const tx = await NFTMarketplaceContract.directListings.updateListing(nft.listing_id, listing);
                    console.log(tx);
                    transactions = tx.receipt.transactionHash;
                    listing_id = nft.listing_id;

                } else {
                    const listing = {
                        assetContractAddress: nft.token_address,
                        tokenId: nft.token_id,
                        quantity: amount,
                        currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                        pricePerToken: formInputPrice,
                        startTimestamp: new Date(),
                        isReservedListing: false
                    }
                    const tx = await NFTMarketplaceContract.directListings.createListing.prepare(listing);
                    await tx.estimateGasCost(); // Estimate the gas cost
                    await tx.setGasLimitMultiple(1.3);
                    const aspetta = await tx.send();
                    const sentTx = await aspetta.wait();
                    console.log(sentTx);
                    transactions = sentTx.transactionHash;

                    const events = sentTx.events;
                    for (const element of events) {
                        let currentEvent = element;
                        // Check if the current object has the desired fragment.name
                        if (currentEvent.event && currentEvent.event === "NewListing") {
                            listing_id = parseInt(currentEvent.args.listingId);
                            break;
                        }
                    };
                    console.log(listing_id);
                }

                //Update transaction history
                const dataTransaction = JSON.stringify({ "token_id": nft.token_id, "token_address": nft.token_address, transactions, 'transactions_type': "LISTING", 'price': formInputPrice, 'quantity': amount });
                await patchOnDB(
                    `${DBUrl}/api/v1/transactions/addTransaction`, dataTransaction, accessToken).then((response) => {
                        console.log(response);
                    });
                //Update token Owners
                const dataTokenOwner = JSON.stringify({ "token_id": nft.token_id, "token_address": nft.token_address, "owner_of": address.toLowerCase(), listing_id, "sellingQuantity": amount, "price": formInputPrice });
                await patchOnDB(`${DBUrl}/api/v1/owners/nftRelisted`, dataTokenOwner, accessToken).then((response) => {
                    console.log(response);
                });

                const analytics = getAnalytics();
                logEvent(analytics, 'secondary_listing');

                setOpenLoading(false);

                setToast("Token successfully listed");
                setOpenToast(true);
                router.push("/my-profile");

            }
            catch (error) {
                handleMetaMaskErrors(error, "Something went wrong while listing the token. <br/>Please try again. If the error persist contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR_secondary_listing");
            }
        })
    };

    //Fetch NFT related to discover page.
    const fetchDiscoverNFTs = async () => {
        const response = await getFromDB(`${DBUrl}/api/v1/owners/discoverItem`
        ).then((response) => { return response });
        console.log("discoverNFT:", response.data.discoverNFT);
        return response.data.discoverNFT;
    };

    //Given a Firebase accessToken returns NFT related to my items.
    const fetchMyNFTs = async (accessToken) => {
        const response = await getFromDB(`${DBUrl}/api/v1/nfts/ownersNFTInfo`, accessToken
        ).then((response) => { return response });
        console.log(response);
        return response.data.NFTInfoOwned;
    };

    //Given the owner _id returns the related item.
    const fetchNFTOwner = async (id) => {
        const response = await getFromDB(`${DBUrl}/api/v1/nfts/ownersNFTInfo/${id}`
        ).then((response) => { return response });
        return response.data.ownerNFTInfo;
    }

    //Given the token_id and token_address fetch all the listing
    const fetchSellingSameTokenNFT = async (token_id, token_address) => {
        const response = await getFromDB(`${DBUrl}/api/v1/owners/?token_id=${token_id}&token_address=${token_address}&sellingQuantity[gte]=1&sort=price`
        ).then((response) => { return response });
        return response.data.owners;
    };

    const fetchNFTOwners = async (token_id, token_address, accessToken) => {
        const myNFTs = await fetchMyNFTs(accessToken);
        const filteredNFTs = myNFTs.filter(nft => {
            return nft.token_id === token_id && nft.token_address === token_address;
        });
        console.log(filteredNFTs);
        return filteredNFTs;
    }

    //Given the artist minting contract it returns the token created
    const fetchArtistNFT = async (address_minting_contract) => {
        const response = await getFromDB(`${DBUrl}/api/v1/owners/artistNFT?cnt=${address_minting_contract}`
        ).then((response) => { return response });
        console.log(response.data.artNFT)
        return response.data.artNFT;
    };

    const fetchArtistName = async (address_minting_contract) => {
        const response = await getFromDB(`${DBUrl}/api/v1/users/artistName?cnt=${address_minting_contract}`
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

    const fetchSupporters = async (id) => {
        const response = await getFromDB(`${DBUrl}/api/v1/users/supporters/${id}`
        ).then((response) => { return response });
        return response.supporters;
    }

    const sendArtistForm = async (name, email, instagram, spotify, soundcloud, other) => {
        const data = JSON.stringify({ name, email, instagram, spotify, soundcloud, other })
        const response = await postOnDB(`${DBUrl}/api/v1/artistForm`, data).then((response) => { return response });
        console.log(response);
        setToast("Form successfully sent");
        setOpenToast(true);
    }

    const claimNFT = async (contract, nft) => {
        await withWalletCheck(async (accessToken) => {
            try {
                setOpenLoading(true); setLoading("The token buying producedure has started. Accept the MetaMask transaction.");
                //Smart contract transaction to buy the token
                console.log(contract);

                let tx;
                if (nft.isFirstSale) {
                    tx = await contract.erc1155.claim(nft.token_id, 1);
                    console.log("transaction", tx);
                } else {
                    console.log(nft.listing_id, 1, address);
                    tx = await contract.directListings.buyFromListing(nft.listing_id, 1, address);
                    console.log("transaction", tx);
                }
                await updateDBafterPurchase(nft, tx, accessToken);

                const analytics = getAnalytics();
                logEvent(analytics, 'purchase');

                setOpenLoading(false);
                setToast("Token successfully purchased");
                setOpenToast(true);
                router.push("/my-profile");
            } catch (error) {
                handleMetaMaskErrors(error, "Something went wrong while buying the token. <br/>Please try again. If the error persist contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR_purchase");
            }
        })
    };

    const updateDBafterPurchase = async (seller, transaction, accessToken, newBuyer) => {
        const transactions = transaction.receipt.transactionHash;
        const buyer = newBuyer || transaction.receipt.from.toLowerCase();
        const data1 = JSON.stringify({ "token_id": seller.token_id, "token_address": seller.token_address, transactions, 'transactions_type': "SALE", "price": seller.price, 'quantity': 1 });
        await patchOnDB(
            `${DBUrl}/api/v1/transactions/addTransaction`, data1, accessToken).then((response) => {
                console.log(response);
            });
        const data2 = JSON.stringify({ "token_id": seller.token_id, "token_address": seller.token_address, "owner_of": seller.owner_of, "buyer": buyer });
        await patchOnDB(
            `${DBUrl}/api/v1/owners/nftSold`, data2, accessToken).then((response) => {
                console.log(response);
            });
    };

    const freeNFTTransfer = async (nft) => {
        await withWalletCheck(async () => {
            try {
                setOpenLoading(true); setLoading("The token is being transferred. Wait for the transaction to be completed. Do not refresh or close the page.");

                const [NFTMarketplace, gasPrice] = await connectingwithSmartContractOwner(NFTMarketplaceAddress, NFTMarketplaceABI);
                console.log(NFTMarketplace, gasPrice);
                console.log(nft.token_id, nft.token_address, nft.owner_of, address.toLowerCase());
                const transaction = await NFTMarketplace.GasFreeTransaction(nft.token_id, nft.token_address, nft.owner_of, address.toLowerCase(),
                    {
                        gasPrice: gasPrice
                    });

                console.log(transaction);
                const trans = await transaction.wait();
                console.log(trans);

                await updateDBafterPurchase(nft, transaction, address.toLowerCase());

                const analytics = getAnalytics();
                logEvent(analytics, 'retrieve');

                setOpenLoading(false);

                setToast("Token successfully transferred");
                setOpenToast(true);
                router.push("/my-profile");
            } catch (error) {
                handleMetaMaskErrors(error, "Something went wrong while transfering the token. <br/>Please try again. If the error persist contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR_retrieve");
            }
        })
    }

    const changeNFTPrice = async (NFTMintContract, nft, formInputPrice) => {
        await withWalletCheck(async (accessToken) => {
            try {
                console.log(NFTMintContract);
                /* setOpenLoading(true); setLoading("The token changing price producedure has started. Accept the MetaMask transaction."); */
                let transactions;
                if (nft.isFirstSale) {

                    const claimConditions = [
                        {
                        },
                        {
                            startTime: new Date(),
                            currencyAddress: NATIVE_TOKEN_ADDRESS,
                            price: formInputPrice, // public sale price
                            maxClaimableSupply: nft.supply
                        }];

                    const prova = await NFTMintContract.erc1155.claimConditions.set(nft.token_id, claimConditions, true);
                    console.log(prova);
                    transactions = prova.receipt.transactionHash;
                } else {
                    const params = await NFTMintContract.call("getListing", [nft.listing_id])
                    const date = new Date(params.startTimestamp * 1000);
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

                    const tx = await NFTMintContract.directListings.updateListing(nft.listing_id, listing);
                    console.log(tx);
                    transactions = tx.receipt.transactionHash;
                }

                //Update DB
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
                handleMetaMaskErrors(error, "Something went wrong while changing the token price. <br/>Please try again. If the error persist contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR_change_price");
            }
        })

    };

    const delistItem = async (NFTMarketplaceContract, nft, amount) => {
        await withWalletCheck(async (accessToken) => {
            try {
                //setOpenLoading(true); setLoading("The token delisting producedure has started. Accept the MetaMask transaction.");
                let transactions
                if (nft.sellingQuantity <= amount) {
                    const tx = await NFTMarketplaceContract.directListings.cancelListing(nft.listing_id);
                    console.log(tx);
                    transactions = tx.receipt.transactionHash;
                } else {
                    const params = await NFTMarketplaceContract.call("getListing", [nft.listing_id])
                    const date = new Date(params.startTimestamp * 1000);
                    console.log(date);
                    //Call updateListing
                    const listing = {
                        assetContractAddress: nft.token_address,
                        tokenId: nft.token_id,
                        currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                        pricePerToken: nft.price,
                        quantity: amount,
                        isReservedListing: false,
                        startTimestamp: date
                    }

                    const tx = await NFTMarketplaceContract.directListings.updateListing(nft.listing_id, listing);
                    console.log(tx);
                    transactions = tx.receipt.transactionHash;
                }

                //Update transaction hystory
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
                handleMetaMaskErrors(error, "Something went wrong while delisting the token. <br/>Please try again. If the error persist contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR_delist");
            }
        })
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

    const setUserAndCheckWallet = async () => {
        checkIfWalletConnected().then((wallet) => {
            fetchUserInformation().then((UserFirebase) => {
                if (UserFirebase) {
                    userToWallet(UserFirebase.accessToken).then((UserDB) => {
                        const userData = { ...UserFirebase, ...UserDB };
                        setUser(userData);
                        console.log(userData);
                        if (wallet && UserDB.wallet && wallet != UserDB.wallet) {
                            setNotificationText(`The current connected wallet (${renderString(wallet, 5)}) does not match the one linked with you account (${renderString(UserDB.wallet, 5)}). <br/>Just one wallet can be linked with your account. In order to change your account linked wallet, go in <a href='./my-profile' style='color: var(--main-color)'>your profile</a>.`)
                            setNotificationTitle("Wrong wallet connected");
                            setOpenNotification(true);
                        }
                    });
                };
            });
        });
    };

    //MongoDB user instance creation and check if any wallet is connected
    const saveUserDataInDB = async (accessToken) => {
        let data;
        if (address) {
            data = JSON.stringify({ 'wallet': address.toLowerCase() });
        } else {
            data = JSON.stringify({});
        }
        const response = await postOnDB(`${DBUrl}/api/v1/users`, data, accessToken);
        console.log(response);
        if (response.status == "success" && response.message == "A user with this wallet already exists, but the new user has been created without setting the wallet parameter.") {
            alert(`We were able to create your account but the wallet connected ${renderString(address.toLowerCase(), 5)} is already connected to another account. One wallet can only be connected to one account. Consequently, connect a new wallet or delete the connection between this wallet ${renderString(address.toLowerCase(), 5)} and the other account`);
        };
    };

    //Sign Up with email and password
    const signUp = async (username, email, password, confirmPassword) => {
        if (password != confirmPassword) {
            setOpenErrorAuth(true); setErrorAuth("Passwords are not equal");
        } else {
            try {
                const auth = getAuth();
                //Firebase account creation
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const analytics = getAnalytics();
                logEvent(analytics, 'sign_up');
                await updateProfile(userCredential.user, { displayName: username })
                sendEmailVerification(auth.currentUser);

                //MongoDB user instance creation & check wallet
                saveUserDataInDB(userCredential.user.accessToken);
                //the user has to verify its email before being able to log in
                signOut(auth)
                    .then(() => {
                        setOpenRegister(false);
                        setNotificationTitle("Confirm you Email");
                        setNotificationText("Thank you for registering with us! To activate your account, please check your email inbox for a confirmation message.")
                        setOpenNotification(true);
                    })
                    .catch((error) => {
                        console.error(error);
                    }
                    );
            } catch (error) {
                handleAuthFirebaseError(error, "Error during registration");
            }
        }
    };

    //Sign In with email and password
    const signIn = async (email, password) => {
        const auth = getAuth();
        try {
            //SignIn process
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const analytics = getAnalytics();
            logEvent(analytics, 'login');
            const UserFirebase = userCredential.user;
            console.log(UserFirebase);

            if (UserFirebase.emailVerified) {
                //Check Wallet connected
                if (address.toLowerCase()) {
                    const DBUser = await userToWallet(UserFirebase.accessToken);
                    console.log(DBUser);
                    console.log(DBUser.wallet == null);
                    if (DBUser.wallet == null) {
                        const data = JSON.stringify({ 'wallet': address.toLowerCase() });
                        console.log(data);
                        console.log(UserFirebase.accessToken);
                        const response = await patchOnDB(`${DBUrl}/api/v1/users/updateMe`, data, UserFirebase.accessToken);
                        console.log("Update Wallet:", response);
                        if (response.status == "fail" && response.message == "Duplicate field value. Please use another value") {
                            setNotificationTitle("WRONG WALLET CONNECTED")
                            setNotificationText(`We were able to login into your account but the wallet connected ${renderString(address.toLowerCase(), 5)} is already connected to another account. One wallet can only be connected to one account. Consequently, connect a new wallet or delete the connection between this wallet ${renderString(address.toLowerCase(), 5)} and the other account`)
                            setOpenNotification(true);
                        }
                    }
                }

                await setUserAndCheckWallet();
                setOpenLogin(false);
            } else {
                sendEmailVerification(auth.currentUser);
                await signOut(auth);
                setOpenLogin(false);
                setNotificationTitle("Confirm you Email")
                setNotificationText("You account has not been activated! To activate your account, please check your email inbox for a confirmation message.")
                setOpenNotification(true);
            };
        } catch (error) {
            console.log(error);
            handleAuthFirebaseError(error, "Error during login");
        }
    };

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
        const auth = getAuth();
        signOut(auth).then(() => {
            window.location.href = "./";
        })
            .catch((error) => {
                console.error(error);
            }
            );
    };

    const forgotPassword = async (email) => {
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                setNotificationTitle("Email sent")
                setNotificationText("You correctly requested to change your password. Open your email box and follow the instruction to change your password");
                setOpenNotification(true);
            })
            .catch((error) => {
                handleAuthFirebaseError(error, "Error updating password");
            });
    };

    //Given the Firebase token returns the saved DB user
    const userToWallet = async (token) => {
        const response = await getFromDB(`${DBUrl}/api/v1/users/getMe`, token);
        console.log(response.data.user);
        return response.data.user;
    };

    const updateUserDisplayName = async (username) => {
        const auth = getAuth();

        return new Promise((resolve, reject) => {
            onAuthStateChanged(auth, async (user) => {
                const response = await updateProfile(user, {
                    displayName: username
                });
                resolve(response);

                setToast("Username successfully updated");
                setOpenToast(true);

                setOpenAccountSetting(false);
                setUserAndCheckWallet();
            });
        });
    };

    const updateUserInformations = async (artist_name, artist_description, artist_instagram, artist_spotify, artist_soundcloud, artist_photo, accessToken) => {
        const dataObject = {
            artist_name,
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
                setUserAndCheckWallet();
            });
    }

    const updateUserPassword = async (currentPassword, newPassword, confirmNewPassword) => {
        if (newPassword == confirmNewPassword) {
            const auth = getAuth();
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(user.email, currentPassword);

            // Reauthenticate the user with their current password
            reauthenticateWithCredential(user, credential)
                .then(() => {
                    // If reauthentication is successful, update the password
                    updatePassword(user, newPassword)
                        .then(() => {

                            setToast("Password successfully updated");
                            setOpenToast(true);

                            setOpenAccountSetting(false);
                        })
                        .catch((error) => {
                            handleAuthFirebaseError(error, "Error updating password");
                        });
                })
                .catch((error) => {
                    handleAuthFirebaseError(error, "Error re-authenticating user");
                });
        } else {
            handleAuthFirebaseError("boh", "Passwords do not match");
        }
    };

    const deleteUsersEmailPsw = (currentPassword) => {
        const auth = getAuth();
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, currentPassword);

        // Reauthenticate the user with their current password
        reauthenticateWithCredential(user, credential)
            .then(() => {
                deleteOnDB(`${DBUrl}/api/v1/users/deleteMe`, user.accessToken).then((response) => {
                    console.log(response);
                });
                deleteUser(user).then(() => {

                    setToast("Account successfully deleted");
                    setOpenToast(true);
                    setOpenAccountSetting(false);
                    window.location.reload();
                }).catch((error) => {
                    handleAuthFirebaseError(error, "Error deleting user");
                });
            })
            .catch((error) => {
                handleAuthFirebaseError(error, "Error re-authenticating user");
            });
    };

    const unlinkWalletEmailPsw = (password) => {
        const auth = getAuth();
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, password);
        // Reauthenticate the user with their current password
        reauthenticateWithCredential(user, credential)
            .then(async () => {
                const data = JSON.stringify({ "wallet": "undefined" });
                await patchOnDB(`${DBUrl}/api/v1/users/updateMe`, data, user.accessToken)
                    .then((response) => {
                        console.log(response);

                        setToast("Wallet successfully unlinked");
                        setOpenToast(true);

                        setOpenAccountSetting(false);
                        window.location.reload();
                    })
                    .catch((error) => {
                        handleAuthFirebaseError(error, "Error unlinking wallet");
                    });
            })
            .catch((error) => {
                handleAuthFirebaseError(error, "Error re-authenticating user");
            });
    };

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
    const [openRegister, setOpenRegister] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);

    const [openAccountSetting, setOpenAccountSetting] = useState(false);
    const [openArtistSettings, setOpenArtistSettings] = useState(false);
    const [openArtistForm, setOpenArtistForm] = useState(false);

    const [openCreateItem, setOpenCreateItem] = useState(false);

    const [openToast, setOpenToast] = useState(false);
    const [toast, setToast] = useState(null);
    const [openNotification, setOpenNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState(null);
    const [notificationText, setNotificationText] = useState(null);


    const verifyWallet = async (wallet) => {
        const identification = await fetchUserInformation();
        if (user) {
            if (!user.wallet) {
                const data = JSON.stringify({ 'wallet': wallet });
                await patchOnDB(`${DBUrl}/api/v1/users/updateMe`, data, identification.accessToken).then((response) => {
                    console.log("Update Wallet:", response);
                    if (response.status == "error" && response.error.codeName == "DuplicateKey") {
                        setNotificationText(`The wallet ${renderString(wallet, 5)} is already linked to another account. One wallet can only be connected to one account. Consequently, connect a new wallet or delete the connection between this wallet and the other account`);
                        setNotificationTitle("Wallet already linked");
                        setOpenNotification(true);
                    }
                });
                setUserAndCheckWallet();
            } else if (user.wallet != wallet) {
                setNotificationText(`The wallet ${renderString(wallet, 5)} you are trying to connect is not the wallet linked to your account. Please connect  ${renderString(user.wallet, 5)} or delete the connection between this wallet and your account to add a new wallet`);
                setNotificationTitle("Wallet already linked");
                setOpenNotification(true);
            }
        }
    }

    useEffect(() => {
        setUserAndCheckWallet();
    }, []);

    useEffect(() => {
        if (address) {
            verifyWallet(address.toLowerCase());
        }
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
                openRegister,
                setOpenRegister,
                openLogin,
                setOpenLogin,
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

                pinFileToIPFS,
                cloudinaryUploadVideo,
                cloudinaryUploadImage,
                createNFTMintSmartContract,
                createNFT,
                SecondListing,
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
                changeNFTPrice,
                delistItem,
                signUp,
                signIn,
                disconnectUser,
                forgotPassword,
                updateUserDisplayName,
                updateUserInformations,
                updateUserPassword,
                deleteUsersEmailPsw,
                unlinkWalletEmailPsw,
                fetchTransactionsInfo,
                renderString,
                sendUserActivity,
                downloadSong
            }}
        >
            {children}
        </NFTMarketplaceContext.Provider>
    )
}
