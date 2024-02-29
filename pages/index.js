import React, { useContext } from 'react';
import { NextSeo } from 'next-seo';
import { useQuery } from '@tanstack/react-query';


//Internal Imports
import Style from "./../styles/index.module.css";
import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext';
import { HeroSection, TopCollectors, WhatIsLIR, Tutorials, JoinLir } from "../indexPage/indexIndex";

const Home = () => {

  const { fetchTopCollectors } = useContext(NFTMarketplaceContext);

  const { data } = useQuery({
    queryKey: ["topCollectors"],
    queryFn: fetchTopCollectors
  }
  );
  return (
    <div>
      <NextSeo title="LIR MUSIC" description="LIR is a music streaming platform integrating a digital collectibles marketplace, empowering fans to collect, enjoy and resale exclusive musical content while investing in artists. Explore our unique collection of digital treasures and own a piece of music history." />
      <div className={Style.index}>
        <HeroSection />
        <WhatIsLIR />
        <JoinLir />
        <TopCollectors collectors={data} />
        <Tutorials />
      </div>
    </div>
  )
}

export default Home;
