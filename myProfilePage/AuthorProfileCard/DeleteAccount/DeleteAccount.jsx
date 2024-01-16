import React, { useState, useContext } from 'react';

import Style3 from "../UpdateAccount/UpdateAccount.module.css";
import { ActionButton } from "../../../components/componentsIndex";
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';

const DeleteAccount = () => {

    const { deleteUsersEmailPsw, openErrorAuth, errorAuth } = useContext(NFTMarketplaceContext);

    const [password, setPassword] = useState("")


    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && password) {
            dltUsersEmailPsw();
        }
    };

    const dltUsersEmailPsw = () => {
        deleteUsersEmailPsw(password);
    }

    return (
        <div className={Style3.UpdateAccount}>
            <div>
                <div className={Style3.UpdateAccount_box}>
                    <input
                        type="password"
                        placeholder="Insert password"
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyPress} />
                </div>
                {openErrorAuth &&
                    <div className={`${Style3.incorrectEmail} font-small`}>
                        {errorAuth}
                    </div>
                }
                <ActionButton text="DELETE ACCOUNT" action={dltUsersEmailPsw} fontSize="0.9rem" />
            </div>
        </div>
    )
}

export default DeleteAccount;