import React, { useContext } from 'react';

import Style from "./JoinLir.module.css";
import { ActionButton, ExternalLinkButton } from '../../components/componentsIndex';
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
            <h2 className='font-huge'>Generating <span className='bold'>new value</span> from music </h2>
            <div className={Style.JoinLir_grid}>
                <div className={Style.JoinLir_grid_left}>
                    <h3 className="font-huge" style={{ color: "var(--main-color)" }}>JOIN AS A <span className='bold'>FAN</span></h3>
                    <h4 className="font-medium" >
                        Collect exclusive tracks that only a few can access and become contributor of artists' success.</h4>
                    <div className={Style.JoinLir_grid_left_button}>
                        <div className={Style.JoinLir_grid_right_secondButton}>
                            <ActionButton text="SIGN UP" action={register} />
                        </div>
                        <ExternalLinkButton text="learn more" path="https://www.docs.lirmusic.com" background="white" textColor="black" />
                    </div>
                </div>
                <div className={Style.JoinLir_grid_right}>
                    <h3 className="font-huge" style={{ color: "var(--main-color)" }}>JOIN AS AN <span className='bold'>ARTIST</span></h3>
                    <h4 className="font-medium" >
                        Collect exclusive tracks that only a few can access and become contributor of artists' success.</h4>
                    <div className={Style.JoinLir_grid_right_buttons}>
                        <div className={Style.JoinLir_grid_right_secondButton}>
                            <ActionButton text="APPLY" action={openForm} />
                        </div>
                        <ExternalLinkButton text="learn more" path="https://www.docs.lirmusic.com" background="white" textColor="black" />
                    </div>
                </div>
            </div>
            <h2 className='font-huge'>Valuing <span className='bold'>music</span> properly</h2>
        </div>
    )
}

export default JoinLir;