import React, { useContext, useState } from 'react';
import { AiOutlineClose } from "react-icons/ai";
import { useTranslation } from 'next-i18next';

//Internal Imports
import Style from "./Login.module.css";
import { ActionButton, InfoButton } from '../../componentsIndex';
import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";

const Login = ({ closeLogin, setOpenRegister, setForgotPassword }) => {
    const { signIn, openErrorAuth, errorAuth } = useContext(NFTMarketplaceContext);

    const ChangeLoginToRegister = () => {
        closeLogin();
        setOpenRegister(true);
    };

    const ChangeLoginToForgotPassword = () => {
        closeLogin();
        setForgotPassword(true);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && email && password) {
            signInEmailPsw();
        }
    };

    const signInEmailPsw = () => {
        signIn(email, password);
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { t } = useTranslation();
    return (
        <div className={Style.login}>
            <div className={Style.login_container}>
                <div className={`${Style.login_container_top} font-normal`}>
                    <div className={Style.login_container_top_login}>
                        Login
                    </div>
                    <AiOutlineClose className={Style.login_container_top_x} onClick={() => closeLogin()} />
                </div>
                <div className={Style.login_container_bottom}>
                    <div className={Style.user_box_input}>
                        <input
                            className={Style.user_box_input_input}
                            type="email"
                            placeholder={t("_app:navbar_login_mail")}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyPress} />
                        <input
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyPress} />
                        <div className={`${Style.user_box_input_forgot} font-small`}>
                            <div>
                                <span style={{ cursor: "pointer" }} onClick={() => ChangeLoginToForgotPassword()}>{t("_app:navbar_login_forgot")}</span>
                            </div>
                        </div>
                    </div>
                    {openErrorAuth &&
                        <div className={Style.incorrectEmail}>
                            {errorAuth}
                        </div>
                    }
                    <div className={Style.login_box_button}>
                        {password && email ? <ActionButton action={signInEmailPsw} text="login" fontSize="0.9rem" />
                            : <InfoButton text="Fill All Required Fields" fontSize="0.9rem" />
                        }
                    </div>
                    <div className={`${Style.login_box_para} font-small`}>
                        New user? <div onClick={() => ChangeLoginToRegister()} className={Style.login_box_para_action}>Create an account</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login