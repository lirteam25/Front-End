import React, { useContext, useState, useEffect } from "react";
import { NextSeo } from 'next-seo';
import { useQuery } from "@tanstack/react-query";

//Internal Imports 
import { NFTCardTwo } from "../collectionPage/collectionPageIndex";
import Style from "../styles/discover.module.css";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const Discover = () => {
    const { fetchDiscoverNFTs } = useContext(NFTMarketplaceContext);

    const [filter, setFilter] = useState(false);

    const { data } = useQuery({
        queryKey: ["tokenInfo"],
        queryFn: fetchDiscoverNFTs
    }
    );

    const filteredNFts = data?.filter((el) => el.musicTag.includes(filter));


    return (
        <div className={Style.vh_discover}>
            <NextSeo title="Collection | LIR" description="Discover unreleased limited-edition tracks. Start exploring now." />
            <div className={Style.discover}>
                <div className={Style.discover_filter}>
                    <div className={`${Style.discover_filter_element} ${!filter && Style.active} font-small`} onClick={() => { if (filter) { setFilter(false) } }}>
                        All Genres
                    </div>
                    <div className={`${Style.discover_filter_element} ${filter == "Techno" && Style.active} font-small`} onClick={() => { if (filter != "Techno") { setFilter("Techno") } }}>
                        Techno
                    </div>
                    <div className={`${Style.discover_filter_element} ${filter == "House" && Style.active} font-small`} onClick={() => { if (filter != "House") { setFilter("House") } }}>
                        House
                    </div>
                    <div className={`${Style.discover_filter_element} ${filter == "Electronic" && Style.active} font-small`} onClick={() => { if (filter != "Electronic") { setFilter("Electronic") } }}>
                        Electronic
                    </div>
                </div>
                <div className={Style.mobile_discover_filter}>
                    <div className={`${Style.mobile_discover_filter_element} ${!filter && Style.active} font-small`} onClick={() => { if (filter) { setFilter(false) } }}>
                        All Genres
                    </div>
                    <div className={Style.mobile_discover_filter_bottom}>
                        <div className={`${Style.discover_filter_element} ${filter == "Techno" && Style.active} font-small`} onClick={() => { if (filter != "Techno") { setFilter("Techno") } }}>
                            Techno
                        </div>
                        <div className={`${Style.discover_filter_element} ${filter == "House" && Style.active} font-small`} onClick={() => { if (filter != "House") { setFilter("House") } }}>
                            House
                        </div>
                        <div className={`${Style.discover_filter_element} ${filter == "Electronic" && Style.active} font-small`} onClick={() => { if (filter != "Electronic") { setFilter("Electronic") } }}>
                            Electronic
                        </div>
                    </div>
                </div>
                <div className={Style.discover_items}>
                    <NFTCardTwo sellingNFTs={filter ? filteredNFts : data} />
                </div>
            </div>
        </div>
    );
}

export default Discover;