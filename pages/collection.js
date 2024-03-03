import React, { useContext } from "react";
import { NextSeo } from 'next-seo';
import { useQuery } from "@tanstack/react-query";

//Internal Imports 
import { NFTCardTwo } from "../collectionPage/collectionPageIndex";
import Style from "../styles/discover.module.css";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const Discover = () => {
    const { fetchDiscoverNFTs } = useContext(NFTMarketplaceContext);

    const { data } = useQuery({
        queryKey: ["tokenInfo"],
        queryFn: fetchDiscoverNFTs
    }
    );

    return (
        <div className={Style.vh_discover}>
            <NextSeo title="Collection | LIR" description="Embark on a musical journey like no other. Discover a treasure trove of digital collectibles, each with its own story and artistry. Start exploring now." />
            <div className={Style.discover}>
                <NFTCardTwo sellingNFTs={data} />
            </div>
        </div>
    );
}

export default Discover;