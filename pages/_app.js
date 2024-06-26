import "../styles/globals.css";
import { NavBar, Footer } from "../components/componentsIndex";
import { NFTMarketplaceProvider } from "../Context/NFTMarketplaceContext";
import Script from 'next/script';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DefaultSeo } from "next-seo";

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

  const iubendaScript = `
  var _iub = _iub || [];
_iub.csConfiguration = {
  "askConsentAtCookiePolicyUpdate":true,
  "countryDetection":true,
  "enableFadp":true,
  "enableLgpd":true,
  "enableUspr":true,
  "lang":"en",
  "lgpdAppliesGlobally":false,
  "perPurposeConsent":true,
  "siteId":3354885,
  "whitelabel":false,
  "cookiePolicyId":94474485, 
  "banner":{ 
    "acceptButtonColor":"#D60B52",
    "acceptButtonDisplay":true,
    "backgroundColor":"#1B1B1D",
    "closeButtonDisplay":false,
    "customizeButtonColor":"#303030",
    "customizeButtonDisplay":true,
    "explicitWithdrawal":true,
    "listPurposes":true,
    "logo":null,
    "position":"float-bottom-right",
    "rejectButtonColor":"#D60B52",
    "rejectButtonDisplay":true,
    "showPurposesToggles":true 
  }};;
  `;

  return (
    <>
      <DefaultSeo {...SEO} />
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider
          queryClient={queryClient}>
          <NFTMarketplaceProvider>
            <Script strategy="lazyOnload" dangerouslySetInnerHTML={{ __html: iubendaScript }} />
            <Script strategy="lazyOnload" src="https://cs.iubenda.com/autoblocking/3354885.js" />
            <Script strategy="lazyOnload" src="//cdn.iubenda.com/cs/gpp/stub.js" />
            <Script strategy="lazyOnload" src="//cdn.iubenda.com/cs/iubenda_cs.js" charset="UTF-8" async />

            <Script strategy="afterInteractive">
              {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1170485644003477');
          fbq('track', 'PageView');
        `}
            </Script>
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


