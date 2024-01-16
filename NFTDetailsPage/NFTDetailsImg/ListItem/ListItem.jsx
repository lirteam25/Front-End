import React, { useState, useContext } from 'react';

import Style from './ListItem.module.css';
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';
import { InfoButton, ActionButton } from "./../../../components/componentsIndex";

const ListItem = ({ nft, setOpenListItem }) => {
    const { SecondListing } = useContext(NFTMarketplaceContext);
    const [price, setPrice] = useState(null);
    const [amount, setAmount] = useState(null);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && price && price >= 0 && amount && amount <= nft.amount - nft.sellingQuantity && amount > 0) {
            secondListing();
        }
    };

    const secondListing = () => {
        setOpenListItem(false);
        SecondListing(
            nft, price, amount
        )
    }

    return (
        <div className={Style.ListItem}>
            <div className={Style.ListItem_input}>
                <input
                    className={Style.ListItem_input_input}
                    type="number"
                    placeholder="price"
                    onChange={(e) => setPrice(e.target.value)}
                    onKeyDown={handleKeyPress} />
                <input
                    className={Style.ListItem_input_input}
                    type="number"
                    placeholder="amount"
                    onChange={(e) => setAmount(e.target.value)}
                    onKeyDown={handleKeyPress} />
            </div>
            <div className={Style.ListItem_button}>
                {(price && price >= 0) ? (
                    (amount && amount <= nft.amount - nft.sellingQuantity && amount > 0) ? (
                        < ActionButton text="List tokens" action={secondListing} />)
                        : (
                            <InfoButton text="Insert a valid amount" />))
                    : (
                        <InfoButton text="Insert a valid price" />)}
            </div>
        </div>
    )
}

export default ListItem;