import React, { useEffect, useState, useContext } from 'react';
import { useActiveAccount } from "thirdweb/react";

import DOMPurify from 'dompurify';

import Style from "./ArtistInformation.module.css";
import { SongDisplay } from "./../../myProfilePage/myProfilePageIndex";
import { NFTMarketplaceContext } from '../../Context/NFTMarketplaceContext';
import { ActionButton, InfoButton, ButtonConnectWallet } from "../../components/componentsIndex";
import CreateSmartContract from './CreateSmartContract/CreateSmartContract';

const ArtistInformation = ({ tokenInfos, artistDescription, myArtistProfile, myNFTs }) => {

    const address = useActiveAccount()?.address;
    const [openRelease, setOpenRelease] = useState(true);
    const [openAbout, setOpenAbout] = useState(false);
    const [openCollectedItems, setOpenCollectedItems] = useState(false);
    const [openCreateSmartContract, setOpenCreateSmartContract] = useState(false);

    const openSmartCnt = () => {
        setOpenCreateSmartContract(true);
    }

    const closeSmartCnt = () => {
        setOpenCreateSmartContract(false);
    }

    const { user, setOpenCreateItem, renderString } = useContext(NFTMarketplaceContext);

    const openCrtItem = () => {
        setOpenCreateItem(true);
    }

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
                    Releases
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
                        {address ?
                            <div>
                                {user?.artist_minting_contract ?
                                    <ActionButton text="Create your limited edition track" action={openCrtItem} fontSize="0.9rem" /> :
                                    <ActionButton text="create your smart contract" action={openSmartCnt} fontSize="0.9rem" />}

                            </div> : <ButtonConnectWallet user={user} />
                        }
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

            {openCreateSmartContract && <div className={Style.overlay} onMouseDown={() => setOpenCreateSmartContract(false)}>
                <div className={Style.CreateSmartContract_box} onMouseDown={(e) => e.stopPropagation()}>
                    <CreateSmartContract closeCreateSmartContract={closeSmartCnt} />
                </div>
            </div>}
        </div>
    )
}

export default ArtistInformation