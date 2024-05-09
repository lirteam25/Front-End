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
                    <ExternalLinkButton text="learn more" path="https://lirmusic.notion.site/Lir-Music-info-694b4a6252224f9fba741bc2397f6212?pvs=4" background="white" textColor="black" />

                </div>
            </div>
        </div>
    );
};

export default HeroSection;