import React, { useState, useContext } from 'react';
import Link from "next/link";
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';
import Image from 'next/image';


//INRTERNAL IMPORTS
import Style from "./SideBar.module.css";
import img from "./../../../img/index";

const SideBar = ({ setOpenArtistSettings, setOpenSideBar, user, setOpenRegister, setOpenLogin }) => {

    const { setOpenAccountSetting, disconnectUser } = useContext(NFTMarketplaceContext);

    return (
        <div className={Style.sidebar}>
            <div className={`${Style.sidebar_center} font-medium`}>
                {user ? (
                    <div className={Style.sidebar_center_userIn}>
                        <div className={Style.sidebar_center_userIn_top}>
                            <Link className={Style.sidebar_center_userIn_top_left} onClick={() => setOpenSideBar(false)} href={{ pathname: "/my-profile" }}>
                                <Image src={img[`utente_${user.picture}`]} alt="user icon" width={32} heigh={32} />
                                <div className={`${Style.sidebar_center_userIn_top_email}`}>{user.displayName}</div>
                            </Link>
                            <div onClick={() => setOpenAccountSetting(true)}>
                                <Image src={img.settings} alt="setting icon" width={32} heigh={32} />
                            </div>
                        </div>
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
                <div className={Style.sidebar_center_element} >
                    <Link href={"./about-us"} onClick={() => setOpenSideBar(false)}>about</Link>
                </div>
                {user && <div className={Style.sidebar_center_element} >
                    <div className="font-medium" onClick={() => disconnectUser()}>
                        log out
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default SideBar;