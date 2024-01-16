import React, { useContext } from 'react';
import ActionButton from "../Button/ActionButton/ActionButton";

import Style from "./Notification.module.css";
import { NFTMarketplaceContext } from '../../Context/NFTMarketplaceContext';

const Notification = () => {
    const { notificationTitle, notificationText, setOpenNotification } = useContext(NFTMarketplaceContext);
    const closeNotification = () => {
        setOpenNotification(false);
    };
    return (
        <div className={`${Style.Notification}`}>
            <div className={Style.Notification_box}>
                <div className={`${Style.Notification_box_top} font-medium`} dangerouslySetInnerHTML={{ __html: notificationTitle }}>
                </div>
                <div className={`${Style.Notification_box_bottom} font-normal`} dangerouslySetInnerHTML={{ __html: notificationText }}>
                </div>
                <div className={Style.Notification_box_button}>
                    <ActionButton action={closeNotification} text="got it!" fontSize="0.9rem" />
                </div>
            </div>
        </div>
    )
}

export default Notification;