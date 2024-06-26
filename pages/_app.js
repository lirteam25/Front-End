import "../styles/globals.css";
import { NavBar, Footer } from "../components/componentsIndex";
import { NFTMarketplaceProvider } from "../Context/NFTMarketplaceContext";
import Script from 'next/script';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DefaultSeo } from "next-seo";
import * as fbq from "../Context/fpixel";

import {
  ThirdwebProvider
} from "./../Context/ThirdwebProvider";

import { useEffect } from 'react';
import { useRouter } from "next/router";
import { firebaseApp } from '../firebase-init';
import SEO from "../next-seo.config"

import { GoogleAnalytics } from "nextjs-google-analytics";


function MyApp({ Component, pageProps }) {
  const location = useRouter();
  const router = useRouter();

  const queryClient = new QueryClient();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search + location.hash,
        page_search: location.search,
        page_hash: location.hash,
      });
    }
  }, [location]);

  useEffect(() => {
    // This pageview only triggers the first time (it's important for Pixel to have real information)
    fbq.pageview();

    const handleRouteChange = () => {
      fbq.pageview();
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <DefaultSeo {...SEO} />
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider
          queryClient={queryClient}>
          <NFTMarketplaceProvider>
            <Script strategy="lazyOnload" src="/iubenda-config.js" />
            <Script strategy="lazyOnload" src="https://cs.iubenda.com/autoblocking/3354885.js" />
            <Script strategy="lazyOnload" src="//cdn.iubenda.com/cs/gpp/stub.js" />
            <Script strategy="lazyOnload" src="//cdn.iubenda.com/cs/iubenda_cs.js" charset="UTF-8" async />

            <Script strategy="afterInteractive" src="/facebook-pixels.js" />
            <noscript>
              <img height="1" width="1" style={{ display: 'none' }}
                src="https://www.facebook.com/tr?id=1170485644003477&ev=PageView&noscript=1" />
            </noscript>

            <GoogleAnalytics strategy="lazyOnload" trackPageViews={false} />
            <NavBar />
            <Component {...pageProps} />
            <Footer />
          </NFTMarketplaceProvider>
        </ThirdwebProvider>
      </QueryClientProvider>
    </>
  )
};

export default MyApp;