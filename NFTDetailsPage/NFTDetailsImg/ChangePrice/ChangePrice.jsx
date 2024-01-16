import React, { useState, useContext } from 'react';

import Style from "../ListItem/ListItem.module.css";
import { ActionButton, InfoButton } from "../../../components/componentsIndex";
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';

const ChangePrice = ({ nft, setOpenChangePrice }) => {
    const { changeNFTPrice } = useContext(NFTMarketplaceContext);
    const [newPrice, setNewPrice] = useState("");

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && newPrice && newPrice >= 0) {
            changePrice();
        }
    };

    const changePrice = () => {
        setOpenChangePrice(false);
        changeNFTPrice(
            nft,
            newPrice
        )
    }

    return (
        <div className={Style.ListItem}>
            <div className={Style.ListItem_input}>
                <input
                    type="number"
                    placeholder="new price"
                    onChange={(e) => setNewPrice(e.target.value)}
                    onKeyDown={handleKeyPress} />

            </div>
            <div className={Style.ListItem_button}>
                {newPrice && newPrice >= 0 ?
                    (<ActionButton action={changePrice} text="CHANGE PRICE" />) : (
                        <InfoButton text="Insert a valid price" />
                    )}
            </div>
        </div>
    )
}

export default ChangePrice;