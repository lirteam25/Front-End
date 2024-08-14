import React, { useState, useEffect } from 'react';
import Style from './LastRelease.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';


// Import Swiper styles
import "swiper/css";

import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';

import NFTCard from '../../collectionPage/NFTCardTwo/NFTCardTwo';

// Import Swiper styles

// Install Swiper modules

const LastRelease = ({ tokenInfoData }) => {

    const [currentSlidesPerView, setCurrentSlidesPerView] = useState(2);

    useEffect(() => {
        // Function to determine the slidesPerView based on current window width
        const calculateSlidesPerView = () => {
            const width = window.innerWidth;
            if (width >= 1200) return 5;
            if (width >= 900) return 4;
            if (width >= 670) return 3;
            if (width >= 375) return 2;
            return 1;
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

    const x = tokenInfoData?.length - currentSlidesPerView


    return (

        <div className={`${Style.LastRelease_box_swiper} 
        ${tokenInfoData?.length > currentSlidesPerView ?
                (currentSlideIndex === 0 ? Style.right_dissolve :
                    (currentSlideIndex > 0 && currentSlideIndex < x ? Style.both_dissolve : Style.left_dissolve)) : Style.no_dissolve}`}

        >
            <Swiper slidesPerView={1}
                spaceBetween="1rem"
                grabCursor={true}
                modules={[Pagination]}
                className="mySwiper"
                breakpoints={{
                    375: {
                        slidesPerView: 2,
                    },
                    670: {
                        slidesPerView: 3,
                    },
                    900: {
                        slidesPerView: 4,
                    },
                    1200: {
                        slidesPerView: 5,
                    }
                }}
                onSlideChange={handleSlideChange}
            >
                {tokenInfoData &&
                    tokenInfoData.map((token, index) => (
                        <SwiperSlide key={index}>
                            <NFTCard sellingNFTs={[token]} isSingle={true} />
                        </SwiperSlide>
                    ))}
            </Swiper>
        </div>
    );
};

export default LastRelease;