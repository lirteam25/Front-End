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
        console.log("Here");
        const tx = await claimNFT(nftMintArtistContract, nft);
        console.log(tx);
        return tx;
    }

    const updateDB = async (receipt, contract) => {
        await updateDBafterPurchase(nft)
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
                    <SmartContractButton text="Pay with Crypto" contractAddress={nft.token_address} action={claimTrack} onTransactionConfirmed={updateDB} />
                </div>
                <div className={`${Style.BuyItem_bottom_middle} font-small`}>or</div>
                <div className={Style.BuyItem_bottom_item}>
                    {nft.collection_id ? <CrossmintPayButton
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
                        /* environment="staging" */
                        collectionId={nft.collection_id}
                        projectId={process.env.CROSSMINT_PROJECT_ID}
                        mintConfig={{ "totalPrice": nft.pricePerToken.toString(), "quantity": "1", "tokenId": nft.token_id.toString() }}
                        checkoutProps={{ "paymentMethods": ["fiat", "ETH", "SOL"] }}
                        mintTo={address}
                        onEvent={(event) => {
                            console.log(event.type, event);
                        }}
                        successCallbackURL={`${process.env.NEXT_PUBLIC_DOMAIN}/success`}
                    /* successCallbackURL={`http://localhost:3000/success`} */
                    /> : <InfoButton text="Credit Card Payment Soon Available" />}
                </div>
            </div>
        </div>
    )
}

export default BuyItem;