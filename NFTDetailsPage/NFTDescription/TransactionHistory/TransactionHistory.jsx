import React from 'react';

import Style from "./TransactionHistory.module.css";



const TransactionHistory = ({ event, hash, price, quantity, date, scanner }) => {

    return (
        <div className={Style.TransactionHistory}>
            <div className={Style.TransactionHistory_title}>
                <h4 className="font-small">EVENT</h4>
                <h4 className={`${Style.TransactionHistory_title_hash} font-small`} >HASH</h4>
                <h4 className="font-small">PRICE</h4>
                <h4 className="font-small">AMOUNT</h4>
                <h4 className="font-small">DATE</h4>
            </div>
            {event.map((el, i) => (
                <a key={i + 1} href={`${scanner}/tx/${hash[i]}`} target="_blank" className={Style.TransactionHistory_content}>
                    <p style={{ textTransform: 'lowercase' }} className="font-small">
                        {el}
                    </p>
                    <p className={`${Style.TransactionHistory_content_url} font-small`}>
                        {hash[i]}
                    </p>
                    <p className="font-small">
                        {price[i]} <span style={{ fontFamily: "Space Grotesk" }}>$</span>
                    </p>
                    <p className="font-small">
                        {quantity[i]}
                    </p>
                    <p className="font-small">
                        {date[i] ? date[i].replace("T", " ").substring(0, 10) : " "}
                    </p>
                </a>
            ))}
        </div>
    )
}

export default TransactionHistory;