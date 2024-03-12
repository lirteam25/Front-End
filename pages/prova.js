import React from 'react';
import { ConnectWallet } from "@thirdweb-dev/react";


import Style from "../styles/discover.module.css";

const prova = () => {
    return (
        <div className={Style.vh_discover}>
            <div className={Style.discover}>
                Cioa
                <ConnectWallet />
            </div>
        </div>
    )
}

export default prova