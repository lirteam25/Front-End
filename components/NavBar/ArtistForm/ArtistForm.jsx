import React, { useState, useContext } from 'react';
import { AiOutlineClose } from "react-icons/ai";

import Style from "./ArtistForm.module.css";
import { ActionButton, InfoButton } from '../../componentsIndex';
import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";

const ArtistForm = ({ closeArtistForm }) => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [instagram, setInstagram] = useState();
    const [spotify, setSpotify] = useState();
    const [soundcloud, setSoundcloud] = useState();
    const [other, setOther] = useState();

    const { sendArtistForm, openErrorAuth, errorAuth } = useContext(NFTMarketplaceContext);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && email && name) {
            ArtistForm();
        }
    };

    const ArtistForm = async () => {
        await sendArtistForm(name, email, instagram, spotify, soundcloud, other);
        closeArtistForm();
    }

    return (
        <div className={Style.ArtistForm}>
            <div className={`${Style.ArtistForm_top} font-normal`}>
                <div className={Style.ArtistForm_top_title}>
                    Artist Application
                </div>
                <AiOutlineClose className={Style.ArtistForm_top_x} onClick={() => closeArtistForm()} />
            </div>
            <div className={Style.ArtistForm_bottom}>
                <p className={`font-small`}>Please introduce yourself by completing the form below. We are highly interested in learning about your work and your music! <br />We'll get back to you within a couple of business days.</p>
                <div className={Style.ArtistForm_bottom_input}>
                    <input
                        className={Style.inputFake}
                        type="string"
                        placeholder="Insert Your Name"
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleKeyPress} />
                </div>
                <div className={Style.ArtistForm_bottom_input}>
                    <input
                        className={Style.inputFake}
                        type="email"
                        placeholder="Insert Your email"
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyPress} />
                </div>
                <div className={Style.ArtistForm_bottom_input}>
                    <input
                        className={Style.inputFake}
                        type="link"
                        placeholder="Link Your Instagram"
                        onChange={(e) => setInstagram(e.target.value)}
                        onKeyDown={handleKeyPress} />
                </div>
                <div className={Style.ArtistForm_bottom_input}>
                    <input
                        className={Style.inputFake}
                        type="link"
                        placeholder="Link Your Spotify"
                        onChange={(e) => setSpotify(e.target.value)}
                        onKeyDown={handleKeyPress} />
                </div>
                <div className={Style.ArtistForm_bottom_input}>
                    <input
                        className={Style.inputFake}
                        type="link"
                        placeholder="Link Your SoundCloud"
                        onChange={(e) => setSoundcloud(e.target.value)}
                        onKeyDown={handleKeyPress} />
                </div>
                <div className={Style.ArtistForm_bottom_input}>
                    <input
                        className={Style.inputFake}
                        type="link"
                        placeholder="Everything else (BandCamp, etc..)"
                        onChange={(e) => setOther(e.target.value)}
                        onKeyDown={handleKeyPress} />
                </div>
                {openErrorAuth &&
                    <div className={`${Style.incorrectEmail} font-small`}>
                        {errorAuth}
                    </div>
                }
                <div className={Style.login_box_button}>
                    <ActionButton action={ArtistForm} text="SEND REQUEST" fontSize="0.9rem" />
                    {/* {name && email ?
                        <ActionButton action={ArtistForm} text="SEND REQUEST" fontSize="0.9rem" /> :
                        <InfoButton text="Email and Name required" fontSize="0.9rem" />} */}
                </div>
            </div>
        </div>
    )
}

export default ArtistForm