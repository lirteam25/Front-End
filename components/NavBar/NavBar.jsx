import React, { useContext, useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { GoDotFill } from "react-icons/go";
import { CiSettings } from "react-icons/ci";
import { MdFileUpload } from "react-icons/md";
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

// Internal Imports
import Style from "./NavBar.module.css";
import images from "../../img";
import { Error, Loading, FooterAudioPlayer, Notification, Toast, ActionButton } from "../componentsIndex";
import SideBar from "./SideBar/SideBar";
import Login from "./Login/Login";
import Register from "./Register/Register";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import ArtistForm from "./ArtistForm/ArtistForm";
import ArtistSettings from "./ArtistSettings/ArtistSettings";
import AccountSettings from "./AccountSettings/AccountSettings";

//Context import
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const NavBar = () => {
    const [forgotPassword, setForgotPassword] = useState(false);
    const [openSideBar, setOpenSideBar] = useState(false);
    const [openProfileTab, setOpenProfileTab] = useState(false);

    const { setOpenErrorAuth,
        openRegister,
        setOpenRegister,
        openLogin,
        setOpenLogin,
        openError,
        openLoading,
        openFooterAudio,
        currentAccount,
        connectWallet,
        user,
        renderString,
        openNotification,
        openToast,
        openArtistForm,
        setOpenArtistForm,
        openAccountSetting,
        setOpenAccountSetting,
        openArtistSettings,
        setOpenArtistSettings,
        disconnectUser
    } = useContext(NFTMarketplaceContext);
    const { t } = useTranslation();

    const router = useRouter();
    const isIndexPage = router.pathname === '/';

    const closeProfileTab = () => {
        setOpenProfileTab(false);
        setOpenErrorAuth(false);
    }

    const closeLogin = () => {
        setOpenLogin(false);
        setOpenErrorAuth(false);
    };

    const closeRegister = () => {
        setOpenRegister(false);
        setOpenErrorAuth(false);
    }

    const closeForgot = () => {
        setForgotPassword(false);
        setOpenErrorAuth(false);
    }

    const closeArtistForm = () => {
        setOpenArtistForm(false);
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
                        />
                    </Link>
                    <Link className={Style.navbar_container_left_discover} href={{ pathname: `collection` }}>
                        collection
                    </Link>
                </div>
                <div className={Style.navbar_container_right}>
                    {/* Create button */}
                    {user == null ? (
                        <div className={Style.navbar_container_right_noUser}>
                            <div onClick={() => setOpenLogin(true)} className={Style.navbar_container_right_noUser_login}>
                                {t("_app:navbar_login")}
                            </div>
                            <div onClick={() => setOpenRegister(true)} className={Style.navbar_container_right_noUser_register}>
                                {t("_app:navbar_register")}
                            </div>
                        </div>
                    ) : (
                        <div className={Style.navbar_container_right_yesUser}>
                            <div className={Style.navbar_container_right_yesUser_connect}>
                                {currentAccount == "" ? (
                                    <div className={Style.navbar_container_right_yesUser_connect_button} onClick={() => connectWallet()}>
                                        {t("_app:navbar_connect")}
                                    </div>
                                ) : (
                                    <div className={Style.navbar_container_right_yesUser_connect_wallet}>
                                        {currentAccount == user.wallet ? (
                                            <div className={Style.wallet_icon_wrapper}>
                                                <div className={`${Style.wallet_info_window} font-small`}>
                                                    <GoDotFill color="green" size={15} className={Style.wallet_info_window_icon} />
                                                    <div>
                                                        {renderString(currentAccount, 6)}<span style={{ fontFamily: "Space Grotesk" }}>...</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (<div className={Style.navbar_container_right_yesUser_connect_wallet_wrong}>
                                            <div className={Style.wallet_icon_wrapper}>
                                                <div className={`${Style.wallet_info_window_wrong} font-small`}>
                                                    <GoDotFill className={Style.wallet_info_window_icon_wrong} />
                                                    <div>
                                                        {renderString(currentAccount, 6)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>)}
                                    </div>
                                )
                                }
                            </div>
                            <div className={Style.navbar_container_right_yesUser_profile}>
                                <Image src={images.user} alt="profile user" width={30.5} height={30.5} onClick={() => setOpenProfileTab(true)} className={Style.navbar_container_right_yesUser_profile_icon}
                                />
                                {openProfileTab &&
                                    <div className={`${Style.overlay_transparent} font-small`} onMouseDown={() => closeProfileTab()}>
                                        <div className={Style.profile_tab} onMouseDown={(e) => e.stopPropagation()}>
                                            <Link onClick={() => setOpenProfileTab(false)} className={Style.profile_tab_element} href="./my-profile">
                                                <Image src={images.user} alt="profile user" width={16} height={16} /> My collection
                                            </Link>
                                            {user.role == "artist" && user.artist_minting_contract && <Link href="./create" className={Style.profile_tab_element} onClick={() => closeProfileTab()}>
                                                <MdFileUpload size={16} /> Create a new digital collectible
                                            </Link>}
                                            <div className={Style.profile_tab_element} onClick={() => { closeProfileTab(); setOpenAccountSetting(true) }}>
                                                <CiSettings size={16} /> Settings
                                            </div>
                                            <div className={Style.profile_tab_logout}>
                                                <ActionButton action={disconnectUser} text="log out" fontSize="0.9rem" />
                                            </div>
                                        </div>
                                    </div>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className={Style.navbar_sidebar} onClick={() => setOpenSideBar(!openSideBar)}>
                <span className={`${Style.icon} ${openSideBar ? Style.close : ""}`}>
                    <span className={Style.line}></span>
                    <span className={Style.line}></span>
                    <span className={Style.line}></span>
                </span>
            </div>

            {openSideBar && (
                <div className={Style.overlay_sidebar}>
                    <div className={`${Style.navbar_openSidebar} ${openSideBar ? 'open-sidebar-transition' : ''}`}>
                        <SideBar setOpenSideBar={setOpenSideBar} user={user} setOpenRegister={setOpenRegister} setOpenLogin={setOpenLogin} />
                    </div>
                </div>
            )}


            {openLogin &&
                <div className={Style.overlay} onMouseDown={() => closeLogin()}>
                    <div className={Style.navbar_Login} onMouseDown={(e) => e.stopPropagation()}>
                        <Login closeLogin={closeLogin} setOpenRegister={setOpenRegister} setForgotPassword={setForgotPassword} />
                    </div>
                </div>}

            {openRegister &&
                <div className={Style.overlay} onMouseDown={() => closeRegister()}>
                    <div className={Style.navbar_Login} onMouseDown={(e) => e.stopPropagation()}>
                        <Register setOpenLogin={setOpenLogin} closeRegister={closeRegister} />
                    </div>
                </div>}

            {forgotPassword &&
                <div className={Style.overlay} onMouseDown={() => closeForgot()}>
                    <div className={Style.navbar_ForgotPassword} onMouseDown={(e) => e.stopPropagation()}>
                        <ForgotPassword closeForgot={closeForgot} />
                    </div>
                </div>}
            {openArtistForm && <div className={Style.overlay} onMouseDown={() => closeArtistForm()}>
                <div className={Style.navbar_ArtistForm} onMouseDown={(e) => e.stopPropagation()}>
                    <ArtistForm closeArtistForm={closeArtistForm} />
                </div>
            </div>}

            {openAccountSetting && <div className={Style.overlay} onMouseDown={() => closeAccountSettings()}>
                <div className={Style.navbar_AccountSetting} onMouseDown={(e) => e.stopPropagation()}>
                    <AccountSettings closeArtistSettings={closeAccountSettings} />
                </div>
            </div>}

            {openArtistSettings && <div className={Style.overlay} onMouseDown={() => closeArtistSettings()}>
                <div className={Style.navbar_ArtistSettings} onMouseDown={(e) => e.stopPropagation()}>
                    <ArtistSettings closeArtistSettings={closeArtistSettings} />
                </div>
            </div>}

            {openError && <Error />}
            {openLoading && <Loading />}
            {openFooterAudio && <FooterAudioPlayer />}
            {openNotification && <Notification />}
            {openToast && <Toast />}

        </div>
    );
}


export default NavBar;
