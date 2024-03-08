import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import img from "../../../img/index";

// Import Swiper styles
import "swiper/css";

import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';


import Style from "./Collectors.module.css";

const Collectors = ({ supporters }) => {
    return (
        <div>
            <div className={Style.Collectors}>
                <Swiper slidesPerView={5}
                    modules={[Pagination]}
                    className="mySwiper"
                    breakpoints={{
                        375: {
                            slidesPerView: 6,
                        },
                        670: {
                            slidesPerView: 8,
                        },
                        900: {
                            slidesPerView: 10,
                        },
                        1200: {
                            slidesPerView: 12,
                        }
                    }}
                >
                    {supporters &&
                        supporters.map((el, index) => (
                            <SwiperSlide key={index}>
                                <div className={Style.Collectors_box}>
                                    <Image src={img[`utente_${el.picture}`]} alt="profile user" />
                                    <div className={`${Style.Collectors_displayOnHover} font-small`}>
                                        <div className={Style.Collectors_displayOnHover_box}>{el.displayName}</div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                </Swiper>

            </div>
        </div>
    )
}

export default Collectors;