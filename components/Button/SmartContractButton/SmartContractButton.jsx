import React, { useContext } from 'react';
import { TransactionButton } from "thirdweb/react";
import { createThirdwebClient, getContract } from "thirdweb";
import { polygon, polygonAmoy } from "thirdweb/chains";

import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';

const SmartContractButton = ({ text, action, onTransactionConfirmed, contractAddress }) => {

    const client = createThirdwebClient({
        clientId: process.env.THIRDWEB_PROJECT_ID,
    });

    const chain = process.env.ACTIVE_CHAIN == "polygon" ? polygon : polygonAmoy

    const contractEditionDrop = contractAddress ? getContract({
        client,
        chain,
        address: contractAddress
    }) : null;

    const { handleMetaMaskErrors } = useContext(NFTMarketplaceContext);

    return (
        <TransactionButton
            transaction={async () => {
                const tx = await action(contractEditionDrop);
                console.log(tx);
                return tx;
            }}

            onTransactionSent={(result) => {
                console.log("Transaction submitted", result.transactionHash);
            }}

            onTransactionConfirmed={async (receipt) => {
                console.log("Transaction Confirmed", receipt);
                await onTransactionConfirmed(receipt, contractEditionDrop);
            }}

            onError={(error) => {
                console.error("Transaction error", error);
                handleMetaMaskErrors(error, "Something went wrong. Please try again.<br/>Check if you have enough funds. If the error persist contact us at <a href='mailto:info@lirmusic.com' style='color: var(--main-color)'>info@lirmusic.com </a>.", "ERROR_smartContract_interaction")
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

        >
            {text}
        </TransactionButton>
    )
}

export default SmartContractButton;