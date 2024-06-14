import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { useActiveWalletChain } from "thirdweb/react";
import { useActiveAccount } from "thirdweb/react";
import { polygon, polygonAmoy } from "thirdweb/chains";
import { createThirdwebClient, getContract } from "thirdweb";
import Link from "next/link";

//INTERNAL IMPORT
import Style from "./NFTDetailsImg.module.css";
import img from "./../../img/index";
import { InfoButton, ActionButton, ButtonConnectWallet } from "../../components/componentsIndex";
import ChangePrice from "./ChangePrice/ChangePrice";
import DelistItem from "./DelistItem/DelistItem";
import ListItem from "./ListItem/ListItem";
import BuyItem from "./BuyItem/BuyItem";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";


const NFTDetailsImg = ({ shownNft, user, userOwn, uid }) => {
    const { nft, setCurrentIndex, setOpenFooterAudio, setNft, setStopFooter, stopFooter, freeNFTTransfer, sendUserActivity, renderString, updateDBafterPurchase } = useContext(NFTMarketplaceContext);

    const address = useActiveAccount()?.address;

    const client = createThirdwebClient({
        clientId: process.env.THIRDWEB_PROJECT_ID,
    });

    const chain = process.env.ACTIVE_CHAIN == "polygon" ? polygon : polygonAmoy;

    const contract = getContract({
        client,
        chain,
        address: shownNft.token_address
    })

    const [openChangePrice, setOpenChangePrice] = useState(false);
    const [openDelistItem, setOpenDelistItem] = useState(false);
    const [openListItem, setOpenListItem] = useState(false);
    const [openBuy, setOpenBuy] = useState(false);

    const setNewPrice = () => {
        setOpenDelistItem(false); setOpenListItem(false); setOpenBuy(false);
        setOpenChangePrice(!openChangePrice);
    }

    const setDelistItem = () => {
        setOpenChangePrice(false); setOpenListItem(false); setOpenBuy(false);
        setOpenDelistItem(!openDelistItem);
    }

    const setListItem = () => {
        setOpenChangePrice(false); setOpenDelistItem(false); setOpenBuy(false);
        setOpenListItem(!openListItem);
    }

    const setBuyItem = () => {
        setOpenChangePrice(false); setOpenDelistItem(false); setOpenListItem(false);
        setOpenBuy(!openBuy);
    }

    const freelyRetriveToken = () => {
        freeNFTTransfer(contract, shownNft);
    }

    const [alreadyClicked, setAlreadyClicked] = useState(false);
    const playSong = () => {
        console.log(userOwn);
        if (userOwn && userOwn.length !== 0) {
            console.log("here");
            setCurrentIndex(0); setOpenFooterAudio(true); setNft([userOwn]); setStopFooter(false);
            if (!alreadyClicked) {
                setAlreadyClicked(true);
                sendUserActivity(shownNft.token_id, shownNft.token_address, false);
            }
        } else {
            setCurrentIndex(0); setOpenFooterAudio(true); setNft([shownNft]); setStopFooter(false);
            if (!alreadyClicked) {
                setAlreadyClicked(true);
                sendUserActivity(shownNft.token_id, shownNft.token_address, true);
            }
        }
    }

    const chainId = useActiveWalletChain()?.id;

    const targetChainId = process.env.ACTIVE_CHAIN == "polygon" ? 137 : 80002;

    return (
        <div className={Style.NFTDetailsImg}>
            <div className={Style.NFTDetailsImg_description}>
                <div className={Style.NFTDetailsImg_description_info}>
                    <div className={Style.NFTDetailsImg_description_info_title}>
                        <div className={Style.NFTDetailsImg_description_info_title_songAndartist}>
                            <h1 className="font-medium">{shownNft.song ? `${shownNft.song}` : "----"}</h1>
                            <h2 className="font-medium">
                                {shownNft.artist?.map((art, i) => (
                                    <span key={i}>
                                        <Link className={Style.underline} href={{ pathname: "/artist", query: `uid=${shownNft.author_address[i]}` }}>
                                            {art}
                                        </Link>
                                        {i < shownNft.artist.length - 1 && ', '}
                                    </span>
                                ))}
                            </h2>
                        </div>
                        <div className={Style.NFTDetailsImg_description_info_title_play}>
                            {(userOwn || !user) && <div> {(JSON.stringify(nft) === JSON.stringify([shownNft]) || JSON.stringify(nft) === JSON.stringify([userOwn])) && !stopFooter ?
                                <Image src={img.pause} alt="pause icon" width={25} height={25} onClick={() => { setStopFooter(true) }} /> :
                                <Image src={img.play} alt="play icon" width={25} height={25}
                                    onClick={() => { playSong() }} />
                            }</div>}
                        </div>
                    </div>
                    <div className={`${Style.NFTDetailsImg_description_info_bottom} font-normal`}>
                        <div>
                            <div>DURATION</div>
                            <div>{shownNft.audioDuration ? shownNft.audioDuration : "----"}</div>
                        </div>
                        <div>
                            <div>PRICE</div>
                            <div>{typeof shownNft.pricePerToken !== 'undefined' ? (shownNft.sellingQuantity == 0 ? <span style={{ color: "var(--main-color)" }}>NOT LISTED</span> : (shownNft.pricePerToken == 0 ? (<span style={{ color: "var(--main-color)" }}>FOR FREE</span>) : (`${shownNft.pricePerToken} $`))) : <span style={{ color: "var(--main-color)", fontFamily: "Space Grotesk" }}>Not listed</span>}</div>
                        </div>
                        <div>
                            <div>SUPPLY</div>
                            <div>{shownNft.maxClaimableSupply ? shownNft.maxClaimableSupply : "----"}</div>
                        </div>
                    </div>
                </div>

                <div className={Style.NFTDetailsImg_description_info_actions}>
                    {shownNft.pricePerToken !== 'undefined' ? (
                        <div> {address && user && chainId == targetChainId ? (
                            <div>
                                {user.uid == uid ? (
                                    <div>
                                        {/* {shownNft.sellingQuantity >= shownNft.amount ?
                                                <InfoButton text={`You already listed all your owned ${shownNft.sellingQuantity} tokens`} /> :
                                                (<div>
                                                    <ActionButton action={setListItem} text={shownNft.sellingQuantity > 0 ? "List other tokens" : "LIST YOUR track"} />
                                                    {openListItem && <ListItem nft={shownNft} setOpenListItem={setOpenListItem} />}
                                                </div>
                                                )} */}
                                        {user.role == "artist" && user?.artist_minting_contract == shownNft?.token_address ? (<InfoButton text={`You listed ${shownNft.sellingQuantity} tokens`} />) : (
                                            <InfoButton text={`Secondary market function will be soon intregrated`} />
                                        )}
                                        {shownNft.sellingQuantity > 0 && (
                                            <div className={Style.NFTDetailsImg_description_info_button}>
                                                <div>
                                                    <ActionButton action={setNewPrice} text="CHANGE PRICE" />
                                                    {openChangePrice && <ChangePrice nft={shownNft} setOpenChangePrice={setOpenChangePrice} />}
                                                </div>
                                                {/* {!shownNft.isFirstSale && <div>
                                                    <ActionButton action={setDelistItem} text="DELIST" />
                                                    {openDelistItem && <DelistItem nft={shownNft} setOpenDelistItem={setOpenDelistItem} />}
                                                </div>} */}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        {shownNft.pricePerToken == 0 ?
                                            (<div>
                                                {userOwn.amount > 0 ? (
                                                    <div>
                                                        <InfoButton text={`You have already colleted this track`} />
                                                        <div className={`${Style.link_to_your_NFTPage} font-normal`}>
                                                            You already own {userOwn.amount} {userOwn.amount > 1 ? ("tokens") : ("token")}. <Link href={{ pathname: "/token-details", query: `token_id=${shownNft.token_id}&token_address=${shownNft.token_address}&id=${userOwn.owner_id}` }} style={{ color: "var(--main-color)" }}> Manage {userOwn.amount > 1 ? ("them") : ("it")}</Link>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <ActionButton action={freelyRetriveToken} text="redeem the token for free" />
                                                )
                                                }
                                            </div>)
                                            :
                                            (<div>

                                                <ActionButton action={setBuyItem} text="Collect Track" />
                                                {userOwn.length != 0 && (<div className={`${Style.link_to_your_NFTPage} font-normal`}>
                                                    You already own {userOwn.amount} {userOwn.amount > 1 ? ("tokens") : ("token")}. <Link href={{ pathname: "/token-details", query: `token_id=${shownNft.token_id}&token_address=${shownNft.token_address}&uid=${user.uid}` }} style={{ color: "var(--main-color)" }}> Manage {userOwn.amount > 1 ? ("them") : ("it")}</Link>
                                                </div>)}

                                            </div>)}
                                    </div>
                                )}
                            </div>
                        ) : (<ButtonConnectWallet />)}
                        </div>
                    ) : (<div>
                        <InfoButton text="---" />
                    </div>)}
                </div>
            </div>
            <div className={Style.NFTDetailsImg_box}>
                {shownNft.imageSongCloudinary ? (
                    <div className={Style.NFTDetailsImg_box_img}>
                        <Image
                            src={shownNft.imageSongCloudinary}
                            className={Style.NFTDetailsImg_box_img_img}
                            alt="token image"
                            fill
                            priority
                        />
                        <div className={Style.play_button_overlay}>
                            {(userOwn || !user) && <div>{(JSON.stringify(nft) === JSON.stringify([shownNft]) || JSON.stringify(nft) === JSON.stringify([userOwn])) && !stopFooter ?
                                <Image src={img.pause} alt="pause icon" width={40} height={40} onClick={() => { setStopFooter(true) }} /> :
                                <Image src={img.play} alt="play icon" width={40} height={40}
                                    onClick={() => { playSong() }} />
                            }</div>}
                        </div>
                    </div>
                ) : (<div className={Style.NFTDetailsImg_box_img} />)}
            </div>
            {openBuy &&
                <div className={Style.overlay} onMouseDown={() => setBuyItem()}>
                    <div className={Style.navbar_Buy} onMouseDown={(e) => e.stopPropagation()}>
                        <BuyItem nft={shownNft} setOpenBuy={setOpenBuy} />
                    </div>
                </div>}
        </div>
    )
}

export default NFTDetailsImg;