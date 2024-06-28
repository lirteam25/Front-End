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
        const name = "an Artist sent the form";
        console.log(name);
        console.log(email);
        await sendArtistForm(name, email);
        setEmailSent(true)
    }

    const [index, setIndex] = useState(0);
    const words = ["MUSIC", "ART", "RULES"];
    const [rolling, setRolling] = useState(false);

    useEffect(() => {
        const changeWord = () => {
            setRolling(true);
            setTimeout(() => {
                setIndex((prevIndex) => (prevIndex + 1) % words.length);
                setRolling(false);
            }, 500); // match this timeout with the CSS animation duration
        };

        const interval = setInterval(changeWord, 2000); // Change every 2 seconds
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    return (
        <div className={Style.heroSection}>
            <div>
                <div className={`${Style.heroSection_banner} font-normal`}>
                    <span className='bold'>free lifetime release</span> for the first <span className='bold'>20</span> artists
                </div>
                <div className={Style.heroSection_colums}>
                    <div className={Style.heroSection_colums_text}>
                        <h1 className='font-huge'>
                            <br />
                            YOUR <span id="animatedWord" className={`${Style.heroSection_colums_text_animateWord} ${rolling ? Style.fadeOut : ''} bold`}>{words[index]}</span>  <br />
                        </h1>
                        <p className='font-normal'>
                            Create your <span className='bold'>digital vinyl</span>.
                            <br />Set the <span className='bold'>supply</span>, <span className='bold'>price</span>, and upload your <span className='bold'>unreleased track</span>.
                            <br />No production costs or shippings. Let fans <span className='bold'>collect</span> and <span className='bold'>resell digitally</span>.
                        </p>
                        {emailSent ?
                            <div className={Style.heroSection_colums_text_button}>
                                <div className={Style.heroSection_colums_text_button_active}>
                                    <InfoButton text="Email correctly sent" />
                                </div>
                            </div> :
                            <div className={Style.heroSection_colums_text_button}>
                                <input
                                    type="string"
                                    placeholder="Insert Your Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={handleKeyPress} />
                                <div className={Style.heroSection_colums_text_button_active}>
                                    {email ?
                                        <ActionButton text="APPLY" action={ArtistForm} /> :
                                        <InfoButton text="APPLY" />
                                    }
                                </div>
                            </div>
                        }
                    </div>
                    <div className={Style.heroSection_colums_floppy}>
                        <Image src={img.landing_floppy} alt='floppy disk' className={Style.heroSection_colums_floppy_img} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;