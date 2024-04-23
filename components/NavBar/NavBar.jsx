import React, { useContext, useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { GoDotFill } from "react-icons/go";
import { useRouter } from 'next/router';

// Internal Imports
import Style from "./NavBar.module.css";
import images from "../../img";
import { Error, Loading, FooterAudioPlayer, Notification, Toast, NavBarConnectWallet } from "../componentsIndex";
import SideBar from "./SideBar/SideBar";
import Login from "./Login/Login";
import Register from "./Register/Register";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import ArtistForm from "./ArtistForm/ArtistForm";
import ArtistSettings from "./ArtistSettings/ArtistSettings";
import AccountSettings from "./AccountSettings/AccountSettings";
import CreateItem from "./CreateItems/CreateItems";

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
        user,
        openNotification,
        openToast,
        openArtistForm, setOpenArtistForm,
        openAccountSetting, setOpenAccountSetting,
        openArtistSettings, setOpenArtistSettings,
        openCreateItem, setOpenCreateItem,
        disconnectUser
    } = useContext(NFTMarketplaceContext);
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

    const closeCreateItems = () => {
        setOpenCreateItem(false);
        setOpenErrorAuth(false);
    }

    useEffect(() => {
        if (isIndexPage) {
            // Detect scroll event
            const handleScroll = () => {
                const navbar = document.querySelector(`.${Style.navbar}`);
                const signUp = document.getElementById("signUp");
                const discover = document.getElementById("discover");
                const docs = document.getElementById("docs");
                const logIn = document.getElementById("logIn");
                const wallet = document.getElementById("wallet");
                const scrollPosition = window.scrollY;
                if (scrollPosition >= (window.innerHeight - 60)) {
                    navbar.classList.add(Style.greyNavbar);
                    navbar.classList.remove(Style.transparentNavbar);


                    signUp && signUp.classList.add(Style.red)
                    signUp && signUp.classList.remove(Style.black)

                    wallet && wallet.classList.add(Style.red)
                    wallet && wallet.classList.remove(Style.black)

                    discover.classList.remove(Style.black_hover);
                    docs.classList.remove(Style.black_hover);
                    logIn && logIn.classList.remove(Style.black_hover);

                    discover.classList.add(Style.red_hover);
                    docs.classList.add(Style.red_hover);
                    logIn && logIn.classList.add(Style.red_hover);

                } else if (!openSideBar) {
                    navbar.classList.add(Style.transparentNavbar);
                    navbar.classList.remove(Style.greyNavbar);

                    signUp && signUp.classList.add(Style.black);
                    signUp && signUp.classList.remove(Style.red);

                    wallet && wallet.classList.add(Style.black);
                    wallet && wallet.classList.remove(Style.red);

                    discover.classList.add(Style.black_hover);
                    docs.classList.add(Style.black_hover);
                    logIn && logIn.classList.add(Style.black_hover);

                    discover.classList.remove(Style.red_hover);
                    docs.classList.remove(Style.red_hover);
                    logIn && logIn.classList.remove(Style.red_hover);
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
                        <Link id="discover" className={`${!isIndexPage ? Style.red_hover : Style.black_hover}`} href={{ pathname: `collection` }}>collection</Link>
                        <Link id="docs" className={`${!isIndexPage ? Style.red_hover : Style.black_hover}`} target="_blank" href={"https://lirmusic.notion.site/Lir-Music-info-694b4a6252224f9fba741bc2397f6212?pvs=4"}>info</Link>
                    </div>
                </div>
                <div className={Style.navbar_container_right}>
                    {/* Create button */}
                    {user == null ? (
                        <div className={Style.navbar_container_right_noUser}>
                            <div id="logIn" onClick={() => setOpenLogin(true)} className={`${!isIndexPage ? Style.red_hover : Style.black_hover}`}>
                                log in
                            </div>
                            <div id="signUp" onClick={() => setOpenRegister(true)} className={`${!isIndexPage ? Style.red : Style.black}`}>
                                sign up
                            </div>
                        </div>
                    ) : (
                        <div className={Style.navbar_container_right_yesUser}>
                            <div className={Style.navbar_container_right_yesUser_connect}>
                                <NavBarConnectWallet user={user} />
                            </div>
                            <div className={Style.navbar_container_right_yesUser_profile}>
                                <Image src={images[`utente_${user.picture}`]} alt="profile user" width={30.5} height={30.5} onClick={() => setOpenProfileTab(true)} className={Style.navbar_container_right_yesUser_profile_icon}
                                />
                                {openProfileTab &&
                                    <div className={`${Style.overlay_transparent} font-small`} onMouseDown={() => closeProfileTab()}>
                                        <div className={Style.profile_tab} onMouseDown={(e) => e.stopPropagation()}>
                                            <Link onClick={() => setOpenProfileTab(false)} className={Style.profile_tab_element} href="./my-profile">
                                                <Image src={images.user} alt="profile user" width={16} height={16} /> My Profile
                                            </Link>
                                            {user.role == "artist" && !user.artist_name && !user.artist_photo && !user.artist_description && <div className={Style.profile_tab_element} onClick={() => { closeProfileTab(); setOpenArtistSettings(true) }}>
                                                <Image src={images.manage_accounts} alt="settings" width={16} height={16} /> Create artist profile
                                            </div>}
                                            {user.role == "artist" && user.artist_minting_contract && <div className={Style.profile_tab_element} onClick={() => { closeProfileTab(); setOpenCreateItem(true) }}>
                                                <Image src={images.upload} alt="upload" width={16} height={16} /> Create a new digital collectible
                                            </div>}
                                            <div className={Style.profile_tab_element} onClick={() => { closeProfileTab(); setOpenAccountSetting(true) }}>
                                                <Image src={images.manage_accounts} alt="setting" width={16} height={16} /> Settings
                                            </div>
                                            <div className={Style.profile_tab_element} onClick={() => disconnectUser()}>
                                                <Image src={images.logout} alt="logout" width={16} height={16} /> log out
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

            {
                openSideBar && (
                    <div className={Style.overlay_sidebar}>
                        <div className={`${Style.navbar_openSidebar} ${openSideBar ? 'open-sidebar-transition' : ''}`}>
                            <SideBar setOpenSideBar={setOpenSideBar} user={user} setOpenRegister={setOpenRegister} setOpenLogin={setOpenLogin} />
                        </div>
                    </div>
                )
            }


            {
                openLogin &&
                <div className={Style.overlay} onMouseDown={() => closeLogin()}>
                    <div className={Style.navbar_Login} onMouseDown={(e) => e.stopPropagation()}>
                        <Login closeLogin={closeLogin} setOpenRegister={setOpenRegister} setForgotPassword={setForgotPassword} />
                    </div>
                </div>
            }

            {
                openRegister &&
                <div className={Style.overlay} onMouseDown={() => closeRegister()}>
                    <div className={Style.navbar_Login} onMouseDown={(e) => e.stopPropagation()}>
                        <Register setOpenLogin={setOpenLogin} closeRegister={closeRegister} />
                    </div>
                </div>
            }

            {
                forgotPassword &&
                <div className={Style.overlay} onMouseDown={() => closeForgot()}>
                    <div className={Style.navbar_ForgotPassword} onMouseDown={(e) => e.stopPropagation()}>
                        <ForgotPassword closeForgot={closeForgot} />
                    </div>
                </div>
            }
            {
                openArtistForm && <div className={Style.overlay} onMouseDown={() => closeArtistForm()}>
                    <div className={Style.navbar_ArtistForm} onMouseDown={(e) => e.stopPropagation()}>
                        <ArtistForm closeArtistForm={closeArtistForm} />
                    </div>
                </div>
            }

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
