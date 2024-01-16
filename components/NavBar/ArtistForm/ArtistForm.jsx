import React, { useState, useContext } from 'react';
import { AiOutlineClose } from "react-icons/ai";


import Style from "./../Login/Login.module.css";
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
        if (e.key === 'Enter' && email) {
            ArtistForm();
        }
    };

    const ArtistForm = async () => {
        await sendArtistForm(name, email, instagram, spotify, soundcloud, other);
        closeArtistForm();
    }

    return (
        <div className={Style.login}>
            <div className={`${Style.login_container} font-normal`}>
                <div className={Style.login_container_top}>
                    <div className={Style.login_container_top_login}>
                        Artist Application
                    </div>
                    <AiOutlineClose className={Style.login_container_top_x} onClick={() => closeArtistForm()} />
                </div>
            </div>
            <div className={Style.login_container_bottom}>
                <p className={`${Style.form_paragraph} font-small`}>Please introduce yourself by completing the form below. We are highly interested in learning about your work and your music! We'll get back to you within a couple of business days.</p>
                <div className={Style.user_box_input}>
                    <input
                        className={Style.user_box_input_input}
                        type="string"
                        placeholder="Insert Your Name"
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleKeyPress} />
                </div>
                <div className={Style.user_box_input}>
                    <input
                        className={Style.user_box_input_input}
                        type="email"
                        placeholder="Insert Your email"
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyPress} />
                </div>
                <div className={Style.user_box_input}>
                    <input
                        className={Style.user_box_input_input}
                        type="link"
                        placeholder="Link Your Instagram"
                        onChange={(e) => setInstagram(e.target.value)}
                        onKeyDown={handleKeyPress} />
                </div>
                <div className={Style.user_box_input}>
                    <input
                        className={Style.user_box_input_input}
                        type="link"
                        placeholder="Link Your Spotify"
                        onChange={(e) => setSpotify(e.target.value)}
                        onKeyDown={handleKeyPress} />
                </div>
                <div className={Style.user_box_input}>
                    <input
                        className={Style.user_box_input_input}
                        type="link"
                        placeholder="Link Your SoundCloud"
                        onChange={(e) => setSoundcloud(e.target.value)}
                        onKeyDown={handleKeyPress} />
                </div>
                <div className={Style.user_box_input}>
                    <input
                        className={Style.user_box_input_input}
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
                    {name && email ?
                        <ActionButton action={ArtistForm} text="SEND REQUEST" fontSize="0.9rem" /> :
                        <InfoButton text="Email and Name required" fontSize="0.9rem" />}
                </div>
            </div>
        </div>
    )
}

export default ArtistForm