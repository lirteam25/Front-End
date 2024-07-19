import React, { useContext } from 'react';
import { ConnectButton, useActiveWalletChain, useSwitchActiveWalletChain } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";
import { polygon, polygonAmoy } from "thirdweb/chains";
import { GoDotFill } from "react-icons/go";
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';
import CircularProgress from '@mui/material/CircularProgress';
import images from "../../../img/index";
import Image from 'next/image';
import Link from 'next/link';


import Style from "./Wallet.module.css";

const wallets = [
    inAppWallet()
];

const recommendedWallets = [
    inAppWallet()
]


const NavBarConnectWallet = ({ openProfileTab, setOpenProfileTab, closeProfileTab, address }) => {

    const client = createThirdwebClient({
        clientId: process.env.THIRDWEB_PROJECT_ID,
    });

    const { completeLogin, renderString, user, disconnectUser, setOpenAccountSetting, setOpenCreateItem, setOpenArtistSettings } = useContext(NFTMarketplaceContext);

    const chain = process.env.ACTIVE_CHAIN == "polygon" ? polygon : polygonAmoy
    const chainId = useActiveWalletChain()?.id;

    const targetChainId = process.env.ACTIVE_CHAIN == "polygon" ? 137 : 80002;

    const switchChain = useSwitchActiveWalletChain();

    return (
        <ConnectButton
            wallets={wallets}
            client={client}
            chain={chain}
            recommendedWallets={recommendedWallets}
            connectButton={{
                label: "SIGN IN",
                style: {
                    fontFamily: "Space Grotesk",
                    fontSize: "1rem",
                    borderRadius: "0px",
                    backgroundColor: "transparent",
                    textAlign: "left",
                    color: "var(--main-color)",
                    padding: 0,
                    margin: 0,
                    minWidth: "unset",
                    height: "60px",
                }
            }}

            connectModal={{
                termsOfServiceUrl: "https://www.iubenda.com/terms-and-conditions/94474485",
                privacyPolicyUrl: "https://www.iubenda.com/privacy-policy/94474485",
                welcomeScreen: {
                    title: "LIR Music",
                    subtitle: "Connect your wallet to LIR Music",
                    img: {
                        src: "https://res.cloudinary.com/dihlirr2b/image/upload/v1709722333/ylkh3d0bektjreqd1hxt.jpg",
                        width: 100,
                        height: 100,
                    },
                }
            }}

            detailsButton={{
                render: () => (
                    <div>
                        {chainId !== targetChainId ? (
                            <div className={`${Style.switch_network} font-normal`} onClick={(e) => { e.stopPropagation(); switchChain(chain); }}>
                                switch network
                            </div>
                        ) : (
                            <div>
                                {user ? (
                                    <div className={Style.rightNetwork}>
                                        <div className={`${Style.rightNetwork_left} font-small`} style={{ cursor: "pointer" }}>
                                            <GoDotFill color="green" size={15} />
                                            <div>
                                                {renderString(address, 6)}<span style={{ fontFamily: "Space Grotesk" }}>...</span>
                                            </div>
                                        </div>
                                        <div className={Style.rightNetwork_right} onClick={(e) => { e.stopPropagation() }}>
                                            {user ? <Image src={images[`utente_${user.picture}`]} alt="profile user" width={30.5} height={30.5} onClick={() => { setOpenProfileTab(true); }}
                                            /> : <CircularProgress size={20} variant="indeterminate" color="inherit" />}
                                            {openProfileTab &&
                                                <div className={`${Style.overlay_transparent} font-small`} onMouseDown={() => closeProfileTab()}>
                                                    <div className={Style.profile_tab} onMouseDown={(e) => e.stopPropagation()}>
                                                        <Link onClick={() => setOpenProfileTab(false)} className={Style.profile_tab_element} href="./my-profile">
                                                            <Image src={images.user} alt="profile user" width={16} height={16} /> My collection
                                                        </Link>
                                                        {user.role == "artist" && !user.artist_name && !user.artist_photo && !user.artist_description && <div className={Style.profile_tab_element} onClick={() => { closeProfileTab(); setOpenArtistSettings(true) }}>
                                                            <Image src={images.manage_accounts} alt="settings" width={16} height={16} /> Create artist profile
                                                        </div>}
                                                        {user.role == "artist" && user.artist_minting_contract && <div className={Style.profile_tab_element} onClick={() => { closeProfileTab(); setOpenCreateItem(true) }}>
                                                            <Image src={images.upload} alt="upload" width={16} height={16} /> Create your limited edition track
                                                        </div>}
                                                        <div className={Style.profile_tab_element} onClick={() => { closeProfileTab(); setOpenAccountSetting(true) }}>
                                                            <Image src={images.manage_accounts} alt="setting" width={16} height={16} /> Settings
                                                        </div>
                                                        <div className={Style.profile_tab_element} onClick={() => disconnectUser()}>
                                                            <Image src={images.logout} alt="logout" width={16} height={16} /> log out
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>) : (<div className={`${Style.switch_network} font-normal`} onClick={(e) => { e.stopPropagation(); completeLogin() }}>
                                        login
                                    </div>)}
                            </div>
                        )}</div>
                )
            }}
        />
    )
}

export default NavBarConnectWallet;