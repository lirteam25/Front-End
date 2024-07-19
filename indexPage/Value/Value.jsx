import React, { useState, useContext } from 'react';

import Style from "./Value.module.css";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";
import { ExternalLinkButton, ActionButton, InfoButton, ButtonConnectWallet } from "../../components/componentsIndex";

const fan = [
    {
        "title": "Resale opportunity",
        "description": "Your digital music collection has real value. Through blockchain technology, you can collect tracks and resell them."
    },
    {
        "title": "Ownership of limited edition music",
        "description": "Own something unique and special. Elevate your music collection with limited edition tracks."
    },
    {
        "title": "Direct support to artist",
        "description": "Directly support the artists you love and contribute to their artistic journey."
    }
]

const artist = [
    {
        "title": "Enhanced fan engagement",
        "description": "Release limited edition tracks directly to your fans. Give them the possibility to digitally collect and trade them though blockchain technology."
    },
    {
        "title": "No subscription fees",
        "description": "Receive 90% of each sale, instantly. The remaining 10% is allocated to run the platform. We value collecting, not subscriptions."
    },
    {
        "title": "Lower cost for higher profits",
        "description": "Eliminate high production and distribution costs associated with vinyl records, resulting in increased profits."
    },
    {
        "title": "Resale royalties",
        "description": "Earn a 5% share on each resale. This is not possible in ordinary vinyl release."
    }
]

const Value = () => {

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
        <div className={Style.Value}>
            <div className={Style.Value_grid}>
                <div className={Style.Value_grid_2}>
                    <h2 className='font-huge bold'>Home of digital vinyls.</h2>
                    <div className={Style.Value_grid_2_grid}>
                        <div>
                            <p className='font-large'>
                                The first music marketplace where you can <span className='red bold'>resell</span> purchased digital music.
                            </p>
                            <p className='font-large'>
                                Each release is a <span className='red bold'>limited edition</span> unreleased track.
                            </p>
                            <p className='font-large'>
                                Once purchased they can be resold, like vinyl records.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <h2 className={`${Style.center} font-huge bold`}>Why choose Lir Music?</h2>
            <div className={Style.Value_bottomGrid}>
                <div className={Style.Value_bottomGrid_fan}>
                    <h3 className='font-large bold'>Collectors</h3>
                    {fan.map((el, i) => (
                        <div key={el.title} className={Style.Value_bottomGrid_fan_element}>
                            <h4 className='font-large'>{el.title}</h4>
                            <p className='font-small'>{el.description}</p>
                        </div>
                    ))}
                    <div className={Style.Value_bottomGrid_artist_bottom}>
                        <ButtonConnectWallet text="SIGN IN" />
                    </div>
                </div>
                <div className={Style.Value_bottomGrid_artist}>
                    <h3 className='font-large bold'>Artists & labels</h3>
                    {artist.map((el, i) => (
                        <div key={el.title} className={Style.Value_bottomGrid_fan_element}>
                            <h4 className='font-large'>{el.title}</h4>
                            <p className='font-small'>{el.description}</p>
                        </div>
                    ))}
                    <div className={Style.Value_bottomGrid_artist_bottom}>
                        {emailSent ?
                            <InfoButton text="Email correctly sent" /> :
                            <div className={Style.Value_bottomGrid_artist_bottom_active}>
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
            <div className={Style.Value_learnMore}>
                <ExternalLinkButton text="learn more" path="https://lirmusic.notion.site/Lir-Music-info-694b4a6252224f9fba741bc2397f6212?pvs=4" background="white" textColor="black" />
            </div>
        </div>
    )
}

export default Value;