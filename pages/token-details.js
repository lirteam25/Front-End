import React, { useEffect, useState, useContext } from "react";
import { NextSeo } from 'next-seo';
import { useRouter } from "next/router";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["NFT_details", "_app"])),
        }
    }
}


//INTERNAL IMPORT
import { NFTDescription, NFTDetailsImg } from "../NFTDetailsPage/NFTDetailsPageIndex";
import Style from "../styles/tokenDetails.module.css";


//import smart contract
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const NFTDetails = () => {
    const { fetchNFTOwner, fetchTransactionsInfo, fetchSellingSameTokenNFT, fetchNFTOwners, user } = useContext(NFTMarketplaceContext);

    const [nft, setNft] = useState([]);

    const router = useRouter();
    const [event, setEvent] = useState([]);
    const [hash, setHash] = useState([]);
    const [price, setPrice] = useState([]);
    const [quantity, setQuantity] = useState([]);
    const [date, setDate] = useState([]);

    const [sameTokenNFT, setSameTokenNFT] = useState([]);
    const [userOwn, setUserOwn] = useState(false);


    useEffect(() => {
        if (!router.isReady) return;
        const { token_id = "", token_address = "", id = "" } = router.query;
        fetchNFTOwner(id).then((item) => {
            console.log("nft", item);
            setNft(item);
        });
        fetchTransactionsInfo(token_id, token_address).then((transactions) => {
            setEvent(transactions.transactions_type.reverse());
            setHash(transactions.transactions.reverse());
            setPrice(transactions.price.reverse());
            setQuantity(transactions.quantity.reverse());
            setDate(transactions.date.reverse());
        });
        fetchSellingSameTokenNFT(token_id, token_address).then((items) => {
            console.log("Same token NFT", items);
            setSameTokenNFT(items);
        });
    }, [router]);

    useEffect(() => {
        if (!router.isReady) return;
        const { token_id = "", token_address = "", } = router.query;
        if (user && user.wallet && user.accessToken) {
            fetchNFTOwners(token_id, token_address, user.accessToken).then((items) => {
                console.log("I own:", items[0]);
                if (items.length > 0 && items[0].amount > 0) {
                    setUserOwn(items[0])
                } else {
                    setUserOwn([]);
                }
            })
        };
    }, [user])


    return (
        <div>
            <NextSeo title="Token Details | LIR" description="Delve deep into the details of this exclusive music digital collectible. Learn about its history, rarity, and the story it carries. Own a piece of music history." />
            <div className={Style.NFTDetailsPage}>
                <NFTDetailsImg shownNft={nft} user={user} userOwn={userOwn} />
                <NFTDescription nft={nft} event={event} hash={hash} price={price} quantity={quantity} date={date} sameTokenNFT={sameTokenNFT} />
            </div>
        </div>
    );
};

export default NFTDetails;