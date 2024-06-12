import React, { useEffect, useContext } from 'react';
import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext';

import Style from "../styles/success.module.css";

const success = () => {

    const { afterPurchaseCreditCard } = useContext(NFTMarketplaceContext);

    useEffect(() => {
        afterPurchaseCreditCard()
    }, []);

    return (
        <div className={Style.vh_success}>
            <div className={Style.success}>
                SUCCESS
            </div>
        </div>
    )
}

export default success;