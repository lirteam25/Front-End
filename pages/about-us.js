import React from 'react';
import { NextSeo } from 'next-seo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["aboutUs", "_app", "index"])),
        }
    }
}

//Internal Imports
import Style from "./../styles/about-us.module.css";
import { Vision, TeamComposition } from '../aboutUs/aboutUsIndex';

const AboutUs = () => {
    return (
        <div className={Style.Vh_aboutUs}>
            <NextSeo title="About | LIR" description="Learn about the passionate team behind LIR. Discover our mission, values, and the journey that drives us to redefine the digital collectibles market." />
            <div className={Style.aboutUs}>
                <Vision />
                <div className={Style.aboutUs_3}>
                    <TeamComposition />
                </div>
            </div>
        </div>
    )
}

export default AboutUs;