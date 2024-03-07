import React from 'react';
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

    return (
        <div className={Style.LastRelease}>
            <div className={Style.LastRelease_box}>
                <div className={`${Style.LastRelease_box_title} font-huge`}>
                    <h2 className='font-huge'>Latest Drops</h2>
                </div>
                <div className={Style.LastRelease_box_swiper}>
                    <Swiper slidesPerView={1}
                        spaceBetween="1rem"
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
                    >
                        {tokenInfoData &&
                            tokenInfoData.map((token, index) => (
                                <SwiperSlide key={index}>
                                    <NFTCard sellingNFTs={[token]} isSingle={true} />
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default LastRelease;