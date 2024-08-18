import React from 'react';
import { ButtonConnectWallet } from '../components/componentsIndex';

import Style from "./../styles/decrypt.module.css";

const mobileLogin = () => {
    return (
        <div className={Style.vh_decrypt}>
            <div className={Style.decrypt}>
                Successful login
            </div>
        </div>
    );
}

export default mobileLogin