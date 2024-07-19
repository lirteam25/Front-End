import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image';

import { ExternalLinkButton, ActionButton, InfoButton } from '../../components/componentsIndex';
import img from "../../img/index";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";


//INTERNAL IMPORT
import Style from "./HeroSection.module.css";

const HeroSection = () => {

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
        <div className={Style.heroSection}>
            <div className={Style.heroSection_colums}>
                <div className={Style.heroSection_colums_text}>
                    <h1 className='font-huge bold'>
                        ENHANCING THE VALUE OF DIGITAL MUSIC.
                    </h1>
                    {emailSent ?
                        <div className={Style.heroSection_colums_text_button}>
                            <div className={Style.heroSection_colums_text_button_active}>
                                <InfoButton text="Email correctly sent" />
                            </div>
                        </div> :
                        <div className={Style.heroSection_colums_text_button}>
                            <h2 className={`${Style.heroSection_colums_text_button_explanation} font-large`}>
                                Release the first song for free ↓
                            </h2>
                            <div className={Style.heroSection_colums_text_button_flex}>
                                <input
                                    type="string"
                                    placeholder="Insert Your Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={handleKeyPress} />
                                <div className={Style.heroSection_colums_text_button_active}>
                                    <ActionButton text="APPLY AS AN ARTIST" action={ArtistForm} />
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className={Style.heroSection_colums_floppy}>
                    <Image src={img.landing_floppy} alt='floppy disk' className={Style.heroSection_colums_floppy_img} />
                </div>
            </div>
        </div>
    );
};

export default HeroSection;