import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";


//INTERNAL IMPORT
import Style from "./HeroSection.module.css";
import { LinkButton } from '../../components/componentsIndex';
import img from "../../img/index";
import ImageSwiper from "./ImageSwiper/ImageSwiper";

const HeroSection = () => {
    const [timeRemaining, setTimeRemaining] = useState('00:00:00');

    useEffect(() => {
        // Get the target date (October 20th)
        const targetDate = new Date('2023-12-04T18:00:00').getTime();

        // Function to update the timer
        function updateTimer() {
            const currentDate = new Date().getTime();
            const timeDifference = targetDate - currentDate;

            if (timeDifference <= 0) {
                // The target date has passed
                setTimeRemaining('00:00:00:00');
            } else {
                // Calculate hours, minutes, and seconds
                const days = Math.floor((timeDifference / (1000 * 60 * 60 * 24)));
                const hours = Math.floor((timeDifference / (1000 * 60 * 60))) % 24;
                const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
                const seconds = Math.floor((timeDifference / 1000) % 60);

                // Format the time as HH:MM:SS
                const formattedTime = `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                // Update the timer state
                setTimeRemaining(formattedTime);
            }
        }

        // Call the updateTimer function initially
        updateTimer();

        // Update the timer every second (1000 milliseconds)
        const timerInterval = setInterval(updateTimer, 1000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(timerInterval);
    }, []);
    return (
        <div className={Style.heroSection}>
            <video autoPlay muted loop className={Style.video} loading="lazy" poster="/cover_video_mp4.png">
                <source src={"/timetofirst2.mp4"} type="video/mp4" />
            </video>
            <Image src={img.background_iPhone} alt="backgroundIphone" className={Style.heroSection_box_mobile} />
            <div className={Style.heroSection_box}>
                <div className={Style.heroSection_box_colums}>
                    <div className={Style.heroSection_box_colums_left}>
                        <h1 className="font-huge">DROP #3</h1>
                        <p className='font-normal'>VVV by Troviero is now available exclusively on Lir. Only 50 tokens available, redeem yours for free.</p>
                        {timeRemaining == "00:00:00:00" ?
                            <LinkButton
                                path="./token-details"
                                queries="token_id=1&token_address=0x5cb1df94c795808e94db596461aa8b8e60755443&id=656a26c6471e8d0af9d93b1d"
                                text="collect the full track for free"
                                background="var(--main-color)" /> :
                            <div> <span className={`${Style.heroSection_box_colums_left_timer} font-normal`}>{timeRemaining}</span>
                            </div>}
                    </div>
                    <div className={Style.heroSection_box_colums_rigth}>
                        <ImageSwiper />
                        <div className={`${Style.heroSection_box_colums_rigth_legend} font-small`}> <IoIosArrowBack /> click and drag the cards to discover the latest drops <IoIosArrowForward /></div>
                    </div>
                </div>
            </div>
            <div className={Style.heroSection_gradient} />
        </div>
    );
};

export default HeroSection;