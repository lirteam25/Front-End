import React, { useContext } from 'react';
import { ConnectWallet, darkTheme, useAddress } from "@thirdweb-dev/react";
import { GoDotFill } from "react-icons/go";
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';

import Style from "./Wallet.module.css";

const customDarkTheme = darkTheme({
    fontFamily: "Space Grotesk, sans-serif",
    colors: {
        modalBg: "#000000",
        accentText: "var(--main-color)",
        // ... etc
    },
});


const NavBarConnectWallet = ({ user }) => {
    const address = useAddress();

    const { renderString } = useContext(NFTMarketplaceContext)

    return (
        <ConnectWallet
            style={{ fontSize: "1rem", borderRadius: "0px", backgroundColor: "transparent", color: "var(--main-color)", padding: 0, margin: 0 }}
            btnTitle="connect wallet"
            theme={customDarkTheme}
            switchToActiveChain={true}
            welcomeScreen={{
                title: "LIR Music",
                subtitle: "Connect your wallet to LIR Music",
                img: {
                    src: "https://res.cloudinary.com/dihlirr2b/image/upload/v1709722333/ylkh3d0bektjreqd1hxt.jpg",
                    width: 100,
                    height: 100,
                },
            }}
            detailsBtn={() => {
                return (<div className={Style.navbar_container_right_yesUser_connect_wallet}>
                    {user.wallet && address.toLocaleLowerCase() == user.wallet ? (
                        <div className={Style.wallet_icon_wrapper}>
                            <div className={`${Style.wallet_info_window} font-small`} style={{ cursor: "pointer" }}>
                                <GoDotFill color="green" size={15} />
                                <div>
                                    {renderString(address.toLowerCase(), 6)}<span style={{ fontFamily: "Space Grotesk" }}>...</span>
                                </div>
                            </div>
                        </div>
                    ) : (<div className={Style.navbar_container_right_yesUser_connect_wallet_wrong}>
                        <div className={Style.wallet_icon_wrapper}>
                            <div className={`${Style.wallet_info_window_wrong} font-small`} style={{ cursor: "pointer" }}>
                                <GoDotFill className={Style.wallet_info_window_icon_wrong} />
                                <div>
                                    {renderString(address.toLowerCase(), 6)}<span style={{ fontFamily: "Space Grotesk" }}>...</span>
                                </div>
                            </div>
                        </div>
                    </div>)}
                </div>);
            }}
            termsOfServiceUrl="https://www.iubenda.com/terms-and-conditions/94474485"
            privacyPolicyUrl="https://www.iubenda.com/privacy-policy/94474485"
        />
    )
}

export default NavBarConnectWallet;