import React from 'react';
import { NextSeo } from 'next-seo';


//Internal Imports
import Style from "./../styles/index.module.css";
import { HeroSection } from "../indexPage/indexIndex";

const Home = () => {

  return (
    <div>
      <NextSeo title="LIR MUSIC" description="LIR Music is a streaming platform integrating a digital collectibles marketplace, empowering fans to collect, enjoy and resale exclusive musical content while investing in artists. Explore our unique collection of digital treasures and own a piece of music history." />
      <div className={Style.index}>
        <HeroSection />
      </div>
    </div>
  )
}

export default Home;