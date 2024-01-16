import React, { useState, useContext } from 'react';

import Style from "./UpdateUsername.module.css";
import { ActionButton, InfoButton } from '../../../componentsIndex';
import { NFTMarketplaceContext } from '../../../../Context/NFTMarketplaceContext';

const UpdateAccount = () => {

    const { updateUserDisplayName, user } = useContext(NFTMarketplaceContext);

    const [newUsername, setNewUsername] = useState("");

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter' && newUsername) {
            await updUserInfo();
        }
    };

    const updUserInfo = async () => {
        await updateUserDisplayName(newUsername);
    }

    return (
        <div className={Style.UpdateAccount}>
            <div className={Style.UpdateAccount_box}>
                <input
                    className={Style.UpdateAccount_top_input}
                    type="text"
                    placeholder={user.displayName}
                    onChange={(e) => setNewUsername(e.target.value)}
                    onKeyDown={handleKeyPress} />
            </div>
            {newUsername ? <ActionButton action={updUserInfo} text="CHANGE USERNAME" fontSize="0.9rem" /> :
                <InfoButton text="CHANGE USERNAME" fontSize="0.9rem" />}
        </div>
    )
}

export default UpdateAccount;