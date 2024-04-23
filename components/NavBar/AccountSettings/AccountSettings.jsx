import React, { useState, useContext } from 'react';
import { AiOutlineClose } from "react-icons/ai";

import Style from "./AccountSettings.module.css";
import UpdateUsername from "./UpdateUsername/UpdateUsername";
import DeleteAccount from "./DeleteAccount/DeleteAccount";
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';

const ArtistSettings = ({ closeArtistSettings }) => {
    const { setErrorAuth, setOpenErrorAuth } = useContext(NFTMarketplaceContext);

    const [openUpdateUsername, setOpenUpdateUsername] = useState(false);
    const [openDeleteAccount, setOpenDeleteAccount] = useState(false);

    const openUsername = () => {
        setOpenUpdateUsername(true);
        setOpenDeleteAccount(false);
        setErrorAuth(""); setOpenErrorAuth(false);
    }

    const openDelete = () => {
        setOpenUpdateUsername(false);
        setOpenDeleteAccount(true);
        setErrorAuth(""); setOpenErrorAuth(false);
    }

    return (
        <div className={Style.ArtistSettings}>
            <div className={`${Style.ArtistSettings_top} font-normal`}>
                <div className={Style.ArtistSettings_top_title}>
                    Settings
                </div>
                <AiOutlineClose className={Style.ArtistSettings_top_x} onClick={closeArtistSettings} />
            </div>

            <div className={`${Style.ArtistSettings_bottom_title} ${!openUpdateUsername && Style.hover} font-normal`} onClick={openUsername}>
                <div className={Style.ArtistSettings_bottom_title_95}>
                    <div className={`${openUpdateUsername && Style.red}`}>Update Username</div>
                    {openUpdateUsername &&
                        <div className={Style.ArtistSettings_bottom_title_95_active}>
                            <UpdateUsername />
                        </div>}
                </div>
            </div>
            <div className={`${Style.ArtistSettings_bottom_title} ${!openDeleteAccount && Style.hover} font-small`} onClick={openDelete}>
                <div className={Style.ArtistSettings_bottom_title_95_delete}>
                    <div className={`${openDeleteAccount && Style.red}`}>Delete Account</div>
                    {openDeleteAccount && <div className={Style.ArtistSettings_bottom_title_95_active}>
                        <DeleteAccount />
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default ArtistSettings;