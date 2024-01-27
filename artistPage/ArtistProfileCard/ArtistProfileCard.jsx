import React, { useContext, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaSpotify, FaSoundcloud } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";

import Style from "./ArtistProfileCard.module.css";
import img from "../../img/index";
import { NFTMarketplaceContext } from "./../../Context/NFTMarketplaceContext";

const ArtistProfileCard = ({ artist, lastRelease, myArtistProfile, setOpenArtistSettings }) => {
    const { setOpenToast, setToast, renderString } = useContext(NFTMarketplaceContext);


    function copyToClipboard(text) {
        if (!navigator.clipboard) {
            el.value = text;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setOpenToast(true);
            setToast("Copied to clipboard");
        } else {
            navigator.clipboard.writeText(text).then(
                function () {
                    setOpenToast(true);
                    setToast("Copied to clipboard");
                })
                .catch(
                    function () {
                        alert("err"); // error
                    });
        }
    }

    const handleCopyClick = () => {
        copyToClipboard(artist.wallet);
    };

    useEffect(() => {
        // Detect scroll event
        const handleScroll = () => {
            const artistRow = document.querySelector('#artist_bar');
            const scrollPosition = window.scrollY;
            if (window.innerWidth <= 480) {
                if (scrollPosition >= (window.innerWidth * 51.7 / 100 - 110)) {
                    artistRow.classList.add(Style.background_black);
                    artistRow.classList.remove(Style.gradient_overlay);
                }
                else {
                    artistRow.classList.add(Style.gradient_overlay);
                    artistRow.classList.remove(Style.background_black);
                }
            } else if (window.innerWidth > 480 && window.innerWidth <= 1023) {
                if (scrollPosition >= (window.innerWidth * 25.2 / 100 - 110)) {
                    artistRow.classList.add(Style.background_black);
                    artistRow.classList.remove(Style.gradient_overlay);
                } else {
                    artistRow.classList.add(Style.gradient_overlay);
                    artistRow.classList.remove(Style.background_black);
                }
            } else {
                if (scrollPosition >= (window.innerWidth * 20 / 100 - 95)) {
                    artistRow.classList.add(Style.background_black);
                    artistRow.classList.remove(Style.gradient_overlay);
                }
                else {
                    artistRow.classList.add(Style.gradient_overlay);
                    artistRow.classList.remove(Style.background_black);
                }
            }
        };

        // Attach scroll event listener
        window.addEventListener("scroll", handleScroll);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className={Style.ArtistProfileCard}>
            <div className={Style.ArtistProfileCard_top}>
                <div
                    className={Style.artist_background_image}
                    style={artist.artist_photo && { backgroundImage: `url(${artist.artist_photo})` }}
                >
                    <div className={`${Style.starting} ${Style.gradient_overlay}`} id='artist_bar'></div>
                    <div className={Style.ArtistProfileCard_top_content}>
                        <div className={Style.ArtistProfileCard_top_content_colums}>
                            <div className={Style.ArtistProfileCard_top_content_colums_1}>
                                <h1 className="font-large">{artist.artist_name ? artist.artist_name : "----"}</h1>
                                {myArtistProfile &&
                                    <div className={Style.ArtistProfileCard_top_content_colums_1_actions}>
                                        <Image src={img.edit} alt="profile user" width={20} height={20} onClick={() => setOpenArtistSettings(true)} />
                                    </div>}
                            </div>
                            <div className={Style.ArtistProfileCard_top_content_colums_2}>
                                <div className={Style.ArtistProfileCard_top_content_colums_2_wallet}>
                                    <div className={`${Style.ArtistProfileCard_top_content_colums_3_wallet} font-small`} onClick={handleCopyClick}>
                                        <Image src={img.copy} alt="copy" width={13} height={13} /> {artist.wallet ? (<div>{renderString(artist.wallet.toString(), 6)}<span style={{ fontFamily: "Space Grotesk" }}>...</span></div>) : ("----")}
                                    </div>
                                </div>
                                <div className={Style.ArtistProfileCard_top_content_colums_social}>
                                    {artist.artist_instagram && <a href={`${artist.artist_instagram}`} target="_blank"><FaInstagram /></a>}
                                    {artist.artist_spotify && <a href={`${artist.artist_spotify}`} target="_blank"><FaSpotify /></a>}
                                    {artist.artist_soundcloud && <a href={`${artist.artist_soundcloud}`} target="_blank"><FaSoundcloud /></a>}
                                </div>
                            </div>
                        </div>
                    </div>
                    {lastRelease && <div className={Style.ArtistProfileCard_top_realease}>
                        <div className={Style.ArtistProfileCard_top_realease_colums}>
                            <div className={Style.ArtistProfileCard_top_realease_colums_2}>
                                <Link href={{ pathname: "/token-details", query: `token_id=${lastRelease.token_id}&token_address=${lastRelease.token_address}&id=${lastRelease.owner_id}` }} className={Style.ArtistProfileCard_top_realease_colums_2_box}>
                                    {lastRelease.imageSongCloudinary ? (<Image src={lastRelease.imageSongCloudinary}
                                        alt="NFT image"
                                        width={110}
                                        height={110}
                                        className={Style.ArtistProfileCard_top_realease_colums_2_box_img}
                                    />) : (<div className={Style.ArtistProfileCard_top_realease_colums_2_box_emptyImage} />)}
                                    <div className={Style.ArtistProfileCard_top_realease_colums_2_box_info}>

                                        <div className={`${Style.ArtistProfileCard_top_realease_colums_2_box_info_top} font-normal`}>
                                            <div>{lastRelease.song ? lastRelease.song : "----"}</div>
                                            <div className={Style.ArtistProfileCard_top_realease_colums_2_box_info_artist}>{lastRelease.artist ? (lastRelease.artist) : ("----")}</div>
                                        </div>
                                        <div className={`${Style.ArtistProfileCard_top_realease_colums_2_box_info_bottom} font-small`}>
                                            <div className={Style.ArtistProfileCard_top_realease_colums_2_box_info_bottom_price}>
                                                <div>PRICE</div>
                                                <div>{typeof lastRelease.floor_price !== 'undefined' ?
                                                    (lastRelease.floor_price == 0 ? (<span style={{ color: "var(--main-color)" }}>FOR FREE</span>)
                                                        : (`${lastRelease.floor_price} $`)) : "---- $"}</div>
                                            </div>
                                            <div className={Style.ArtistProfileCard_top_realease_colums_2_box_info_bottom_supply}>
                                                <div>SUPPLY</div>
                                                <div>{lastRelease.supply ? (lastRelease.supply) : ("----")}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default ArtistProfileCard;