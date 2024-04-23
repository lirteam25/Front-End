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
            <h2 className='font-huge'>Generate <span className='bold'>new value</span><br /> from music </h2>
            <div className={Style.JoinLir_grid}>
                <div className={Style.JoinLir_buttons}>
                    <div className={Style.JoinLir_secondFeature}>
                        <ActionButton text="SIGN UP" action={register} />
                    </div>
                    <div className={Style.JoinLir_secondFeature}>
                        <ActionButton text="APPLY AS AN ARTIST" action={openForm} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JoinLir;