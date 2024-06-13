import React, { useEffect, useState, useContext } from "react";
import { NextSeo } from 'next-seo';
import { useRouter } from "next/router";


//INTERNAL IMPORT
import { NFTDescription, NFTDetailsImg } from "../NFTDetailsPage/NFTDetailsPageIndex";
import Style from "../styles/tokenDetails.module.css";


//import smart contract
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const NFTDetails = () => {
    const { fetchNFTOwner, fetchTransactionsInfo, fetchSellingSameTokenNFT, fetchNFTOwners, fetchSupporters, user } = useContext(NFTMarketplaceContext);

    const [nft, setNft] = useState([]);

    const router = useRouter();
    const [event, setEvent] = useState([]);
    const [hash, setHash] = useState([]);
    const [price, setPrice] = useState([]);
    const [quantity, setQuantity] = useState([]);
    const [date, setDate] = useState([]);
    const [uid, setUid] = useState(null);

    const [sameTokenNFT, setSameTokenNFT] = useState([]);

    const [supporters, setSupporters] = useState([])

    const [userOwn, setUserOwn] = useState(false);


    useEffect(() => {
        if (!router.isReady) return;
        const { token_id = "", token_address = "", uid = "" } = router.query;
        fetchNFTOwner(token_id, token_address, uid).then((item) => {
            setUid(uid);
            console.log("nft", item);
            setNft(item);
            setSameTokenNFT([item]);
        });
        fetchTransactionsInfo(token_id, token_address).then((transactions) => {
            setEvent(transactions.transactions_type.reverse());
            setHash(transactions.transactions.reverse());
            setPrice(transactions.price.reverse());
            setQuantity(transactions.quantity.reverse());
            setDate(transactions.date.reverse());
        });
        /* fetchSellingSameTokenNFT(token_id, token_address).then((items) => {
            console.log("Same token NFT", items);
            setSameTokenNFT(items);
        }); */
        fetchSupporters(token_id, token_address).then((item) => {
            console.log("supporters", item);
            setSupporters(item);
        });
    }, [router]);

    useEffect(() => {
        if (!router.isReady) return;
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
    }, [user])

    const title = nft.length == 0 ? ("Token Details | LIR") : (`${nft.song} | ${nft.artist}`);
    const description = nft.length == 0 ? ("") : (`${nft.song} is an unreleased track by ${nft.artist}. ${nft.description}`)


    return (
        <>
            <NextSeo title={title} description={description} />
            <div className={Style.NFTDetailsPage}>
                <NFTDetailsImg shownNft={nft} user={user} userOwn={userOwn} uid={uid} />
                <NFTDescription nft={nft} event={event} hash={hash} price={price} quantity={quantity} date={date} sameTokenNFT={sameTokenNFT} supporters={supporters} />
            </div>
        </>
    );
};

export default NFTDetails;