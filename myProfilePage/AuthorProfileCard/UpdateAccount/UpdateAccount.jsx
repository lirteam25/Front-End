import React, { useState, useContext } from 'react';

import Style from "./UpdateAccount.module.css";
import { ActionButton } from '../../../components/componentsIndex';
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';

const UpdateAccount = () => {

    const { updateUserInformation } = useContext(NFTMarketplaceContext);

    const [newUsername, setNewUsername] = useState("");

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && newUsername) {
            updUserInfo();
        }
    };

    const updUserInfo = () => {
        updateUserInformation(newUsername);
    }

    return (
        <div className={Style.UpdateAccount}>
            <div className={Style.UpdateAccount_box}>
                <input
                    className={Style.UpdateAccount_top_input}
                    type="text"
                    placeholder="new username"
                    onChange={(e) => setNewUsername(e.target.value)}
                    onKeyDown={handleKeyPress} />
            </div>
            <ActionButton action={updUserInfo} text="CHANGE USERNAME" fontSize="0.9rem" />
        </div>
    )
}

export default UpdateAccount;