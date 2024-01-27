import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

//INTERNAL IMPORT
import Style from "./NFTDetailsImg.module.css";
import img from "./../../img/index";
import { ActionButton, InfoButton } from "../../components/componentsIndex";
import ChangePrice from "./ChangePrice/ChangePrice";
import DelistItem from "./DelistItem/DelistItem";
import ListItem from "./ListItem/ListItem";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";


const NFTDetailsImg = ({ shownNft, user, userOwn }) => {
    const { setOpenRegister, nft, setCurrentIndex, setOpenFooterAudio, setNft, setStopFooter, stopFooter, connectWallet, currentAccount, buyNFTMatic, freeNFTTransfer, sendUserActivity, renderString } = useContext(NFTMarketplaceContext);

    const openLogin = () => {
        setOpenRegister(true)
    }

    const [openChangePrice, setOpenChangePrice] = useState(false);
    const [openDelistItem, setOpenDelistItem] = useState(false);
    const [openListItem, setOpenListItem] = useState(false);

    const setNewPrice = () => {
        setOpenDelistItem(false); setOpenListItem(false);
        setOpenChangePrice(!openChangePrice);
    }

    const setDelistItem = () => {
        setOpenChangePrice(false); setOpenListItem(false);
        setOpenDelistItem(!openDelistItem);
    }

    const setListItem = () => {
        setOpenChangePrice(false); setOpenDelistItem(false);
        setOpenListItem(!openListItem);
    }

    const transactionNFTMatic = () => {
        buyNFTMatic(shownNft);
    }

    const freelyRetriveToken = () => {
        freeNFTTransfer(shownNft);
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

    const [timeRemaining, setTimeRemaining] = useState(false);

    useEffect(() => {
        // Get the target date (October 20th)
        const targetDate = new Date(`${shownNft.launch_date}`).getTime();;

        // Function to update the timer
        function updateTimer() {
            const currentDate = new Date().getTime();
            const timeDifference = targetDate - currentDate;

            if (timeDifference <= 0) {
                // The target date has passed
                setTimeRemaining(false);
            } else {
                // Calculate hours, minutes, and seconds
                const days = Math.floor((timeDifference / (1000 * 60 * 60 * 24)));
                const hours = Math.floor((timeDifference / (1000 * 60 * 60))) % 24;
                const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
                const seconds = Math.floor((timeDifference / 1000) % 60);

                // Format the time as HH:MM:SS
                const formattedTime = `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                // Update the timer state
                setTimeRemaining(formattedTime);
            }
        }

        // Call the updateTimer function initially
        updateTimer();

        // Update the timer every second (1000 milliseconds)
        const timerInterval = setInterval(updateTimer, 1000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(timerInterval);
    }, [shownNft]);

    return (
        <div className={Style.NFTDetailsImg}>
            <div className={Style.NFTDetailsImg_description}>
                <div className={Style.NFTDetailsImg_description_info}>
                    <div className={Style.NFTDetailsImg_description_info_title}>
                        <div className={Style.NFTDetailsImg_description_info_title_songAndartist}>
                            <h1 className="font-medium">{shownNft.song && shownNft.version ? `${shownNft.song}` : "----"}</h1>
                            <h2 className="font-medium"><Link href={{ pathname: "/artist", query: `cnt=${shownNft.token_address}` }}>{shownNft.artist ? shownNft.artist : "----"}</Link></h2>
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
                            <div>{typeof shownNft.price !== 'undefined' ? (shownNft.sellingQuantity == 0 ? "Track not listed" : (shownNft.price == 0 ? (<span style={{ color: "var(--main-color)" }}>FOR FREE</span>) : (`${shownNft.price} $`))) : "---- $"}</div>
                        </div>
                        <div>
                            <div>SUPPLY</div>
                            <div>{shownNft.supply ? shownNft.supply : "----"}</div>
                        </div>
                    </div>
                </div>

                <div className={Style.NFTDetailsImg_description_info_actions}>
                    {shownNft.price !== 'undefined' ? (
                        <div>{!user ? (
                            <ActionButton action={openLogin} text="Login or signup to collect" />
                        ) : (
                            <div>
                                {currentAccount === "" ? (
                                    <ActionButton action={connectWallet} text="connect wallet" />
                                ) : (
                                    <div>
                                        {user.wallet ? (<div>
                                            {user.wallet == shownNft.owner_of ? (
                                                <div>
                                                    {shownNft.sellingQuantity >= shownNft.amount ? (
                                                        <div>
                                                            <InfoButton text="You already listed all your owned tokens" />
                                                            {currentAccount == user.wallet ? (
                                                                <div className={Style.NFTDetailsImg_description_info_button}>
                                                                    <div>
                                                                        <ActionButton action={setNewPrice} text="CHANGE PRICE" />
                                                                        {openChangePrice &&
                                                                            <ChangePrice nft={shownNft} setOpenChangePrice={setOpenChangePrice} />
                                                                        }
                                                                    </div>
                                                                    <div>
                                                                        <ActionButton action={setDelistItem} text="DELIST" />
                                                                        {openDelistItem &&
                                                                            <DelistItem nft={shownNft} setOpenDelistItem={setOpenDelistItem} />
                                                                        }
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className={Style.NFTDetailsImg_description_info_button2}>
                                                                    <InfoButton text={`Connect ${renderString(shownNft.owner_of, 5)} wallet to change price or delist your tokens`} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            {currentAccount == user.wallet ? (
                                                                <div>
                                                                    <ActionButton action={setListItem} text="LIST YOUR track" />
                                                                    {openListItem &&
                                                                        <ListItem nft={shownNft} setOpenListItem={setOpenListItem} />
                                                                    }
                                                                    {shownNft.sellingQuantity > 0 && (
                                                                        <div className={Style.NFTDetailsImg_description_info_button}>
                                                                            <div>
                                                                                <ActionButton action={setNewPrice} text="CHANGE PRICE" />
                                                                                {openChangePrice &&
                                                                                    <ChangePrice nft={shownNft} setOpenChangePrice={setOpenChangePrice} />
                                                                                }
                                                                            </div>
                                                                            <div>
                                                                                <ActionButton action={setDelistItem} text="DELIST" />
                                                                                {openDelistItem &&
                                                                                    <DelistItem nft={shownNft} setOpenDelistItem={setOpenDelistItem} />
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className={Style.NFTDetailsImg_description_info_button2}>
                                                                    <InfoButton text={`Connect ${renderString(shownNft.owner_of, 5)} wallet to list your trakcs`} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div>
                                                    {currentAccount == user.wallet ? (
                                                        <div>
                                                            {shownNft.price == 0 ?
                                                                (<div>
                                                                    {userOwn.length != 0 ? (
                                                                        <div>
                                                                            <InfoButton text={`You have already colleted this track`} />
                                                                            <div className={`${Style.link_to_your_NFTPage} font-normal`}>
                                                                                You already own {userOwn.amount} {userOwn.amount > 1 ? ("tokens") : ("token")}. <Link href={{ pathname: "/token-details", query: `token_id=${shownNft.token_id}&token_address=${shownNft.token_address}&id=${userOwn.owner_id}` }} style={{ color: "var(--main-color)" }}> Manage {userOwn.amount > 1 ? ("them") : ("it")}</Link>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div>
                                                                            {timeRemaining ? (<div className={`${Style.timer} font-normal`}>
                                                                                <span>{timeRemaining}</span>
                                                                            </div>) :
                                                                                <ActionButton action={freelyRetriveToken} text="redeem the token for free" />}
                                                                        </div>
                                                                    )
                                                                    }
                                                                </div>)
                                                                :
                                                                (<div>
                                                                    <ActionButton action={transactionNFTMatic} text="BUY TOKEN" />
                                                                    {userOwn.length != 0 && (<div className={`${Style.link_to_your_NFTPage} font-normal`}>
                                                                        You already own {userOwn.amount} {userOwn.amount > 1 ? ("tokens") : ("token")}. <Link href={{ pathname: "/token-details", query: `token_id=${shownNft.token_id}&token_address=${shownNft.token_address}&id=${userOwn.owner_id}` }} style={{ color: "var(--main-color)" }}> Manage {userOwn.amount > 1 ? ("them") : ("it")}</Link>
                                                                    </div>)}
                                                                </div>)}
                                                        </div>) : (
                                                        <InfoButton text={`Connect ${renderString(user.wallet, 5)} wallet to purchase the token`} />
                                                    )}
                                                </div>
                                            )}
                                        </div>) : (
                                            <InfoButton text={`Disconnect the wallet ${renderString(currentAccount, 5)} and connect a new one`} />
                                        )}
                                    </div>
                                )}
                            </div>
                        )}</div>) : (<div>
                            <InfoButton text="---" />
                        </div>)}
                </div>

            </div>
            {<div className={Style.NFTDetailsImg_box}>
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
            </div>}
        </div>
    )
}

export default NFTDetailsImg;