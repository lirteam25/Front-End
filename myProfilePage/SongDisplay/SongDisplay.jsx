import React, { useContext, useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { AiOutlineDownload } from "react-icons/ai";
import CircularProgress from '@mui/material/CircularProgress';


//Internal Imports
import Style from "./SongDisplay.module.css";
import img from "./../../img/index";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const SongDisplay = ({ myNFTs, artist }) => {
    const { user, downloadSong, setOpenFooterAudio, setNft, currentIndex, setCurrentIndex, nft, stopFooter, setStopFooter, openFooterAudio, sendUserActivity } = useContext(NFTMarketplaceContext);

    const [isDownloading, setIsDownloading] = useState(false);
    const [indexDownload, setIndexDownload] = useState();

    const fake = [{ _id: 0 }, { _id: 1 }, { _id: 2 }, { _id: 3 }, { _id: 4 }, { _id: 5 }, { _id: 6 }, { _id: 7 }, { _id: 8 }, { _id: 9 }];

    const playOrStopSong = (i) => {
        if (!artist) {
            if (!openFooterAudio) {
                setCurrentIndex(i); setNft(myNFTs); setOpenFooterAudio(true); setStopFooter(false);
            } else {
                setCurrentIndex(i); setNft(myNFTs); setStopFooter(false);
            };
            sendUserActivity(myNFTs[i].token_id, myNFTs[i].token_address, false);
        } else {
            if (!openFooterAudio) {
                setCurrentIndex(0); setOpenFooterAudio(true); setNft([myNFTs[i]]); setStopFooter(false);
            } else {
                setCurrentIndex(0); setNft([myNFTs[i]]); setStopFooter(false);
            };
            console.log(currentIndex);
            console.log(nft);
            sendUserActivity(myNFTs[i].token_id, myNFTs[i].token_address, true);
        }
    };

    const sendEventDownload = async (el, i) => {
        setIndexDownload(i)
        setIsDownloading(true);
        await downloadFile(el);
        await downloadSong();
        setIsDownloading(false);
    }

    async function downloadFile(el) {
        const response = await fetch(`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload${el.audioCloudinary}`);

        if (!response.ok) {
            console.error(response.status, response.statusText);
            return;
        }

        const contentType = response.headers.get('content-type');
        const fileExtension = contentType.includes('audio/mpeg') ? 'mp3' : 'wav';

        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([await response.arrayBuffer()], { type: contentType }));
        link.download = `${el.song} - ${el.artist}.${fileExtension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className={Style.display}>
            {artist ? (
                <div>
                    <div className={`${Style.display_title} font-small`}>
                        <div className={`${Style.display_title_item_num} ${Style.hide}`}>
                            #
                        </div>
                        <div className={`${Style.display_title_item_title}`}>
                            TITLE
                        </div>
                        <Image alt="clock" src={img.schedule} height={13} width={13} className={Style.show} />
                        <div className={`${Style.display_title_item_owned} ${Style.hide}`}>
                            LISTED
                        </div>
                        <div className={`${Style.display_title_item} ${Style.hide}`}>
                            SUPPLY
                        </div>
                        <div className={`${Style.display_title_item}`}>
                            PRICE
                        </div>
                    </div>
                    <div className={Style.display_song}>

                        {myNFTs ? (
                            <div>
                                {myNFTs.length == 0 ? (
                                    <div className={`${Style.display_song_noSong} font-normal`}>
                                        {user?.artist_minting_contract ?
                                            <div>No track released. <br /><a className={Style.display_song_noSong_link} href='https://lirmusic.notion.site/Release-limited-editions-tracks-80d1f16f4d894f2983a58b047eb35e83' target='_blank'>How to release a track?</a></div> :
                                            <div>Create a smart contract to start releasing. <br /><a className={Style.display_song_noSong_link} href='https://lirmusic.notion.site/Create-a-smart-contract-ca49f55ef3f24695873b8f90ff38fadf' target='_blank'>What is a smart contract?</a></div>}
                                    </div>) : (
                                    myNFTs.map((el, i) => (
                                        <div className={`${Style.display_song_box} ${(currentIndex == 0 && JSON.stringify(nft) === JSON.stringify(myNFTs.slice(i, i + 1)) && !stopFooter && Style.background_grey)}`}
                                            key={el._id}
                                            onClick={() => {
                                                if (window.innerWidth <= 1024) {
                                                    window.location.href = `/token-details?token_id=${el.token_id}&token_address=${el.token_address}&uid=${el.author_address[0]}`;
                                                }
                                            }}
                                            onDoubleClick={() => {
                                                if (window.innerWidth > 1024) {
                                                    playOrStopSong(i);
                                                }
                                            }}
                                        >
                                            <div className={`${Style.display_song_num} ${Style.hide}`}>
                                                <div className={`${Style.display_song_num_num} font-small`}>
                                                    {i + 1}
                                                </div>
                                                <div className={Style.display_song_num_play}>
                                                    <div>
                                                        {currentIndex == 0 && JSON.stringify(nft) === JSON.stringify(myNFTs.slice(i, i + 1)) && !stopFooter ?
                                                            <Image src={img.pause} alt="pause icon" width={14} height={14} onClick={() => { setStopFooter(true) }} /> :
                                                            <Image src={img.play} alt="play icon" width={14} height={14}
                                                                onClick={() => {
                                                                    playOrStopSong(i);
                                                                }} />
                                                        }
                                                    </div>
                                                </div>

                                            </div>
                                            <div className={Style.display_song_title}>
                                                <div className={Style.display_song_title_img}>
                                                    <Image
                                                        src={el.imageSongCloudinary}
                                                        alt="NFT"
                                                        fill
                                                        sizes={100}
                                                        className={Style.NFTCardTwo_box_img_img}
                                                    />
                                                </div>
                                                <div className={`${Style.display_song_title_info} font-normal ${Style.mobile}`}>
                                                    <div className={`${Style.display_song_title_info_name}`}>
                                                        {el.song}
                                                    </div>
                                                    {el.artist?.map((art, i) => (
                                                        <div key={i} className={`${Style.display_song_title_info_artist}`}>
                                                            <span className={Style.underline}>
                                                                {art}
                                                            </span>
                                                            {i < el.artist.length - 1 && ', '}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className={`${Style.display_song_title_info} font-normal ${Style.pc}`}>
                                                    <Link href={{ pathname: "/token-details", query: `token_id=${el.token_id}&token_address=${el.token_address}&uid=${el.author_address[0]}` }} className={`${Style.display_song_title_info_name}`}>
                                                        {el.song}
                                                    </Link>
                                                    <div key={i} className={`${Style.display_song_title_info_artist}`}>
                                                        {el.artist?.map((art, i) => (
                                                            <span key={i} className={`${Style.display_song_title_info_artist}`}>
                                                                <Link className={Style.underline} href={{ pathname: "/artist", query: `uid=${el.author_address[i]}` }}>
                                                                    {art}
                                                                </Link>
                                                                {i < el.artist.length - 1 && ', '}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`${Style.display_song_owned} font-small`}> {el.audioDuration}</div>
                                            <div className={`${Style.display_song_owned} ${Style.hide} font-small`}>
                                                {parseInt(el.maxClaimableSupply) - parseInt(el.supplyClaimed)}
                                            </div>
                                            <div className={`${Style.display_song_owned}  ${Style.hide} font-small`}>
                                                {el.maxClaimableSupply}
                                            </div>
                                            <div className={`${Style.display_song_owned} font-small`}>
                                                {el.pricePerToken} <span className={Style.display_song_price_symbol}>$</span>
                                            </div>
                                        </div>))
                                )}</div>) : (fake.map((el, i) => (
                                    <div className={Style.display_song_box} key={el._id}>
                                        <div className={`${Style.display_song_num} ${Style.hide}`}>
                                            <div className={`${Style.display_song_num_num}`}>
                                                -
                                            </div>
                                        </div>
                                        <div className={Style.display_song_title}>
                                            <div className={Style.display_song_title_img}>

                                            </div>
                                            <div className={Style.display_song_title_info}>
                                                <div className={Style.display_song_title_info_name}>
                                                    ----
                                                </div>
                                                <div>
                                                    <div className={Style.display_song_title_info_artist} >
                                                        ----
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`${Style.display_song_owned} ${Style.hide}`}>
                                            -:--
                                        </div>
                                        <div className={`${Style.display_song_owned} ${Style.hide}`}>
                                            --
                                        </div>
                                        <div className={Style.display_song_supply}>
                                            --
                                        </div>
                                        <div className={Style.display_song_price}>
                                            --
                                        </div>
                                    </div>)))}
                    </div>
                </div>) :
                (
                    <div>
                        <div className={`${Style.display_title_download} font-small`}>
                            <div className={`${Style.display_title_item_num} ${Style.hide}`}>
                                #
                            </div>
                            <div className={Style.display_title_item_title}>
                                TITLE
                            </div>
                            <Image alt="clock" src={img.schedule} height={13} width={13} className={Style.hide} />
                            <div className={Style.display_title_item_owned}>
                                OWNED
                            </div>
                            <div className={Style.display_title_item_owned}>
                                LISTED
                            </div>
                            <div className={`${Style.display_title_item} ${Style.hide}`}>
                                FLOOR PRICE
                            </div>
                        </div>
                        <div className={Style.display_song}>
                            {myNFTs ? (
                                <div>
                                    {myNFTs.length == 0 ? (
                                        <div className={`${Style.display_song_noSong} font-normal`}>
                                            No track collected.<br />Visit <Link href={"./collection"} className={Style.display_song_noSong_discover}>collection</Link> and start collecting.
                                        </div>) : (
                                        myNFTs.map((el, i) => (
                                            <div className={`${Style.display_song_box_download} ${currentIndex == i && nft == myNFTs && !stopFooter && Style.background_grey}`}
                                                key={el._id}
                                                onClick={() => {
                                                    if (window.innerWidth <= 1024) {
                                                        window.location.href = `/token-details?token_id=${el.token_id}&token_address=${el.token_address}&uid=${el.author_address[0]}`;
                                                    }
                                                }}
                                                onDoubleClick={() => {
                                                    if (window.innerWidth > 1024) {
                                                        playOrStopSong(i);
                                                    }
                                                }}
                                            >
                                                <div className={`${Style.display_song_num} ${Style.hide}`}>
                                                    <div className={`${Style.display_song_num_num} font-small`}>
                                                        {i + 1}
                                                    </div>
                                                    <div className={Style.display_song_num_play}>
                                                        <div>
                                                            {currentIndex == i && nft == myNFTs && !stopFooter ?
                                                                <Image src={img.pause} alt="pause icon" width={14} height={14} onClick={() => { setStopFooter(true) }} /> :
                                                                <Image src={img.play} alt="play icon" width={14} height={14}
                                                                    onClick={() => {
                                                                        playOrStopSong(i);
                                                                    }} />
                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className={Style.display_song_title}>
                                                    <div className={Style.display_song_title_img}>
                                                        <Image
                                                            src={el.imageSongCloudinary}
                                                            alt="NFT"
                                                            fill
                                                            sizes={100}
                                                            className={Style.NFTCardTwo_box_img_img}
                                                        />
                                                    </div>
                                                    <div className={`${Style.display_song_title_info} font-normal ${Style.mobile}`}>
                                                        <div className={`${Style.display_song_title_info_name}`}>
                                                            {el.song}
                                                        </div>
                                                        {el.artist?.map((art, i) => (
                                                            <span key={i} className={`${Style.display_song_title_info_artist}`}>
                                                                <span className={Style.underline}>
                                                                    {art}
                                                                </span>
                                                                {i < el.artist.length - 1 && ', '}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className={`${Style.display_song_title_info} font-normal ${Style.pc}`}>
                                                        <Link href={{ pathname: "/token-details", query: `token_id=${el.token_id}&token_address=${el.token_address}&uid=${el.author_address[0]}` }} className={`${Style.display_song_title_info_name}`}>
                                                            {el.song}
                                                        </Link>
                                                        {el.artist?.map((art, i) => (
                                                            <div key={i} className={`${Style.display_song_title_info_artist}`}>
                                                                <Link className={Style.underline} href={{ pathname: "/artist", query: `uid=${el.author_address[i]}` }}>
                                                                    {art}
                                                                </Link>
                                                                {i < el.artist.length - 1 && ', '}
                                                            </div>
                                                        ))}
                                                    </div>

                                                </div>

                                                <div className={`${Style.display_song_owned} ${Style.hide} font-small`}> {el.audioDuration}</div>

                                                <div className={`${Style.display_song_owned} font-small`}>
                                                    {el.amount}
                                                </div>

                                                <div className={`${Style.display_song_owned} font-small`}>
                                                    {el.maxClaimableSupply}
                                                </div>

                                                <div className={`${Style.display_song_owned} ${Style.hide} font-small`}>
                                                    {el.pricePerToken} <span className={Style.display_song_price_symbol}>$</span>
                                                </div>

                                                <div className={`${Style.display_song_download} ${Style.hide} font-small`}>
                                                    {(isDownloading && indexDownload == i) ? <div style={{ color: "var(--main-color)" }}><CircularProgress color="inherit" size={21} /></div> : <div onClick={() => sendEventDownload(el, i)}><AiOutlineDownload fontSize={21} className={Style.icon} /></div>}
                                                </div>

                                            </div>)
                                        ))}
                                </div>) : (fake.map((el, i) => (
                                    <div className={Style.display_song_box_download} key={el._id}>
                                        <div className={`${Style.display_song_num} ${Style.hide}`}>
                                            <div className={`${Style.display_song_num_num}`}>
                                                -
                                            </div>
                                        </div>
                                        <div className={Style.display_song_title}>
                                            <div className={Style.display_song_title_img}>

                                            </div>
                                            <div className={Style.display_song_title_info}>
                                                <div className={Style.display_song_title_info_name}>
                                                    ----
                                                </div>
                                                <div>
                                                    <div className={Style.display_song_title_info_artist} >
                                                        ----
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`${Style.display_song_owned} ${Style.hide}`}>
                                            -:--
                                        </div>
                                        <div className={`${Style.display_song_owned} ${Style.hide}`}>
                                            --
                                        </div>
                                        <div className={Style.display_song_supply}>
                                            --
                                        </div>
                                        <div className={Style.display_song_price}>
                                            --
                                        </div>
                                        <div className={`{Style.display_song_price} ${Style.hide}`}>
                                            --
                                        </div>
                                    </div>)))}
                        </div>
                    </div>)}
        </div>
    )
}

export default SongDisplay;