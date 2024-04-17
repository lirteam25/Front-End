import React, { useContext } from 'react';
import { useActiveAccount, TransactionButton, ConnectButton } from "thirdweb/react";
import { prepareContractCall, createThirdwebClient, getContract, sendTransaction, readContract, resolveMethod, encode, NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { polygon, polygonAmoy } from "thirdweb/chains";
import { nextTokenIdToMint, setClaimConditions, lazyMint, uri } from "thirdweb/extensions/erc1155";
import { createWallet, embeddedWallet } from "thirdweb/wallets";
import { NFTMarketplaceContext } from './../Context/NFTMarketplaceContext';
import { GoDotFill } from "react-icons/go";
import { deployERC1155Contract } from "thirdweb/deploys";


import { metamaskWallet } from "thirdweb/wallets";
import { SmartContractButton } from "../components/componentsIndex";


import Style from "../styles/discover.module.css";

const wallets = [
    embeddedWallet(),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
];

const prova = () => {

    const client = createThirdwebClient({
        clientId: process.env.THIRDWEB_PROJECT_ID,
    });

    const chain = polygonAmoy;

    const contractEditionDrop = getContract({
        client,
        chain,
        address: "0x277b3a556273162adc1a8d73c18f84a65fa26228"
    });

    const account = useActiveAccount();

    return (
        <div className={Style.vh_discover}>
            <div className={Style.discover}>
                <TransactionButton
                    transaction={async () => {
                        const contractAddress = await deployERC1155Contract({
                            chain: polygonAmoy,
                            client,
                            account,
                            type: "DropERC1155",
                            params: {
                                name: "MyEdition",
                                description: "My edition contract",
                                symbol: "ME",
                            }
                        });
                        return contractAddress;
                    }}

                    onTransactionSent={async (result) => {
                        console.log("Transaction submitted", result);
                    }}

                    onTransactionConfirmed={async (receipt) => {
                        console.log("Transaction confirmed", receipt);
                    }}

                    onError={(error) => {
                        console.error("Transaction error", error);
                    }}

                >
                    Test Minting
                </TransactionButton>
            </div>
        </div>
    )
}

export default prova