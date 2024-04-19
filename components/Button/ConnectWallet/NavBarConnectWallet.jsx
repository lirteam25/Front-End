import React, { useContext } from 'react';
import { ConnectButton, useActiveAccount, useActiveWalletChain, useSwitchActiveWalletChain } from "thirdweb/react";
import { createWallet, embeddedWallet } from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";
import { polygon, polygonAmoy } from "thirdweb/chains";
import { GoDotFill } from "react-icons/go";
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';


import Style from "./Wallet.module.css";

const wallets = [
    embeddedWallet(),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
];

const NavBarConnectWallet = ({ user }) => {

    const address = useActiveAccount()?.address;

    const client = createThirdwebClient({
        clientId: process.env.THIRDWEB_PROJECT_ID,
    });

    const { renderString } = useContext(NFTMarketplaceContext);

    const chain = process.env.ACTIVE_CHAIN == "polygon" ? polygon : polygonAmoy
    const chainId = useActiveWalletChain()?.id;

    const targetChainId = process.env.ACTIVE_CHAIN == "polygon" ? 137 : 80002

    const switchChain = useSwitchActiveWalletChain();

    return (
        <ConnectButton
            wallets={wallets}
            client={client}
            chain={chain}
            connectButton={{
                label: "connect wallet",
                style: {
                    fontFamily: "Space Grotesk",
                    fontSize: "1rem",
                    borderRadius: "0px",
                    backgroundColor: "transparent",
                    color: "var(--main-color)",
                    padding: 0,
                    margin: 0
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
                    <div>{chainId !== targetChainId ? (
                        <div className={`${Style.switch_network} font-normal`} onClick={(e) => { e.stopPropagation(); switchChain(polygonAmoy); }}>
                            switch network
                        </div>
                    ) : (
                        <div>
                            {user.wallet && address.toLocaleLowerCase() == user.wallet ? (
                                <div className={Style.wallet_icon_wrapper}>
                                    <div className={`${Style.wallet_info_window} font-small`} style={{ cursor: "pointer" }}>
                                        <GoDotFill color="green" size={15} />
                                        <div>
                                            {renderString(address.toLowerCase(), 6)}<span style={{ fontFamily: "Space Grotesk" }}>...</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={Style.wallet_icon_wrapper}>
                                    <div className={`${Style.wallet_info_window_wrong} font-small`} style={{ cursor: "pointer" }}>
                                        <GoDotFill className={Style.wallet_info_window_icon_wrong} />
                                        <div>
                                            {renderString(address.toLowerCase(), 6)}<span style={{ fontFamily: "Space Grotesk" }}>...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}</div>
                )
            }}
        />
    )
}

export default NavBarConnectWallet;