import React, { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { isMobile } from 'react-device-detect';

//INTERNAL IMPORT
import Style from "./NFTCardTwo.module.css";
import img from "./../../img/index";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const NFTCardTwo = ({ sellingNFTs, isSingle }) => {

    const { setOpenFooterAudio, setNft, nft, setCurrentIndex, setStopFooter, stopFooter, sendUserActivity } = useContext(NFTMarketplaceContext);

    const loading = [{ _id: 0 }, { _id: 1 }, { _id: 2 }, { _id: 3 }, { _id: 4 }, { _id: 5 }, { _id: 6 }, { _id: 7 }, { _id: 8 }, { _id: 9 }]

    return (
        <div className={`${Style.NFTCardTwo} ${!sellingNFTs && Style.pulseClass} ${isSingle && Style.single}`}>
            {sellingNFTs ? (sellingNFTs.map((el, i) => (
                <Link
                    href={
                        { pathname: "/token-details", query: `token_id=${el.token_id}&token_address=${el.token_address}&uid=${el.author_address[0]}` }}
                    className={`${Style.NFTCardTwo_box}`}
                    key={el._id}
                >
                    <div className={Style.NFTCardTwo_box_img}><Image
                        src={el.imageSongCloudinary}
                        alt="NFT image"
                        className={Style.NFTCardTwo_box_img_img}
                        fill
                        sizes="10"
                        priority
                    />
                        <div className={Style.play_button_overlay}>
                            {JSON.stringify(nft) === JSON.stringify(sellingNFTs.slice(i, i + 1)) && !stopFooter ?
                                <span className={Style.play_button_overlay_button}><Image src={img.pause} alt="pause icon" width={30} height={30} onClick={(e) => { e.preventDefault(); setStopFooter(true) }} /></span> :
                                <span className={Style.play_button_overlay_button}><Image src={img.play} alt="pause icon" width={30} height={30}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentIndex(0); setOpenFooterAudio(true); setNft(sellingNFTs.slice(i, i + 1)); setStopFooter(false);
                                        sendUserActivity(sellingNFTs.slice(i, i + 1)[0].token_id, sellingNFTs.slice(i, i + 1)[0].token_address, true)
                                    }} />
                                </span>
                            }
                        </div>
                    </div>
                    <div className={Style.NFTCardTwo_box_info}>
                        <div className={Style.NFTCardTwo_box_info_top}>
                            <h2 className="font-normal">{el.song}</h2>
                            <h3 className="font-normal">
                                {el.artist.map((art, i) => (
                                    <span key={i} className={Style.NFTCardTwo_box_info_top_action}>
                                        {isMobile ? (
                                            <span>{art}</span>
                                        ) : (
                                            <Link href={{ pathname: "/artist", query: { uid: el.author_address[i] } }} className={Style.underline}>
                                                {art}
                                            </Link>
                                        )}
                                        {i < el.artist.length - 1 && ', '}
                                    </span>
                                ))}
                            </h3>
                        </div>
                        <div className={` ${Style.NFTCardTwo_box_info_bottom} font-small`}>
                            <h4>limited edition of {el.maxClaimableSupply}</h4>
                        </div>
                    </div>
                </Link>
            ))) :
                (loading.map((el, i) => (
                    <div className={Style.NFTCardTwo_box_loading} key={el._id}>
                        <div className={Style.NFTCardTwo_box_img}>
                            <div className={Style.image_placeholder} />
                        </div>
                        <div className={Style.NFTCardTwo_box_info}>
                            <div className={Style.NFTCardTwo_box_info_top}>
                                <h2 className="font-normal">----</h2>
                                <h3 className="font-normal">----</h3>
                            </div>
                            <div className={` ${Style.NFTCardTwo_box_info_bottom} font-small`}>
                                ----
                            </div>
                        </div>
                    </div>
                )))}

        </div >
    );
};

export default NFTCardTwo;