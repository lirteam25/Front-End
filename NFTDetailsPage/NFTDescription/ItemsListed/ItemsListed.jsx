import React from 'react';
import Link from 'next/link';

import Style from "./ItemsListed.module.css";


const ItemsListed = ({ sameTokenNFT }) => {

    return (
        <div className={Style.ItemsListed}>
            <div className={Style.ItemsListed_title}>
                <h4 className="font-small">
                    AMOUNT
                </h4>
                <h4 className="font-small">
                    PRICE
                </h4>
            </div>
            {sameTokenNFT.map((el, i) => (
                <Link href={`/token-details?token_id=${el.token_id}&token_address=${el.token_address}&id=${el._id}`} className={Style.ItemsListed_items} key={el._id}>
                    <p className="font-small">
                        {el.maxClaimableSupply - el.supplyClaimed}
                    </p>
                    <p className="font-small">
                        {el.pricePerToken} <span style={{ fontFamily: "Space Grotesk" }}>$</span>
                    </p>
                </Link>
            ))}
        </div>
    )
}

export default ItemsListed;