import React from 'react';
import { ExternalLinkButton } from '../../components/componentsIndex';


//INTERNAL IMPORT
import Style from "./HeroSection.module.css";

const HeroSection = () => {

    return (
        <div className={Style.heroSection}>
            <div className={Style.heroSection_box}>
                <div className={Style.heroSection_box_colums}>
                    <div className={Style.heroSection_box_colums_title}>
                        <h1 className="font-huge">COLLECT <span className='bold'>UNRELEASED</span><br />
                            <span className='bold'>LIMITED EDITIONS</span> TRACKS</h1>
                    </div>
                    <ExternalLinkButton text="learn more" path="https://www.docs.lirmusic.com" background="white" textColor="black" />

                </div>
            </div>
            <div className={Style.heroSection_gradient} />
        </div>
    );
};

export default HeroSection;