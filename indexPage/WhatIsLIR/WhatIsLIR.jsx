import React, { useEffect } from 'react';
import Image from 'next/image';

//INTERNAL IMPORT
import Style from "./WhatIsLIR.module.css";
import { LinkButton } from '../../components/componentsIndex';
import img from "../../img/index";

const WhatIsLIR = () => {

    useEffect(() => {
        const img_3 = document.getElementById('img_3');
        const img_4 = document.getElementById('img_4');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            let initTop_3;
            let initTop_4;
            let initTop_3_Speed;
            let initTop_4_Speed;
            let startPercentage;
            if (window.innerWidth <= 480) {
                initTop_3 = 270;
                initTop_4 = 150;
                initTop_3_Speed = 0.15;
                initTop_4_Speed = 0.1;
                startPercentage = 0.1;
            } else if (window.innerWidth > 480 && window.innerWidth <= 1024) {
                initTop_3 = 450;
                initTop_4 = 200;
                initTop_3_Speed = 0.1;
                initTop_4_Speed = 0.15;
                startPercentage = 0.4;
            } else {
                initTop_3 = 300;
                initTop_4 = 20;
                initTop_3_Speed = 0.2;
                initTop_4_Speed = 0.3;
                startPercentage = 0.3;
            }
            if (scrollY > window.innerHeight * startPercentage) {
                img_3.style.top = `${initTop_3 + ((scrollY - window.innerHeight * startPercentage) * initTop_3_Speed)}px`;
                img_4.style.top = `${initTop_4 + ((scrollY - window.innerHeight * startPercentage) * initTop_4_Speed)}px`;
            }
        });

        return () => {
            // Remove the scroll event listener when the component unmounts
            window.removeEventListener('scroll', () => { });
        };
    }, []);

    return (
        <div className={Style.explanation}>
            <div className={Style.explanation_first}>
                <div className={Style.explanation_first_text}>
                    <div>
                        <h2 className="font-huge" style={{ color: "var(--main-color)" }}>ABOUT</h2>
                        <h3 className="font-medium">Lir allows artists to share exclusive musical content that can be collected by fans, as digital collectibles.</h3>
                        <LinkButton path="about-us" text="about" background="var(--main-color)" />
                    </div>
                </div>
                <Image src={img.card_coin_back} alt="Card Coin Back" className={Style.img_1} />
                <Image src={img.coin_bot} width={100} alt="coin bot" height="auto" className={Style.img_3} id='img_3' />
                <Image src={img.coin_top} width={60} alt="coin top" height="auto" className={Style.img_4} id='img_4' />
            </div>
            <div className={Style.explanation_second}>
                <h3 className="font-medium">Create your own collection and invest in artists success by trading content only available on LIR.</h3>
            </div>
        </div>
    )
}

export default WhatIsLIR;