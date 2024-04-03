import React, { useContext } from 'react';
import { Web3Button, darkTheme } from "@thirdweb-dev/react";

import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';

const SmartContractButton = ({ text, contractAddress, action, toast, ABI }) => {

    const customDarkTheme = darkTheme({
        fontFamily: "Space Grotesk, sans-serif",
        colors: {
            modalBg: "#000000",
            accentText: "var(--main-color)",
            // ... etc
        },
    });

    const { setToast, setOpenLoading, handleMetaMaskErrors } = useContext(NFTMarketplaceContext);

    return (
        <Web3Button
            contractAddress={contractAddress}
            contractAbi={ABI ? ABI : undefined}
            action={async (contract) => { await action(contract) }}

            onSuccess={() => {
                setOpenLoading(false);
                setToast(toast);
            }}

            onError={(error) => {
                console.log(error);
                handleMetaMaskErrors(error, "Something went wrong. Check if you have sufficient fund to perform the transaction. <br/>If the error persist contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR");
            }}

            style={{
                margin: "0",
                fontSize: "0.9rem",
                padding: "0.3rem 0rem",
                minHeight: "auto",
                width: "100%",
                borderRadius: "0px",
                backgroundColor: "var(--main-color)",
                color: "white",
                textTransform: "uppercase",
                border: "1px solid white"
            }}

            connectWallet={{
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
                },
                btnTitle: "connect wallet",
                theme: { customDarkTheme },
                welcomeScreen: {
                    title: "LIR Music",
                    subtitle: "Connect your wallet to LIR Music",
                    img: {
                        src: "https://res.cloudinary.com/dihlirr2b/image/upload/v1709722333/ylkh3d0bektjreqd1hxt.jpg",
                        width: 100,
                        height: 100,
                    },
                },
                termsOfServiceUrl: "https://www.iubenda.com/terms-and-conditions/94474485",
                privacyPolicyUrl: "https://www.iubenda.com/privacy-policy/94474485"
            }}

        >
            {text}
        </Web3Button>
    )
}

export default SmartContractButton;