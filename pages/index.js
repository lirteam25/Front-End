import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';


//Internal Imports
import Style from "./../styles/index.module.css";
import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext';
import { HeroSection, TopCollectors, JoinLir, LastRelease, Value } from "../indexPage/indexIndex";

const Home = () => {

  const { fetchTopCollectors, fetchDiscoverNFTs } = useContext(NFTMarketplaceContext);

  const { data: topCollectorsData } = useQuery({
    queryKey: ["topCollectors"],
    queryFn: fetchTopCollectors
  });

  const { data: sellingNFT } = useQuery({
    queryKey: ["tokenInfo"],
    queryFn: fetchDiscoverNFTs
  });

  return (
    <div className={Style.index}>
      <HeroSection />
      <Value />
      <LastRelease tokenInfoData={sellingNFT} />
      <TopCollectors collectors={topCollectorsData} />
      {/* <JoinLir /> */}
    </div>
  )
}

export default Home;