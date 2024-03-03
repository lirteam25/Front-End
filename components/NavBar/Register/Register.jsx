import React, { useContext, useState } from 'react';
import { AiOutlineClose } from "react-icons/ai";
import Checkbox from "@mui/material/Checkbox";


//Internal Imports
import Style from "./../Login/Login.module.css";
import { ActionButton, InfoButton } from '../../componentsIndex';
import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";

const Register2 = ({ setOpenLogin, closeRegister }) => {
    const { signUp, setOpenErrorAuth, openErrorAuth, setErrorAuth, errorAuth } = useContext(NFTMarketplaceContext);

    const ChangeRegisterToLog = () => {
        setOpenLogin(true);
        closeRegister();
    };

    const [username, setUsername] = useState(false);
    const [email, setEmail] = useState(false);
    const [password, setPassword] = useState(false);
    const [passwordConfirm, setPasswordConfirm] = useState(false);
    const [checked, setChecked] = useState(false);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && username && email && password && passwordConfirm) {
            signUpEmailPsw();
        }
    };

    const signUpEmailPsw = () => {
        if (checked) {
            signUp(username, email, password, passwordConfirm);
        } else {
            setErrorAuth("Please accept Terms of Service and Privacy Policy")
            setOpenErrorAuth(true);
        }
    }

    return (
        <div className={Style.login}>
            <div className={`${Style.login_container} font-normal`}>
                <div className={Style.login_container_top}>
                    <div className={Style.login_container_top_login}>
                        Sign up
                    </div>
                    <AiOutlineClose className={Style.login_container_top_x} onClick={() => closeRegister()} />
                </div>
            </div>
            <div className={Style.login_container_bottom}>
                <div className={Style.user_box_input}>
                    <input
                        className={Style.user_box_input_input}
                        type="username"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={handleKeyPress} />

                    <input
                        className={Style.user_box_input_input}
                        type="email"
                        placeholder="Email Address"
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyPress} />

                    <input
                        className={Style.user_box_input_input}
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <input
                        className={Style.user_box_input_input}
                        type="password"
                        placeholder="Repeat Password"
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />

                </div>
                <div className={`${Style.login_container_bottom_policy} font-small`}>
                    <Checkbox size="small" sx={{
                        color: "var(--main-color)",
                        '&.Mui-checked': {
                            color: "var(--main-color)",
                        },
                    }}
                        onChange={() => { setChecked(!checked); setOpenErrorAuth(false) }}
                    />
                    <div>
                        By ticking this box, you accept Lir's <a href='https://www.iubenda.com/terms-and-conditions/94474485' target="_blank" className={Style.login_container_bottom_policy_links}>Terms of Service</a>, and <a href='https://www.iubenda.com/privacy-policy/94474485' target="_blank" className={Style.login_container_bottom_policy_links}>Privacy Policy</a>.
                    </div>
                </div>
                {openErrorAuth &&
                    <div className={Style.incorrectEmail}>
                        {errorAuth}
                    </div>
                }
                <div className={Style.login_box_button}>
                    {username && email && password && passwordConfirm ?
                        (<ActionButton action={signUpEmailPsw} text="Register" fontSize="0.9rem" />) :
                        (<InfoButton text="Fill All Required Fields" fontSize="0.9rem" />)}

                </div>
                <div className={`${Style.login_box_para} font-small`}>
                    Already registered?<div onClick={() => ChangeRegisterToLog()} className={Style.login_box_para_action}>Login</div>
                </div>

            </div>
        </div>
    )
}

export default Register2;