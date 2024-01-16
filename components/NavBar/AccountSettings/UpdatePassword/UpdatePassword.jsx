import React, { useState, useContext } from 'react';

import Style3 from "./../UpdateUsername/UpdateUsername.module.css";
import { ActionButton, InfoButton } from '../../../componentsIndex';
import { NFTMarketplaceContext } from '../../../../Context/NFTMarketplaceContext';

const UpdatePassword = () => {

    const { updateUserPassword, openErrorAuth, errorAuth } = useContext(NFTMarketplaceContext);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && currentPassword && newPassword && confirmNewPassword) {
            updUserPsw();
        }
    };

    const updUserPsw = () => {
        updateUserPassword(currentPassword, newPassword, confirmNewPassword);
    }

    return (
        <div className={Style3.UpdateAccount}>
            <div className={Style3.UpdateAccount_box}>
                <input
                    className={Style3.UpdateAccount_top_input}
                    type="password"
                    placeholder="Current Password"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    onKeyDown={handleKeyPress} />
            </div>
            <div className={Style3.UpdateAccount_box}>
                <input
                    className={Style3.UpdateAccount_top_input}
                    type="password"
                    placeholder="New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    onKeyDown={handleKeyPress} />
            </div>
            <div className={Style3.UpdateAccount_box}>
                <input
                    className={Style3.UpdateAccount_top_input}
                    type="password"
                    placeholder="Confirm New Password"
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    onKeyDown={handleKeyPress} />
            </div>
            {openErrorAuth &&
                <div className={`${Style3.incorrectEmail} font-small`}>
                    {errorAuth}
                </div>
            }
            {confirmNewPassword && newPassword && currentPassword ?
                <ActionButton text="CHANGE PASSWORD" action={updUserPsw} fontSize="0.9rem" />
                : <InfoButton text="CHANGE PASSWORD" fontSize="0.9rem" />}
        </div>
    )
}

export default UpdatePassword;