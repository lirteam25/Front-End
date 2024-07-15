import React, { useEffect, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from "next/router";


//Internal Imports
import Style from "./../styles/index.module.css";
import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext';
import { HeroSection, TopCollectors, JoinLir, LastRelease, Value } from "../indexPage/indexIndex";

const Home = () => {

  const router = useRouter();

  const { fetchTopCollectors, fetchDiscoverNFTs, setOpenArtistForm } = useContext(NFTMarketplaceContext);

  useEffect(() => {
    if (!router.isReady) return;
    const { artistForm } = router.query;
    const isOpen = artistForm === 'true';
    setOpenArtistForm(isOpen);
  }, [router]);

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
      <JoinLir />
    </div>
  )
}

export default Home;