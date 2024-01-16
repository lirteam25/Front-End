import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

//Internal Imports
import Style from "./NFTDescription.module.css";
import NFTDetails from "./NFTDetails/NFTDetails";
import TransactionHistory from "./TransactionHistory/TransactionHistory";
import ItemsListed from "./ItemsListed/ItemsListed";

const NFTDescription = ({ nft, event, hash, price, quantity, date, sameTokenNFT }) => {

    const mumbaiScanner = "https://polygonscan.com";

    const [description, setDescription] = useState(true);
    const [tokenDetails, setTokenDetails] = useState(true);
    const [itemsListed, setItemsListed] = useState(true);
    const [transactionHistory, setTransactionHistory] = useState(true);

    return (
        <div className={Style.NFTDescription}>
            <div className={Style.NFTDescription_first}>
                <div className={Style.NFTDescription_box_tokenDetails}>
                    <div className={`${Style.NFTDescription_box_title} ${tokenDetails && Style.active} font-medium`} onClick={() => setTokenDetails(!tokenDetails)}>
                        Token details {tokenDetails ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </div>
                    {tokenDetails &&
                        <div className={Style.NFTDescription_box_content}>
                            <NFTDetails nft={nft} scanner={mumbaiScanner} />
                        </div>
                    }
                </div>
                <div className={Style.NFTDescription_box_description}>
                    <div className={`${Style.NFTDescription_box_title} ${description && (Style.active)} font-medium`} onClick={() => setDescription(!description)}>
                        Description {description ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </div>
                    {description &&
                        <div
                            className={`${Style.NFTDescription_box_content} font-small}`}
                            dangerouslySetInnerHTML={{ __html: nft.description || "----" }}
                        />
                    }
                </div>
            </div>
            <div className={Style.NFTDescription_second}>
                <div className={Style.NFTDescription_box_transactions}>
                    <div className={`${Style.NFTDescription_box_title} ${transactionHistory && Style.active} font-medium`} onClick={() => setTransactionHistory(!transactionHistory)}>
                        Transaction History {transactionHistory ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </div>
                    {transactionHistory && <div className={Style.NFTDescription_box_content}>
                        <TransactionHistory event={event} hash={hash} price={price} quantity={quantity} date={date} scanner={mumbaiScanner} />
                    </div>}
                </div>
                <div className={Style.NFTDescription_box_itemsListed}>
                    <div className={`${Style.NFTDescription_box_title} ${itemsListed && Style.active} font-medium`} onClick={() => setItemsListed(!itemsListed)}>
                        Items Listed {itemsListed ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </div>
                    {itemsListed && <div className={Style.NFTDescription_box_content}>
                        <ItemsListed sameTokenNFT={sameTokenNFT} />
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default NFTDescription;