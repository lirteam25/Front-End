import React from 'react';
import { ConnectWallet, darkTheme, useAddress } from "@thirdweb-dev/react";

import Style from "../styles/discover.module.css";

const customDarkTheme = darkTheme({
    fontFamily: "Space Grotesk, sans-serif",
    colors: {
        modalBg: "#000000",
        accentText: "var(--main-color)",
        // ... etc
    },
});


const prova = () => {
    const address = useAddress();

    return (
        <div className={Style.vh_discover}>
            <div className={Style.discover}>
                <ConnectWallet
                    btnTitle="connect wallet"
                    theme={customDarkTheme}
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
                        return <div> {address} </div>;
                    }}
                    termsOfServiceUrl="https://www.iubenda.com/terms-and-conditions/94474485"
                    privacyPolicyUrl="https://www.iubenda.com/privacy-policy/94474485"
                    switchToActiveChain={true}
                    className={`${Style.buttonWallet} font-normal`}
                />
            </div>
        </div>
    )
}

export default prova