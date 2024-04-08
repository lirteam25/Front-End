import React, { useContext } from 'react';
import { CheckoutWithCard, useAddress } from '@thirdweb-dev/react';

import Style from "../styles/discover.module.css";
import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext';
import { EditionDropABI } from '../Context/Constants';

const prova = () => {

    const address = useAddress();

    const { user } = useContext(NFTMarketplaceContext);
    return (
        <div className={Style.vh_discover}>
            <div className={Style.discover}>
                {address &&
                    <CheckoutWithCard
                        clientId={process.env.THIRDWEB_PROJECT_ID}
                        configs={{
                            contractId: "8e78cdd7-e70f-44cb-b46b-17f1c839243f",
                            walletAddress: address ?? '',
                            contractArgs: {
                                listings: [
                                    { listingId: "19" },  // Add your listing IDs here
                                    // Add more listing IDs as needed
                                ]
                            }

                        }}
                        onPaymentSuccess={async (result) => {
                            console.log(result);
                        }}
                        onError={(error) => {
                            console.log(error);
                        }}
                        options={{
                            colorBackground: '#111111',
                            colorPrimary: '#D60B52',
                            colorText: '#FFFFFF',
                            borderRadius: 0,
                            inputBackgroundColor: '#1B1B1B',
                            inputBorderColor: '#767676',
                        }}
                    />
                }
            </div>
        </div>
    )
}

export default prova