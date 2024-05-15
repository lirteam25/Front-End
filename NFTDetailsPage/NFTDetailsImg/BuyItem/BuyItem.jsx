import React, { useContext } from 'react';
import { useActiveAccount } from "thirdweb/react";
import { AiOutlineClose } from "react-icons/ai";
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";

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
                    <CrossmintPayButton
                        style={{
                            borderRadius: 0,
                            width: "100%",
                            backgroundColor: "transparent",
                            border: "1px solid white",
                            padding: "0.3rem 0",
                            textTransform: "uppercase",
                            fontFamily: "Space Grotesk",
                            fontSize: "0.9rem",
                            margin: 0
                        }}
                        getButtonText={(connecting) =>
                            connecting ? "Connecting" : `Pay with credit card`
                        }
                        collectionId="4967ec15-66aa-45e1-a367-418b6325eb01"
                        projectId={process.env.CROSSMINT_PROJECT_ID}
                        mintConfig={{ "totalPrice": "0.015", "quantity": "1", "tokenId": nft.token_id }}
                        environment="staging"
                        checkoutProps={{ "paymentMethods": ["fiat", "ETH", "SOL"] }}
                        mintTo={address}
                    />
                </div>
            </div>
        </div>
    )
}

export default BuyItem;