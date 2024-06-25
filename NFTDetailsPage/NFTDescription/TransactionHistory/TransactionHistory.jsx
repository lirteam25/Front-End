import React from 'react';

import Style from "./TransactionHistory.module.css";



const TransactionHistory = ({ transactions, scanner }) => {

    return (
        <div className={Style.TransactionHistory}>
            <div className={Style.TransactionHistory_title}>
                <h4 className="font-small">EVENT</h4>
                <h4 className={`${Style.TransactionHistory_title_hash} font-small`} >HASH</h4>
                <h4 className="font-small">AMOUNT</h4>
                <h4 className="font-small">RECEIVER</h4>
            </div>
            {transactions.map((el, i) => (
                <a key={i + 1} href={`${scanner}/tx/${el.transactionHash}`} target="_blank" className={Style.TransactionHistory_content}>
                    <p style={{ textTransform: 'lowercase' }} className="font-small">
                        SALE
                    </p>
                    <p className={`${Style.TransactionHistory_content_url} font-small`}>
                        {el.transactionHash}
                    </p>
                    <p className="font-small">
                        {el.quantityClaimed}
                    </p>
                    <p className={`${Style.TransactionHistory_content_url} font-small`}>
                        {el.receiver}
                    </p>
                </a>
            ))}
        </div>
    )
}

export default TransactionHistory;