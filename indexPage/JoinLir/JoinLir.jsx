import React, { useContext } from 'react';

import Style from "./JoinLir.module.css";
import { ActionButton, LinkButton } from '../../components/componentsIndex';
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const JoinLir = () => {
    const { setOpenRegister, setOpenArtistForm } = useContext(NFTMarketplaceContext);

    const register = () => {
        setOpenRegister(true);
    }

    const openForm = () => {
        setOpenArtistForm(true);
    }

    return (
        <div className={Style.JoinLir}>
            <div className={Style.JoinLir_grid}>
                <div className={Style.JoinLir_grid_left}>
                    <h2 className="font-huge" style={{ color: "var(--main-color)" }}>JOIN AS A FAN</h2>
                    <h3 className="font-medium" >Create an account. Connect your wallet.<br /> <span style={{ color: "var(--main-color)" }}>Start building your own valuable digital music collection. </span></h3>
                    <p className="font-small">
                        <span style={{ color: "var(--main-color)", textDecoration: "underline", cursor: "pointer" }} onClick={() => register()}>Create your account</span> for free, a valid email address is all that you need.
                        You need a crypto wallet to collect tracks. Connect it after logging in.
                        Don't have it? <a href="#createAWallet" style={{ color: "var(--main-color)", textDecoration: "underline", cursor: "pointer" }}>Follow a few simple steps to create one.</a>
                    </p>
                    <div className={Style.JoinLir_grid_left_button}>
                        <ActionButton text="SIGN UP" action={register} />
                    </div>
                </div>
                <div className={Style.JoinLir_grid_right}>
                    <h2 className="font-huge" style={{ color: "var(--main-color)" }}>JOIN AS AN ARTIST</h2>
                    <h3 className="font-medium" >Treat your music as masterpieces of art. <br /> <span style={{ color: "var(--main-color)" }}>Create a new independent revenue stream while satisfying the most demanding fans.</span></h3>
                    <div className={Style.JoinLir_grid_right_buttons}>
                        <div className={Style.JoinLir_grid_right_firstButton}>
                            <LinkButton text="LEARN MORE" path="./about-us" background="white" textColor="black" />
                        </div>
                        <div className={Style.JoinLir_grid_right_secondButton}>
                            <ActionButton text="APPLY" action={openForm} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JoinLir;