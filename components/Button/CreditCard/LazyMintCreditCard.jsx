/* import React from 'react';
import { CheckoutWithCard, useAddress } from '@thirdweb-dev/react';


const CreditCard = ({ contractId, args, onSuccess }) => {

    const address = useAddress();

    return (
        <div>
            {address &&
                <CheckoutWithCard
                    clientId={process.env.THIRDWEB_PROJECT_ID}
                    configs={{
                        contractId: contractId,
                        walletAddress: address ?? '',
                        contractArgs: args
                    }}

                    onPaymentSuccess={async (result) => {
                        await onSuccess(result)
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
    )
}

export default CreditCard */