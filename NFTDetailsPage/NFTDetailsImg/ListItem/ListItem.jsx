import React, { useState, useContext } from 'react';

import Style from './ListItem.module.css';
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';
import { InfoButton, SmartContractButton } from "./../../../components/componentsIndex";
import { NFTMarketplaceAddress } from '../../../Context/Constants';

const ListItem = ({ nft, setOpenListItem }) => {
    const { SecondListing, updateDBOnSecondListing } = useContext(NFTMarketplaceContext);
    const [price, setPrice] = useState(nft.sellingQuantity && nft.sellingQuantity > 0 ? nft.price : null);
    const [amount, setAmount] = useState(nft.sellingQuantity && nft.sellingQuantity > 0 ? nft.sellingQuantity : null);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && price && price >= 0 && amount && amount <= nft.amount - nft.sellingQuantity && amount > 0) {
            secondListing();
        }
    };

    const secondListing = (contract) => {
        setOpenListItem(false);
        console.log(contract);
        const tx = SecondListing(
            contract, nft, price, amount
        );
        return tx;
    };

    const updateDB = async (receipt, contract) => {
        console.log(receipt);
        await updateDBOnSecondListing(receipt, nft, formInputPrice, amount, listing_id)
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
                {<input
                    className={Style.ListItem_input_input}
                    type="number"
                    placeholder="amount"
                    onChange={(e) => setAmount(e.target.value)}
                    onKeyDown={handleKeyPress} />}
            </div>
            <div className={Style.ListItem_button}>
                {(price && price >= 0) ? (
                    (amount && amount <= nft.amount - nft.sellingQuantity && amount > 0) ? (
                        <SmartContractButton contractAddress={NFTMarketplaceAddress} text="List tokens" action={secondListing} onTransactionConfirmed={updateDB} />)
                        : (
                            <InfoButton text="Insert a valid amount" />))
                    : (
                        <InfoButton text="Insert a valid price" />)}
            </div>
        </div>
    )
}

export default ListItem;