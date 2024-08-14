import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import img from "../../../img/index";

// Import Swiper styles
import "swiper/css";

import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';
import Style from "./Collectors.module.css";

const Collectors = ({ supporters }) => {

    const [currentSlidesPerView, setCurrentSlidesPerView] = useState(5);

    useEffect(() => {
        // Function to determine the slidesPerView based on current window width
        const calculateSlidesPerView = () => {
            const width = window.innerWidth;
            if (width >= 1200) return 12;
            if (width >= 900) return 10;
            if (width >= 670) return 8;
            if (width >= 375) return 5;
            return 4;
        };

        // Set the initial slidesPerView
        setCurrentSlidesPerView(calculateSlidesPerView());

        // Update the slidesPerView on window resize
        const handleResize = () => {
            setCurrentSlidesPerView(calculateSlidesPerView());
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const handleSlideChange = (swiper) => {
        setCurrentSlideIndex(swiper.activeIndex);
    };

    const x = supporters?.length - currentSlidesPerView

    return (
        <div>
            <div className=
                {`${Style.Collectors} 
            ${supporters?.length > currentSlidesPerView ?
                        (currentSlideIndex === 0 ? Style.right_dissolve :
                            (currentSlideIndex > 0 && currentSlideIndex < x ? Style.both_dissolve : Style.left_dissolve)) : Style.no_dissolve}`}>
                <Swiper slidesPerView={5}
                    modules={[Pagination]}
                    className="mySwiper"
                    breakpoints={{
                        375: {
                            slidesPerView: 5,
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
                    onSlideChange={handleSlideChange}
                >
                    {supporters &&
                        supporters.map((el, index) => (
                            <SwiperSlide key={index}>
                                <div className={Style.Collectors_box}>
                                    <Image src={img[`utente_${el.picture}`]} alt="profile user" />
                                    <div className={`${Style.Collectors_displayOnHover} font-small`}>
                                        <div className={Style.Collectors_displayOnHover_box}>{el.display_name}</div>
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