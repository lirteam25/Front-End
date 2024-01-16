import React, { useEffect, useState, useContext } from 'react';
import { NextSeo } from 'next-seo';
import { useRouter } from "next/router";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["artist", "_app"])),
        }
    }
}

//INTERNAL IMPORTS
import Style from "./../styles/artist.module.css";
import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext';
import { ArtistProfileCard, ArtistInformation } from '../artistPage/artistPageIndex';


const Artist = () => {
    const router = useRouter();

    const { fetchArtistNFT, fetchArtistName } = useContext(NFTMarketplaceContext);
    const [tokenInfos, setTokenInfos] = useState([]);
    const [lastRelease, setLastRelease] = useState([]);
    const [artist, setArtist] = useState([]);


    useEffect(() => {
        if (!router.isReady) return;
        const { cnt = "" } = router.query;
        fetchArtistNFT(cnt).then((result) => {
            setLastRelease(result[0]);
            setTokenInfos(result);
        });
        fetchArtistName(cnt).then((response) => {
            console.log(response);
            setArtist(response);
        })
    }, [router]);


    return (
        <div className={Style.Vh_artist}>
            <NextSeo title="Artist | LIR" description="Explore the unique creations of one artist. Immerse yourself in their exclusive music digital collectibles and dive into the artistic world they've crafted." />
            <div className={Style.artist}>
                <ArtistProfileCard artist={artist} lastRelease={lastRelease} />
                <div className={Style.artist_bottom}>
                    <ArtistInformation tokenInfos={tokenInfos} artistDescription={artist.artist_description} />
                </div>
            </div>
        </div>
    )

}

export default Artist;