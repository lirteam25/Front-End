import React, { useEffect } from 'react';
import { useActiveAccount } from "thirdweb/react";
import { toTokens, estimateGas, createThirdwebClient, getContract, encode, NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { polygonAmoy } from "thirdweb/chains";
import { claimTo, getNFT, getActiveClaimCondition } from "thirdweb/extensions/erc1155";
import { editionDropABI } from "../Context/Constants";

import Pusher from "pusher-js";
const { ethers } = require("ethers");

// Public channel for all transak order events
let pusher = new Pusher("1d9ffac87de599c61283", { cluster: "ap2" });

export const DEFAULT_SLIPPAGE = 0.5;

export const ESTIMATED_GAS_FEE_OFFSET = 0.0001;

import Style from "../styles/discover.module.css";
import { Transak } from '@transak/transak-sdk';
import { verifyContract } from "thirdweb/contract"


const prova = () => {

    useEffect(() => {
        settingGeration().then((settings) => {
            const transak = new Transak(settings);

            transak.init();
            const subscribeToWebsockets = (orderId) => {
                let channel = pusher.subscribe(orderId);

                //receive updates of all the events
                pusher.bind_global((eventId, orderData) => {
                    console.log(`websocket Event: ${eventId} with order data:`, orderData);
                });

                //receive updates of a specific event
                channel.bind("ORDER_COMPLETED", (orderData) => {
                    console.log("ORDER COMPLETED websocket event", orderData);
                });

                channel.bind("ORDER_FAILED", async (orderData) => {
                    console.log("ORDER FAILED websocket event", orderData);
                });
            };

            Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData) => {
                console.log("callback transak order created", orderData);
                const eventData = orderData;

                const orderId = eventData.status?.id;

                if (!orderId) {
                    return;
                }

                subscribeToWebsockets(orderId);
            });
        })
    }, []);


    const client = createThirdwebClient({
        clientId: process.env.THIRDWEB_PROJECT_ID,
    });

    const chain = polygonAmoy;

    const contractEditionDrop = getContract({
        client,
        chain,
        address: "0x9288d930080F3b0144cC80199055Ff9b0A11A212"
    });

    const address = useActiveAccount()?.address;

    const settingGeration = async () => {

        const tx = claimTo({
            contract: contractEditionDrop,
            to: "0xCB9bD5aCD627e8FcCf9EB8d4ba72AEb1Cd8Ff5EF",
            tokenId: 1,
            quantity: 1,
        });
        console.log(tx);

        const calldata1 = await encode(tx);
        console.log(calldata1);

        const gas = await estimateGas({ transaction: tx });
        const estimatedGas = gas * 2n;


        const nft = await getNFT({
            contract: contractEditionDrop,
            tokenId: 1,
        });
        console.log(nft);
        const activeClaimCondition = await getActiveClaimCondition({ contract: contractEditionDrop, tokenId: 1 });
        console.log(activeClaimCondition);
        console.log(address);

        /* const provider = new ethers.providers.JsonRpcProvider("https://80002.rpc.thirdweb.com/");
        const owner_privateKey = process.env.OWNER_PRIVATE_KEY;
        const signer = new ethers.Wallet(owner_privateKey, provider);
        // Define your contract ABI and address
        // Define your contract ABI and address
        const contractABI = editionDropABI; // Your contract ABI
        const contractAddress = "0x9288d930080F3b0144cC80199055Ff9b0A11A212"; // Your contract address

        // Create a new instance of your contract
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        // Sign a transaction to call the contract function
        const txr = await signer.sendTransaction({
            to: contractAddress,
            data: calldata1,
            gasLimit: estimatedGas,
            value: activeClaimCondition.pricePerToken
        });
        // Sign a transaction to call the contract functio

        console.log("Transaction result:", txr);
        const aspetta = await txr.wait();
        console.log(aspetta); */

        const settings = {
            apiKey: process.env.TRANSAK_API_KEY,
            environment: Transak.ENVIRONMENTS.STAGING,
            themeColor: "000000",
            defaultPaymentMethod: "credit_debit_card",
            walletAddress: "0x2d90fc78ad933717Bc4a31097fd845C478F9B204",
            exchangeScreenTitle: "Buy NFT",
            disableWalletAddressForm: true,
            estimatedGasLimit: estimatedGas,
            calldata: calldata1,
            cryptoCurrencyCode: "MATIC",
            nftData: [
                {
                    imageURL: nft.metadata.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/"),
                    nftName: nft.metadata.name,
                    collectionAddress: contractEditionDrop.address,
                    tokenID: ["1"],
                    price: [toTokens(activeClaimCondition.pricePerToken, 18)],
                    quantity: 1,
                    nftType: "ERC1155",
                },
            ],
            isNFT: true,
            contractId: "6628cc8d99757d8582166068"
        };

        console.log(settings);
        return settings
    }

    return (
        <div className={Style.vh_discover}>
            <div className={Style.discover}>
            </div>
        </div>
    )
}

export default prova