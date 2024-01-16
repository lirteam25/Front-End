import React, { useState, useEffect, useContext } from 'react';

import Style from "./Toast.module.css";
import { NFTMarketplaceContext } from '../../Context/NFTMarketplaceContext';

const Toast = () => {
    const { toast, setToast, setOpenToast, openToast } = useContext(NFTMarketplaceContext);
    const [isVisible, setIsVisible] = useState(true);


    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsVisible(false);

            // After the fade-out animation, set openToast to false
            setTimeout(() => {
                setOpenToast(false);
                setToast(null);
            }, 400);
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, [openToast]);


    return (
        <div className={`${Style.Toast} ${!isVisible && Style.fade_out}`}>
            <div className={Style.Toast_box}>
                <div className={`${Style.Toast_box_bottom} font-normal`} dangerouslySetInnerHTML={{ __html: toast }}>
                </div>
            </div>
        </div>
    )
}

export default Toast;