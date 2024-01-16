import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DOMPurify from 'dompurify';

import Style from "./ArtistInformation.module.css";
import { SongDisplay } from "./../../myProfilePage/myProfilePageIndex";

const ArtistInformation = ({ tokenInfos, artistDescription, myArtistProfile, myNFTs }) => {

    const [openRelease, setOpenRelease] = useState(true);
    const [openAbout, setOpenAbout] = useState(false);
    const [openCollectedItems, setOpenCollectedItems] = useState(false);

    useEffect(() => {
        // Detect scroll event
        const handleScroll = () => {
            const title = document.querySelector(`.${Style.ArtistInformation_title}`);
            const bottom = document.querySelector(`.${Style.ArtistInformation_bottom}`)
            const scrollPosition = window.scrollY;

            if (window.innerWidth <= 480) {
                if (scrollPosition >= (window.innerWidth * 51.7 / 100 - 110)) {
                    title.classList.add(Style.fixedBlack);
                    bottom.classList.add(Style.under);
                }
                else {
                    title.classList.remove(Style.fixedBlack);
                    bottom.classList.remove(Style.under);
                }
            } else if (window.innerWidth > 480 && window.innerWidth <= 1023) {
                if (scrollPosition >= (window.innerWidth * 25.2 / 100 - 110)) {
                    title.classList.add(Style.fixedBlack);
                    bottom.classList.add(Style.under);
                } else {
                    title.classList.remove(Style.fixedBlack);
                    bottom.classList.remove(Style.under);
                }
            } else {
                if (scrollPosition >= (window.innerWidth * 20 / 100 - 90)) {
                    title.classList.add(Style.fixedBlack);
                    bottom.classList.add(Style.under);
                }
                else {
                    title.classList.remove(Style.fixedBlack);
                    bottom.classList.remove(Style.under);
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

    const decodeHtmlEntities = (html) => {
        const sanitizedHTML = DOMPurify.sanitize(html);
        const txt = document.createElement('textarea');
        txt.innerHTML = sanitizedHTML;
        return txt.value;
    };

    return (
        <div className={`${Style.ArtistInformation} font-medium`}>
            <div className={Style.ArtistInformation_title}>
                <div className={`${Style.ArtistInformation_title_release} ${openRelease && Style.ArtistInformation_title_active}`} onClick={() => { setOpenRelease(true); setOpenAbout(false); setOpenCollectedItems(false) }}>
                    All releases
                </div>
                <div className={`${Style.ArtistInformation_title_about} ${openAbout && Style.ArtistInformation_title_active}`} onClick={() => { setOpenAbout(true); setOpenRelease(false); setOpenCollectedItems(false) }}>
                    About
                </div>
                {myArtistProfile && <div className={`${Style.ArtistInformation_title_collection} ${openCollectedItems && Style.ArtistInformation_title_active}`} onClick={() => { setOpenCollectedItems(true); setOpenAbout(false); setOpenRelease(false) }}>
                    Collection
                </div>}
            </div>

            <div className={Style.ArtistInformation_bottom}>
                {openRelease && <div>
                    {myArtistProfile && <div>
                        <div className={Style.ArtistInformation_bottom_button}>
                            <Link href="./create" className={Style.ArtistInformation_bottom_button_text}>
                                create a new digital collectible
                            </Link>
                        </div>
                    </div>}
                    <SongDisplay myNFTs={tokenInfos} artist={true} />
                </div>}
                {openAbout &&
                    <div
                        className={`${Style.ArtistInformation_bottom_description} font-normal`}
                        dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(artistDescription) || "----" }}
                    ></div>
                }
                {myArtistProfile && openCollectedItems &&
                    <SongDisplay myNFTs={myNFTs} artist={false} />
                }
            </div>
        </div>
    )
}

export default ArtistInformation