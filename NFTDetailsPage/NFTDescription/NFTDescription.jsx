import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
//Internal Imports
import Style from "./NFTDescription.module.css";
import NFTDetails from "./NFTDetails/NFTDetails";
import TransactionHistory from "./TransactionHistory/TransactionHistory";
import ItemsListed from "./ItemsListed/ItemsListed";
import Collectors from "./Collectors/Collectors";

const NFTDescription = ({ nft, transactions, sameTokenNFT, supporters, sellingNFT }) => {


    const scanner = "https://polygonscan.com";

    const [description, setDescription] = useState(true);
    const [collectors, setCollectors] = useState(true);
    const [tokenDetails, setTokenDetails] = useState(true);
    const [itemsListed, setItemsListed] = useState(false);
    const [transactionHistory, setTransactionHistory] = useState(false);

    return (
        <div className={Style.NFTDescription}>
            <div className={Style.NFTDescription_first}>
                <div className={Style.NFTDescription_box_tokenDetails}>
                    <div className={`${Style.NFTDescription_box_title} ${tokenDetails && Style.active} font-medium`} onClick={() => setTokenDetails(!tokenDetails)}>
                        Track details {tokenDetails ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </div>
                    {tokenDetails &&
                        <div className={Style.NFTDescription_box_content}>
                            <NFTDetails nft={nft} scanner={scanner} />
                        </div>
                    }
                </div>
                <div className={Style.NFTDescription_box_description}>
                    <div className={`${Style.NFTDescription_box_title} ${collectors && (Style.active)} font-medium`} onClick={() => setCollectors(!collectors)}>
                        Collectors {collectors ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </div>
                    {collectors &&
                        <div className={Style.NFTDescription_box_content}>
                            <Collectors supporters={supporters} />
                        </div>
                    }
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
                        <TransactionHistory transactions={transactions} scanner={scanner} />
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