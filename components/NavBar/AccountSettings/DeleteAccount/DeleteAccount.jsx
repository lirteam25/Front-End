import React, { useState, useContext } from 'react';

import Style3 from "../UpdateUsername/UpdateUsername.module.css";
import { ActionButton, InfoButton } from "../../../componentsIndex";
import { NFTMarketplaceContext } from '../../../../Context/NFTMarketplaceContext';
import Switch from '@mui/material/Switch';

const DeleteAccount = () => {

    const { deleteUsers, openErrorAuth, errorAuth } = useContext(NFTMarketplaceContext);

    const [isDelete, setIsDelete] = useState(false);

    const dltUsersEmailPsw = () => {
        deleteUsers();
    }

    const switchStyle = {
        color: 'var(--main-color)',  // Replace with your actual variable or color value
    };

    return (
        <div className={Style3.UpdateAccount}>
            <div>
                <div className={Style3.UpdateAccount_box} style={{ color: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    Are you sure you want to delete your account?
                    <Switch style={switchStyle} color="default" onChange={() => { setIsDelete(!isDelete) }} />
                </div>
                {openErrorAuth &&
                    <div className={`${Style3.incorrectEmail} font-small`}>
                        {errorAuth}
                    </div>
                }
                {isDelete ?
                    <ActionButton text="DELETE ACCOUNT" action={dltUsersEmailPsw} fontSize="0.9rem" />
                    : <InfoButton fontSize="0.9rem" text="DELETE ACCOUNT" />
                }
            </div>
        </div>
    )
}

export default DeleteAccount;