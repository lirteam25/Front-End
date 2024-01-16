import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getAnalytics, logEvent } from "firebase/analytics";
import { isMobile } from "react-device-detect";

import Style from "./Tutorials.module.css";
import img from "../../img/index";

const Tutorials = () => {
    const [openYoutube1, setOpenYoutube1] = useState(false);
    const [openYoutube2, setopenYoutube2] = useState(false);
    const [mobile, setMobile] = useState(false);

    const openAndSendEventYoutube1 = () => {
        setOpenYoutube1(true);
        const analytics = getAnalytics();
        logEvent(analytics, "tutorial_begin_createWallet");
    }

    const openAndSendEventYoutube2 = () => {
        setopenYoutube2(true);
        const analytics = getAnalytics();
        logEvent(analytics, "tutorial_begin_RedeemToken");
    }

    useEffect(() => {
        setMobile(isMobile);
    }, [isMobile])

    return (
        <div className={Style.border}>
            <div className={Style.Tutorials} id="createAWallet">
                <h2 className="font-large">Tutorials</h2>
                <div className={Style.Tutorials_grid}>
                    <div className={Style.Tutorials_grid_1}>
                        {openYoutube1 ? (
                            <iframe
                                loading="lazy"
                                className={Style.Tutorials_grid_video}
                                src="https://www.youtube.com/embed/GQRp8kaIu_8?si=7lff5uz8z92EHrWG&amp;controls=0"
                                title="how to create a wallet"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen>
                            </iframe>) :
                            (<div className={Style.Tutorials_grid_image}>
                                <Image
                                    src={img.cover_howToCreateAWallet} alt="placeholder Youtube" className={Style.Tutorials_grid_video}
                                />
                                <div className={Style.play_button_overlay}>
                                    <Image src={img.play} alt="play icon" width={40} height={40} onClick={() => { openAndSendEventYoutube1() }} />
                                </div>
                            </div>
                            )}
                    </div>
                    <div className={Style.Tutorials_grid_3}>
                        {openYoutube2 ? (
                            <iframe
                                loading="lazy"
                                className={Style.Tutorials_grid_video}
                                src={`${mobile ? "https://www.youtube.com/embed/i9YoKPj5NJk?si=G3cbfdYgiNLpYVTu" : "https://www.youtube.com/embed/abEdutMnKzU?si=y9qg0Yge6rgodFgv"}`}
                                title="how to create a wallet"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen>
                            </iframe>) :
                            (<div className={Style.Tutorials_grid_image}>
                                <Image
                                    src={mobile ? img.cover_YT_mobile : img.cover_howToCollect} alt="placeholder Youtube" className={Style.Tutorials_grid_video}
                                />
                                <div className={Style.play_button_overlay}>
                                    <Image src={img.play} alt="play icon" width={40} height={40} onClick={() => { openAndSendEventYoutube2() }} />
                                </div>
                            </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tutorials;