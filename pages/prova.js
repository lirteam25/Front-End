import React, { useEffect, useState, useContext } from 'react';
import { useActiveWallet, TransactionButton, ConnectButton, useDisconnect } from "thirdweb/react";
import { toTokens, estimateGas, prepareContractCall, createThirdwebClient, getContract, sendTransaction, readContract, resolveMethod, encode, NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { polygon, polygonAmoy } from "thirdweb/chains";
import { nextTokenIdToMint, setClaimConditions, lazyMint, uri, claimTo, getNFT, setApprovalForAll, getActiveClaimCondition } from "thirdweb/extensions/erc1155";
import { getListing, updateListing, createListing, approveBuyerForListing } from "thirdweb/extensions/marketplace";
import { createWallet, embeddedWallet } from "thirdweb/wallets";
import { NFTMarketplaceContext } from './../Context/NFTMarketplaceContext';
import { GoDotFill } from "react-icons/go";
import Pusher from "pusher-js";

// Public channel for all transak order events
let pusher = new Pusher("1d9ffac87de599c61283", { cluster: "ap2" });

export const DEFAULT_SLIPPAGE = 0.5;

export const ESTIMATED_GAS_FEE_OFFSET = 0.0001;

import Style from "../styles/discover.module.css";
import { TransakConfig, Transak } from '@transak/transak-sdk';


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

    const address = useActiveWallet()?.address;

    const settingGeration = async () => {
        const tx = claimTo({
            contract: contractEditionDrop,
            to: "0xCB9bD5aCD627e8FcCf9EB8d4ba72AEb1Cd8Ff5EF",
            tokenId: 0,
            quantity: 1,
        });

        const calldata = await encode(tx);

        const gas = await estimateGas({ transaction: tx });
        const estimatedGas = gas * 2n;

        const nft = await getNFT({
            contract: contractEditionDrop,
            tokenId: 0,
        });
        const activeClaimCondition = await getActiveClaimCondition({ contract: contractEditionDrop, tokenId: 0 });

        const settings = {
            apiKey: process.env.TRANSAK_API_KEY,
            environment: Transak.ENVIRONMENTS.STAGING,
            themeColor: "000000",
            defaultPaymentMethod: "credit_debit_card",
            walletAddress: address,
            exchangeScreenTitle: "Buy NFT",
            disableWalletAddressForm: true,
            estimatedGasLimit: estimatedGas,
            calldata,
            cryptoCurrencyCode: "MATIC",
            nftData: [
                {
                    imageURL: nft.metadata.image,
                    nftName: nft.metadata.name,
                    collectionAddress: contractEditionDrop.address,
                    tokenID: ["0"],
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