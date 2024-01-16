import React, { useState, useContext } from 'react';

import Style3 from "../UpdateAccount/UpdateAccount.module.css";
import { ActionButton } from '../../../components/componentsIndex';
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';

const UnlinkWallet = () => {

    const { unlinkWalletEmailPsw, openErrorAuth, errorAuth } = useContext(NFTMarketplaceContext);

    const [password, setPassword] = useState("")

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && password) {
            unlWalletEmailPsw();
        }
    };

    const unlWalletEmailPsw = () => {
        unlinkWalletEmailPsw(password)
    }
    return (
        <div className={Style3.UpdateAccount}>
            <div>
                <div className={Style3.UpdateAccount_box}>
                    <input
                        type="password"
                        placeholder="Insert Password"
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyPress} />
                </div>
                {openErrorAuth &&
                    <div className={`${Style3.incorrectEmail} font-small`}>
                        {errorAuth}
                    </div>
                }
                <ActionButton text="UNLINK CURRENT WALLET" action={unlWalletEmailPsw} fontSize="0.9rem" />
            </div>
        </div>
    )
}

export default UnlinkWallet;