import React, { useState, useEffect, useContext, useRef } from 'react';
import Link from 'next/link';
import Image from "next/image";


import Style from "./FooterAudioPlayer.module.css";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";
import img from "./../../img/index";

const FooterAudioPlayer = () => {
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentVolume, setCurrentVolume] = useState(1);
    const audioPlayer = useRef();   // reference our audio component
    const progressBar = useRef();   // reference our progress bar
    const animationRef = useRef();  // reference the animation
    const volumeBar = useRef(); // reference the volume


    const { setStopFooter, stopFooter, stopAudioPlayer, setStopAudioPlayer, nft, currentIndex, setCurrentIndex, sendUserActivity } = useContext(NFTMarketplaceContext);

    useEffect(() => {
        const seconds = Math.floor(audioPlayer.current.duration);
        setDuration(seconds);
        progressBar.current.max = seconds;
        if (!stopFooter) {
            const playPromise = audioPlayer.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        animationRef.current = requestAnimationFrame(whilePlaying);
                    })
                    .catch(error => {
                    });
            }
        }
    }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

    useEffect(() => {
        setCurrentTime(0);
        audioPlayer.current.load();
    }, [currentIndex]);

    useEffect(() => {
        togglePlayPause();
    }, [stopFooter])


    const calculateTime = (secs) => {
        const minutes = Math.floor(secs / 60);
        const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${returnedMinutes}:${returnedSeconds}`;
    }

    const togglePlayPause = () => {
        if (!stopAudioPlayer) {
            setStopAudioPlayer(true);
        };
        const prevValue = stopFooter;
        if (!prevValue) {
            audioPlayer.current.play();
            animationRef.current = requestAnimationFrame(whilePlaying)
        } else {
            audioPlayer.current.pause();
            cancelAnimationFrame(animationRef.current);
        }
    }

    const whilePlaying = () => {
        if (audioPlayer.current) {
            progressBar.current.value = audioPlayer.current.currentTime;
            changePlayerCurrentTime();
            animationRef.current = requestAnimationFrame(whilePlaying);
        }
    }

    useEffect(() => {
        const handleEnded = async () => {
            await playNextSong();
        };

        audioPlayer.current.addEventListener('ended', handleEnded);

        return () => {
            // Clean up the event listener when the component unmounts
            audioPlayer.current.removeEventListener('ended', handleEnded);
        };

    }, [currentIndex]);

    const changeRange = () => {
        audioPlayer.current.currentTime = progressBar.current.value;
        changePlayerCurrentTime();
    }

    const changePlayerCurrentTime = () => {
        const backgroundSize = `${progressBar.current.value / Math.floor(audioPlayer.current.duration) * 100}% 100%`;
        progressBar.current.style.backgroundSize = backgroundSize;
        setCurrentTime(progressBar.current.value);
    }

    const changeVolumeRange = () => {
        audioPlayer.current.volume = volumeBar.current.value / 100;
        changePlayerCurrentVolume();
    }

    const changePlayerCurrentVolume = () => {
        const backgroundSize = `${volumeBar.current.value}% 100%`;
        volumeBar.current.style.backgroundSize = backgroundSize;
        setCurrentVolume(volumeBar.current.value / 100);
    };

    const playNextSong = async () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < nft.length) {
            setCurrentIndex(nextIndex);
            await sendUserActivity(nft[nextIndex].token_id, nft[nextIndex].token_address, false);
        }
    }

    const playPreviousSong = async () => {
        if (currentIndex == 0) {
            audioPlayer.current.currentTime = 0;
            if (nft[currentIndex].audioCloudinary) {
                await sendUserActivity(nft[currentIndex].token_id, nft[currentIndex].token_address, false);
            } else {
                await sendUserActivity(nft[currentIndex].token_id, nft[currentIndex].token_address, true);
            }
        } else if (audioPlayer.current.currentTime > 3) {
            audioPlayer.current.currentTime = 0;
            await sendUserActivity(nft[currentIndex].token_id, nft[currentIndex].token_address, false);
        } else {
            setCurrentIndex((currentIndex - 1));
            await sendUserActivity(nft[currentIndex].token_id, nft[currentIndex].token_address, false);
        }
    }

    return (

        <div className={Style.FooterAudioPlayer}>
            <audio ref={audioPlayer} src={`${process.env.CLOUDINARY_URL}${(nft[currentIndex].audioCloudinary) ? nft[currentIndex].audioCloudinary : nft[currentIndex].audioPreview}`} preload="auto"></audio>
            <div className={Style.audioPlayer_progressBar}>
                <input type="range" className={Style.progressBar} defaultValue={0} ref={progressBar} onChange={changeRange} step="1" />
            </div>
            <div className={Style.FooterAudioPlayer_colums}>
                <div className={Style.FooterAudioPlayer_colums_left}>
                    <Image src={nft[currentIndex].imageSongCloudinary} alt="song image" width={40} height={40} />
                    <div>
                        <div className={`${Style.FooterAudioPlayer_colums_left_song} font-small`}>
                            {nft[currentIndex].song}
                        </div>
                        {nft[currentIndex].artist.map((art, i) => (
                            <span key={i} className={`${Style.FooterAudioPlayer_colums_left_artist} font-small`}>
                                <Link className={Style.hover} href={{ pathname: "/artist", query: `uid=${nft[currentIndex].author_address[i]}` }}>
                                    {art}
                                </Link>
                                {i < nft[currentIndex].artist.length - 1 && ', '}
                            </span>
                        ))}
                    </div>
                </div>
                <div className={Style.FooterAudioPlayer_colums_center}>
                    {/* current time */}
                    <div className={`${Style.currentTime} ${Style.hide_mobile} font-small`}>{calculateTime(currentTime)}</div>
                    <button className={`${Style.skip_right}`} onClick={() => playPreviousSong()}>
                        <Image src={img.skip_previous} alt="skip next icon" className={Style.skip} />
                    </button>
                    <button onClick={togglePlayPause} className={Style.playPause}>
                        {stopFooter ?
                            <Image src={img.play} alt="play icon" className={Style.play} onClick={() => { setStopFooter(false) }} />
                            :
                            <Image src={img.pause} alt="pause icon" className={Style.pause} onClick={() => { setStopFooter(true) }} />}
                    </button>
                    <button className={`${Style.skip_left}`} onClick={() => playNextSong()}>
                        <Image src={img.skip_next} alt="skip next icon" className={Style.skip} />
                    </button>
                    {/* duration */}
                    <div className={`${Style.duration} ${Style.hide_mobile} font-small`}>{!isNaN(duration) ? (
                        <div>
                            {calculateTime(duration)}
                        </div>) : (
                        <div>
                            {calculateTime(0)}
                        </div>
                    )}</div>
                </div>
                <div className={`${Style.FooterAudioPlayer_colums_right} ${Style.hide}`}>
                    <Image src={img.volume_up} alt="volume icon" className={Style.skip} />
                    <div>
                        <input type="range" className={Style.volumeBar} defaultValue="100" ref={volumeBar} onChange={changeVolumeRange} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FooterAudioPlayer;