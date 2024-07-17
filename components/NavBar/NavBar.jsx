import React, { useContext, useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router';

// Internal Imports
import Style from "./NavBar.module.css";
import images from "../../img";
import { Error, Loading, FooterAudioPlayer, Notification, Toast, NavBarConnectWallet } from "../componentsIndex";
import SideBar from "./SideBar/SideBar";
import ArtistSettings from "./ArtistSettings/ArtistSettings";
import AccountSettings from "./AccountSettings/AccountSettings";
import CreateItem from "./CreateItems/CreateItems";
import SetUsername from "./SetUsername/SetUsername";

//Context import
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const NavBar = () => {
    const [openSideBar, setOpenSideBar] = useState(false);
    const [openProfileTab, setOpenProfileTab] = useState(false);

    const { setOpenErrorAuth,
        openError,
        openLoading,
        openFooterAudio,
        user,
        openNotification,
        openToast,
        openUsername,
        openAccountSetting, setOpenAccountSetting,
        openArtistSettings, setOpenArtistSettings,
        openCreateItem, setOpenCreateItem
    } = useContext(NFTMarketplaceContext);
    const router = useRouter();
    const isIndexPage = router.pathname === '/';

    const closeProfileTab = () => {
        setOpenProfileTab(false);
        setOpenErrorAuth(false);
    }

    const closeAccountSettings = () => {
        setOpenAccountSetting(false);
        setOpenErrorAuth(false);
    }

    const closeArtistSettings = () => {
        setOpenArtistSettings(false);
        setOpenErrorAuth(false);
    }

    const closeCreateItems = () => {
        setOpenCreateItem(false);
        setOpenErrorAuth(false);
    }

    useEffect(() => {
        if (isIndexPage) {
            // Detect scroll event
            const handleScroll = () => {
                const navbar = document.querySelector(`.${Style.navbar}`);
                const scrollPosition = window.scrollY;
                if (scrollPosition >= (window.innerHeight - 60)) {
                    navbar.classList.add(Style.greyNavbar);
                    navbar.classList.remove(Style.transparentNavbar);
                } else if (!openSideBar) {
                    navbar.classList.add(Style.transparentNavbar);
                    navbar.classList.remove(Style.greyNavbar);
                }
            };

            // Attach scroll event listener
            window.addEventListener("scroll", handleScroll);

            // Clean up event listener on component unmount
            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        }
    }, [router, openSideBar]);

    return (
        <div className={`${Style.navbar} ${(!isIndexPage || openSideBar) ? Style.greyNavbar : Style.transparentNavbar}`}>
            <div className={Style.navbar_container}>
                <div className={Style.navbar_container_left}>
                    <Link href={"./"} onClick={() => setOpenSideBar(false)} className={Style.navbar_container_left_logo}>
                        <Image
                            src={images.logo}
                            alt="Lir logo"
                            height={30.5}
                            width="auto"
                            priority
                        />
                    </Link>
                    <div className={Style.navbar_container_left_discover}>
                        <Link id="discover" className={Style.red_hover} href={{ pathname: `collection` }}>collection</Link>
                        <Link id="docs" className={Style.red_hover} target="_blank" href={"https://lirmusic.notion.site/Lir-Music-info-694b4a6252224f9fba741bc2397f6212?pvs=4"}>info</Link>
                    </div>
                </div>
                <div className={Style.navbar_container_right}>
                    <NavBarConnectWallet openProfileTab={openProfileTab} setOpenProfileTab={setOpenProfileTab} closeProfileTab={closeProfileTab} />
                </div>
            </div>
            <div className={Style.navbar_sidebar} onClick={() => setOpenSideBar(!openSideBar)}>
                <span className={`${Style.icon} ${openSideBar ? Style.close : ""}`}>
                    <span className={Style.line}></span>
                    <span className={Style.line}></span>
                    <span className={Style.line}></span>
                </span>
            </div>

            {
                openSideBar && (
                    <div className={Style.overlay_sidebar}>
                        <div className={`${Style.navbar_openSidebar} ${openSideBar ? 'open-sidebar-transition' : ''}`}>
                            <SideBar setOpenSideBar={setOpenSideBar} user={user} />
                        </div>
                    </div>
                )
            }

            {
                openUsername && (
                    <div className={Style.overlay}>
                        <div className={Style.navbar_openUsername}>
                            <SetUsername />
                        </div>
                    </div>
                )}

            {
                openAccountSetting && <div className={Style.overlay} onMouseDown={() => closeAccountSettings()}>
                    <div className={Style.navbar_AccountSetting} onMouseDown={(e) => e.stopPropagation()}>
                        <AccountSettings closeArtistSettings={closeAccountSettings} />
                    </div>
                </div>
            }

            {
                openArtistSettings && <div className={Style.overlay} onMouseDown={() => closeArtistSettings()}>
                    <div className={Style.navbar_ArtistSettings} onMouseDown={(e) => e.stopPropagation()}>
                        <ArtistSettings closeArtistSettings={closeArtistSettings} />
                    </div>
                </div>
            }

            {
                openCreateItem && <div className={Style.overlay} onMouseDown={() => closeCreateItems()}>
                    <div className={Style.navbar_CreateItem} onMouseDown={(e) => e.stopPropagation()}>
                        <CreateItem closeCreateItems={closeCreateItems} />
                    </div>
                </div>
            }

            {openError && <Error />}
            {openLoading && <Loading />}
            {openFooterAudio && <FooterAudioPlayer />}
            {openNotification && <Notification />}
            {openToast && <Toast />}
        </div >
    );
}


export default NavBar;
