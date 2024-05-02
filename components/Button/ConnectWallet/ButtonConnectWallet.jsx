import React, { useContext } from 'react';
import { ConnectButton, useActiveAccount, useActiveWalletChain, useSwitchActiveWalletChain } from "thirdweb/react";
import { createWallet, embeddedWallet } from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";
import { polygon, polygonAmoy } from "thirdweb/chains";
import { createAuth } from 'thirdweb/auth';
import { InfoButton } from '../../componentsIndex';
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';

import Style from "./Wallet.module.css";

const wallets = [
    embeddedWallet(),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
];


const buttonConnectWallet = () => {

    const { user, completeLogin } = useContext(NFTMarketplaceContext);

    const client = createThirdwebClient({
        clientId: process.env.THIRDWEB_PROJECT_ID,
    });

    const chain = process.env.ACTIVE_CHAIN == "polygon" ? polygon : polygonAmoy
    const chainId = useActiveWalletChain()?.id;

    const targetChainId = process.env.ACTIVE_CHAIN == "polygon" ? 137 : 80002

    const switchChain = useSwitchActiveWalletChain();


    const auth = createAuth({
        domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
    });

    return (
        <ConnectButton
            wallets={wallets}
            client={client}
            chain={chain}
            connectButton={{
                label: "login / sign up",
                style: {
                    width: "100%",
                    borderRadius: "0px",
                    backgroundColor: "var(--main-color)",
                    color: "white",
                    padding: 0,
                    padding: "0.3rem 0rem",
                    textTransform: "uppercase",
                    margin: 0,
                    border: "1px solid white"
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
                            <div className={`${Style.login_Button} font-normal`} onClick={(e) => { e.stopPropagation(); switchChain(polygonAmoy); }}>
                                switch network
                            </div>
                        ) : (
                            <div>
                                {user ? (
                                    <div className={Style.rightNetwork}>
                                        <InfoButton text="Connected" />
                                    </div>) : (<div className={`${Style.login_Button} font-normal`} onClick={(e) => { e.stopPropagation(); completeLogin() }}>
                                        login
                                    </div>)}
                            </div>
                        )}</div>
                )
            }}

            switchButton={{
                label: "switch network",
                style: {
                    width: "100%",
                    borderRadius: "0px",
                    backgroundColor: "var(--main-color)",
                    color: "white",
                    padding: 0,
                    padding: "0.3rem 0rem",
                    textTransform: "uppercase",
                    margin: 0,
                    border: "1px solid white"
                }
            }}
        />
    )
}

export default buttonConnectWallet;