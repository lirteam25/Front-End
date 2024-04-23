import React, { useContext } from 'react';
import { useActiveAccount, TransactionButton, ConnectButton, useDisconnect } from "thirdweb/react";
import { prepareContractCall, createThirdwebClient, getContract, sendTransaction, readContract, resolveMethod, encode, NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { polygon, polygonAmoy } from "thirdweb/chains";
import { nextTokenIdToMint, setClaimConditions, lazyMint, uri, claimTo, setApprovalForAll } from "thirdweb/extensions/erc1155";
import { getListing, updateListing, createListing, approveBuyerForListing } from "thirdweb/extensions/marketplace";
import { createWallet, embeddedWallet } from "thirdweb/wallets";
import { NFTMarketplaceContext } from './../Context/NFTMarketplaceContext';
import { GoDotFill } from "react-icons/go";
import { deployERC1155Contract, prepareDirectDeployTransaction } from "thirdweb/deploys";
import { toWei } from "thirdweb/utils";


import { metamaskWallet } from "thirdweb/wallets";
import { SmartContractButton } from "../components/componentsIndex";
import { ButtonConnectWallet } from "./../components/componentsIndex"


import Style from "../styles/discover.module.css";


const prova = () => {

    const { user } = useContext(NFTMarketplaceContext)
    const client = createThirdwebClient({
        clientId: process.env.THIRDWEB_PROJECT_ID,
    });

    const chain = polygonAmoy;

    const contractEditionDrop = getContract({
        client,
        chain,
        address: "0x9288d930080f3b0144cc80199055ff9b0a11a212"
    });

    const contractMarketplace = getContract({
        client,
        chain,
        address: "0x79b046BaEaBCeea366365B617E0086225F1d9873"
    })

    const account = useActiveAccount();


    const accountAddress = useActiveAccount()?.address;

    const { disconnect } = useDisconnect();

    return (
        <div className={Style.vh_discover}>
            <div className={Style.discover}>
                <ButtonConnectWallet />
            </div>
        </div>
    )
}

export default prova