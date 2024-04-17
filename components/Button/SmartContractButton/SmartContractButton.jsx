import React, { useContext } from 'react';
import { useActiveAccount, TransactionButton } from "thirdweb/react";
import { createThirdwebClient, getContract } from "thirdweb";
import { polygon, polygonAmoy } from "thirdweb/chains";

import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';

const SmartContractButton = ({ text, action, onTransactionConfirmed, addressEditionDrop }) => {

    const client = createThirdwebClient({
        clientId: process.env.THIRDWEB_PROJECT_ID,
    });

    const contractEditionDrop = addressEditionDrop ? getContract({
        client,
        chain: polygonAmoy,
        address: addressEditionDrop
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
                await onTransactionConfirmed(receipt, contractEditionDrop);
            }}

            onError={(error) => {
                console.error("Transaction error", error);
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