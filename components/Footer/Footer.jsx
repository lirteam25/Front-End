import React, { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTwitter, FaDiscord, FaYoutube } from "react-icons/fa";

//INTERNAL IMPORT
import Style from "./Footer.module.css";
import images from "../../img";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";
// menu we are going to display and are needed in the footer

const Footer = () => {

    const { openFooterAudio } = useContext(NFTMarketplaceContext);
    return (
        <div className={`${Style.footer} ${openFooterAudio && Style.footer_higher}`}>
            <div className={Style.footer_box}>
                <div className={Style.footer_box_logo}>
                    {/*Logo image */}
                    <Image
                        src={images.logo}
                        alt="footer logo"
                        height={30.5}
                        width="auto"
                    />
                </div>
                <div className={`${Style.footer_box_rights} font-normal`}>
                    ©2023 LIR, all rights reserved<br />
                    lirmusic.com
                    <br /><br />
                    <Link href="https://play.google.com/store/apps/details?id=com.lirmusic.LIRMUSIC&hl=en&gl=US" target="_blank">Android App</Link>
                </div>
                <div className={`${Style.footer_box_text} font-normal`}>
                    get in touch <a className={Style.mail} href="mailto:info@lirmusic.com">info@lirmusic.com</a>
                    <div className={Style.footer_box_text_bottom}>
                        <Link className={Style.footer_box_1_item} target="_blank" href={"https://lirmusic.notion.site/Lir-Music-info-694b4a6252224f9fba741bc2397f6212?pvs=4"}>
                            info
                        </Link><br />
                        <Link className={Style.footer_box_1_item} target="_blank" href={"https://www.iubenda.com/privacy-policy/94474485"}>
                            privacy policy
                        </Link><br />
                        <Link className={Style.footer_box_1_item} target="_blank" href={"https://www.iubenda.com/privacy-policy/94474485/cookie-policy"}>
                            cookie policy
                        </Link><br />
                        <Link className={Style.footer_box_1_item} target="_blank" href={"https://www.iubenda.com/terms-and-conditions/94474485"}>
                            terms & conditions
                        </Link><br />
                        <Link href='#' className={`${Style.footer_box_1_item} iubenda-cs-preferences-link`}>
                            your privacy choices
                        </Link><br />
                        <Link href='#' className={`${Style.footer_box_1_item} iubenda-cs-uspr-link`}>
                            notice at collection
                        </Link>
                    </div>
                </div>
                <div className={Style.footer_box_right}>
                    <a href="https://www.instagram.com/lirmusicofficial" target="_blank"><FaInstagram size={23} className={Style.link} /></a>
                    <a href="https://twitter.com/LIRMusicOfc" target="_blank"><FaTwitter size={23} className={Style.link} /></a>
                    <a href="https://discord.gg/JbxC2ucbM8" target="_blank"><FaDiscord size={23} className={Style.link} /></a>
                    <a href="https://www.youtube.com/@lirmusicofficial" target="_blank"><FaYoutube size={23} className={Style.link} /></a>
                </div>
            </div>
        </div>
    );
};

export default Footer;
