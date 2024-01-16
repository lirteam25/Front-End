import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Image from 'next/image';
import Link from "next/link";

import Style from "./ImageSwiper.module.css";
import img from "../../../img/index";
import 'swiper/css/effect-cards';
import { EffectCards } from 'swiper/modules';


const ImageSwiper = () => {
    const cover = [
        {
            index: 2,
            imageName: "trovieroCard",
            query: "token_id=1&token_address=0x5cb1df94c795808e94db596461aa8b8e60755443&id=656a26c6471e8d0af9d93b1d"
        },
        {
            index: 1,
            imageName: "marlonCard",
            query: "token_id=1&token_address=0x614f589c0761a6309ee0777075f765f2684b307e&id=655fc413471e8d0af9d92be8"
        },
        {
            index: 0,
            imageName: "toriukeCard",
            query: "token_id=1&token_address=0x7420fbc723fd25d8c6f498f17eb584b92d32cad6&id=6532b2246ffacfbb084f22ce"
        }
    ];

    return (
        <Swiper
            effect={'cards'}
            grabCursor={true}
            modules={[EffectCards]}
            className={`${Style.cointainer} mySwiper`}
        >
            {cover.map((el, i) => (
                <SwiperSlide key={el.index}>
                    <Link href={{ pathname: "/token-details", query: `${el.query}` }}>
                        <Image
                            alt="cover"
                            priority
                            src={img[`${el.imageName}`]}
                            className={Style.cointainer_image}
                        />
                    </Link>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export default ImageSwiper;