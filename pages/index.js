import React, { useContext } from 'react';
import { NextSeo } from 'next-seo';
import { useQuery } from '@tanstack/react-query';


//Internal Imports
import Style from "./../styles/index.module.css";
import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext';
import { HeroSection, TopCollectors, JoinLir, LastRelease } from "../indexPage/indexIndex";

const Home = () => {

  const { fetchTopCollectors, fetchDiscoverNFTs } = useContext(NFTMarketplaceContext);

  const { data: topCollectorsData } = useQuery({
    queryKey: ["topCollectors"],
    queryFn: fetchTopCollectors
  });

  const { data: tokenInfoData } = useQuery({
    queryKey: ["tokenInfo"],
    queryFn: fetchDiscoverNFTs
  });

  return (
    <div>
      <NextSeo title="LIR MUSIC" description="LIR Music is a streaming platform integrating a digital collectibles marketplace, empowering fans to collect, enjoy and resale exclusive musical content while investing in artists. Explore our unique collection of digital treasures and own a piece of music history." />
      <div className={Style.index}>
        <HeroSection />
        <LastRelease tokenInfoData={tokenInfoData} />
        <TopCollectors collectors={topCollectorsData} />
        <JoinLir />
      </div>
    </div>
  )
}

export default Home;