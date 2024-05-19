import React, { useEffect, useContext } from 'react';
import { useRouter } from "next/router";
import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext';

import Style from "../styles/success.module.css";

const success = () => {

    const { updateDBafterPurchaseCreditCard } = useContext(NFTMarketplaceContext);

    const router = useRouter();

    useEffect(() => {
        if (!router.isReady) return;

        const params = new URLSearchParams(router.asPath.split('?')[1]);
        const data = JSON.parse(decodeURIComponent(params.get('p')));

        if (data.length > 0) {
            const {
                type,
                status,
                walletAddress,
                clientId,
                collectionId,
                txId,
                orderId,
                projectId,
                contractAddress,
                tokenId,
                tokenIds
            } = data[0];

            console.log("Transaction ID:", txId);
            console.log("Contract Address:", contractAddress);
            console.log("Token ID:", tokenId);
            console.log("Token IDs:", tokenIds);

            updateDBafterPurchaseCreditCard(txId, tokenId, contractAddress);
        }
        //Ho bisogno del transaction Hash, token id, token address, price, address del venditore seller
    }, [router.isReady]);

    return (
        <div className={Style.vh_success}>
            <div className={Style.success}>
                SUCCESS
            </div>
        </div>
    )
}

export default success;