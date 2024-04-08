import React, { useState, useContext } from 'react';
import { useAddress } from '@thirdweb-dev/react';
import { AiOutlineClose } from "react-icons/ai";

import Style from "./BuyItem.module.css";
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';
import { SmartContractButton, LazyMintCreditCard } from '../../../components/componentsIndex';
import { NFTMarketplaceAddress, NFTMarketplaceAddressContractId } from '../../../Context/Constants';

const BuyItem = ({ nft, setOpenBuy }) => {
    const { user, claimNFT, updateDBafterPurchase } = useContext(NFTMarketplaceContext);

    const address = useAddress();

    const claimTrack = async (nftMintArtistContract) => {
        setOpenBuy(false);
        await claimNFT(nftMintArtistContract, nft)
    }

    const updateDB = async (response) => {
        console.log(response);
        const transactionId = response.transactionId;

        const get = async (url, token) => {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    'x-secret-key': token,
                    'Content-Type': 'application/json',
                }
            });
            return response.json()
        }

        let final = await get(`https://payments.thirdweb.com/api/v1/transaction-status/${transactionId}`, process.env.THIRDWEB_API_KEY);
        console.log(final);
        const transactionHash = final.result.transactionHash || transactionId;
        const transactionFrom = address.toLowerCase();
        updateDBafterPurchase(nft, transactionHash, transactionFrom, user.accessToken);

    }

    const arg = { "tokenId": nft.token_id };

    console.log(arg)

    return (
        <div className={Style.BuyItem}>
            <div className={`${Style.BuyItem_top} font-normal`}>
                <div className={Style.BuyItem_top_title}>
                    Checkout
                </div>
                <AiOutlineClose className={Style.BuyItem_top_x} onClick={() => setOpenBuy(false)} />
            </div>
            <div className={Style.BuyItem_bottom}>
                <div className={Style.BuyItem_bottom_item}>
                    <SmartContractButton
                        text="Collect Track With Crypto" contractAddress={nft.isFirstSale ? nft.token_address : NFTMarketplaceAddress}
                        action={claimTrack} />
                </div>
                <div className={`${Style.BuyItem_bottom_middle} font-small`}>or pay with credit card</div>
                <div className={Style.BuyItem_bottom_item}>
                    <LazyMintCreditCard
                        contractId={nft.isFirstSale ? nft.contract_id : NFTMarketplaceAddressContractId}
                        args={nft.isFirstSale ? { "tokenId": nft.token_id } : { "listings": [{ "listingId": nft.listing_id }] }}
                        onSuccess={updateDB} />
                </div>
            </div>

        </div>
    )
}

export default BuyItem;