import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = process.env.WEB3MODAL_PROJECT_ID

// 2. Set chains
const mainnet = {
    chainId: 137,
    name: 'Polygon Mainnet',
    currency: 'MATIC',
    explorerUrl: 'https://polygonscan.com',
    rpcUrl: 'https://polygon-rpc.com/',
}

const testnet = {
    chainId: 80001,
    name: 'Polygon Mumbai Testnet',
    currency: 'MATIC',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com', // Note: Use an array for rpcUrls
    explorerUrl: 'https://mumbai.polygonscan.com',
};


// 3. Create modal
const metadata = {
    name: 'LIR Music',
    description: 'LIR is a music streaming platform integrating a digital collectibles marketplace, empowering fans to collect, enjoy and resale exclusive musical content while investing in artists. Explore our unique collection of digital treasures and own a piece of music history.',
    url: 'https://www.lirmusic.com', // origin must match your domain & subdomain
    icons: ['https://avatars.mywebsite.com/']
}

createWeb3Modal({
    ethersConfig: defaultConfig({
        metadata
    }),
    chains: [process.env.NODE_ENV === 'production' ? mainnet : testnet],
    projectId,
    allWallets: 'ONLY_MOBILE',
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    themeVariables: {
        '--w3m-font-family': "Space Grotesk, san-serif",
        "--w3m-border-radius-master": "0px",
        "--w3m-accent": "var(--main-color)"
    }
})

export function Web3ModalProvider({ children }) {
    return children
}