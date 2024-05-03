import React, { useContext } from 'react';
import { useActiveAccount } from "thirdweb/react";
import { AiOutlineClose } from "react-icons/ai";

import Style from "./BuyItem.module.css";
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';
import { NFTMarketplaceAddress } from '../../../Context/Constants';
import { InfoButton, SmartContractButton } from '../../../components/componentsIndex';

const BuyItem = ({ nft, setOpenBuy }) => {
    const { claimNFT, updateDBafterPurchase } = useContext(NFTMarketplaceContext);

    const address = useActiveAccount()?.address;

    const claimTrack = async (nftMintArtistContract) => {
        setOpenBuy(false);
        const tx = await claimNFT(nftMintArtistContract, nft);
        console.log(tx);
        return tx;
    }

    const updateDB = async (receipt, contract) => {
        await updateDBafterPurchase(receipt, nft, address)
    }

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
                    <SmartContractButton text="Pay with Crypto" contractAddress={nft.isFirstSale ? nft.token_address : NFTMarketplaceAddress} action={claimTrack} onTransactionConfirmed={updateDB} />
                </div>
                <div className={`${Style.BuyItem_bottom_middle} font-small`}>or</div>
                <div className={Style.BuyItem_bottom_item}>
                    <InfoButton text="Pay with Credit Card Coming Soon" />
                </div>
            </div>
        </div>
    )
}

export default BuyItem;