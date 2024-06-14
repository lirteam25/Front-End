import React from 'react';

import Style from "./NFTDetails.module.css";
import { NFTMarketplaceAddress } from "../../../Context/Constants";

const NFTDetails = ({ nft, scanner }) => {
    const listed = (Math.floor((nft.maxClaimableSupply - nft.supplyClaimed) / nft.maxClaimableSupply * 100));

    function formatDateToMonthYear(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long' };
        const formattedDate = date.toLocaleDateString("en-US", options);
        return formattedDate;
    }

    return (
        <div className={Style.NFTDetails}>
            <div className={Style.NFTDetails_box}>
                <div className={Style.NFTDetails_box_title}>
                    <h4 className="font-small">Token ID</h4>
                </div>
                <div className={Style.NFTDetails_box_content}>
                    <p className="font-small">{nft.token_id || "----"}</p>
                </div>
            </div>

            <div className={Style.NFTDetails_box}>
                <div className={Style.NFTDetails_box_title}>
                    <h4 className="font-small">Created</h4>
                </div>
                <div className={Style.NFTDetails_box_content}>
                    <p className="font-small">{nft.created_at ? formatDateToMonthYear(nft.created_at) : "----"}</p>
                </div>
            </div>

            <div className={Style.NFTDetails_box}>
                <div className={Style.NFTDetails_box_title}>
                    <h4 className="font-small">Token supply</h4>
                </div>
                <div className={Style.NFTDetails_box_content}>
                    <p className="font-small">{nft.maxClaimableSupply || "----"}</p>
                </div>
            </div>

            <div className={Style.NFTDetails_box}>
                <div className={Style.NFTDetails_box_title}>
                    <h4 className="font-small">% listed</h4>
                </div>
                <div className={Style.NFTDetails_box_content}>
                    <p className="font-small">{typeof listed !== "undefined" ? `${listed}%` : "----"}</p>
                </div>
            </div>

            <div className={Style.NFTDetails_box}>
                <div className={Style.NFTDetails_box_title}>
                    <h4 className="font-small">Resale Royalty</h4>
                </div>
                <div className={Style.NFTDetails_box_content}>
                    <p className="font-small">{typeof nft.royalties !== "undefined" ? `${nft.royalties}%` : "----"}</p>
                </div>
            </div>

            <div className={Style.NFTDetails_box}>
                <div className={Style.NFTDetails_box_title}>
                    <h4 className="font-small">Token owner</h4>
                </div>
                {nft?.author_address && <div style={{ color: "var(--main-color)" }} className={Style.NFTDetails_box_content}>
                    <a href={`${scanner}/address/${nft.author_address[0]}`} className={`${Style.NFTDetails_url} font-small`} target="_blank">
                        {nft?.author_address[0] || "----"}
                    </a>
                </div>}
            </div>

            <div className={Style.NFTDetails_box}>
                <div className={Style.NFTDetails_box_title}>
                    <h4 className="font-small">Token creator</h4>
                </div>
                {nft?.author_address && <div style={{ color: "var(--main-color)" }} className={Style.NFTDetails_box_content}>
                    <a href={`${scanner}/address/${nft.author_address[0]}`} className={`${Style.NFTDetails_url} font-small`} target="_blank">
                        {nft?.author_address[0] || "----"}
                    </a>
                </div>}
            </div>

            <div className={Style.NFTDetails_box}>
                <div className={Style.NFTDetails_box_title}>
                    <h4 className="font-small">Contract address</h4>
                </div>
                <div style={{ color: "var(--main-color)" }} className={Style.NFTDetails_box_content}>
                    <a href={`${scanner}/address/${nft.token_address}`} className={`${Style.NFTDetails_url} font-small`} target="_blank">
                        {nft.token_address || "----"}
                    </a>
                </div>
            </div>

        </div>

    )
}

export default NFTDetails;