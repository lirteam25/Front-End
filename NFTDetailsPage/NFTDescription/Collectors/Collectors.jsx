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
                <Swiper slidesPerView={12}
                    spaceBetween="1rem"
                    modules={[Pagination]}
                    className="mySwiper"
                >
                    {supporters &&
                        supporters.map((el, index) => (
                            <SwiperSlide key={index} className={Style.Collectors_img}>
                                <div>
                                    <Image src={img[`utente_${el.picture}`]} alt="profile user" width={30.5} height={30.5} />
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