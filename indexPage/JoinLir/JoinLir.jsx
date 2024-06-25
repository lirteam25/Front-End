import React, { useContext } from 'react';

import Style from "./JoinLir.module.css";
import { ActionButton, ButtonConnectWallet } from '../../components/componentsIndex';
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const JoinLir = () => {
    const { setOpenArtistForm } = useContext(NFTMarketplaceContext);

    const openForm = () => {
        setOpenArtistForm(true);
    }

    return (
        <div className={Style.JoinLir}>
            <h2 className='font-huge'>Join our<br /> community </h2>
            <div className={Style.JoinLir_buttons}>
                <div className={Style.JoinLir_secondFeature}>
                    <ButtonConnectWallet />
                </div>
                <div className={Style.JoinLir_secondFeature}>
                    <ActionButton text="APPLY AS AN ARTIST" action={openForm} />
                </div>
            </div>
        </div>
    )
}

export default JoinLir;