import React, { useContext, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaSpotify, FaSoundcloud } from "react-icons/fa";

import Style from "./ArtistProfileCard.module.css";
import img from "../../img/index";
import { NFTMarketplaceContext } from "./../../Context/NFTMarketplaceContext";

const ArtistProfileCard = ({ artist, myArtistProfile, setOpenArtistSettings }) => {
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
        copyToClipboard(artist.uid);
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
                </div>
            </div>
        </div>
    )
}

export default ArtistProfileCard;