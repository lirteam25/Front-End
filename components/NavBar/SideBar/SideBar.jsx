import React, { useState, useContext } from 'react';
import Link from "next/link";
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';
import Image from 'next/image';


//INRTERNAL IMPORTS
import Style from "./SideBar.module.css";
import img from "./../../../img/index";
import UpdateUsername from "../AccountSettings/UpdateUsername/UpdateUsername";
import UpdatePassword from "../AccountSettings/UpdatePassword/UpdatePassword";
import UnlinkWallet from "../AccountSettings/UnlinkCryptoWallet/UnlinkCryptoWallet";
import DeleteAccount from "../AccountSettings/DeleteAccount/DeleteAccount";




const SideBar = ({ setOpenSideBar, user, setOpenRegister, setOpenLogin }) => {

    const { disconnectUser } = useContext(NFTMarketplaceContext);
    const [update, setUpdate] = useState(false);
    const [updateAccount, setUpdateAccount] = useState(false);
    const [updatePassword, setUpdatePassword] = useState(false);
    const [unlinkCryptoWallet, setUnlinkCryptoWallet] = useState(false);
    const [deleteAccount, setDeleteAccount] = useState(false);

    const openAndCloseUpdateAccount = () => {
        setUpdateAccount(!updateAccount);
        setUpdatePassword(false); setUnlinkCryptoWallet(false); setDeleteAccount(false);
    }

    const openAndCloseUpdatePassword = () => {
        setUpdatePassword(!updatePassword);
        setUpdateAccount(false); setUnlinkCryptoWallet(false); setDeleteAccount(false);
    }

    const openAndCloseUnlinkCryptoWallet = () => {
        setUnlinkCryptoWallet(!unlinkCryptoWallet);
        setUpdatePassword(false); setUpdateAccount(false); setDeleteAccount(false);
    }

    const openAndCloseDeleteAccount = () => {
        setDeleteAccount(!deleteAccount);
        setUpdatePassword(false); setUnlinkCryptoWallet(false); setUpdateAccount(false);
    }

    return (
        <div className={Style.sidebar}>
            <div className={`${Style.sidebar_center} font-medium`}>
                {user ? (
                    <div className={Style.sidebar_center_userIn}>
                        <div className={Style.sidebar_center_userIn_top}>
                            <Link className={Style.sidebar_center_userIn_top_left} onClick={() => setOpenSideBar(false)} href={{ pathname: "/my-profile" }}>
                                <Image src={img.user} alt="user icon" width={32} heigh={32} />
                                <div className={`${Style.sidebar_center_userIn_top_email}`}>{user.displayName}</div>
                            </Link>
                            <div onClick={() => setUpdate(!update)}>
                                <Image src={img.settings} alt="setting icon" width={32} heigh={32} />
                            </div>
                        </div>
                        {update && (
                            <div className={Style.sidebar_center_userIn_update}>
                                <div className={Style.sidebar_center_userIn_update_box}>
                                    <div className={`${Style.sidebar_center_userIn_update_box_title} font-medium`} onClick={() => openAndCloseUpdateAccount()}>
                                        update username
                                    </div>
                                    {updateAccount &&
                                        <div className={Style.sidebar_center_userIn_update_box_content}>
                                            <UpdateUsername />
                                        </div>
                                    }
                                </div>
                                <div className={Style.sidebar_center_userIn_update_box}>
                                    <div>
                                        <div className={`${Style.sidebar_center_userIn_update_box_title} font-medium`} onClick={() => openAndCloseUpdatePassword()}>
                                            update password
                                        </div>
                                        {updatePassword &&
                                            <div className={Style.sidebar_center_userIn_update_box_content}>
                                                <UpdatePassword />
                                            </div>

                                        }
                                    </div>
                                </div>
                                {user.wallet && <div className={Style.sidebar_center_userIn_update_box}>
                                    <div className={`${Style.sidebar_center_userIn_update_box_title} font-medium`} onClick={() => openAndCloseUnlinkCryptoWallet()}>
                                        unlink crypto wallet
                                    </div>
                                    {unlinkCryptoWallet &&
                                        <div className={Style.sidebar_center_userIn_update_box_content}>
                                            <UnlinkWallet />
                                        </div>
                                    }
                                </div>}
                                <div className={Style.sidebar_center_userIn_update_box}>
                                    <div className={`${Style.sidebar_center_userIn_update_box_title} font-medium`} onClick={() => openAndCloseDeleteAccount()}>
                                        delete account
                                    </div>
                                    {deleteAccount &&
                                        <div className={Style.sidebar_center_userIn_update_box_content} onMouseDown={(e) => e.stopPropagation()}>
                                            <DeleteAccount />
                                        </div>
                                    }
                                </div>
                                <div className={Style.sidebar_center_userIn_update_box}>
                                    <div className={`${Style.sidebar_center_userIn_update_box_title} font-medium`} onClick={() => disconnectUser()}>
                                        log out
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={Style.sidebar_center_login}>
                        <div onClick={() => { setOpenLogin(true) }} className={Style.sidebar_center_login_login}>log in</div>
                        <div onClick={() => { setOpenRegister(true) }} className={Style.sidebar_center_register}>sign up</div>
                    </div>
                )}
                <div className={Style.sidebar_center_element}>
                    <Link href={"./collection"} onClick={() => setOpenSideBar(false)}>collection</Link>
                </div>
                {user && <div className={Style.sidebar_center_element} >
                    <Link href={"./my-profile"} onClick={() => setOpenSideBar(false)}>my items</Link>
                </div>}
                <div className={Style.sidebar_center_element} >
                    <Link href={"./about-us"} onClick={() => setOpenSideBar(false)}>about</Link>
                </div>
                <div className={Style.sidebar_center_bottom}>
                    get in touch <a style={{ color: "var(--main-color)", textDecoration: "underline", textAlign: "right" }} href="mailto:info@lirmusic.com">info@lirmusic.com</a>
                </div>
            </div>
        </div>
    )
}

export default SideBar;