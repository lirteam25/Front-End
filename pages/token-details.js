import React, { useEffect, useState, useContext } from "react";
import { NextSeo } from 'next-seo';
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

//INTERNAL IMPORT
import { NFTDescription, NFTDetailsImg } from "../NFTDetailsPage/NFTDetailsPageIndex";
import Style from "../styles/tokenDetails.module.css";


//import smart contract
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const NFTDetails = () => {
    const { fetchNFTOwner, fetchNFTOwners, fetchSupporters, fetchDiscoverNFTs, user } = useContext(NFTMarketplaceContext);

    const [nft, setNft] = useState([]);

    const router = useRouter();
    const [uid, setUid] = useState(null);

    const [collectors, setCollectors] = useState([])

    const [userOwn, setUserOwn] = useState(false);


    useEffect(() => {
        if (!router.isReady) return;
        const { token_id = "", token_address = "", uid = "" } = router.query;
        fetchNFTOwner(token_id, token_address, uid).then((item) => {
            setUid(uid);
            console.log("nft", item);
            setNft(item);
        });
        fetchSupporters(token_id, token_address).then((item) => {
            console.log("supporters", item);
            setCollectors(item);
        });
    }, [router]);

    useEffect(() => {
        console.log("Calculation NFT owned")
        if (!router.isReady) return;
        console.log("Router ready?")
        const { token_id = "", token_address = "", } = router.query;
        if (user?.uid) {
            fetchNFTOwners(token_id, token_address).then((items) => {
                console.log("I own:", items[0]);
                if (items.length > 0 && items[0].amount > 0) {
                    setUserOwn(items[0])
                } else {
                    setUserOwn([]);
                }
            })
        } else {
            setUserOwn([])
        }
    }, [user, router])

    const { data } = useQuery({
        queryKey: ["tokenInfo"],
        queryFn: fetchDiscoverNFTs
    }
    );

    const filteredNFts = nft && data ? data?.filter((el) => el._id !== nft._id) : [];

    const title = nft.length == 0 ? ("Track Details | LIR") : (`${nft.song} | ${nft.artist}`);
    const description = nft.length == 0 ? ("") : (`${nft.song} is an unreleased track by ${nft.artist}. ${nft.description}`)


    return (
        <>
            <NextSeo title={title} description={description} />
            <div className={Style.NFTDetailsPage}>
                <NFTDetailsImg shownNft={nft} user={user} userOwn={userOwn} uid={uid} />
                <NFTDescription nft={nft} user={user} collectors={collectors} discoverMore={filteredNFts} setNft={setNft} />
            </div>
        </>
    );
};

export default NFTDetails;