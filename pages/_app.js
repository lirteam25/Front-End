import "../styles/globals.css";
import { NavBar, Footer } from "../components/componentsIndex";
import { NFTMarketplaceProvider } from "../Context/NFTMarketplaceContext";
import Script from 'next/script';
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  embeddedWallet
} from "./../Context/ThirdwebProvider";

import { useEffect } from 'react';
import { useRouter } from "next/router";
import { firebaseApp } from '../firebase-init';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleAnalytics } from "nextjs-google-analytics";

const queryClient = new QueryClient();


function MyApp({ Component, pageProps }) {
  const location = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV == "production") {
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
    <div>
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider
          supportedWallets={[
            metamaskWallet(),
            coinbaseWallet(),
            walletConnect(),
            embeddedWallet()
          ]}
          activeChain="mumbai"
          clientId="3d60c6caaa12c62a65cecff17b2d0a40" >
          <NFTMarketplaceProvider>
            <Script strategy="lazyOnload" dangerouslySetInnerHTML={{ __html: iubendaScript }} />
            <Script strategy="lazyOnload" src="https://cs.iubenda.com/autoblocking/3354885.js" />
            <Script strategy="lazyOnload" src="//cdn.iubenda.com/cs/gpp/stub.js" />
            <Script strategy="lazyOnload" src="//cdn.iubenda.com/cs/iubenda_cs.js" charset="UTF-8" async />
            <GoogleAnalytics strategy="lazyOnload" trackPageViews={false} />
            <NavBar />
            <Component {...pageProps} />
            <Footer />
          </NFTMarketplaceProvider>
        </ThirdwebProvider>
      </QueryClientProvider>
    </div>
  )
};

export default MyApp;


