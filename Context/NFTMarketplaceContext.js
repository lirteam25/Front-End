import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";
import { useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider, useWeb3ModalError } from '@web3modal/ethers/react';
import { getAnalytics, logEvent } from "firebase/analytics";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut, updateProfile, sendPasswordResetEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from "firebase/auth";
const FormData = require('form-data');

//Internal Imports
import { NFTMintABI, NFTMintSampleAddress, NFTMarketplaceAddress, NFTMarketplaceABI, NFTMintFactoryABI, NFTMintFactoryAddress } from "./Constants";

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


// whatever data we are goin to pass inside here it will be available to the entire application. (we connected in _app.js)
export const NFTMarketplaceProvider = ({ children }) => {
    const DBUrl = process.env.DB_URL;

    const { open } = useWeb3Modal();
    const { address, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
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
    const [currentAccount, setCurrentAccount] = useState("");

    const router = useRouter();

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
        setOpenLoading(false);
        console.log(error);
        console.log(error.code);
        if (error.code == 4001 || error.code == "ACTION_REJECTED") {
            setOpenError(true); setError(`User rejected the request. Please try again.`);
        } else if (error.code == -32002) {
            setOpenError(true); setError(`A MetaMask request has alreayd being throw. Please check MetaMask and accept the transaction.`);
        }
        else if (error.code == "CALL_EXCEPTION") {
            setOpenError(true); setError(`${string} <br/><br/>Check if you have sufficient fund to perform the transaction.`);
        } else {
            setOpenError(true); setError(`${string}`);
            const analytics = getAnalytics();
            logEvent(analytics, `${event}`);
        }
    }

    //Check if wallet is connected to the application
    const checkIfWalletConnected = async () => {
        try {
            if (isConnected) { return address.toLocaleLowerCase() }
        } catch (error) {
            handleMetaMaskErrors(error, "Something went wrong while checking the wallet connected. <br/>Please try to refresh the page. If the error persist contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR_check_if_wallet_connected")
        }
    };


    // Connect Wallet to the apllication function
    const connectWallet = async () => {
        try {
            await open();
        } catch (error) {
            handleMetaMaskErrors(error, "Something went wrong while connecting the wallet. <br/>Please try again to connect the wallet. If the error persist contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR_connect_wallet");
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
        let connectedWallet = await checkIfWalletConnected();
        if (!connectedWallet) {
            connectWallet();
            connectedWallet = await checkIfWalletConnected();
        }
        if (connectedWallet && user.wallet !== connectedWallet) {
            setOpenLoading(false);
            setNotificationText(`The wallet connected ${renderString(connectedWallet, 5)} is not the same wallet connected to your account. Switch to ${user.wallet} to complete the transaction`);
            setNotificationTitle("Wrong wallet connected");
            setOpenNotification(true);
        } else {
            return fn();
        }
    };

    const createNFTMintSmartContract = async (nameToken, symbolToken, accessToken) => {
        await withWalletCheck(async () => {
            setLoading("The smart contract creating procedure has started. Accept the MetaMask transaction."); setOpenLoading(true);
            try {
                const NFTMintSample = await connectingWithSmartContract(NFTMintSampleAddress, NFTMintABI);
                const connectedWallet = await checkIfWalletConnected();
                const initData = NFTMintSample.interface.encodeFunctionData("initialize", [nameToken, symbolToken, connectedWallet]);
                const NFTMintFactoryContract = await connectingWithSmartContract(NFTMintFactoryAddress, NFTMintFactoryABI);
                const tx = await NFTMintFactoryContract.createNFTMint(initData);
                setLoading("The smart contract is being created. Wait for the transaction to be completed."); setOpenLoading(true);
                console.log(tx);
                const result = await tx.wait();
                console.log(result.logs);
                const logs = result.logs;
                let BeaconProxyAddress;
                for (const element of logs) {
                    let currentLog = element;
                    // Check if the current object has the desired fragment.name
                    if (currentLog.fragment && currentLog.fragment.name === "NFTMintDeployed") {
                        BeaconProxyAddress = currentLog.args[0].toLowerCase();
                        break; // Stop the loop since you found the desired object
                    }
                };
                console.log(BeaconProxyAddress);

                const [NFTMarketplaceContract, gasPrice] = await connectingwithSmartContractOwner(NFTMarketplaceAddress, NFTMarketplaceABI);
                console.log(NFTMarketplaceContract);
                const tx1 = await NFTMarketplaceContract.storeMintingContracts(BeaconProxyAddress, {
                    gasPrice: gasPrice
                });
                const result2 = await tx1.wait();
                console.log(result2);

                const data = JSON.stringify({ "artist_minting_contract": BeaconProxyAddress });
                console.log(data);
                await patchOnDB(`${DBUrl}/api/v1/users/updateMe`, data, accessToken)
                    .then((response) => {
                        console.log(response);
                        setOpenLoading(false);

                    });

                window.location.reload();
                setToast("You successfully created your smart contract");
            } catch (error) {
                handleMetaMaskErrors(error, "Something went wrong while creating the smart contracts. <br/>Please try again. If the error persist contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR_create");
            }
        })
    }

    const createNFT = async (
        nftMintAddress, artist, song, formInputPrice, audioPinata, audioCloudinary, imageSongPinata, imageSongCloudinary, description, royalties, firstSaleFees, supply, amount, launch_date, audioDuration
    ) => {
        await withWalletCheck(async () => {
            setLoading("The token creating procedure has started. Accept the MetaMask transaction."); setOpenLoading(true);
            //AGGIUNGI PINATAA
            const data = { artist, song, "image": imageSongPinata, "audio": audioPinata, description, royalties };
            const token_URI = await pinJSONToIPFS(data);

            try {
                const price = ethers.parseUnits(formInputPrice.toString(), 18);
                const NFTMintContract = await connectingWithSmartContract(nftMintAddress, NFTMintABI);

                //First smart contract transaction to create the token
                console.log(token_URI, price, supply, amount, royalties, firstSaleFees, NFTMarketplaceAddress);
                const tokenCreation = await NFTMintContract.createAndListToken(token_URI, price, supply, amount, royalties, firstSaleFees, NFTMarketplaceAddress);
                setOpenLoading(true); setLoading("The token is being created and the relative amount listed. Wait for the transaction to be completed.");
                const tokenCreation1 = await tokenCreation.wait();

                const logs = tokenCreation1.logs;
                console.log(logs);
                let token_id;
                for (const element of logs) {
                    let currentLog = element;
                    // Check if the current object has the desired fragment.name
                    if (currentLog.fragment && currentLog.fragment.name === "TokenCreated") {
                        token_id = Number(currentLog.args[0]);
                        break; // Stop the loop since you found the desired object
                    }
                };
                console.log(token_id);


                const transaction1 = tokenCreation1.hash;
                const token_address = nftMintAddress;
                const author_address = tokenCreation1.from.toLowerCase();

                //Retreive the name and symbol of the token
                const name = await NFTMintContract.viewName();
                const symbol = await NFTMintContract.viewSymbol();
                //Get Firebase Access Token
                const identification = await fetchUserInformation();

                //Post NFTInfo document
                const audioPreview = "/du_30" + audioCloudinary;
                let dataTokenInfo;
                if (launch_date) {
                    dataTokenInfo = JSON.stringify({ token_id, token_address, name, symbol, author_address, royalties, supply, song, artist, description, imageSongPinata, imageSongCloudinary, audioPinata, audioCloudinary, audioPreview, audioDuration, token_URI, "launch_price": formInputPrice, launch_date });
                } else {
                    dataTokenInfo = JSON.stringify({ token_id, token_address, name, symbol, author_address, royalties, supply, song, artist, description, imageSongPinata, imageSongCloudinary, audioPinata, audioCloudinary, audioPreview, audioDuration, token_URI, "launch_price": formInputPrice });
                }
                await postOnDB(`${DBUrl}/api/v1/nfts`, dataTokenInfo, identification.accessToken).then((response) => {
                    console.log("response:", response);
                });

                //Post Owners document
                const dataTokenOwner = JSON.stringify({ token_id, token_address, "owner_of": author_address, "amount": supply, "sellingQuantity": amount, "price": formInputPrice, date: new Date() });

                await postOnDB(`${DBUrl}/api/v1/owners`, dataTokenOwner, identification.accessToken).then((response) => {
                    console.log("response:", response);
                });

                //Post Transaction document
                const dataTransaction = JSON.stringify({ token_id, token_address, 'quantity': [supply, amount], "transactions": [transaction1, transaction1], 'transactions_type': ["MINTING", "LISTING"], 'price': [0, formInputPrice] })
                await postOnDB(`${DBUrl}/api/v1/transactions`, dataTransaction, identification.accessToken).then((response) => {
                    console.log("response:", response);
                });

                const analytics = getAnalytics();
                logEvent(analytics, 'create');

                setOpenLoading(false);
                setToast("Token successfully listed");
                setOpenToast(true);
                router.push("/collection");
            } catch (error) {
                handleMetaMaskErrors(error, "Something went wrong while creating the tokens. <br/>Please try again. If the error persist contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR_create");
            }
        })
    };

    const SecondListing = async (nft, formInputPrice, amount) => {
        await withWalletCheck(async () => {
            try {
                setOpenLoading(true); setLoading("The token listing producedure has started. Accept the MetaMask transaction.");
                const price = ethers.parseUnits(formInputPrice.toString(), 18);
                const NFTMintContract = await connectingWithSmartContract(nft.token_address, NFTMintABI);

                //Smart contract transaction to list the token
                const transaction = await NFTMintContract.secondaryListing(nft.token_id, amount, price, NFTMarketplaceAddress);
                setOpenLoading(true); setLoading("The token is being listed. Wait for the transaction to be completed.");
                await transaction.wait();
                console.log(transaction);

                const transactions = transaction.hash;
                const newseller = transaction.from.toLowerCase();

                const identification = await fetchUserInformation();
                //Update transaction history
                const dataTransaction = JSON.stringify({ "token_id": nft.token_id, "token_address": nft.token_address, transactions, 'transactions_type': "LISTING", 'price': formInputPrice, 'quantity': amount });
                await patchOnDB(
                    `${DBUrl}/api/v1/transactions/addTransaction`, dataTransaction, identification.accessToken).then((response) => {
                        console.log(response);
                    });
                //Update token Owners
                const dataTokenOwner = JSON.stringify({ "token_id": nft.token_id, "token_address": nft.token_address, "owner_of": newseller, "sellingQuantity": amount, "price": formInputPrice });
                await patchOnDB(`${DBUrl}/api/v1/owners/nftRelisted`, dataTokenOwner, identification.accessToken).then((response) => {
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

    const buyNFTMatic = async (seller) => {
        await withWalletCheck(async () => {
            try {
                setOpenLoading(true); setLoading("The token buying producedure has started. Accept the MetaMask transaction.");
                //Smart contract transaction to buy the token
                const NFTMarketplaceContract = await connectingWithSmartContract(NFTMarketplaceAddress, NFTMarketplaceABI);
                const [roundId, startedAt,] = await NFTMarketplaceContract.getLatestPrice();
                console.log(roundId);
                const USDprice = ethers.parseEther(seller.price.toString());
                const MaticPrice = await NFTMarketplaceContract.getLatestPriceGivenRound(roundId, USDprice);
                console.log(MaticPrice);
                console.log(seller.token_id, seller.token_address, seller.owner_of);
                const transaction = await NFTMarketplaceContract.createMarketSaleMatic(
                    seller.token_id, seller.token_address, seller.owner_of, roundId, startedAt,
                    { value: MaticPrice }
                );
                setOpenLoading(true); setLoading("The token is being bought. Wait for the transaction to be completed.");
                await transaction.wait();
                console.log("transaction", transaction);

                await updateDBafterPurchase(seller, transaction);

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

    const updateDBafterPurchase = async (seller, transaction, newBuyer) => {
        const identification = await fetchUserInformation();
        const transactions = transaction.hash;
        const buyer = newBuyer || transaction.from.toLowerCase();
        const data1 = JSON.stringify({ "token_id": seller.token_id, "token_address": seller.token_address, transactions, 'transactions_type': "SALE", "price": seller.price, 'quantity': 1 });
        await patchOnDB(
            `${DBUrl}/api/v1/transactions/addTransaction`, data1, identification.accessToken).then((response) => {
                console.log(response);
            });
        const data2 = JSON.stringify({ "token_id": seller.token_id, "token_address": seller.token_address, "owner_of": seller.owner_of, "buyer": buyer });
        await patchOnDB(
            `${DBUrl}/api/v1/owners/nftSold`, data2, identification.accessToken).then((response) => {
                console.log(response);
            });
    };

    const freeNFTTransfer = async (nft) => {
        await withWalletCheck(async () => {
            try {
                setOpenLoading(true); setLoading("The token is being transferred. Wait for the transaction to be completed. If");

                const [NFTMarketplace, gasPrice] = await connectingwithSmartContractOwner(NFTMarketplaceAddress, NFTMarketplaceABI);
                console.log(NFTMarketplace, gasPrice);
                console.log(nft.token_id, nft.token_address, nft.owner_of, currentAccount);
                const transaction = await NFTMarketplace.GasFreeTransaction(nft.token_id, nft.token_address, nft.owner_of, currentAccount,
                    {
                        gasPrice: gasPrice
                    });

                console.log(transaction);
                const trans = await transaction.wait();
                console.log(trans);

                await updateDBafterPurchase(nft, transaction, currentAccount);

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

    const changeNFTPrice = async (nft, formInputPrice) => {

        try {
            setOpenLoading(true); setLoading("The token changing price producedure has started. Accept the MetaMask transaction.");
            const NFTMarketplaceContract = await connectingWithSmartContract(NFTMarketplaceAddress, NFTMarketplaceABI);
            const price = ethers.parseUnits(formInputPrice, 18);

            //Smart contract transaction to change token price
            const transaction = await NFTMarketplaceContract.changePrice(nft.token_id, nft.token_address, price);
            console.log(transaction);
            setOpenLoading(true); setLoading("The price is being changed. Wait for the transaction to be completed.");
            await transaction.wait();
            console.log(transaction);
            const transactions = transaction.hash;

            //Update transaction history
            const identification = await fetchUserInformation();
            const transactionData = JSON.stringify({ "token_id": nft.token_id, "token_address": nft.token_address, transactions, 'transactions_type': "PRICE CHANGE", "price": formInputPrice, 'quantity': nft.sellingQuantity });
            await patchOnDB(
                `${DBUrl}/api/v1/transactions/addTransaction`, transactionData, identification.accessToken).then((response) => {
                    console.log(response);
                });
            //Update Owners selling price
            const data = JSON.stringify({ "token_id": nft.token_id, "token_address": nft.token_address, "owner_of": nft.owner_of, 'price': formInputPrice });
            await patchOnDB(`${DBUrl}/api/v1/owners/updatePrice`, data, identification.accessToken).then((response) => {
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

    };

    const delistItem = async (nft, amount) => {
        await withWalletCheck(async () => {
            try {
                setOpenLoading(true); setLoading("The token delisting producedure has started. Accept the MetaMask transaction.");
                const NFTMarketplaceContract = await connectingWithSmartContract(NFTMarketplaceAddress, NFTMarketplaceABI);
                //Smart contract transaction to delist
                const transaction = await NFTMarketplaceContract.delistTokens(nft.token_id, nft.token_address, amount);
                setOpenLoading(true); setLoading("The token is being delisted. Wait for the transaction to be completed.");
                await transaction.wait();
                setOpenLoading(false);
                const transactions = transaction.hash;
                //Update transaction hystory

                const identification = await fetchUserInformation();
                const transactionData = JSON.stringify({ "token_id": nft.token_id, "token_address": nft.token_address, transactions, 'transactions_type': "DELISTING", "price": nft.price, 'quantity': amount });
                await patchOnDB(
                    `${DBUrl}/api/v1/transactions/addTransaction`, transactionData, identification.accessToken).then((response) => {
                        console.log(response);
                    });
                //Update Owners selling quantity
                const data = JSON.stringify({ "token_id": nft.token_id, "token_address": nft.token_address, "owner_of": nft.owner_of, "amount": amount });
                await patchOnDB(`${DBUrl}/api/v1/owners/delistItems`, data, identification.accessToken).then((response) => {
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
        if (currentAccount) {
            data = JSON.stringify({ 'wallet': currentAccount });
        } else {
            data = JSON.stringify({});
        }
        const response = await postOnDB(`${DBUrl}/api/v1/users`, data, accessToken);
        console.log(response);
        if (response.status == "success" && response.message == "A user with this wallet already exists, but the new user has been created without setting the wallet parameter.") {
            alert(`We were able to create your account but the wallet connected ${renderString(currentAccount, 5)} is already connected to another account. One wallet can only be connected to one account. Consequently, connect a new wallet or delete the connection between this wallet ${renderString(currentAccount, 5)} and the other account`);
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
                if (currentAccount) {
                    const DBUser = await userToWallet(UserFirebase.accessToken);
                    console.log(DBUser);
                    console.log(DBUser.wallet == null);
                    if (DBUser.wallet == null) {
                        const data = JSON.stringify({ 'wallet': currentAccount });
                        console.log(data);
                        console.log(UserFirebase.accessToken);
                        const response = await patchOnDB(`${DBUrl}/api/v1/users/updateMe`, data, UserFirebase.accessToken);
                        console.log("Update Wallet:", response);
                        if (response.status == "fail" && response.message == "Duplicate field value. Please use another value") {
                            setNotificationTitle("WRONG WALLET CONNECTED")
                            setNotificationText(`We were able to login into your account but the wallet connected ${renderString(currentAccount, 5)} is already connected to another account. One wallet can only be connected to one account. Consequently, connect a new wallet or delete the connection between this wallet ${renderString(currentAccount, 5)} and the other account`)
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
            setCurrentAccount(address.toLowerCase());
            verifyWallet(address.toLowerCase());
        } else {
            setCurrentAccount("")
        };
    }, [isConnected, address])

    return (
        <NFTMarketplaceContext.Provider
            value={{
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
                currentAccount,
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

                connectWallet,
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
                buyNFTMatic,
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
