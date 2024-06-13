import React, { useEffect, useState, useContext } from 'react';
import { NextSeo } from 'next-seo';
import { useRouter } from "next/router";

//INTERNAL IMPORTS
import Style from "./../styles/artist.module.css";
import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext';
import { ArtistProfileCard, ArtistInformation } from '../artistPage/artistPageIndex';


const Artist = () => {
    const router = useRouter();

    const { fetchArtistNFT, fetchArtistName } = useContext(NFTMarketplaceContext);
    const [tokenInfos, setTokenInfos] = useState([]);
    const [artist, setArtist] = useState([]);


    useEffect(() => {
        if (!router.isReady) return;
        const { uid = "" } = router.query;
        console.log(uid);
        fetchArtistName(uid).then((response) => {
            console.log(response);
            setArtist(response);
            fetchArtistNFT(uid).then((result) => {
                setTokenInfos(result);
            });
        })
    }, [router]);

    const title = artist.length == 0 ? "Artist | LIR" : `${artist.artist_name} | LIR`;
    const description = artist.length == 0 ? "" : `${artist.description}`;

    return (
        <div className={Style.Vh_artist}>
            <NextSeo title={title} description={description} />
            <div className={Style.artist}>
                <ArtistProfileCard artist={artist} />
                <div className={Style.artist_bottom}>
                    <ArtistInformation tokenInfos={tokenInfos} artistDescription={artist.artist_description} />
                </div>
            </div>
        </div>
    )

}

export default Artist;