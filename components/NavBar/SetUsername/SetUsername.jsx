import React from 'react';

import UpdateUsername from "../AccountSettings/UpdateUsername/UpdateUsername";
import Style from "../AccountSettings/AccountSettings.module.css";

const SetUsername = ({ }) => {
    return (
        <div className={Style.ArtistSettings}>
            <div className={`${Style.ArtistSettings_top} font-normal`}>
                <div className={Style.ArtistSettings_top_title}>
                    Create your username
                </div>
            </div>

            <div className={`${Style.ArtistSettings_bottom_title} font-normal`}>
                <div className={Style.ArtistSettings_bottom_title_95}>
                    <span className='font-small'>A username is necessary. Choose one that suits you best.</span>
                    <div className={Style.ArtistSettings_bottom_title_95_active}>
                        <UpdateUsername />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SetUsername;