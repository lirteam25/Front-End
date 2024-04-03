import React, { useContext } from 'react';
import { Web3Button } from '@thirdweb-dev/react';

import Style from "../styles/discover.module.css";
import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext';
import { NFTMintSampleAddress } from '../Context/Constants';

const prova = () => {

    const { user } = useContext(NFTMarketplaceContext);
    return (
        <div className={Style.vh_discover}>
            <div className={Style.discover}>
                <Web3Button contractAddress="0x21D8d4A6e469BF3de45f5dbae3CEea09D33af003"
                    action={async (contract) => {
                        const data = await contract.call("uri", [0])
                        console.log(data);

                    }}>MINTA</Web3Button>
            </div>
        </div>
    )
}

export default prova