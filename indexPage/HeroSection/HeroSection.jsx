import React from 'react';
import { ExternalLinkButton } from '../../components/componentsIndex';


//INTERNAL IMPORT
import Style from "./HeroSection.module.css";

const HeroSection = () => {

    return (
        <div className={Style.heroSection}>
            <div className={Style.heroSection_box}>
                <div className={Style.heroSection_box_colums}>
                    <h1 className="font-huge">REVIVING <span className='bold'>MUSIC COLLECTING</span><br />
                        BY <span className='bold'>DIGITIZING</span> ITS PRACTICES <br />
                        THROUGH BLOCKCHAIN</h1>
                    <ExternalLinkButton text="learn more" path="https://www.docs.lirmusic.com" background="white" textColor="black" />
                </div>
            </div>
            <div className={Style.heroSection_gradient} />
        </div>
    );
};

export default HeroSection;