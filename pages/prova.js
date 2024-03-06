import React, { useState, useEffect } from 'react';

import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react';

import Style from "../styles/discover.module.css";


const prova = () => {
    const { open } = useWeb3Modal();
    const [account, setAccount] = useState(null);
    const [chain, setChain] = useState(null);

    const { address, chainId, isConnected } = useWeb3ModalAccount();

    useEffect(() => {
        setAccount(address);
        setChain(chainId)
    }, [isConnected, address, chainId])


    return (
        <div className={Style.vh_discover}>
            <div className={Style.discover}>
                <div>
                    <w3m-button />

                </div>
            </div>
        </div>
    )
}

export default prova;
