import React, { useContext, useState, useEffect } from "react";
import { NextSeo } from 'next-seo';
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";

import 'swiper/css/pagination';

import { Navigation, Pagination } from 'swiper/modules';

//Internal Imports 
import { NFTCardTwo } from "../collectionPage/collectionPageIndex";
import Style from "../styles/discover.module.css";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const Discover = () => {
    const { fetchDiscoverNFTs } = useContext(NFTMarketplaceContext);

    const [filter, setFilter] = useState(false);

    const { data } = useQuery({
        queryKey: ["tokenInfo"],
        queryFn: fetchDiscoverNFTs
    }
    );

    const filteredNFts = data?.filter((el) => el.musicTag.includes(filter));

    const genres = ["All Genres", "Techno", "House", "Electronic", "Ambient"];

    const [currentSlidesPerView, setCurrentSlidesPerView] = useState(5);

    useEffect(() => {
        // Function to determine the slidesPerView based on current window width
        const calculateSlidesPerView = () => {
            const width = window.innerWidth;
            if (width >= 1450) return 12;
            if (width >= 1300) return 11;
            if (width >= 1200) return 10;
            if (width >= 1100) return 9;
            if (width >= 1000) return 8;
            if (width >= 900) return 7;
            if (width >= 670) return 5;
            if (width >= 450) return 4;
            if (width >= 370) return 3;
            return 2;
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

    const x = genres.length - currentSlidesPerView

    return (
        <div className={Style.vh_discover}>
            <NextSeo title="Collection | LIR" description="Discover unreleased limited-edition tracks. Start exploring now." />
            <div className={Style.discover}>
                <div className={
                    `${Style.discover_filter} 
                ${genres.length > currentSlidesPerView ?
                        (currentSlideIndex === 0 ? Style.right_dissolve :
                            (currentSlideIndex > 0 && currentSlideIndex < x ? Style.both_dissolve : Style.left_dissolve)) : Style.no_dissolve}`}>
                    <Swiper slidesPerView={2}
                        spaceBetween={10}
                        modules={[Pagination]}
                        className="mySwiper"
                        breakpoints={{
                            370: {
                                slidesPerView: 3,
                            },
                            450: {
                                slidesPerView: 4
                            },
                            670: {
                                slidesPerView: 5,
                            },
                            900: {
                                slidesPerView: 7,
                            },
                            1000: {
                                slidesPerView: 8,
                            },
                            1100: {
                                slidesPerView: 9,
                            },
                            1200: {
                                slidesPerView: 10,
                            },
                            1300: {
                                slidesPerView: 11,
                            },
                            1450: {
                                slidesPerView: 12,
                            }
                        }}
                        onSlideChange={handleSlideChange}
                    >
                        {genres.map((el, index) => (
                            <SwiperSlide key={index}>
                                <div className={`${Style.discover_filter_element} ${el !== "All Genres" ? (filter == el && Style.active) : (!filter && Style.active)} font-small`} onClick={() => {
                                    if (el === "All Genres") {
                                        if (filter) { setFilter(false) }
                                    } else if (filter != el) {
                                        setFilter(el)

                                    }
                                }}>
                                    {el}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <div className={Style.discover_items}>
                    <NFTCardTwo sellingNFTs={filter ? filteredNFts : data} />
                </div>
            </div>
        </div>
    );
}

export default Discover;