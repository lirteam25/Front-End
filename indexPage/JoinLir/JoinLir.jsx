import React, { useState, useContext } from 'react';

import Style from "./JoinLir.module.css";
import { ActionButton, ButtonConnectWallet } from '../../components/componentsIndex';
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const JoinLir = () => {
    const { sendArtistForm } = useContext(NFTMarketplaceContext);

    const [email, setEmail] = useState();
    const [emailSent, setEmailSent] = useState(false);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && email) {
            ArtistForm();
        }
    };

    const ArtistForm = async () => {
        if (email) {
            const name = "an Artist sent the form";
            await sendArtistForm(name, email);
            setEmailSent(true)
        }
    }

    return (
        <div className={Style.JoinLir}>
            <h2 className='font-huge bold'>Join our community</h2>
            <div className={Style.JoinLir_buttons}>
                <div>
                    <span className='font-large'>Start Collecting</span>
                    <div className={Style.JoinLir_buttons_button}>
                        <ButtonConnectWallet />
                    </div>
                </div>
                <div>
                    <span className='font-large '>Release the first song for free ↓</span>
                    <div className={Style.JoinLir_buttons_email}>
                        {emailSent ?
                            <InfoButton text="Email correctly sent" /> :
                            <div className={Style.JoinLir_buttons_button_flex}>
                                <input
                                    type="string"
                                    placeholder="Insert Your Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={handleKeyPress} />
                                <div className={Style.heroSection_colums_text_button_active}>
                                    <ActionButton text="APPLY AS AN ARTIST" action={ArtistForm} />
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JoinLir;