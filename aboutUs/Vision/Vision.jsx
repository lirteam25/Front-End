import React from 'react';
import { useTranslation } from 'next-i18next';

//Internal Imports
import Style from "./Vision.module.css";
import { LinkButton } from '../../components/componentsIndex';


const Introduction = () => {

    const { t } = useTranslation("aboutUs");
    return (
        <div className={Style.introduction}>
            <h1 className='font-large'>About</h1>
            <div className={Style.introduction_bottom}>
                <div className={Style.introduction_bottom_card}>
                    <p className='font-normal'>
                        LIR is a streaming platform where fans can collect, trade and resell exclusive musical artist contents, such as live versions and bonus tracks. <br />
                        The idea is to revive music collecting, currently still ancored to vinyl and CDs, by digitalizing its practices. <br />
                        We strongly believe in blockchain technology as the ideal vehicle for our concept.</p>
                </div>
                <div className={Style.introduction_bottom_card}>
                    <h2 className='font-normal'>Vision</h2>
                    <p className='font-normal'>{t("vision")}</p>
                </div>
                <div className={Style.introduction_bottom_card}>
                    <h2 className='font-normal'>Mission</h2>
                    <p className='font-normal'>{t("mission")}</p>
                </div>
                <div className={Style.introduction_bottom_card}>
                    <h2 className='font-normal'>Purpose</h2>
                    <p className='font-normal'>{t("purpose")}</p>
                </div>
                <div className={Style.introduction_bottom_card}>
                    <p className='font-normal'>This is LIR's MVP.
                        We are currently curating artists for the platform.
                        If you would like to join our project or for any other inquiries, contact us at <a href='mailto:info@lirmusic.com' style={{ color: "var(--main-color)" }}>info@lirmusic.com</a>.
                    </p>
                </div>
            </div>
            <LinkButton text={"Get in touch"} path={"mailto:info@lirmusic.com"} />
        </div>
    )
}

export default Introduction