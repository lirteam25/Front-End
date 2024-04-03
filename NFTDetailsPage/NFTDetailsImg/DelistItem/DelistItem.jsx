import React, { useState, useContext } from 'react';

import Style from "../ListItem/ListItem.module.css";
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';
import { SmartContractButton, InfoButton } from '../../../components/componentsIndex';
import { NFTMarketplaceAddress } from '../../../Context/Constants';

const DelistItem = ({ nft, setOpenDelistItem }) => {
    const { delistItem } = useContext(NFTMarketplaceContext);

    const [amount, setAmount] = useState(null);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && amount && amount <= nft.sellingQuantity && amount > 0) {
            delist();
        }
    };

    const delist = (contract) => {
        setOpenDelistItem(false);
        delistItem(contract, nft, amount)
    }

    return (
        <div className={Style.ListItem}>
            <div className={Style.ListItem_input}>
                <input
                    type="number"
                    placeholder="amount"
                    onChange={(e) => setAmount(e.target.value)}
                    onKeyDown={handleKeyPress} />
            </div>
            <div className={Style.ListItem_button}>
                {(amount && amount <= nft.sellingQuantity && amount > 0) ? (
                    <SmartContractButton text="delist tokens" action={delist} contractAddress={NFTMarketplaceAddress} />
                ) : (
                    <InfoButton text="Insert a valid amount" />)}
            </div>

        </div>
    )
}

export default DelistItem;