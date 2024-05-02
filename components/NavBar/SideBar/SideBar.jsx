import React, { useContext } from 'react';
import Link from "next/link";
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';
import Image from 'next/image';
import CircularProgress from '@mui/material/CircularProgress';
import { useActiveAccount } from "thirdweb/react";


//INRTERNAL IMPORTS
import Style from "./SideBar.module.css";
import img from "./../../../img/index";
import { ButtonConnectWallet } from "../../componentsIndex"

const SideBar = ({ setOpenSideBar, user }) => {

    const { setOpenAccountSetting, disconnectUser } = useContext(NFTMarketplaceContext);

    const account = useActiveAccount();

    return (
        <div className={Style.sidebar}>
            <div className={`${Style.sidebar_center} font-medium`}>
                {account && user ? (
                    <div className={Style.sidebar_center_userIn}>
                        <div className={Style.sidebar_center_userIn_top}>
                            <Link className={Style.sidebar_center_userIn_top_left} onClick={() => setOpenSideBar(false)} href={{ pathname: "/my-profile" }}>
                                {user ? <Image src={img[`utente_${user.picture}`]} alt="user icon" width={32} heigh={32} /> : <CircularProgress size={20} variant="indeterminate" color="inherit" />}
                                <div className={`${Style.sidebar_center_userIn_top_email}`}>{user?.displayName}</div>
                            </Link>
                            <div onClick={() => setOpenAccountSetting(true)}>
                                <Image src={img.settings} alt="setting icon" width={32} heigh={32} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={Style.sidebar_center_login}>
                        <ButtonConnectWallet />
                    </div>
                )}
                <Link href={"./collection"} onClick={() => setOpenSideBar(false)}>
                    <div className={Style.sidebar_center_element}>collection</div>
                </Link>
                <Link href={"https://www.docs.lirmusic.com"} onClick={() => setOpenSideBar(false)}>
                    <div className={Style.sidebar_center_element}>docs</div>
                </Link>
                <Link href={"./about-us"} onClick={() => setOpenSideBar(false)}>
                    <div className={Style.sidebar_center_element} >about</div>
                </Link>
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