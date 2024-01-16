import React, { useState, useContext } from 'react';
import { AiOutlineClose } from "react-icons/ai";


import Style from "./../Login/Login.module.css";
import { ActionButton } from '../../componentsIndex';
import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";


const ForgotPassword = ({ closeForgot }) => {
    const [email, setEmail] = useState();

    const { forgotPassword, openErrorAuth, errorAuth } = useContext(NFTMarketplaceContext);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && email) {
            resetPassword();
        }
    };

    const resetPassword = () => {
        forgotPassword(email);
        closeForgot();
    }

    return (
        <div className={Style.login}>
            <div className={`${Style.login_container} font-normal`}>
                <div className={Style.login_container_top}>
                    <div className={Style.login_container_top_login}>
                        Forgot Password
                    </div>
                    <AiOutlineClose className={Style.login_container_top_x} onClick={() => closeForgot()} />
                </div>
            </div>
            <div className={Style.login_container_bottom}>
                <div className={Style.user_box_input}>
                    <input
                        className={Style.user_box_input_input}
                        type="email"
                        placeholder="Insert Your Email"
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyPress} />
                </div>
                {openErrorAuth &&
                    <div className={`${Style.incorrectEmail} font-small`}>
                        {errorAuth}
                    </div>
                }
                <div className={Style.login_box_button}>
                    <ActionButton action={resetPassword} text="_app:navbar_forgot_reset" fontSize="0.9rem" />
                </div>

            </div>
        </div>
    )
}

export default ForgotPassword