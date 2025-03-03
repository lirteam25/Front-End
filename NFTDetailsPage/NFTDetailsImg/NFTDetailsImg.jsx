import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { useActiveWalletChain } from "thirdweb/react";
import { polygon, polygonAmoy } from "thirdweb/chains";
import { createThirdwebClient, getContract } from "thirdweb";
import Link from "next/link";

//INTERNAL IMPORT
import Style from "./NFTDetailsImg.module.css";
import img from "./../../img/index";
import { InfoButton, ActionButton, ButtonConnectWallet, LoadingModule } from "../../components/componentsIndex";
import ChangePrice from "./ChangePrice/ChangePrice";
import BuyItem from "./BuyItem/BuyItem";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";


const NFTDetailsImg = ({ shownNft, user, userOwn, uid }) => {
    const { nft, setCurrentIndex, setOpenFooterAudio, setNft, setStopFooter, stopFooter, freeNFTTransfer, sendUserActivity, address, userLoaded } = useContext(NFTMarketplaceContext);

    const client = createThirdwebClient({
        clientId: process.env.THIRDWEB_PROJECT_ID,
    });

    const [timeRemaining, setTimeRemaining] = useState(null);
    const [ready, setIsReady] = useState(false);

    useEffect(() => {
        if (userLoaded && userOwn && shownNft.length !== 0) {
            console.log(userLoaded, userOwn, shownNft)
            setIsReady(true)
        }
    }, [userLoaded, userOwn, shownNft])

    useEffect(() => {
        const launchDate = new Date(shownNft.launch_date).getTime();

        const updateTimeRemaining = () => {
            const now = new Date().getTime();
            const timeDifference = launchDate - now;

            if (timeDifference <= 0) {
                setTimeRemaining("Ready")
                return;
            }

            const hours = Math.floor(timeDifference / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        };

        updateTimeRemaining(); // Initialize the timer with the correct remaining time

        const intervalId = setInterval(updateTimeRemaining, 1000); // Update every second

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [shownNft.launch_date]);


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

    const listed = shownNft?.maxClaimableSupply - shownNft?.supplyClaimed;

    return (
        <div className={Style.NFTDetailsImg}>
            <div className={Style.NFTDetailsImg_description}>
                <div className={Style.NFTDetailsImg_description_info}>
                    <div className={Style.NFTDetailsImg_description_info_title}>
                        <div className={Style.NFTDetailsImg_description_info_title_play}>
                            {ready ?
                                <> {(userOwn || !user) && <> {(JSON.stringify(nft) === JSON.stringify([shownNft]) || JSON.stringify(nft) === JSON.stringify([userOwn])) && !stopFooter ?
                                    <Image src={img.pause} alt="pause icon" className={Style.pause} onClick={() => { setStopFooter(true) }} /> :
                                    <Image src={img.play} alt="play icon" className={Style.play}
                                        onClick={() => { playSong() }} />
                                }</>}</> : <LoadingModule height="30px" width="30px" />}
                        </div>
                        <div className={Style.NFTDetailsImg_description_info_title_title}>
                            <h1 className="font-normal">{shownNft.song ? `${shownNft.song}` : "----"}</h1>
                            <h2 className="font-normal">
                                {shownNft.artist ? (shownNft.artist.map((art, i) => (
                                    <span key={i}>
                                        <Link className={Style.underline} href={{ pathname: "/artist", query: `uid=${shownNft.author_address[i]}` }}>
                                            {art}
                                        </Link>
                                        {i < shownNft.artist.length - 1 && ', '}
                                    </span>)
                                )) : "----"}
                            </h2>
                        </div>
                    </div>
                    <div className={`${Style.NFTDetailsImg_description_info_bottom} font-small`}>
                        <div>
                            <div>PRICE</div>
                            <div>{typeof shownNft.pricePerToken !== 'undefined' ? (shownNft.sellingQuantity == 0 ? <span style={{ color: "var(--main-color)" }}>NOT LISTED</span> : (shownNft.pricePerToken == 0 ? (<span style={{ color: "var(--main-color)" }}>FOR FREE</span>) : (`${shownNft.pricePerToken} $`))) : <span style={{ color: "var(--main-color)", fontFamily: "Space Grotesk" }}>Not listed</span>}</div>
                        </div>
                        <div>
                            <div>EDITION OF</div>
                            <div>{shownNft.maxClaimableSupply ? shownNft.maxClaimableSupply : "----"}</div>
                        </div>
                        <div>
                            <div>REMAINING</div>
                            <div>{listed ? listed : "----"}</div>
                        </div>
                    </div>
                </div>
                <p className={`${Style.NFTDetailsImg_description_middle} font-small`}>Includes unlimited streaming via Lir Music, plus high-quality download and the ability to resell it.</p>

                <div className={Style.NFTDetailsImg_description_info_actions}>
                    {shownNft.pricePerToken == 'undefined' ? (
                        <div>
                            <InfoButton text="---" />
                        </div>
                    ) : (<div> {address && user && chainId == targetChainId ?
                        (
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
                                            <InfoButton text="Reselling starts when all tracks are collected" />
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
                                        {timeRemaining !== "Ready" ? (<InfoButton text={timeRemaining} />) : (
                                            <div>
                                                {shownNft.pricePerToken == 0 ?
                                                    (<div>
                                                        {userOwn.amount > 0 ? (
                                                            <div>
                                                                <InfoButton text={`You have already colleted this track`} />
                                                                <div className={`${Style.link_to_your_NFTPage} font-normal`}>
                                                                    You already own {userOwn.amount} {userOwn.amount > 1 ? ("tokens") : ("token")}. <Link href={{ pathname: "/token-details", query: `token_id=${shownNft.token_id}&token_address=${shownNft.token_address}&uid=${user?.uid}` }} style={{ color: "var(--main-color)" }}> Manage {userOwn.amount > 1 ? ("them") : ("it")}</Link>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <ActionButton action={freelyRetriveToken} text="Collect the track for free" />
                                                        )
                                                        }
                                                    </div>)
                                                    :
                                                    (<div>
                                                        <ActionButton action={setBuyItem} text="Collect Track" />
                                                        {userOwn.length != 0 && (<div className={`${Style.link_to_your_NFTPage} font-normal`}>
                                                            You already own {userOwn.amount} {userOwn.amount > 1 ? ("tokens") : ("token")}. <Link href={{ pathname: "/token-details", query: `token_id=${shownNft.token_id}&token_address=${shownNft.token_address}&uid=${user?.uid}` }} style={{ color: "var(--main-color)" }}> Manage {userOwn.amount > 1 ? ("them") : ("it")}</Link>
                                                        </div>)}
                                                    </div>)}
                                            </div>
                                        )}

                                    </div>
                                )}
                            </div>
                        ) : (<ButtonConnectWallet text="Collect Track" />)}
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
                            {ready && (userOwn || !user) && <div>{(JSON.stringify(nft) === JSON.stringify([shownNft]) || JSON.stringify(nft) === JSON.stringify([userOwn])) && !stopFooter ?
                                <Image src={img.pause} alt="pause icon" width={40} height={40} style={{ cursor: "pointer" }} onClick={() => { setStopFooter(true) }} /> :
                                <Image src={img.play} alt="play icon" width={40} height={40} style={{ cursor: "pointer" }} onClick={() => { playSong() }} />
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