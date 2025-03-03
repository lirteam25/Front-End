import React, { useContext } from 'react';
import { ConnectButton, useActiveWalletChain, useSwitchActiveWalletChain } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";
import { polygon, polygonAmoy } from "thirdweb/chains";
import { createAuth } from 'thirdweb/auth';

import Style from "./Wallet.module.css";
import { InfoButton, LoadingModule } from '../../componentsIndex';
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';


const wallets = [
    inAppWallet()
];

const buttonConnectWallet = ({ text }) => {

    const { user } = useContext(NFTMarketplaceContext);

    const client = createThirdwebClient({
        clientId: process.env.THIRDWEB_PROJECT_ID,
    });

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
                label: `${text}`,
                style: {
                    width: "100%",
                    borderRadius: "0px",
                    backgroundColor: "var(--main-color)",
                    color: "white",
                    minHeight: "unset",
                    padding: "0.3rem 0rem",
                    textTransform: "uppercase",
                    margin: 0,
                    border: "1px solid white"
                }
            }}

            connectModal={{
                termsOfServiceUrl: "https://www.iubenda.com/terms-and-conditions/94474485",
                privacyPolicyUrl: "https://www.iubenda.com/privacy-policy/94474485",
            }}

            detailsButton={{
                render: () => (
                    <div>
                        {chainId !== targetChainId ? (
                            <div className={`${Style.login_Button} font-normal`} onClick={(e) => { e.stopPropagation(); switchChain(polygonAmoy); }}>
                                SWITCH NETWORK
                            </div>
                        ) : (
                            <div>
                                {user ? (
                                    <InfoButton text="Connected" />
                                ) : (<LoadingModule height="20px" width="20px" />)}
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